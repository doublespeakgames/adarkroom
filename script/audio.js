/**
 * Module that takes care of audio playback
 */
var AudioEngine = {
    AUDIO_BUFFER_CACHE: {},
    audioContext: null,
    master: null,

    // Tracks for playing music and sound effects
    // 0 - Background music
    // 1 - Background music
    // 2 - Sound effects
    // 3 - Sound effects
    tracks: null,
    currentBackgroundChannel: 0,
    currentTrack: null,
	init: function(options) {
        // for legacy browsers
        this.audioContext = new (window.AudioContext || window.webkitAudioContext);

        // create master
        this.master = this.audioContext.createGain();
        this.master.connect(this.audioContext.destination);

        // create 4 tracks to output to master
        this.tracks = [];
        for (var i = 0; i < 4; i++) {
            this.tracks[i] = this.audioContext.createGain();
            this.tracks[i].connect(this.master);
        }
	},
	options: {}, // Nothing for now
    _playSound: function(buffer) {
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.tracks[1]);
        source.start(0);
    },
    _fadeTrack: function(buffer) {
        var newTrack = this.audioContext.createBufferSource();
        newTrack.buffer = buffer;
        newTrack.loop = true;

        // figure out which background track to start on
        // in order to do crossfade
        var nextBackgroundChannel;
        if (this.currentBackgroundChannel === 0) {
            nextBackgroundChannel = 1;
        } else {
            nextBackgroundChannel = 0;
        }
        
        // fade in new track
        var fadeTime = this.audioContext.currentTime + 5.0;
        newTrack.connect(this.tracks[nextBackgroundChannel]);
        newTrack.start(0);
        this.tracks[nextBackgroundChannel].gain.setValueAtTime(0.0, this.audioContext.currentTime);
        this.tracks[nextBackgroundChannel].gain.linearRampToValueAtTime(1.0, fadeTime);

        // fade out old track
        this.tracks[this.currentBackgroundChannel].gain.linearRampToValueAtTime(0.0, fadeTime);
        if (this.currentTrack) {
            this.currentTrack.stop(fadeTime + 1.0); // make sure fade has completed
        }

        // switch background track
        this.currentBackgroundChannel = nextBackgroundChannel;
        this.currentTrack = newTrack;
    },
	changeMusic: function(src) {
        var self = this;
        this.loadAudioFile(src)
            .then(function (buffer) {
                self._fadeTrack(buffer);
            });
    },
	playSound: function(src) {
        var self = this;
        this.loadAudioFile(src)
            .then(function (buffer) {
                self._playSound(buffer);
            });
    },
    loadAudioFile(src) {
        var self = this;
        if (self.AUDIO_BUFFER_CACHE[src]) {
            return new Promise(function (resolve, reject) {
                resolve(self.AUDIO_BUFFER_CACHE[src]);
            });
        } else {
            var request = new Request(src);
            return fetch(request).then(function(response) {
                return response.arrayBuffer();
              }).then(function(buffer) {
                return self.audioContext.decodeAudioData(buffer, function(decodedData) {
                    self.AUDIO_BUFFER_CACHE[src] = decodedData;
                    return self.AUDIO_BUFFER_CACHE[src];
                });
              });
        }
      }
};
