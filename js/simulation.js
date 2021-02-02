const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");
var days_passed = 0;

initialize();

var ballRadius = 5;
var infected_counter;
var death_counter;
var immune_counter;
var transmission_rate;
var intervals = [];
var movement_speed;

var gravity_points = [];
var gravity_point_timeouts = [];
var balls = [];
var population;
var incubation_period;
var disease_duration;
var lethality_rate;
var immunity_days;
var timeoutStore = [];

const DAY_LENGTH = 1000;

const canvas_info = {
  ballRadius: ballRadius,
  max_x: canvas.width,
  max_y: canvas.height,
};

function initialize() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, false);
  plotChart();
}

function resizeCanvas() {
  canvas.width = (3 * window.innerWidth) / 4;
  canvas.height = window.innerHeight / 2;
  canvas.setAttribute("align", "center");
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  for (var i = 0; i < balls.length; i++) {
    balls[i].drawSelf();
  }
  for (var i = 0; i < gravity_points.length; i++) {
    gravity_points[i].drawSelf();
  }
  collisionDetection();
  requestAnimationFrame(draw);
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


function changeBallDirections() {
  for (var i = 0; i < balls.length; i++) {
    var gravity = null;
    for (var j = 0; j < gravity_points.length; j++) {
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

function infectBallLater(ball) {
  setTimeout(() => { ball.infect(); }, incubation_period*DAY_LENGTH);
  
  infected_counter++;
  killBallLater(ball);
}

function collisionDetection() {
  for (var i = 0; i < balls.length; i++) {
    for (var j = 0; j < balls.length; j++) {
      if (i == j) {
        continue;
      }
      if (
        isCollision(balls[i], balls[j]) &&
        (balls[i].state === InfectionState.infected || balls[j].state === InfectionState.infected) &&
        Math.random() < transmission_rate
      ) {
        if (balls[i].expose()) {
          infectBallLater(balls[i]);
        }
        if (balls[j].expose()) {
          infectBallLater(balls[j]);
        }
      }
    }

    for (var j = 0; j < gravity_points.length; j++) {
      if (
        isCollision(balls[i], gravity_points[j]) &&
        (balls[i].state === InfectionState.infected || gravity_points[j].infected) &&
        Math.random() < transmission_rate
      ) {
        if (balls[i].expose()) {
          infectBallLater(balls[i]);
        } else if(!(balls[i].state === InfectionState.immune)){ // TODO this is pretty ugly
          // The ball either infected the city here, or it was 
          // immune and didn't infect it
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

function infectRandomBall() {
  var ballIndex = Math.floor(Math.random() * balls.length);
  balls[ballIndex].infect();
  killBallLater(balls[ballIndex]);
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
  var incubation = document.getElementById("incubation-period-input").value;
  if (incubation != "") {
    incubation_period = parseInt(incubation);
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

  infected_counter = 1; // Start with 1 infection
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
  getConfigValues();
  
  // Balls all start on the same point, move around and get drawn to density hubs
  // Then after 10 seconds disease starts spreading
  for (var i = 0; i < population; i++) {
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
  infectRandomBall();

  plotChart();

  requestAnimationFrame(draw);
  intervals.push(setInterval(changeBallDirections, 1000));
  intervals.push(setInterval(incrementDaysPassed, DAY_LENGTH));
  intervals.push(setInterval(updateCharts, DAY_LENGTH));
}
