var canvas = document.getElementById("simulation");
var ctx = canvas.getContext("2d");
var days_passed = 0;

initialize();

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 5;
var infected_counter;
var death_counter;
var immune_counter;
var transmission_rate = 1;
var initially_infected = 1;
var intervals = [];
var movement_speed = 9;

var gravity_points = [];
var gravity_point_timeouts = [];
var balls = [];
var population;
var disease_duration = 1000000;
var lethality_rate;
var immunity_days;
var timeoutStore = [];

const DAY_LENGTH = 1000;

var canvas_info = {
  ballRadius: ballRadius,
  max_x: canvas.width,
  max_y: canvas.height,
};

function initialize() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, false);
}

function resizeCanvas() {
  canvas.width = (3 * window.innerWidth) / 4;
  canvas.height = window.innerHeight / 2;
  canvas.setAttribute("align", "center");
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  showDaysPassedText();
  var i;
  for (i = 0; i < balls.length; i++) {
    balls[i].drawSelf();
  }
  for (i = 0; i < gravity_points.length; i++) {
    gravity_points[i].drawSelf();
  }
  collisionDetection();
}

function kill(ball) {
  if (Math.random() < lethality_rate) {
    balls.splice(balls.indexOf(ball), 1);
    death_counter++;
  } else {
    ball.recover();
    immune_counter++;
    timeoutStore.push(
      setTimeout(() => {
        setBallSusceptible(ball);
      }, immunity_days * DAY_LENGTH)
    );
  }
  infected_counter--;
}

function setBallSusceptible(ball) {
  ball.setSusceptible();
  immune_counter--;
}

function killBallLater(ball) {
  timeoutStore.push(
    setTimeout(() => {
      kill(ball);
    }, disease_duration * DAY_LENGTH)
  );
}

function incrementDaysPassed() {
  days_passed++;
}

function showDaysPassedText() {
  ctx.font = "20px Arial";
  const text = "Day " + days_passed;
  ctx.fillStyle = "#000000";
  ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, 20);
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
  return (
    Math.abs(ball.x - gravityPoint.x) <= gravityPoint.extendedRadius &&
    Math.abs(ball.y - gravityPoint.y) <= gravityPoint.extendedRadius
  );
}

function collisionDetection() {
  var i;
  var j;
  for (i = 0; i < balls.length; i++) {
    for (j = 0; j < balls.length; j++) {
      if (i == j) {
        continue;
      }
      if (
        isCollision(balls[i], balls[j]) &&
        (balls[i].infected || balls[j].infected) &&
        Math.random() < transmission_rate
      ) {
        if (balls[i].infect()) {
          killBallLater(balls[i]);
          infected_counter++;
        }
        if (balls[j].infect()) {
          killBallLater(balls[j]);
          infected_counter++;
        }
      }
    }

    for (j = 0; j < gravity_points.length; j++) {
      if (
        isCollision(balls[i], gravity_points[j]) &&
        (balls[i].infected || gravity_points[j].infected) &&
        Math.random() < transmission_rate
      ) {
        if (balls[i].infect()) {
          infected_counter++;
          killBallLater(balls[i]);
        } else if(!balls[i].immune){ // TODO this is pretty ugly
          gravity_points[j].infect();
          resetTimeoutForGravityPoint(j);
        }        
      }
    }
  }
}

function resetTimeoutForGravityPoint(j) {
  clearTimeout(gravity_point_timeouts[j]);
  gravity_point_timeouts[j] = cureGravityPointLater(j);
}

function cureGravityPointLater(g_index) {
  return setTimeout(() => {
    gravity_points[g_index].cure();
  }, DAY_LENGTH * 0.6);
}

function infectRandomBalls(number) {
  var i;
  for (i = 0; i < number; i++) {
    var ballIndex = Math.floor(Math.random() * balls.length);
    while (!balls[ballIndex].infect()) {
      ballIndex = Math.floor(Math.random() * balls.length);
    }
    killBallLater(balls[ballIndex]);
  }
}

function getConfigValues() {
  // get user configured values
  var conf_population = document.getElementById("population-input").value;
  if (conf_population != "") {
    population = parseInt(conf_population);
  }
  var user_transmission_rate = document.getElementById(
    "transmission-rate-input"
  ).value;
  if (user_transmission_rate != "") {
    transmission_rate = parseFloat(user_transmission_rate);
  }
  var move_speed = parseFloat(
    document.getElementById("movement-speed-input").value
  );
  if (move_speed != "") {
    movement_speed = move_speed;
  }
  var gravity = document.getElementById("gravity-points-input").value;
  if (gravity != "") {
    gravity = parseInt(gravity);
    for (; gravity > 0; gravity--) {
      gravity_points.push(
        new GravityPoint(
          ctx,
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          true,
          ballRadius * 3.5
        )
      );
      gravity_point_timeouts.push(null);
    }
  }
  var lethality = document.getElementById("lethality-rate-input").value;
  if (lethality != "") {
    lethality_rate = lethality;
  }
  var dis_dur = document.getElementById("disease-duration-input").value;
  if (dis_dur != "") {
    disease_duration = dis_dur;
  }
  var im_dur = document.getElementById("immunity-input").value;
  if (im_dur != "") {
    immunity_days = parseInt(im_dur);
  }
}

function removeOldConfig() {
  // stop intervals
  while (intervals.length > 0) {
    clearInterval(intervals.pop());
  }

  while (timeoutStore.length > 0) {
    clearTimeout(timeoutStore.pop());
  }

  infected_counter = initially_infected;
  death_counter = 0;
  immune_counter = 0;
  balls = [];
  gravity_points = [];
  days_passed = 0;
}

function updateCharts() {
  updateChart(infected_counter, death_counter, immune_counter, days_passed);
}

function loadConfig() {
  removeOldConfig();
  clearChart();

  getConfigValues();
  // Balls all start on the same point, move around and get drawn to density hubs
  // Then after 10 seconds disease starts spreading
  var i;
  for (i = 0; i < population; i++) {
    var ball = new Ball(
      ctx,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      canvas_info,
      movement_speed
    );
    balls.push(ball);
    ball.drawSelf();
  }
  infectRandomBalls(initially_infected);

  plotChart();

  intervals.push(setInterval(draw, 10));
  intervals.push(setInterval(changeBallDirections, 1000));
  intervals.push(setInterval(incrementDaysPassed, DAY_LENGTH));
  intervals.push(setInterval(updateCharts, DAY_LENGTH));
}
