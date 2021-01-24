class Ball {


    constructor(ctx, canvas_info, speed) {
        this.x = canvas_info["x"];
        this.y = canvas_info["y"];
        this.max_x = canvas_info["max_x"];
        this.max_y = canvas_info["max_y"];
        this.radius = canvas_info["ballRadius"];
        this.ctx = ctx;
        this.x_speed = speed;
        this.y_speed = -speed;
    }

    moveSelf() {
        console.log("Moving ball");
        if (this.x + this.x_speed > this.max_x - this.radius || this.x + this.x_speed < this.radius) {
            this.x_speed = -this.x_speed;
        }
        if (this.y + this.y_speed > this.max_y - this.radius || this.y - this.y_speed < this.radius) {
            this.y_speed = -this.y_speed;
        }
    
        this.x += this.x_speed;
        this.y += this.y_speed;
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