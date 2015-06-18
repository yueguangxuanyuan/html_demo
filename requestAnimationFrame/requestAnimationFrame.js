//解决Date.now() 函数的浏览器支持问题
if (!Date.now)
    Date.now = function() { return new Date().getTime(); };
	
	
//解决requestAnimationFrame的浏览器支持问题
(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

//定义获取随机颜色的函数
var getRandomColor = function(){
  return '#'+(Math.random()*0xffffff<<0).toString(16);
}

//获取绘图对象
var canvas = document.getElementById("motion"), 
    c = canvas.getContext("2d"),
    particles = {},  //定义记录颗粒的数组
    particleIndex = 0,  //颗粒index
    particleNum = 0.2;   //一个限定值 来控制颗粒出现的概率  具体见后文

canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight/2;

//生成一个颗粒相关的参数
function Particle(){
  this.x = canvas.width/2;   //所在位置
  this.y = canvas.height/2;

  this.vx = Math.random() * 6 - 3;  //偏移参数
  this.vy = Math.random() * 4 - 2; 

  this.growth = ( Math.abs(this.vx) + Math.abs(this.vy) ) * 0.007;

  particleIndex++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.size = Math.random() * 1;
  this.color = getRandomColor();
}

//定义绘图函数
Particle.prototype.draw = function(){
  this.x += this.vx;
  this.y += this.vy;

  this.size += this.growth;
  if(this.x > canvas.width || this.y > canvas.height){
    delete particles[this.id];
  }
//调用从canvas拿来的上下文对象绘图
  c.fillStyle = this.color;
  c.beginPath();
  c.arc(this.x, this.y, this.size,0*Math.PI,2*Math.PI);
  c.fill();
};

//动画
function animate(){
  requestAnimationFrame( animate );
  //绘制背景黑幕
  c.fillStyle = "#000";
  c.fillRect(0,0,canvas.width,canvas.height);
  //决定是否产生新点
  if(Math.random() > particleNum){
    new Particle();
  }
  //绘制点
  for(var i in particles){
    particles[i].draw();
  }
}

//开始动画
requestAnimationFrame( animate );