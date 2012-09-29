/*
 * a very simple Breakout game
 *     for Javascript OOP study
 * @version 0.1
 * @author Takashi Matsui
 * Ball extends Paddle and adds Move method
 * Brick extends Paddle and overrides Clear method
 */

var BLOCK = 20, WIDTH = 300, HIGHT = 400;
var DELTAX = 5, DELTAY = -5;
var timer = null;

var canvas = document.getElementById('canvas');

// class definitions
function Paddle(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.w = BLOCK * 5;
    this.h = BLOCK;
}

Paddle.prototype.draw = function (color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
}

Paddle.prototype.clear = function () {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
}

function Ball() {
    Paddle.apply(this, arguments); // プロパティの継承
    this.w = BLOCK; // プロパティの変更
}

Ball.prototype = new Paddle(); // メソッドの継承

Ball.prototype.move = function () { // メソッドの追加
    if ((this.x + BLOCK) >= WIDTH || this.x < 0) DELTAX *= -1;
    if ((this.y + BLOCK) >= HIGHT || this.y < 0) DELTAY *= -1;
    if (intersect(this, paddle)) DELTAY *= -1;
    if (clearBlock()) DELTAY *= -1;
    
    if ((this.y + BLOCK) > 370) stop();
    this.clear();
    this.x += DELTAX;
    this.y += DELTAY;
    this.draw('red');
}

function Brick() {
    Paddle.apply(this, arguments);
    this.w = BLOCK * 3;
}

Brick.prototype = new Paddle();
Brick.prototype.clear = function () { // メソッドのオーバーライド
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
    this.x = this.y = this.w = this.h = 0;
}

// game start
if (canvas && typeof(canvas.getContext) === 'function'){
    var ctx = canvas.getContext('2d');
    
    var ball = new Ball(0, 200, ctx);
    
    var bricks = [];
    for (var i = 0; i < 9; i++) {
        bricks[i] = new Brick(((i % 3) * 100) + 20, Math.floor(i / 3) * 30, ctx);
        bricks[i].draw('brown');
    }
    
    var paddle = new Paddle(100, 370, ctx);
    paddle.draw('blue');
    
    timer = setInterval(function() { ball.move(); }, 1000/30);
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        paddle.clear();
        paddle.x = e.touches[0].pageX - canvas.offsetLeft - 50;
        paddle.draw('blue');
    }, false);
    canvas.addEventListener('mousemove', function(e) {
        e.preventDefault();
        paddle.clear();
        paddle.x = e.offsetX - 50;
        paddle.draw('blue');
    }, false);
}

// functions
function stop() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    } else {
        timer = setInterval(function() { ball.move(); }, 1000/30);
    }
}

function intersect(A,B){
    if ((A.x <= B.x + B.w) && (A.x +A.w >= B.x) && (A.y <= B.y + B.h) && (A.y + A.h >= B.y)){
        return true;
    }
    return false;		
};

function clearBlock() {
    for (var i = 0; i < 9; i++) {
        if (intersect(ball, bricks[i])) {
            bricks[i].clear();
            return true;
        }
    }
    return false;
}