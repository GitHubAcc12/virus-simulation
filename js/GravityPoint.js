class GravityPoint {
  constructor(ctx, x, y, inside, radius) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.inside = inside;
    this.infected = false;
    this.radius = radius;
    this.color = "green";
    this.extendedRadius = radius * 5;
  }

  cure() {
    this.infected = false;
    this.color = "green";
  }

  infect() {
    if(this.infected) {
      return false;
    }
    this.infected = true;
    this.color = "orange";
    return true;
  }

  drawSelf() {

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (this.inside) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // draw gravity radius
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.arc(this.x, this.y, this.extendedRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}
