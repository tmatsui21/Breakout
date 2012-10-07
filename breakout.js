/*
 * A very simple Breakout game
 *     for Experimental use and Javascript OOP study
 * @version 0.3
 * @author Takashi Matsui
 * 
 * https://github.com/tmatsui21/Breakout
 */

var BLOCK = 20, WIDTH = 300, HIGHT = 400, FPS = 30;
var DELTAX = 5, DELTAY = -5;
var timer = timer2 = null;
var canvas = document.getElementById('canvas');
var canvas2 = document.getElementById('canvas2');
var particles = [];
var count = 0;

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

Paddle.prototype.intersect = function (other){
    return this.x <= other.x + other.w && this.x + this.w >= other.x &&
        this.y <= other.y + other.h && this.y + this.h >= other.y;	
};

function Ball() {
    Paddle.apply(this, arguments); // プロパティの継承
    this.w = BLOCK; // プロパティの変更
}

Ball.prototype = new Paddle(); // メソッドの継承

Ball.prototype.move = function () { // メソッドの追加
    if ((this.y + BLOCK) > 370) stop();
    if ((this.x + BLOCK) >= WIDTH || this.x < 0) DELTAX *= -1;
    if ((this.y + BLOCK) >= HIGHT || this.y < 0 || clearBlock()) DELTAY *= -1;
    if (this.intersect(paddle)){
        DELTAY *= -1;
        initParticles(ball.x+10, ball.y+20);
        timer2 = setInterval(function () { drawParticles(ball.x+10, ball.y+20); }, 1000/FPS);
    }

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
    var ctx2 = canvas2.getContext('2d');
    
    var ball = new Ball(0, 200, ctx);
    
    var bricks = [];
    for (var i = 0; i < 9; i++) {
        bricks[i] = new Brick(((i % 3) * 100) + 20, Math.floor(i / 3) * 30, ctx);
        bricks[i].draw('brown');
    }
    
    var paddle = new Paddle(100, 330, ctx);
    paddle.draw('blue');
    
    timer = setInterval(function() { ball.move(); }, 1000/FPS);
    
    canvas2.addEventListener('touchmove', function(e) {
        e.preventDefault();
        paddle.clear();
        paddle.x = e.touches[0].pageX - canvas.offsetLeft - 50;
        paddle.draw('blue');
    }, false);
    canvas2.addEventListener('mousemove', function(e) {
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
        timer = setInterval(function() { ball.move(); }, 1000/FPS);
    }
}

function clearBlock() {
    for (var i = 0; i < 9; i++) {
        if (ball.intersect(bricks[i])) {
            bricks[i].clear();
            return true;
        }
    }
    return false;
}

function Particle(x, y) {
    this.delta = { x: -5 + Math.random() * 10, y: -10 + Math.random() * 15 };
    this.pos = { x: x, y: y };
    this.radius = 5 + Math.random() * 10;
    this.life = 5 + Math.random() * 10;
    this.remainingLife = this.life;
    this.r = Math.round(Math.random() * 255);
    this.g = Math.round(Math.random() * 255);
    this.b = Math.round(Math.random() * 255);
}

function initParticles(x, y) {
    particles = [];
    
    for (var i = 0; i < 50; i++) {
        particles.push(new Particle(x, y));
    }
    ctx2.globalCompositeOperation = 'lighter';
}

function drawParticles(x, y) {
    ctx2.clearRect(0, 0, WIDTH, HIGHT);
    
    if (++count > 5) {
        clearInterval(timer2);
        timer2 = null; count = 0;
        return ;
    };
    
    for(var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.opacity = Math.round(p.remainingLife/p.life*100) / 100
        
        var gradient = ctx2.createRadialGradient(p.pos.x, p.pos.y, 0, p.pos.x, p.pos.y, p.radius);
        gradient.addColorStop(0, 'rgba('+p.r+', '+p.g+', '+p.b+', '+p.opacity+')');
        gradient.addColorStop(1, 'rgba('+p.r+', '+p.g+', '+p.b+', 0)');
        
        ctx2.beginPath();
        ctx2.fillStyle = gradient;
        ctx2.arc(p.pos.x, p.pos.y, p.radius, Math.PI*2, false);
        ctx2.fill();
        
        p.remainingLife--;
        p.radius--;
        p.pos.x += p.delta.x;
        p.pos.y += p.delta.y;
        
        if (p.remainingLife < 0 || p.radius < 0) {
            particles[i] = new Particle(x, y);
        }
    }
}
