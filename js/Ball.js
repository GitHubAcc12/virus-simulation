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
        this.last_visited_city;
        this.infected_days = 0;
        this.dead = false;
        this.color = "blue";
        this.randomDirection();
    }

    randomDirection() {
        this.x_speed = Math.random() * 2 * this.speed - this.speed;
        this.y_speed = -(Math.random() * 2 * this.speed - this.speed);
    }

    moveTo(to_x, to_y) {
        if (this.last_visited_city == null || (this.last_visited_city.x != to_x && this.last_visited_city.y != to_y)) {
            this.x_speed = (to_x - this.x) / 100;
            this.y_speed = (to_y - this.y) / 100;
            this.last_visited_city = {
                x: to_x,
                y: to_y
            }
        }
    }

    infect() {
        if(this.infected) {
            return false;
        }
        this.infected = true;
        this.color = "red";
        return true;
    }

    recover() {
        this.infected = false;
        this.color = "blue";
    }
    /*
    kill() {
        if (Math.random() < this.lethality_rate) {
            this.dead = true;
            this.color = "black";
        } else {
            this.infected = false;
        }
    }
    */
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}