var myGamePiece;

function startGame() {
    myGameArea.start();
    addEventListener('keydown', (event) => myGameArea.processKey(event));
    addEventListener('keyup', (event) => myGameArea.processKey(event));
    barLeft = new component(30, 100, "red", 10, 250);
    barRight = new component(30, 100, "blue", 760, 250);
    ball = new circle("green", 15);
    ball.speedX = 3;
    ball.speedY = 3;
}

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

function circle(color, radius) {
    this.radius = radius;
    this.x = myGameArea.canvas.width / 2 - radius / 2;
    this.y = myGameArea.canvas.height / 2 - radius / 2;
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

function updateGameArea() {
    myGameArea.clear();
    //barLeft.speedX = 0;
    //barLeft.speedY = 0;
    //if (myGameArea.keys[37]) {barLeft.x -= 1; }
    // up arrow
    if (myGameArea.keys[38]) {barRight.y -= 4; }
    // right arrow
    //if (myGameArea.keys[39]){barLeft.x += 1; }
    // down arrow
    if (myGameArea.keys[40]){barRight.y += 4; }
    barRight.update();
    if (myGameArea.keys[87]) {barLeft.y -= 4; }
    if (myGameArea.keys[83]){barLeft.y += 4; }
    barLeft.update();

    if(ball.y > myGameArea.canvas.height - ball.radius) ball.speedY *= -1;
    if(ball.y < 0 + ball.radius) ball.speedY *= -1;
    if(ball.x > myGameArea.canvas.width - ball.radius) ball.speedX *= -1;
    if(ball.x < 0 + ball.radius) ball.speedX *= -1;


    ball.x += ball.speedX;
    ball.y += ball.speedY;
    ball.update();
}