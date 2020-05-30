/**
 * Module that takes care of audio playback
 */
var AudioEngine = {
    canPlayAudio: false,
    AUDIO_BUFFER_CACHE: {},
    audioContext: null,
    master: null,

    // Tracks for playing music and sound effects
    // 0 - Background music
    // 1 - Background music
    // 2 - Event music
    // 3 - Sound effects
    tracks: null,
    currentBackgroundChannel: 0,
    currentTrack: null,
	init: function(options) {
        // for legacy browsers
        AudioEngine.audioContext = new (window.AudioContext || window.webkitAudioContext);
        audioLog('starting audio engine');
        console.log(AudioEngine.audioContext);
        audioLog('state: ' + AudioEngine.audioContext.state);

        if (AudioEngine.audioContext.state === 'suspended') {
            AudioEngine.audioContext.resume().then(function () {
                AudioEngine.createChannels();
                AudioEngine.canPlayAudio = true;
            });
        } else {
            AudioEngine.createChannels();
        }
    },
    createChannels() {
        // create master
        AudioEngine.master = AudioEngine.audioContext.createGain();
        AudioEngine.master.connect(AudioEngine.audioContext.destination);

        // create 4 tracks to output to master
        AudioEngine.tracks = [];
        for (var i = 0; i < 4; i++) {
            AudioEngine.tracks[i] = AudioEngine.audioContext.createGain();
            AudioEngine.tracks[i].connect(AudioEngine.master);
        }
    },
	options: {}, // Nothing for now
    _playSound: function(buffer) {
        if (!AudioEngine.canPlayAudio) return;

        var source = AudioEngine.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(AudioEngine.tracks[1]);
        source.start(AudioEngine.audioContext.currentTime);
    },
    _fadeTrack: function(buffer) {
        if (!AudioEngine.canPlayAudio) return;

        var newTrack = AudioEngine.audioContext.createBufferSource();
        newTrack.buffer = buffer;
        newTrack.loop = true;

        // figure out which background track to start on
        // in order to do crossfade
        var nextBackgroundChannel;
        if (AudioEngine.currentBackgroundChannel === 0) {
            nextBackgroundChannel = 1;
        } else {
            nextBackgroundChannel = 0;
        }
        
        // fade in new track
        var fadeTime = AudioEngine.audioContext.currentTime + 2.0;
        newTrack.connect(AudioEngine.tracks[nextBackgroundChannel]);
        newTrack.start(0);
        AudioEngine.tracks[nextBackgroundChannel].gain.setValueAtTime(0.0, AudioEngine.audioContext.currentTime);
        AudioEngine.tracks[nextBackgroundChannel].gain.linearRampToValueAtTime(.1, fadeTime);

        // fade out old track
        AudioEngine.tracks[AudioEngine.currentBackgroundChannel].gain.linearRampToValueAtTime(0.0, fadeTime);
        if (AudioEngine.currentTrack) {
            AudioEngine.currentTrack.stop(fadeTime + 0.3); // make sure fade has completed
        }

        // switch background track
        AudioEngine.currentBackgroundChannel = nextBackgroundChannel;
        AudioEngine.currentTrack = newTrack;
    },
	changeMusic: function(src) {
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._fadeTrack(buffer);
            });
        audioLog('change music: ' + src);
        audioLog('audio engine status: ' + AudioEngine.audioContext.state);
    },
	playSound: function(src) {
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playSound(buffer);
            });
        audioLog('play sound: ' + src);
        audioLog('audio engine status: ' + AudioEngine.audioContext.state);
    },
    loadAudioFile(src) {
        if (AudioEngine.AUDIO_BUFFER_CACHE[src]) {
            return new Promise(function (resolve, reject) {
                resolve(AudioEngine.AUDIO_BUFFER_CACHE[src]);
            });
        } else {
            var request = new Request(src);
            return fetch(request).then(function(response) {
                return response.arrayBuffer();
              }).then(function(buffer) {
                return AudioEngine.audioContext.decodeAudioData(buffer, function(decodedData) {
                    AudioEngine.AUDIO_BUFFER_CACHE[src] = decodedData;
                    return AudioEngine.AUDIO_BUFFER_CACHE[src];
                });
              });
        }
      }
};

function audioLog(message) {
    console.log('%c' + message, 'background: #222; color: #bada55');
}
