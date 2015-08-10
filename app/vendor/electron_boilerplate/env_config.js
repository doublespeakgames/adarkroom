// Loads config/env_XXX.json file and puts it
// in proper place for given Electron context.

'use strict';

(function () {
    var jetpack = require('fs-jetpack');
    if (typeof window === 'object') {
        // Web browser context, __dirname points to folder where app.html file is.
        window.env = jetpack.read(__dirname + '/env_config.json', 'json');
    } else {
        // Node context
        module.exports = jetpack.read(__dirname + '/../../env_config.json', 'json');
    }
}());
