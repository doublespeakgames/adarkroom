// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

(function () {
    'use strict';

    var remote = require('remote');
    var Menu = remote.require('menu');
    var MenuItem = remote.require('menu-item');

    var cut = new MenuItem({
        label: "Cut",
        click: function () {
            document.execCommand("cut");
        }
    });

    var copy = new MenuItem({
        label: "Copy",
        click: function () {
            document.execCommand("copy");
        }
    })

    var paste = new MenuItem({
        label: "Paste",
        click: function () {
            document.execCommand("paste");
        }
    });

    var textMenu = new Menu();
    textMenu.append(cut);
    textMenu.append(copy);
    textMenu.append(paste);

    document.addEventListener('contextmenu', function(e) {

        switch (e.target.nodeName) {
            case 'TEXTAREA':
            case 'INPUT':
                e.preventDefault();
                textMenu.popup(remote.getCurrentWindow());
                break;
        }

    }, false);

}());
