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

var canvas_info = {
    "x": x,
    "y": y,
    "ballRadius": ballRadius,
    "max_x": canvas.width,
    "max_y": canvas.height
}

var balls = [];

drawBackground();


function drawBackground() {
    ctx.fillStyle = "#d2d6d3";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

function draw() {
    console.log("In draw()");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawBackground();
    var i;
    for (i = 0; i < balls.length; i++) {
        console.log(`Balls: ${balls.length}`);
        balls[i].drawSelf();
    }
}

function loadConfig() {
    balls = [];
    var population = parseInt(document.getElementById("population-input").value);
    console.log("population: " + population);
    // Balls all start on the same point, move around and get drawn to density hubs
    // Then after 10 seconds disease starts spreading

    var i;
    for (i = 0; i < population; i++) {
        var speed = Math.random()*5 + 1;
        var ball = new Ball(ctx, canvas_info, speed);
        console.log(`Ball.speed: ${ball.x_speed}`);
        balls.push(ball);
        ball.drawSelf();
    }

    console.log(`# Balls: ${balls.length}`);

    setInterval(draw, 10);
}


