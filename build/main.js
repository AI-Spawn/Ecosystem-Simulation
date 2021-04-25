"use strict";
class Ant {
    constructor(x = random(0, width), y = random(0, height)) {
        this.size = 50;
        this.food = 500;
        this.speed = 10;
        this.eat_rate = 1;
        this.energy_rate = 2;
        this.max_food = 1000;
        this.vel = [random(-1, 1), random(-1, 1)];
        this.dead = false;
        this.last_move = Date.now();
        this.x = x;
        this.y = y;
    }
    move() {
        let vel = bindVector(this.vel[0], this.vel[1], (this.speed * (Date.now() - this.last_move)) / 100);
        this.last_move = Date.now();
        this.x += vel[0];
        this.y += vel[1];
        if (this.x < this.size / 2 || this.x > width - this.size / 2) {
            this.vel[0] *= -1;
            this.x = clamp(this.x, this.size / 2, width - this.size / 2);
        }
        if (this.y < this.size / 2 || this.y > height - this.size / 2) {
            this.vel[1] *= -1;
            this.y = clamp(this.y, this.size / 2, height - this.size / 2);
        }
    }
    show() {
        if (!this.dead) {
            strokeWeight(2);
            stroke(0);
            fill(47, 185, 161);
            ellipse(this.x, this.y, this.size, this.size);
            fill(0);
        }
    }
    eat(food) {
        if (this.food < this.max_food) {
            food.consume(this.eat_rate);
            this.food += this.energy_rate;
            this.size = clamp(this.food / 100, 50, 75);
        }
    }
    drawClosest(points) {
        let d = [];
        for (const point of points) {
            let p = point.data;
            if (p != this) {
                d.push({ ant: p, dist: dist(this.x, this.y, p.x, p.y) });
            }
        }
        d.sort((a, b) => (a.dist > b.dist ? 1 : -1));
        for (let i = 0; i < min(2, d.length); i++) {
            let c = d[i];
            line(this.x, this.y, c.ant.x, c.ant.y);
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
function dc(obj) {
    return JSON.parse(JSON.stringify(obj));
}
let cnv;
let moveUpdate = Date.now();
let num_food = 100;
let depos = [];
let num_ants = 500;
let ants = [];
let size = 5000;
function setup() {
    cnv = createCanvas(size, size * (windowHeight / windowWidth));
    cnv.position(0, 0);
    for (let i = 0; i < num_food; i++) {
        depos.push(new Food());
    }
    for (let i = 0; i < num_ants; i++) {
        ants.push(new Ant());
    }
    textAlign(CENTER, CENTER);
}
function draw() {
    clear();
    scale(windowWidth / size);
    background(128, 175, 73);
    gen_grid_lines();
    for (let i = 0; i < depos.length; i++) {
        let f = depos[i];
        f.show();
        if (f.capacity <= 20) {
            depos[i] = new Food();
        }
    }
    let qtree = QuadTree.create();
    for (let a of ants) {
        let point = new Point(a.x, a.y, a);
        qtree.insert(point);
        if (!a.dead) {
            a.show();
            for (const f of depos) {
                if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
                    a.eat(f);
                }
            }
            if (a.food <= 0) {
                a.dead = true;
            }
            a.move();
        }
    }
    stroke(255, 0, 0);
    strokeWeight(3);
    for (let a of ants) {
        let range = new Circle(a.x, a.y, 100);
        let points = qtree.query(range);
        a.drawClosest(points);
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
        stroke(40, 64, 14);
        strokeWeight(this.capacity / 5);
        fill(62, 93, 33);
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
function gen_grid_lines() {
    let grid_spacing = width / 10;
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < width / grid_spacing; i++) {
        line(i * grid_spacing, 0, i * grid_spacing, height);
    }
    for (let i = 0; i < height / grid_spacing; i++) {
        line(0, i * grid_spacing, width, i * grid_spacing);
    }
}
class Point {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.data = d;
    }
    dist(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = x - w / 2;
        this.right = x + w / 2;
        this.top = y - h / 2;
        this.bottom = y + h / 2;
    }
    contains(point) {
        return (this.left <= point.x &&
            point.x <= this.right &&
            this.top <= point.y &&
            point.y <= this.bottom);
    }
    intersects(range) {
        return !(this.right < range.left ||
            range.right < this.left ||
            this.bottom < range.top ||
            range.bottom < this.top);
    }
    subdivide(quadrant) {
        switch (quadrant) {
            case "ne":
                return new Rectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case "nw":
                return new Rectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case "se":
                return new Rectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
            case "sw":
                return new Rectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        }
    }
    dist(point) {
        let dx = 0;
        if (this.left >= point.x || point.x >= this.right) {
            dx = Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
        }
        let dy = 0;
        if (this.top >= point.y || point.y >= this.bottom) {
            dx = Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
        }
        return Math.sqrt(dx * dx + dy * dy);
    }
}
class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    contains(point) {
        let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
        return d <= Math.pow(this.r, 2);
    }
    intersects(range) {
        let xDist = Math.abs(range.x - this.x);
        let yDist = Math.abs(range.y - this.y);
        let r = this.r;
        let w = range.w / 2;
        let h = range.h / 2;
        let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);
        if (xDist > r + w || yDist > r + h)
            return false;
        if (xDist <= w || yDist <= h)
            return true;
        return edges <= Math.pow(this.r, 2);
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }
    get children() {
        if (this.divided) {
            return [this.northeast, this.northwest, this.southeast, this.southwest];
        }
        else {
            return [];
        }
    }
    static create() {
        let DEFAULT_CAPACITY = 8;
        if (arguments.length === 0) {
            let bounds = new Rectangle(width / 2, height / 2, width, height);
            return new QuadTree(bounds, DEFAULT_CAPACITY);
        }
        if (arguments[0] instanceof Rectangle) {
            let capacity = arguments[1] || DEFAULT_CAPACITY;
            return new QuadTree(arguments[0], capacity);
        }
        if (typeof arguments[0] === "number" &&
            typeof arguments[1] === "number" &&
            typeof arguments[2] === "number" &&
            typeof arguments[3] === "number") {
            let capacity = arguments[4] || DEFAULT_CAPACITY;
            return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
        }
        throw new TypeError("Invalid parameters");
    }
    toJSON(isChild) {
        let obj = { points: this.points };
        if (this.divided) {
            if (this.northeast.points.length > 0) {
                obj.ne = this.northeast.toJSON(true);
            }
            if (this.northwest.points.length > 0) {
                obj.nw = this.northwest.toJSON(true);
            }
            if (this.southeast.points.length > 0) {
                obj.se = this.southeast.toJSON(true);
            }
            if (this.southwest.points.length > 0) {
                obj.sw = this.southwest.toJSON(true);
            }
        }
        if (!isChild) {
            obj.capacity = this.capacity;
            obj.x = this.boundary.x;
            obj.y = this.boundary.y;
            obj.w = this.boundary.w;
            obj.h = this.boundary.h;
        }
        return obj;
    }
    static fromJSON(obj, x, y, w, h, capacity) {
        if (typeof x === "undefined") {
            if ("x" in obj) {
                x = obj.x;
                y = obj.y;
                w = obj.w;
                h = obj.h;
                capacity = obj.capacity;
            }
            else {
                throw TypeError("JSON missing boundary information");
            }
        }
        let qt = new QuadTree(new Rectangle(x, y, w, h), capacity);
        qt.points = obj.points;
        if ("ne" in obj || "nw" in obj || "se" in obj || "sw" in obj) {
            let x = qt.boundary.x;
            let y = qt.boundary.y;
            let w = qt.boundary.w / 2;
            let h = qt.boundary.h / 2;
            if ("ne" in obj) {
                qt.northeast = QuadTree.fromJSON(obj.ne, x + w / 2, y - h / 2, w, h, capacity);
            }
            else {
                qt.northeast = new QuadTree(qt.boundary.subdivide("ne"), capacity);
            }
            if ("nw" in obj) {
                qt.northwest = QuadTree.fromJSON(obj.nw, x - w / 2, y - h / 2, w, h, capacity);
            }
            else {
                qt.northwest = new QuadTree(qt.boundary.subdivide("nw"), capacity);
            }
            if ("se" in obj) {
                qt.southeast = QuadTree.fromJSON(obj.se, x + w / 2, y + h / 2, w, h, capacity);
            }
            else {
                qt.southeast = new QuadTree(qt.boundary.subdivide("se"), capacity);
            }
            if ("sw" in obj) {
                qt.southwest = QuadTree.fromJSON(obj.sw, x - w / 2, y + h / 2, w, h, capacity);
            }
            else {
                qt.southwest = new QuadTree(qt.boundary.subdivide("sw"), capacity);
            }
            qt.divided = true;
        }
        return qt;
    }
    subdivide() {
        this.northeast = new QuadTree(this.boundary.subdivide("ne"), this.capacity);
        this.northwest = new QuadTree(this.boundary.subdivide("nw"), this.capacity);
        this.southeast = new QuadTree(this.boundary.subdivide("se"), this.capacity);
        this.southwest = new QuadTree(this.boundary.subdivide("sw"), this.capacity);
        this.divided = true;
    }
    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        if (!this.divided) {
            this.subdivide();
        }
        return (this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point));
    }
    query(range, found = []) {
        if (!range.intersects(this.boundary)) {
            return found;
        }
        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }
        return found;
    }
    forEach(fn) {
        this.points.forEach(fn);
        if (this.divided) {
            this.northeast.forEach(fn);
            this.northwest.forEach(fn);
            this.southeast.forEach(fn);
            this.southwest.forEach(fn);
        }
    }
    merge(other, capacity) {
        let left = Math.min(this.boundary.left, other.boundary.left);
        let right = Math.max(this.boundary.right, other.boundary.right);
        let top = Math.min(this.boundary.top, other.boundary.top);
        let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
        let height = bottom - top;
        let width = right - left;
        let midX = left + width / 2;
        let midY = top + height / 2;
        let boundary = new Rectangle(midX, midY, width, height);
        let result = new QuadTree(boundary, capacity);
        this.forEach((point) => result.insert(point));
        other.forEach((point) => result.insert(point));
        return result;
    }
    get length() {
        let count = this.points.length;
        if (this.divided) {
            count += this.northwest.length;
            count += this.northeast.length;
            count += this.southwest.length;
            count += this.southeast.length;
        }
        return count;
    }
}
//# sourceMappingURL=../src/src/main.js.map