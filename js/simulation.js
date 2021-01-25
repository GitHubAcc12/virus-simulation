var canvas = document.getElementById("simulation");
var width = 3*document.documentElement.clientWidth * window.devicePixelRatio / 4;//window.innerWidth * window.devicePixelRatio;
var height = document.documentElement.clientHeight * window.devicePixelRatio / 2;//window.innerHeight * window.devicePixelRatio;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
canvas.setAttribute("align", "center");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 5;
var collision_counter;
var transmission_rate = 1;
var initially_infected = 1;
var intervals = [];

var canvas_info = {
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
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawBackground();
    var i;
    for (i = 0; i < balls.length; i++) {
        balls[i].drawSelf();
    }
    collisionDetection();
}

function changeBallDirections() {
    var i;
    for (i = 0; i < balls.length; i++) {
        balls[i].changeDirection();
    }
}

function isCollision(i, j) {
    return Math.abs(balls[i].x - balls[j].x) <= ballRadius && Math.abs(balls[i].y - balls[j].y) <= ballRadius;
}

function collisionDetection() {
    var i;
    var j;
    for (i = 0; i < balls.length; i++) {
        for (j = 0; j < balls.length; j++) {
            if (i == j) {
                continue;
            }
            if(isCollision(i, j)) {
                // Collision Detected
                collision_counter++;
                if((balls[i].infected || balls[j].infected) && Math.random() < transmission_rate) {
                    balls[i].infected = true;
                    balls[j].infected = true;
                }
                console.log("Collision! So far: " + collision_counter);
            }
        }
    }
}

function infectRandomBalls(number) {
    var i;
    for(i = 0; i < number; i++) {
        var ball = balls[Math.floor(Math.random() * balls.length)];
        while(ball.infected == true) {
            ball = balls[Math.floor(Math.random() * balls.length)];
        }
        ball.infected = true;
    }
}

function loadConfig() {
    // stop intervals
    while(intervals.length > 0) {
        clearInterval(intervals.pop());
    }

    collision_counter = 0;
    balls = [];
    var population = parseInt(document.getElementById("population-input").value);
    var user_transmission_rate = document.getElementById("transmission-rate-input").value;
    if(user_transmission_rate != "") {
        console.log("Transmission rate: " + user_transmission_rate);
        transmission_rate = parseFloat(user_transmission_rate);
    }
    console.log("population: " + population);
    // Balls all start on the same point, move around and get drawn to density hubs
    // Then after 10 seconds disease starts spreading
    var i;
    for (i = 0; i < population; i++) {
        var ball = new Ball(ctx, Math.random()*canvas.width, Math.random()*canvas.height, canvas_info);
        balls.push(ball);
        ball.drawSelf();
    }
    infectRandomBalls(initially_infected);

    intervals.push(setInterval(draw, 10));
    intervals.push(setInterval(changeBallDirections, 1000));
}


/*
For copy paste into console-- get amount of infected balls
for(k = 0; k < balls.length; k++) {
    console.log(balls[k].infected);
}
*/
