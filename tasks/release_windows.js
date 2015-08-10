'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var asar = require('asar');
var utils = require('./utils');

var projectDir;
var tmpDir;
var releasesDir;
var readyAppDir;
var manifest;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    readyAppDir = tmpDir.cwd(manifest.name);

    return Q();
};

var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/electron-prebuilt/dist', readyAppDir.path(), { overwrite: true });
};

var cleanupRuntime = function() {
    return readyAppDir.removeAsync('resources/default_app');
}

var packageBuiltApp = function () {
    var deferred = Q.defer();

    asar.createPackage(projectDir.path('build'), readyAppDir.path('resources/app.asar'), function() {
        deferred.resolve();
    });

    return deferred.promise;
};

var finalize = function () {
    var deferred = Q.defer();

    projectDir.copy('resources/windows/icon.ico', readyAppDir.path('icon.ico'));

    // Replace Electron icon for your own.
    var rcedit = require('rcedit');
    rcedit(readyAppDir.path('electron.exe'), {
        'icon': projectDir.path('resources/windows/icon.ico'),
        'version-string': {
            'ProductName': manifest.productName,
            'FileDescription': manifest.description,
        }
    }, function (err) {
        if (!err) {
            deferred.resolve();
        }
    });

    return deferred.promise;
};

var renameApp = function() {
    return readyAppDir.renameAsync('electron.exe', manifest.productName + '.exe');
}

var createInstaller = function () {
    var deferred = Q.defer();

    var finalPackageName = manifest.name + '_' + manifest.version + '.exe';
    var installScript = projectDir.read('resources/windows/installer.nsi');
    installScript = utils.replace(installScript, {
        name: manifest.name,
        productName: manifest.productName,
        version: manifest.version,
        src: readyAppDir.path(),
        dest: releasesDir.path(finalPackageName),
        icon: readyAppDir.path('icon.ico'),
        setupIcon: projectDir.path('resources/windows/setup-icon.ico'),
        banner: projectDir.path('resources/windows/setup-banner.bmp'),
    });
    tmpDir.write('installer.nsi', installScript);

    gulpUtil.log('Building installer with NSIS...');

    // Remove destination file if already exists.
    releasesDir.remove(finalPackageName);

    // Note: NSIS have to be added to PATH (environment variables).
    var nsis = childProcess.spawn('makensis', [
        tmpDir.path('installer.nsi')
    ], {
        stdio: 'inherit'
    });
    nsis.on('error', function (err) {
        if (err.message === 'spawn makensis ENOENT') {
            throw "Can't find NSIS. Are you sure you've installed it and"
                + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });
    nsis.on('close', function () {
        gulpUtil.log('Installer ready!', releasesDir.path(finalPackageName));
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function () {
    return init()
    .then(copyRuntime)
    .then(cleanupRuntime)
    .then(packageBuiltApp)
    .then(finalize)
    .then(renameApp)
    .then(createInstaller)
    .then(cleanClutter);
};
