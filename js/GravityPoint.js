class GravityPoint {

    constructor(ctx, x, y, inside, radius) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.inside = inside;
        this.infected = false;
        this.radius = radius;
    }

    drawSelf() {
        if(this.infected) {
            ctx.fillStyle = "orange";
            ctx.strokeStyle = "orange";
        } else {
            ctx.fillStyle = "green";
            ctx.strokeStyle = "green";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius*0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        if(this.inside) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

}