/**
 * Module that takes care of audio playback
 */
var AudioEngine = {
    FADE_TIME: 1,
    AUDIO_BUFFER_CACHE: {},
    _audioContext: null,
    _master: null,
    _currentBackgroundMusic: null,
    _currentEventAudio: null,
    _currentSoundEffectAudio: null,
    _initialized: false,
    init: function () {
        AudioEngine._initAudioContext();
        // AudioEngine._preloadAudio(); // removed to save bandwidth
        AudioEngine._initialized = true;
    },
    _preloadAudio: function () {
        // start loading music and events early
        // ** could be used later if we specify a better set of
        // audio files to preload -- i.e. we probably don't need to load
        // the later villages or events audio, and esp. not the ending
        for (var key in AudioLibrary) {
            if (
            key.toString().indexOf('MUSIC_') > -1 ||
            key.toString().indexOf('EVENT_') > -1) {
                AudioEngine.loadAudioFile(AudioLibrary[key]);
            }
        }
    },
    _initAudioContext: function () {
        AudioEngine._audioContext = new (window.AudioContext || window.webkitAudioContext);
        AudioEngine._createMasterChannel();
    },
    _createMasterChannel: function () {
        // create master
        AudioEngine._master = AudioEngine._audioContext.createGain();
        AudioEngine._master.gain.setValueAtTime(1.0, AudioEngine._audioContext.currentTime);
        AudioEngine._master.connect(AudioEngine._audioContext.destination);
    },
    _getMissingAudioBuffer: function () {
        // plays beeping sound to indicate missing audio
        var buffer = AudioEngine._audioContext.createBuffer(
            1,
            AudioEngine._audioContext.sampleRate,
            AudioEngine._audioContext.sampleRate
        );
        // Fill the buffer
        var bufferData = buffer.getChannelData(0);
        for (var i = 0; i < buffer.length / 2; i++) {
            bufferData[i] = Math.sin(i * 0.05) / 4; // max .25 gain value
        }
        return buffer;
    },
    _playSound: function (buffer) {
        if (AudioEngine._currentSoundEffectAudio &&
            AudioEngine._currentSoundEffectAudio.source.buffer == buffer) {
            return;
        }

        var source = AudioEngine._audioContext.createBufferSource();
        source.buffer = buffer;
        source.onended = function(event) {
            // dereference current sound effect when finished
            if (AudioEngine._currentSoundEffectAudio &&
                AudioEngine._currentSoundEffectAudio.source.buffer == buffer) {
                AudioEngine._currentSoundEffectAudio = null;
            }
        };

        source.connect(AudioEngine._master);
        source.start();

        AudioEngine._currentSoundEffectAudio = {
            source: source
        };
    },
    _playBackgroundMusic: function (buffer) {
        var source = AudioEngine._audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        var envelope = AudioEngine._audioContext.createGain();
        envelope.gain.setValueAtTime(0.0, AudioEngine._audioContext.currentTime);
        
        var fadeTime = AudioEngine._audioContext.currentTime + AudioEngine.FADE_TIME;

        // fade out current background music
        if (AudioEngine._currentBackgroundMusic && 
            AudioEngine._currentBackgroundMusic.source &&
            AudioEngine._currentBackgroundMusic.source.playbackState !== 0) {
            var currentBackgroundGainValue = AudioEngine._currentBackgroundMusic.envelope.gain.value;
            AudioEngine._currentBackgroundMusic.envelope.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
            AudioEngine._currentBackgroundMusic.envelope.gain.setValueAtTime(currentBackgroundGainValue, AudioEngine._audioContext.currentTime);
            AudioEngine._currentBackgroundMusic.envelope.gain.linearRampToValueAtTime(0.0, fadeTime);
            AudioEngine._currentBackgroundMusic.source.stop(fadeTime + 0.3); // make sure fade has completed
        }

        // fade in new backgorund music
        source.connect(envelope);
        envelope.connect(AudioEngine._master);
        source.start();
        envelope.gain.linearRampToValueAtTime(1.0, fadeTime);

        // update current background music
        AudioEngine._currentBackgroundMusic = {
            source: source,
            envelope: envelope
        };
    },
    _playEventMusic: function (buffer) {
        var source = AudioEngine._audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        var envelope = AudioEngine._audioContext.createGain();
        envelope.gain.setValueAtTime(0.0, AudioEngine._audioContext.currentTime);

        var fadeTime = AudioEngine._audioContext.currentTime + AudioEngine.FADE_TIME * 2;

        // turn down current background music
        if (AudioEngine._currentBackgroundMusic != null) {
            var currentBackgroundGainValue = AudioEngine._currentBackgroundMusic.envelope.gain.value;
            AudioEngine._currentBackgroundMusic.envelope.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
            AudioEngine._currentBackgroundMusic.envelope.gain.setValueAtTime(currentBackgroundGainValue, AudioEngine._audioContext.currentTime);
            AudioEngine._currentBackgroundMusic.envelope.gain.linearRampToValueAtTime(0.2, fadeTime);
        }

        // fade in event music
        source.connect(envelope);
        envelope.connect(AudioEngine._master);
        source.start();
        envelope.gain.linearRampToValueAtTime(1.0, fadeTime);

        // update reference
        AudioEngine._currentEventAudio = {
            source: source,
            envelope: envelope
        };
    },
    _stopEventMusic: function () {
        var fadeTime = AudioEngine._audioContext.currentTime + AudioEngine.FADE_TIME * 2;

        // fade out event music and stop
        if (AudioEngine._currentEventAudio && 
            AudioEngine._currentEventAudio.source && 
            AudioEngine._currentEventAudio.source.buffer) {
            var currentEventGainValue = AudioEngine._currentEventAudio.envelope.gain.value;
            AudioEngine._currentEventAudio.envelope.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
            AudioEngine._currentEventAudio.envelope.gain.setValueAtTime(currentEventGainValue, AudioEngine._audioContext.currentTime);
            AudioEngine._currentEventAudio.envelope.gain.linearRampToValueAtTime(0.0, fadeTime);
            AudioEngine._currentEventAudio.source.stop(fadeTime + 1); // make sure fade has completed
            AudioEngine._currentEventAudio = null;
        }

        // turn up background music
        if (AudioEngine._currentBackgroundMusic) {
          var currentBackgroundGainValue = AudioEngine._currentBackgroundMusic.envelope.gain.value;
          AudioEngine._currentBackgroundMusic.envelope.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
          AudioEngine._currentBackgroundMusic.envelope.gain.setValueAtTime(currentBackgroundGainValue, AudioEngine._audioContext.currentTime);
          AudioEngine._currentBackgroundMusic.envelope.gain.linearRampToValueAtTime(1.0, fadeTime);
        }
    },
    isAudioContextRunning: function () {
        return AudioEngine._audioContext.state !== 'suspended';
    },
    tryResumingAudioContext: function() {
        if (AudioEngine._audioContext.state === 'suspended') {
            AudioEngine._audioContext.resume();
        }
    },
    playBackgroundMusic: function (src) {
        if (!AudioEngine._initialized) {
          return;
        }
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playBackgroundMusic(buffer);
            });
    },
    playEventMusic: function (src) {
        if (!AudioEngine._initialized) {
          return;
        }
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playEventMusic(buffer);
            });
    },
    stopEventMusic: function () {
        if (!AudioEngine._initialized) {
          return;
        }
        AudioEngine._stopEventMusic();
    },
    playSound: function (src) {
        if (!AudioEngine._initialized) {
          return;
        }
        AudioEngine.loadAudioFile(src)
            .then(function (buffer) {
                AudioEngine._playSound(buffer);
            });
    },
    loadAudioFile: function (src) {
        if (src.indexOf('http') === -1) {
            var path = window.location.protocol + '//' + window.location.hostname + (window.location.port ?(':' + window.location.port) : '') + window.location.pathname;
            if(path.endsWith('index.html')){
                path = path.slice(0, - 10); 
            }
            src = path + src;
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

                var decodeAudioDataPromise = AudioEngine._audioContext.decodeAudioData(buffer, function (decodedData) {
                    AudioEngine.AUDIO_BUFFER_CACHE[src] = decodedData;
                    return AudioEngine.AUDIO_BUFFER_CACHE[src];
                });

                // Safari WebAudio does not return a promise based API for
                // decodeAudioData, so we need to fake it if we want to play
                // audio immediately on first fetch
                if (decodeAudioDataPromise) {
                    return decodeAudioDataPromise;
                } else {
                    return new Promise(function (resolve, reject) {
                        var fakePromiseId = setInterval(function() {
                            if (AudioEngine.AUDIO_BUFFER_CACHE[src]) {
                                resolve(AudioEngine.AUDIO_BUFFER_CACHE[src]);
                                clearInterval(fakePromiseId);
                            }
                        }, 20);
                    });
                }
            });
        }
    },
    setBackgroundMusicVolume: function (volume, s) {
        if (AudioEngine._master == null) return;  // master may not be ready yet
        if (volume === undefined) {
            volume = 1.0;
        }
        if (s === undefined) {
            s = 1.0;
        }

        // cancel any current schedules and then ramp
        var currentBackgroundGainValue = AudioEngine._currentBackgroundMusic.envelope.gain.value;
        AudioEngine._currentBackgroundMusic.envelope.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
        AudioEngine._currentBackgroundMusic.envelope.gain.setValueAtTime(currentBackgroundGainValue, AudioEngine._audioContext.currentTime);
        AudioEngine._currentBackgroundMusic.envelope.gain.linearRampToValueAtTime(
            volume,
            AudioEngine._audioContext.currentTime + s
        );
    },
    setMasterVolume: function (volume, s) {
        if (AudioEngine._master == null) return;  // master may not be ready yet
        if (volume === undefined) {
            volume = 1.0;
        }
        if (s === undefined) {
            s = 1.0;
        }

        // cancel any current schedules and then ramp
        var currentGainValue = AudioEngine._master.gain.value;
        AudioEngine._master.gain.cancelScheduledValues(AudioEngine._audioContext.currentTime);
        AudioEngine._master.gain.setValueAtTime(currentGainValue, AudioEngine._audioContext.currentTime);
        AudioEngine._master.gain.linearRampToValueAtTime(
            volume,
            AudioEngine._audioContext.currentTime + s
        );
    }
};
