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
        if (x + dx > thix.max_x - this.radius || x + dx < this.radius) {
            dx = -dx;
        }
        if (y + dy > thix.max_y - this.radius || y + dy < this.radius) {
            dy = -dy;
        }
    
        x += dx;
        y += dy;
    }

    drawSelf(x, y) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}