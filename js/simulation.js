var canvas = document.getElementById("simulation");
var width = 3 * document.documentElement.clientWidth * window.devicePixelRatio / 4;//window.innerWidth * window.devicePixelRatio;
var height = document.documentElement.clientHeight * window.devicePixelRatio / 2;//window.innerHeight * window.devicePixelRatio;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
canvas.setAttribute("align", "center");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 5;
var infected_counter;
var transmission_rate = 1;
var initially_infected = 1;
var intervals = [];
var movement_speed = 9;
var infection_data_plot = [];
var gravity_points = [];
var population;


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
    for (i = 0; i < gravity_points.length; i++) {
        gravity_points[i].drawSelf();
    }
    collisionDetection();

    // is everyone infected? Draw plot!
    /*if (everyoneInfected()) {
        showChart();
    }*/
}

function everyoneInfected() {
    return population == infected_counter
}

function changeBallDirections() {
    var i;
    var j;
    for (i = 0; i < balls.length; i++) {
        var gravity = null;
        for (j = 0; j < gravity_points.length; j++) {
            if (isInRadius(balls[i], gravity_points[j]) && Math.random() < 0.6) {
                gravity = gravity_points[j];
            }
        }
        if (gravity == null) {
            balls[i].randomDirection();

        } else {
            balls[i].moveTo(gravity.x, gravity.y);
        }
    }
}

function isCollision(objA, objB) {
    var rad = Math.max(objA.radius, objB.radius);
    return Math.abs(objA.x - objB.x) <= rad && Math.abs(objA.y - objB.y) <= rad;
}

function isInRadius(ball, gravityPoint) {
    return Math.abs(ball.x - gravityPoint.x) <= gravityPoint.extendedRadius
        && Math.abs(ball.y - gravityPoint.y) < + gravityPoint.extendedRadius;
}

function collisionDetection() {
    var i;
    var j;
    for (i = 0; i < balls.length; i++) {
        for (j = 0; j < balls.length; j++) {
            if (i == j) {
                continue;
            }
            if (isCollision(balls[i], balls[j]) && (balls[i].infected || balls[j].infected) && Math.random() < transmission_rate) {
                if (!(balls[i].infected && balls[j].infected)) {
                    infected_counter++;
                }
                balls[i].infected = true;
                balls[j].infected = true;
            }
        }
        for (j = 0; j < gravity_points.length; j++) {
            if (isCollision(balls[i], gravity_points[j]) && (balls[i].infected || gravity_points[j].infected) && Math.random() < transmission_rate) {
                if (!(balls[i].infected)) {
                    infected_counter++;
                    balls[i].infected = true;
                }
                gravity_points[j].infected = true;
            }
        }
    }
}


function infectRandomBalls(number) {
    var i;
    for (i = 0; i < number; i++) {
        var ball = balls[Math.floor(Math.random() * balls.length)];
        while (ball.infected == true) {
            ball = balls[Math.floor(Math.random() * balls.length)];
        }
        ball.infected = true;
    }
}

function showChart() {
    console.log(infection_data_plot);
    functionPlot({
        target: '#polyline',
        width: 800,
        height: 500,
        data: [{
            points: infection_data_plot,
            fnType: 'points',
            graphType: 'polyline'
        }]
    });
}

function saveDataPoint() {
    if (!everyoneInfected()) {
        infection_data_plot.push([infection_data_plot.length, infected_counter]);
    }
}

function loadConfig() {
    // stop intervals
    while (intervals.length > 0) {
        clearInterval(intervals.pop());
    }

    infected_counter = initially_infected;
    balls = [];
    gravity_points = [];

    // get user configured values
    var conf_population = document.getElementById("population-input").value;
    if (conf_population != "") {
        population = parseInt(conf_population);
    }
    var user_transmission_rate = document.getElementById("transmission-rate-input").value;
    if (user_transmission_rate != "") {
        console.log("Transmission rate: " + user_transmission_rate);
        transmission_rate = parseFloat(user_transmission_rate);
    }
    var move_speed = parseFloat(document.getElementById("movement-speed-input").value);
    if (move_speed != "") {
        movement_speed = move_speed;
    }
    var gravity = document.getElementById("gravity-points-input").value;
    if (gravity != "") {
        gravity = parseInt(gravity);
        for (; gravity > 0; gravity--) {
            gravity_points.push(new GravityPoint(ctx, Math.random() * canvas.width, Math.random() * canvas.height, true, ballRadius * 3.5));
        }
    }

    // Balls all start on the same point, move around and get drawn to density hubs
    // Then after 10 seconds disease starts spreading
    var i;
    for (i = 0; i < population; i++) {
        var ball = new Ball(ctx, Math.random() * canvas.width, Math.random() * canvas.height, canvas_info, movement_speed);
        balls.push(ball);
        ball.drawSelf();
    }
    infectRandomBalls(initially_infected);

    intervals.push(setInterval(draw, 10));
    intervals.push(setInterval(changeBallDirections, 1000));
    intervals.push(setInterval(saveDataPoint, 1000));
}
