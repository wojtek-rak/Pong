var myGamePiece;

function startGame() {
    myGameArea.start();
    addEventListener('keydown', (event) => myGameArea.processKey(event));
    addEventListener('keyup', (event) => myGameArea.processKey(event));
    myGamePiece = new component(30, 30, "red", 10, 120);
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

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys[37]) {myGamePiece.x -= 1; }
    // up arrow
    if (myGameArea.keys[38]) {myGamePiece.y -= 1; }
    // right arrow
    if (myGameArea.keys[39]){myGamePiece.x += 1; }
    // down arrow
    if (myGameArea.keys[40]){myGamePiece.y += 1; }
    myGamePiece.update();
}