class Ball {


    constructor(ctx, x, y, canvas_info, speed) {
        this.x = x;
        this.y = y;
        this.max_x = canvas_info["max_x"];
        this.max_y = canvas_info["max_y"];
        this.radius = canvas_info["ballRadius"];
        this.ctx = ctx;
        this.speed = speed;
        this.infected = false;

        this.changeDirection();
        }

    changeDirection() {
        this.x_speed = Math.random()*2*this.speed - this.speed;
        this.y_speed = -(Math.random()*2*this.speed - this.speed);
    }

    moveSelf() {
        if (this.x + this.x_speed > this.max_x - this.radius || this.x + this.x_speed < this.radius) {
            this.x_speed = -this.x_speed;
        } 
        if (this.y + this.y_speed > this.max_y - this.radius || this.y + this.y_speed < this.radius) {
            this.y_speed = -this.y_speed;
        } 

        this.x += this.x_speed;
        this.y += this.y_speed;
    }

    drawSelf() {
        this.moveSelf();
        if(this.infected) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}