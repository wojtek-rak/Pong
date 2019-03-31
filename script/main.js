var fps = 100;
var gameSpeedIndex = 6;
var fpsReal = 1000 / fps;
var speedOfBars = 13 / fps * gameSpeedIndex;
var speedOfBall = 10 / fps * gameSpeedIndex;
var barLeft;
var barRight;
var ball;
var barStartY = 250;
var barStartLeftX = 10;
var barStartRightX = 760;
var paused = false;
var pauseKeyUp = false;
var pauseStart = false;
var counter = 0;
var lastUpdate = Date.now();
var lastDT = 10
var accDT = 10;
function startGame() {

    myGameArea.start();
    addEventListener('keydown', (event) => myGameArea.processKey(event));
    addEventListener('keyup', (event) => myGameArea.processKey(event));
    barLeft = new component(30, 100, "red", barStartLeftX, barStartY);
    barRight = new component(30, 100, "blue", barStartRightX, barStartY);
    var randBool = Math.random() >= 0.5
    ball = new circle("green", 5, randBool);
    score = new score(myGameArea.canvas.width / 2, 60, 0, 0);


    Rx.Observable.interval(30)
        .map(() => pauseKeyUp)
        .distinctUntilChanged()
        .subscribe(()=> pauseStart = true)
    pauseStart = false;

}

//making game arena
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.keys = new Map();
        this.keyUp = new Map();
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, fpsReal);
        this.intervalPause = setInterval(function() {
            // Will only run once
            clearInterval(this.intervalPause);
        }, 1000);},
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    processKey(event) {
        this.keys[event.keyCode] = (event.type == 'keydown');
        this.keyUp[event.keyCode] = (event.type == 'keyup');
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
    this.reset = function (x, y) {
        this.x = x;
        this.y = y;
    }
}

function score(x, y,scoreLeft,scoreRight) {
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
function circle(color, radius, startSiteRight) {
    this.radius = radius;
    this.y = myGameArea.canvas.height / 2 - radius / 2;
    this.setStartPos = function (startSiteRight) {
        if(startSiteRight){
            this.x = myGameArea.canvas.width * 3 / 4 - radius / 2;
            this.speedX = -speedOfBall;
            //this.speedY = Math.random() * 5 / fps * gameSpeedIndex;
            //TESTING
            //this.speedY = 5 / fps * gameSpeedIndex;
            //this.y = 0;
            //this.x = myGameArea.canvas.width * 3 / 4 - radius / 2 -5;
        }
        else{
            this.x = myGameArea.canvas.width  / 4 - radius / 2;
            this.speedX = speedOfBall;
            this.speedY = Math.random() * 5 / fps * gameSpeedIndex;
        }
    }
    this.setStartPos(startSiteRight);
    
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    this.reset = function (startSiteRight) {
        this.x = myGameArea.canvas.width / 2 - radius / 2;
        this.y = myGameArea.canvas.height / 2 - radius / 2;
        this.setStartPos(startSiteRight)
    }

}


function pause() {
    if(!paused){
        clearInterval(myGameArea.interval);
        myGameArea.intervalPause = setInterval(pauseLoop, 20);
        paused = true
    }
    else if (paused){
        clearInterval(myGameArea.intervalPause);
        myGameArea.interval = setInterval(updateGameArea, 20);
        paused = false;
    }

}
function pauseLoop() {
    pauseKeyUp = myGameArea.keyUp[80];
    if(pauseStart){
        pauseStart = false;
        counter += 1;
        if (counter == 2){
            counter = 0;
            pause();
        }
    }
}
function resetGame(startSiteRight) {
    ball.reset(startSiteRight);
    barLeft.reset(barStartLeftX, barStartY);
    barRight.reset(barStartRightX, barStartY);
    barLeft.update();
    barRight.update();
    ball.update();
}
//main loop
function updateGameArea() {
    lastDT = accDT;
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    console.log(dt);
    accDT = dt;
    myGameArea.clear();
    // register up arrow
    if (myGameArea.keys[38]) {barRight.y -= speedOfBars * dt; }
    // right arrow
    // register down arrow
    if (myGameArea.keys[40]){barRight.y += speedOfBars * dt; }
    if (barRight.y < 0) {barRight.y = 0; }
    if (barRight.y > myGameArea.canvas.height - barRight.height) {barRight.y = myGameArea.canvas.height - barRight.height; }
    barRight.update();
    if (myGameArea.keys[87]) {barLeft.y -= speedOfBars * dt; }
    if (myGameArea.keys[83]){barLeft.y += speedOfBars * dt; }
    if (barLeft.y < 0) {barLeft.y = 0; }
    if (barLeft.y > myGameArea.canvas.height - barLeft.height) {barLeft.y = myGameArea.canvas.height - barLeft.height; }
    barLeft.update();

    //hitting the arena
    if(ball.y > myGameArea.canvas.height - ball.radius) ball.speedY = Math.abs(ball.speedY) * (-1);
    if(ball.y < 0 + ball.radius) ball.speedY = Math.abs(ball.speedY);


    if(ball.x + ball.radius > barRight.x){
        if(ball.y > barRight.y && ball.y < barRight.y + barRight.height && ball.x + ball.radius < barRight.x
            + Math.abs(ball.speedX  * lastDT))
        {
            ball.speedX = Math.abs(ball.speedX) * (-1);
            ball.speedY =( (ball.y - barRight.y ) - (barRight.height / 2) ) / 3 / fps * gameSpeedIndex;
        }
        //bouncing off top and bottom right bar
        else if(ball.y + ball.radius > barRight.y && ball.y - ball.radius < barRight.y + barRight.height) {
            if(ball.y < barRight.y + barRight.height / 2) ball.speedY = Math.abs(ball.speedY) * (-1);
            if(ball.y > barRight.y + barRight.height / 2) ball.speedY = Math.abs(ball.speedY);
        }
    };
    if(ball.x - ball.radius < barLeft.x + barLeft.width){
        if(ball.y > barLeft.y && ball.y < barLeft.y + barLeft.height && ball.x - ball.radius > barLeft.x +barLeft.width
            - Math.abs(ball.speedX * lastDT))
        {
            ball.speedX = Math.abs(ball.speedX);
            ball.speedY =( (ball.y - barLeft.y ) - (barLeft.height / 2) ) / 3 / fps * gameSpeedIndex;
        }
        //bouncing off top and bottom left bar
        else if(ball.y + ball.radius > barLeft.y && ball.y - ball.radius < barLeft.y + barLeft.height) {
            if(ball.y < barLeft.y + barLeft.height / 2) ball.speedY = Math.abs(ball.speedY) * (-1);
            if(ball.y > barLeft.y + barLeft.height / 2) ball.speedY = Math.abs(ball.speedY);
        }
    };

    //change position of the ball
    ball.x += ball.speedX * dt;
    ball.y += ball.speedY * dt;
    ball.update();
    if(ball.x > myGameArea.canvas.width - 10) {
        score.scoreLeft += 1;
        resetGame(true);
    }
    if(ball.x < 10){
        score.scoreRight += 1;
        resetGame(false);
    }
    score.update();
    pauseKeyUp = myGameArea.keyUp[80];

    if(pauseStart){
        pauseStart = false;
        counter += 1;
        if (counter == 2){
            counter = 0;
            pause();
        }
    }


}