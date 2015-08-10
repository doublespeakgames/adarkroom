// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>

(function () {
    'use strict';

    var shell = require('shell');

    var supportExternalLinks = function (e) {
        var href;
        var isExternal = false;

        var checkDomElement = function (element) {
            if (element.nodeName === 'A') {
                href = element.getAttribute('href');
            }
            if (element.classList.contains('js-external-link')) {
                isExternal = true;
            }
            if (href && isExternal) {
                shell.openExternal(href);
                e.preventDefault();
            } else if (element.parentElement) {
                checkDomElement(element.parentElement);
            }
        }

        checkDomElement(e.target);
    }

    document.addEventListener('click', supportExternalLinks, false);
}());
