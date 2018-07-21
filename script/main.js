var myGamePiece;

//const { Observable,Subject, ReplaySubject, from, of, range } = rxjs;
//const { map, filter, switchMap } = rxjs.operators;
//var Rx = require('rx');
//import * as Rx from 'rxjs';
//import { Observable } from 'rxjs';

//Rx.Observable.fromEvent(window, 'mousemove').subscribe(event => console.log(event.clientX, event.clientY));

var barLeft;
var barRight;
var ball;

function startGame() {

    myGameArea.start();
    addEventListener('keydown', (event) => myGameArea.processKey(event));
    addEventListener('keyup', (event) => myGameArea.processKey(event));

    barLeft = new component(30, 100, "red", 10, 250);
    barRight = new component(30, 100, "blue", 760, 250);
    ball = new circle("green", 5);
    score = new score(myGameArea.canvas.width / 2, 60, 0, 0);
    //Rx.Observable.interval(1)
    //    .map(() => barRight.y)
    //    .distinctUntilChanged().subscribe(() => console.log(barRight.y));
    //ball.speedX = 4;
    //ball.speedY = 3;
}

//making game arena
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.keys = new Map();
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    processKey(event) {
        this.keys[event.keyCode] = (event.type == 'keydown');
    }
}

//making bars
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function score(x, y,scoreLeft,scoreRight) {
    //this.width = width;
    //this.height = height;
    this.scoreLeft = scoreLeft;
    this.scoreRight = scoreRight;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        //ctx.fillStyle = color;
        ctx.font="50px Georgia";
        var txt = this.scoreLeft.toString() + ":" + this.scoreRight.toString();
        ctx.fillText(txt ,this.x - ctx.measureText(txt).width / 2,this.y);
    }
}


//making ball
function circle(color, radius) {
    this.radius = radius;
    this.x = myGameArea.canvas.width / 2 - radius / 2;
    this.y = myGameArea.canvas.height / 2 - radius / 2;
    this.speedX = 4;
    this.speedY = 3;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        //ctx.lineWidth = 5;
        //ctx.strokeStyle = '#003300';
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

//main loop
function updateGameArea() {
    //document.write("XD");
    //console.log(barRight.x);
    //console.log(barRight.y);
    //console.log(barLeft.x);
    //console.log(barRight.y);
    myGameArea.clear();
    //if (myGameArea.keys[37]) {barLeft.x -= 1; }
    // register up arrow
    if (myGameArea.keys[38]) {barRight.y -= 4; }
    // right arrow
    //if (myGameArea.keys[39]){barLeft.x += 1; }
    // register down arrow
    if (myGameArea.keys[40]){barRight.y += 4; }
    if (barRight.y < 0) {barRight.y = 0; }
    if (barRight.y > myGameArea.canvas.height - barRight.height) {barRight.y = myGameArea.canvas.height - barRight.height; }
    barRight.update();
    if (myGameArea.keys[87]) {barLeft.y -= 4; }
    if (myGameArea.keys[83]){barLeft.y += 4; }
    if (barLeft.y < 0) {barLeft.y = 0; }
    if (barLeft.y > myGameArea.canvas.height - barLeft.height) {barLeft.y = myGameArea.canvas.height - barLeft.height; }
    barLeft.update();

    //hitting the arena
    if(ball.y > myGameArea.canvas.height - ball.radius) ball.speedY = Math.abs(ball.speedY) * (-1);
    if(ball.y < 0 + ball.radius) ball.speedY = Math.abs(ball.speedY);
    if(ball.x > myGameArea.canvas.width - ball.radius) ball.speedX = Math.abs(ball.speedX) * (-1);
    if(ball.x < 0 + ball.radius) ball.speedX = Math.abs(ball.speedX);

    //bouncing off top and bottom right bar
    if(ball.x + ball.radius > barRight.x){
        if(ball.y > barRight.y && ball.y < barRight.y + barRight.height && ball.x + ball.radius < barRight.x
            + Math.abs(ball.speedX))  ball.speedX = Math.abs(ball.speedX) * (-1);
        else if(ball.y + ball.radius > barRight.y && ball.y - ball.radius < barRight.y + barRight.height) {
            if(ball.y < barRight.y + barRight.height / 2) ball.speedY = Math.abs(ball.speedY) * (-1);
            if(ball.y > barRight.y + barRight.height / 2) ball.speedY = Math.abs(ball.speedY);
        }
    };
    //bouncing off top and bottom left bar
    if(ball.x - ball.radius < barLeft.x + barLeft.width){
        if(ball.y > barLeft.y && ball.y < barLeft.y + barLeft.height && ball.x - ball.radius > barLeft.x +barLeft.width
            - Math.abs(ball.speedX))  ball.speedX = Math.abs(ball.speedX);
        else if(ball.y + ball.radius > barLeft.y && ball.y - ball.radius < barLeft.y + barLeft.height) {
            if(ball.y < barLeft.y + barLeft.height / 2) ball.speedY = Math.abs(ball.speedY) * (-1);
            if(ball.y > barLeft.y + barLeft.height / 2) ball.speedY = Math.abs(ball.speedY);
        }
    };

    //change position of the ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    ball.update();
    score.update();
}