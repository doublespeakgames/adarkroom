/**
 * Module that takes care of audio playback
 */
var AudioEngine = {
    FADE_TIME: 1,
    AUDIO_BUFFER_CACHE: {},
    audioContext: null,
    master: null,
    tracks: {
        'bg1': null,
        'bg2': null,
        'events': null,
        'sfx': null
    },
    currentBackgroundChannel: 'bg1',
    currentBackgroundAudio: null,
    currentEventAudio: null,
    init: function (options) {
        // for legacy browsers
        AudioEngine.audioContext = new (window.AudioContext || window.webkitAudioContext);

        if (AudioEngine.audioContext.state === 'suspended') {
            AudioEngine.audioContext.resume().then(function () {
                AudioEngine.createChannels();
            });
        } else {
            AudioEngine.createChannels();
        }
    },
    createChannels() {
        // create master
        AudioEngine.master = AudioEngine.audioContext.createGain();
        AudioEngine.master.gain.setValueAtTime(1.0, AudioEngine.audioContext.currentTime);
        AudioEngine.master.connect(AudioEngine.audioContext.destination);

        // create 4 tracks to output to master
        AudioEngine.tracks['bg1'] = AudioEngine.audioContext.createGain();
        AudioEngine.tracks['bg1'].connect(AudioEngine.master);
        AudioEngine.tracks['bg1'].gain.setValueAtTime(1.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks['bg2'] = AudioEngine.audioContext.createGain();
        AudioEngine.tracks['bg2'].connect(AudioEngine.master);
        AudioEngine.tracks['bg2'].gain.setValueAtTime(1.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks['events'] = AudioEngine.audioContext.createGain();
        AudioEngine.tracks['events'].connect(AudioEngine.master);
        AudioEngine.tracks['events'].gain.setValueAtTime(1.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks['sfx'] = AudioEngine.audioContext.createGain();
        AudioEngine.tracks['sfx'].connect(AudioEngine.master);
        AudioEngine.tracks['sfx'].gain.setValueAtTime(1.0, AudioEngine.audioContext.currentTime);
    },
    options: {}, // Nothing for now,
    _canPlayAudio: function () {
        if (AudioEngine.audioContext.state === 'suspended') {
            return false;
        }
        return true;
    },
    _getMissingAudioBuffer: function () {
        var buffer = AudioEngine.audioContext.createBuffer(
            1, 
            AudioEngine.audioContext.sampleRate, 
            AudioEngine.audioContext.sampleRate
        );
        // Fill the buffer
        var bufferData = buffer.getChannelData(0);
        for (var i = 0; i < buffer.length / 2; i++) {
            bufferData[i] = Math.sin(i * .05) / 2;
        }
        return buffer;
    },
    _playSound: function (buffer) {
        if (!AudioEngine._canPlayAudio()) return;

        var source = AudioEngine.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(AudioEngine.tracks['sfx']);
        source.start(AudioEngine.audioContext.currentTime);
    },
    _fadeTrack: function (buffer) {
        if (!AudioEngine._canPlayAudio()) return;

        var bufferSource = AudioEngine.audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.loop = true;

        // figure out which background track to start on
        // in order to do crossfade
        var nextBackgroundChannel;
        if (AudioEngine.currentBackgroundChannel === 'bg1') {
            nextBackgroundChannel = 'bg2';
        } else {
            nextBackgroundChannel = 'bg1';
        }

        // fade in new track
        var fadeTime = AudioEngine.audioContext.currentTime + AudioEngine.FADE_TIME;
        bufferSource.connect(AudioEngine.tracks[nextBackgroundChannel]);
        bufferSource.start(AudioEngine.audioContext.currentTime);
        AudioEngine.tracks[nextBackgroundChannel].gain.setValueAtTime(0.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks[nextBackgroundChannel].gain.linearRampToValueAtTime(1.0, fadeTime);

        // fade out old track
        AudioEngine.tracks[AudioEngine.currentBackgroundChannel].gain.linearRampToValueAtTime(0.0, fadeTime);
        if (AudioEngine.currentBackgroundAudio) {
            AudioEngine.currentBackgroundAudio.stop(fadeTime + 0.3); // make sure fade has completed
        }

        // switch background track
        AudioEngine.currentBackgroundChannel = nextBackgroundChannel;
        AudioEngine.currentBackgroundAudio = bufferSource;
    },
    _playEvent: function (buffer) {
        if (!AudioEngine._canPlayAudio()) return;

        var bufferSource = AudioEngine.audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.loop = true;

        var fadeTime = AudioEngine.audioContext.currentTime + AudioEngine.FADE_TIME * 2;

        // turn down background music
        AudioEngine.tracks['bg1'].gain.linearRampToValueAtTime(0.2, fadeTime);
        AudioEngine.tracks['bg2'].gain.linearRampToValueAtTime(0.2, fadeTime);

        // fade in event music
        bufferSource.connect(AudioEngine.tracks['events']);
        bufferSource.start(0);
        AudioEngine.currentEventAudio = bufferSource;

        AudioEngine.tracks['events'].gain.setValueAtTime(0.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks['events'].gain.linearRampToValueAtTime(0.1, fadeTime);
    },
    _stopEventMusic: function () {
        var fadeTime = AudioEngine.audioContext.currentTime + AudioEngine.FADE_TIME * 2;

        // fade out event music and stop
        AudioEngine.tracks['events'].gain.linearRampToValueAtTime(0.0, fadeTime);
        if (AudioEngine.currentEventAudio) {
            AudioEngine.currentEventAudio.stop(fadeTime + 1); // make sure fade has completed
            AudioEngine.currentEventAudio = null;
        }

        // turn up background music
        AudioEngine.tracks[AudioEngine.currentBackgroundChannel].gain.linearRampToValueAtTime(1.0, fadeTime);
    },
    changeMusic: function (src) {
        console.log('changeMusic ', src);
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._fadeTrack(buffer);
            });
    },
    playEventMusic: function (src) {
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playEvent(buffer);
            });
    },
    stopEventMusic: function () {
        AudioEngine._stopEventMusic();
    },
    playSound: function (src) {
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playSound(buffer);
            });
    },
    loadAudioFile(src) {
        if (src.indexOf('http') === -1) {
            src = window.location + src;
        }
        if (AudioEngine.AUDIO_BUFFER_CACHE[src]) {
            return new Promise(function (resolve, reject) {
                resolve(AudioEngine.AUDIO_BUFFER_CACHE[src]);
            });
        } else {
            var request = new Request(src);
            return fetch(request).then(function (response) {
                return response.arrayBuffer();
            }).then(function (buffer) {
                if (buffer.byteLength === 0) {
                    console.error('cannot load audio from ' + src);
                    return AudioEngine._getMissingAudioBuffer();
                }

                return AudioEngine.audioContext.decodeAudioData(buffer, function (decodedData) {
                    AudioEngine.AUDIO_BUFFER_CACHE[src] = decodedData;
                    return AudioEngine.AUDIO_BUFFER_CACHE[src];
                });
            });
        }
    },
    mute: function () {
        AudioEngine.master.gain.linearRampToValueAtTime(
            0.0,
            AudioEngine.audioContext.currentTime + AudioEngine.FADE_TIME
        );
    },
    setVolume: function (volume) {
        if (!AudioEngine.master) return; // master may not be ready yet
        if (!volume) {
            volume = 1.0;
        }
        AudioEngine.master.gain.setValueAtTime(
            AudioEngine.master.gain.value,
            AudioEngine.audioContext.currentTime
        );
        AudioEngine.master.gain.linearRampToValueAtTime(
            volume,
            AudioEngine.audioContext.currentTime + AudioEngine.FADE_TIME / 2
        );
    }
};