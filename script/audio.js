/**
 * Module that takes care of audio playback
 */
var AudioEngine = {
    AUDIO_BUFFER_CACHE: {},
    audioContext: null,
    output: null,
	init: function(options) {
        // for legacy browsers
        this.audioContext = new (window.AudioContext || window.webkitAudioContext);
        this.output = this.audioContext.createGain();
        this.output.connect(this.audioContext.destination);
	},
	options: {}, // Nothing for now
    _playAudioBuffer: function(buffer, loop) {
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.output);
        source.loop = loop || false;
        source.start(0);
    },
	playSound: function(src, loop) {
        var self = this;
        this.loadAudioFile(src)
            .then(function (buffer) {
                self._playAudioBuffer(buffer, loop);
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
