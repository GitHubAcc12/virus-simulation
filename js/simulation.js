var canvas = document.getElementById("simulation");
var width = 3*document.documentElement.clientWidth * window.devicePixelRatio / 4;//window.innerWidth * window.devicePixelRatio;
var height = document.documentElement.clientHeight * window.devicePixelRatio / 2;//window.innerHeight * window.devicePixelRatio;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
canvas.setAttribute("align", "center");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;

var dx = 2;
var dy = -2;

draw();


function drawBall() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawBackground() {
    ctx.fillStyle = "#d2d6d3";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawBackground();
    drawBall();
    
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    x += dx;
    y += dy;
}

function loadConfig() {
    var population = document.getElementById("population-input");
    // Balls all start on the same point, move around and get drawn to density hubs
    // Then after 10 seconds disease starts spreading

    draw

    setInterval(draw, 10);
}


