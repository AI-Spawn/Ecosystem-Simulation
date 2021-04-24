"use strict";
class Ant {
    constructor(x = random(0, width), y = random(0, height)) {
        this.size = 50;
        this.food = 50;
        this.speed = 5;
        this.eat_rate = 1;
        this.max_food = 255;
        this.vel = [random(-1, 1), random(-1, 1)];
        this.x = x;
        this.y = y;
    }
    move() {
        let vel = bindVector(this.vel[0], this.vel[1], this.speed);
        this.x += vel[0];
        this.y += vel[1];
        if (this.x < this.size / 2 || this.x > width - this.size / 2) {
            this.vel[0] *= -1;
        }
        if (this.y < this.size / 2 || this.y > height - this.size / 2) {
            this.vel[1] *= -1;
        }
        this.x = clamp(this.x, this.size / 2 + 1, width - this.size / 2 - 1);
        this.y = clamp(this.y, this.size / 2 + 1, height - this.size / 2 - 1);
    }
    show() {
        fill(99, 202, 216);
        ellipse(this.x, this.y, this.size, this.size);
    }
    eat(food) {
        if (this.food < this.max_food) {
            food.consume(this.eat_rate);
            this.food += this.eat_rate;
            this.size = clamp(this.food, 50, 75);
        }
    }
}
function bindVector(x, y, magnitude = 1) {
    x *= 100 * magnitude;
    y *= 100 * magnitude;
    if (x != 0 || y != 0) {
        let scaler = magnitude / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        x *= scaler;
        y *= scaler;
    }
    else {
        x = x <= -magnitude ? -magnitude : x >= magnitude ? magnitude : x;
        y = y <= -magnitude ? -magnitude : y >= magnitude ? magnitude : y;
    }
    return [x, y];
}
function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
let cnv;
let moveUpdate = Date.now();
let num_food = 10;
let depos = [];
let num_ants = 2;
let ants = [];
function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    for (let i = 0; i < num_food; i++) {
        depos.push(new Food());
    }
    for (let i = 0; i < num_ants; i++) {
        ants.push(new Ant());
    }
}
function draw() {
    background(0);
    for (let i = 0; i < depos.length; i++) {
        let f = depos[i];
        f.show();
        if (f.capacity <= 20) {
            depos[i] = new Food();
        }
    }
    for (let i = 0; i < ants.length; i++) {
        let a = ants[i];
        a.show();
        for (const f of depos) {
            if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
                a.eat(f);
            }
        }
        a.move();
    }
}
let min_food_size = 100;
let max_food_size = 300;
class Food {
    constructor(x = random(0, width), y = random(0, height), c = random(min_food_size, max_food_size)) {
        this.x = x;
        this.y = y;
        this.capacity = c;
    }
    show() {
        fill(40, 204, 45);
        ellipse(this.x, this.y, this.capacity, this.capacity);
    }
    consume(amount) {
        if (amount > 0) {
            this.capacity -= amount;
        }
        if (this.capacity < 0) {
            this.capacity = 0;
        }
    }
}
//# sourceMappingURL=../src/src/main.js.map