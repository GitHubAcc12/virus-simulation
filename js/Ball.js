class Ball {


    constructor(ctx, canvas_info, speed) {
        this.x = canvas_info["x"];
        this.y = canvas_info["y"];
        this.max_x = canvas_info["max_x"];
        this.max_y = canvas_info["max_y"];
        this.radius = canvas_info["ballRadius"];
        this.ctx = ctx;
        this.speed = speed
    }

    moveSelf() {
        if (x + dx > this.max_x - this.radius || x + this.speed < this.radius) {
            dx = -this.speed;
        }
        if (y + dy > this.max_y - this.radius || y - this.speed < this.radius) {
            dy = this.speed;
        }
    
        this.x += this.speed;
        this.y += -this.speed;
    }

    drawSelf() {
        this.moveSelf();
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}