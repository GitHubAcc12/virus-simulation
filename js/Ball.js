class Ball {


    constructor(ctx, canvas_info, speed) {
        console.log("Speed: " + speed);
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
        var new_speed_x = Math.random()*10 - 5;
        var new_speed_y = -(Math.random()*10 - 5);
        if (this.x + new_speed_x > this.max_x - this.radius || this.x + this.x_speed < this.radius) {
            this.x_speed = -this.x_speed;
        } else {
            this.x_speed = new_speed_x;
        }
        if (this.y + new_speed_y > this.max_y - this.radius || this.y + new_speed_y < this.radius) {
            this.y_speed = -this.y_speed;
        } else {
            this.y_speed = new_speed_y;
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