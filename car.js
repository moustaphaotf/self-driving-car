class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.5;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.polygon = [];
        this.useBrain = controlType === "AI";

        if(controlType !== 'DUMMY') {
            this.sensors = new Sensors(this);
            this.brain = new NeuralNetwork(
                [this.sensors.rayCount, 6, 4]
            );
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
            
            if(this.sensors) {
                this.sensors.update(roadBorders, traffic);
                const offsets = this.sensors.readings.map(s => s === null ? 0 : 1 - s.offset);
                const outputs = NeuralNetwork.feedForward(offsets, this.brain);

                if(this.useBrain) {
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.reverse = outputs[3];
                }
            }
        }
    }
    
    #move() {
        if(this.controls.forward) {
            this.speed += this.acceleration;
        }
        
        if(this.controls.reverse) {
            this.speed -= this.acceleration;
        }


        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if(this.speed < - this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if(this.speed > 0) {
            this.speed -= this.friction;
        }

        if(this.speed < 0) {
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if(this.speed !== 0)  {
            const flip = this.speed > 0 ? 1 : -1;
            
            if(this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if(this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, color='black', drawSensors=false) {
        if(this.damaged) {
            ctx.fillStyle = 'gray';
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        
        if(this.sensors && drawSensors) {
            this.sensors.draw(ctx);
        }
    }

    #createPolygon(){
        const points = [];
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
        });

        return points;
    }

    #assessDamage(roadBorders, traffic) {
        for(const border of roadBorders) {
            if(polysIntersect(this.polygon, border)){
                return true;
            }
        }

        for(const car of traffic) {
            if(polysIntersect(this.polygon, car.polygon)){
                return true;
            }
        }
        return false;
    }
}