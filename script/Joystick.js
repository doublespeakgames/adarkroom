"use strict";

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var pointers; // collections of pointers

var canvas,
c; // c is the canvas' context 2D

document.addEventListener("DOMContentLoaded", init);

window.onorientationchange = resetCanvas;
window.onresize = resetCanvas;

function init() {
    setupCanvas();
    pointers = new Collection();
    canvas.addEventListener('pointerdown', onPointerDown, false);
    canvas.addEventListener('pointermove', onPointerMove, false);
    canvas.addEventListener('pointerup', onPointerUp, false);
    canvas.addEventListener('pointerout', onPointerUp, false);
    requestAnimFrame(draw);
}

function resetCanvas(e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0, 0);
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    pointers.forEach(function (pointer) {
        c.beginPath();
        c.fillStyle = "white";
        c.fillText(pointer.type + " id : " + pointer.identifier + " x:" + pointer.x + " y:" + 
                   pointer.y, pointer.x + 30, pointer.y - 30);

        c.beginPath();
        c.strokeStyle = pointer.color;
        c.lineWidth = "6";
        c.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2, true);
        c.stroke();
    });

    requestAnimFrame(draw);
}

function createPointerObject(event) {
    var type;
    var color;
    switch (event.pointerType) {
        case event.POINTER_TYPE_MOUSE:
            type = "MOUSE";
            color = "red";
            break;
        case event.POINTER_TYPE_PEN:
            type = "PEN";
            color = "lime";
            break;
        case event.POINTER_TYPE_TOUCH:
            type = "TOUCH";
            color = "cyan";
            break;
    }
    return { identifier: event.pointerId, x: event.clientX, y: event.clientY, type: type, color: color };
}

function onPointerDown(e) {
    pointers.add(e.pointerId, createPointerObject(e));
}

function onPointerMove(e) {
    if (pointers.item(e.pointerId)) {
        pointers.item(e.pointerId).x = e.clientX;
        pointers.item(e.pointerId).y = e.clientY;
    }
}

function onPointerUp(e) {
    pointers.remove(e.pointerId);
}

function setupCanvas() {
    canvas = document.getElementById('canvasSurface');
    c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c.strokeStyle = "#ffffff";
    c.lineWidth = 2;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var canvas,
c, // c is the canvas' context 2D
container,
halfWidth,
halfHeight,
leftPointerID = -1,
leftPointerPos = new Vector2(0, 0),
leftPointerStartPos = new Vector2(0, 0),
leftVector = new Vector2(0, 0);

var pointers; // collections of pointers
var ship;
bullets = [],
spareBullets = [];

document.addEventListener("DOMContentLoaded", init);

window.onorientationchange = resetCanvas;
window.onresize = resetCanvas;

function init() {
    setupCanvas();
    pointers = new Collection();
    ship = new ShipMoving(halfWidth, halfHeight);
    document.body.appendChild(ship.canvas);
    canvas.addEventListener('pointerdown', onPointerDown, false);
    canvas.addEventListener('pointermove', onPointerMove, false);
    canvas.addEventListener('pointerup', onPointerUp, false);
    canvas.addEventListener('pointerout', onPointerUp, false);
    requestAnimFrame(draw);
}

function resetCanvas(e) {
    // resize the canvas - but remember - this clears the canvas too. 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    halfWidth = canvas.width / 2;
    halfHeight = canvas.height / 2;

    //make sure we scroll to the top left. 
    window.scrollTo(0, 0);
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    ship.targetVel.copyFrom(leftVector);
    ship.targetVel.multiplyEq(0.15);
    ship.update();

    with (ship.pos) {
        if (x < 0) x = canvas.width;
        else if (x > canvas.width) x = 0;
        if (y < 0) y = canvas.height;
        else if (y > canvas.height) y = 0;
    }

    ship.draw();

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        if (!bullet.enabled) continue;
        bullet.update();
        bullet.draw(c);
        if (!bullet.enabled) {
            spareBullets.push(bullet);

        }
    }

    pointers.forEach(function (pointer) {
        if (pointer.identifier == leftPointerID) {
            c.beginPath();
            c.strokeStyle = "cyan";
            c.lineWidth = 6;
            c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 40, 0, Math.PI * 2, true);
            c.stroke();
            c.beginPath();
            c.strokeStyle = "cyan";
            c.lineWidth = 2;
            c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 60, 0, Math.PI * 2, true);
            c.stroke();
            c.beginPath();
            c.strokeStyle = "cyan";
            c.arc(leftPointerPos.x, leftPointerPos.y, 40, 0, Math.PI * 2, true);
            c.stroke();

        } else {

            c.beginPath();
            c.fillStyle = "white";
            c.fillText("type : " + pointer.type + " id : " + pointer.identifier + " x:" + pointer.x + 
                       " y:" + pointer.y, pointer.x + 30, pointer.y - 30);

            c.beginPath();
            c.strokeStyle = "red";
            c.lineWidth = "6";
            c.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2, true);
            c.stroke();
        }
    });

    requestAnimFrame(draw);
}

function makeBullet() {
    var bullet;

    if (spareBullets.length > 0) {

        bullet = spareBullets.pop();
        bullet.reset(ship.pos.x, ship.pos.y, ship.angle);

    } else {

        bullet = new Bullet(ship.pos.x, ship.pos.y, ship.angle);
        bullets.push(bullet);

    }

    bullet.vel.plusEq(ship.vel);
}

function givePointerType(event) {
    switch (event.pointerType) {
        case event.POINTER_TYPE_MOUSE:
            return "MOUSE";
            break;
        case event.POINTER_TYPE_PEN:
            return "PEN";
            break;
        case event.POINTER_TYPE_TOUCH:
            return "TOUCH";
            break;
    }
}

function onPointerDown(e) {
    var newPointer = { identifier: e.pointerId, x: e.clientX, y: e.clientY, type: givePointerType(e) };
    if ((leftPointerID < 0) && (e.clientX < halfWidth)) {
        leftPointerID = e.pointerId;
        leftPointerStartPos.reset(e.clientX, e.clientY);
        leftPointerPos.copyFrom(leftPointerStartPos);
        leftVector.reset(0, 0);
    }
    else {
        makeBullet();

    }
    pointers.add(e.pointerId, newPointer);
}

function onPointerMove(e) {
    if (leftPointerID == e.pointerId) {
        leftPointerPos.reset(e.clientX, e.clientY);
        leftVector.copyFrom(leftPointerPos);
        leftVector.minusEq(leftPointerStartPos);
    }
    else {
        if (pointers.item(e.pointerId)) {
            pointers.item(e.pointerId).x = e.clientX;
            pointers.item(e.pointerId).y = e.clientY;
        }
    }
}

function onPointerUp(e) {
    if (leftPointerID == e.pointerId) {
        leftPointerID = -1;
        leftVector.reset(0, 0);

    }
    leftVector.reset(0, 0);

    pointers.remove(e.pointerId);
}

function setupCanvas() {
    canvas = document.getElementById('canvasSurfaceGame');
    c = canvas.getContext('2d');
    resetCanvas();
    c.strokeStyle = "#ffffff";
    c.lineWidth = 2;
}