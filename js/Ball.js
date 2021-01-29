class Ball {
  constructor(ctx, x, y, canvas_info, speed) {
    this.x = x;
    this.y = y;
    this.max_x = canvas_info["max_x"];
    this.max_y = canvas_info["max_y"];
    this.radius = canvas_info["ballRadius"];
    this.ctx = ctx;
    this.speed = speed;
    this.state = InfectionState.susceptible;
    this.last_visited_city;
    this.infected_days = 0;
    this.color = "blue";
    this.randomDirection();
  }

  randomDirection() {
    this.x_speed = Math.random() * 2 * this.speed - this.speed;
    this.y_speed = -(Math.random() * 2 * this.speed - this.speed);
  }

  moveTo(to_x, to_y) {
    if (
      this.last_visited_city == null ||
      (this.last_visited_city.x != to_x && this.last_visited_city.y != to_y)
    ) {
      this.x_speed = (to_x - this.x) / 100;
      this.y_speed = (to_y - this.y) / 100;
      this.last_visited_city = {
        x: to_x,
        y: to_y,
      };
    }
  }

  expose() {
    if(this.state === InfectionState.exposed || this.state === InfectionState.infected || this.state === InfectionState.immune) {
      return false;
    }
    this.state = InfectionState.exposed;
    this.color = "purple";
    return true;
  }

  moveToOppositeDirection() {
    // Supposed to create "bounce-off" effect from other balls
    this.x_speed = -this.x_speed;
    this.y_speed = -this.y_speed;
  }

  infect() {
    this.state = InfectionState.infected; 
    this.color = "red";
  }

  recover() {
    this.state = InfectionState.immune;
    this.color = "green";
  }

  setSusceptible() {
    this.state = InfectionState.susceptible;
    this.color = "blue";
  }

  moveSelf() {
    if (
      this.x + this.x_speed > this.max_x - this.radius ||
      this.x + this.x_speed < this.radius
    ) {
      this.x_speed = -this.x_speed;
    }
    if (
      this.y + this.y_speed > this.max_y - this.radius ||
      this.y + this.y_speed < this.radius
    ) {
      this.y_speed = -this.y_speed;
    }

    this.x += this.x_speed;
    this.y += this.y_speed;
  }

  drawSelf() {
    this.moveSelf();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
