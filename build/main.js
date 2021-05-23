"use strict";
class Ant {
    constructor(x = random(0, width), y = random(0, height)) {
        this.learning_rate = 1.1;
        this.color = getColor();
        this.size = 25;
        this.food = start_food;
        this.speed = ant_speed;
        this.litter_size = litter_size;
        this.move_energy = move_energy;
        this.energy_rate = energy_rate;
        this.vision_range = vision_range;
        this.max_food = birth_food;
        this.shout_range = shout_range;
        this.turn_speed = turn_speed;
        this.angle = random(0, PI * 2);
        this.last_move = Date.now();
        this.thoughts = [];
        this.spawn_time = 0;
        this.death_time = Number.MAX_SAFE_INTEGER;
        this.dead = false;
        this.children = [];
        this.x = x;
        this.y = y;
        this.skill_tree = {
            total: 0,
            stats: new Map(),
        };
        let s = this.skill_tree.stats;
        s.set("speed", 0);
        s.set("move_energy", 0);
        s.set("energy_rate", 0);
        s.set("litter_size", 0);
        s.set("vision_range", 0);
        s.set("turn_angle", 0);
    }
    think() {
        let [depo, dist] = this.get_closest_food(depos);
        if (dist < this.vision_range) {
            let thought = {
                x: depo.x,
                y: depo.y,
                time_made: tick,
                data: depo,
            };
            if (!this.hasThot(thought)[0]) {
                this.thoughts.unshift(thought);
            }
            else {
                this.hasThot(thought)[1].time_made = tick;
            }
        }
        if (this.thoughts.length >= 1) {
            let t = this.thoughts[0];
            this.turn_to(t.x, t.y);
        }
        this.communicate();
        this.forget();
        if (dist < this.size) {
            depo.capacity -= eat_rate;
            this.food += this.energy_rate;
            if (this.food >= this.max_food) {
                this.food -= birth_energy;
                for (let i = 0; i <
                    random(this.litter_size - litter_varience, this.litter_size + litter_varience); i++) {
                    let spawn = this.mitosis();
                    ants.push(spawn);
                    this.children.push(spawn);
                }
            }
        }
        else {
            this.move();
            this.food -= this.move_energy;
            if (this.food < 0) {
                this.dead = true;
                this.death_time = tick;
            }
        }
        this.show();
    }
    communicate() {
        let closest = this.get_closest_ants(ants);
        this.drawClosest(closest);
        for (let t of this.thoughts) {
            for (const p of closest) {
                const a = p.data;
                let has = a.hasThot(t);
                if (!has[0] && tick - t.time_made < exist_time) {
                    a.thoughts.unshift(t);
                }
            }
        }
    }
    forget() {
        this.thoughts = this.thoughts.filter((t) => {
            tick - t.time_made < exist_time;
        });
    }
    get_closest_ants(an) {
        let qtree = QuadTree.create();
        for (const a of an) {
            let point = new Point(a.x, a.y, a);
            qtree.insert(point);
        }
        let range = new Circle(this.x, this.y, this.shout_range);
        let closest = qtree.query(range);
        closest = closest.sort((a, b) => dist(this.x, this.y, a.x, a.y) < dist(this.x, this.y, b.x, b.y) ? 1 : 0);
        return closest.slice(0, min(closest.length, vision_max));
    }
    get_closest_food(items) {
        let ans = items[0];
        let ld = dist(ans.x, ans.y, this.x, this.y);
        for (let f = 0; f < items.length; f++) {
            let i = items[f];
            let d = dist(i.x, i.y, this.x, this.y) - i.capacity - this.size;
            if (d <= ld) {
                ld = d;
                ans = i;
            }
        }
        return [ans, ld];
    }
    move() {
        let time_scale = Date.now() - this.last_move;
        time_scale = 10;
        let vel = bindVector(cos(this.angle), sin(this.angle), (this.speed * time_scale) / 100);
        this.last_move = Date.now();
        this.x += vel[0];
        this.y += vel[1];
        if (this.x < this.size || this.x > width - this.size) {
            this.angle += 2 * ((3 * PI) / 2 - this.angle);
            this.x = clamp(this.x, this.size, width - this.size);
        }
        if (this.y < this.size || this.y > height - this.size) {
            this.angle += 2 * -this.angle;
            this.y = clamp(this.y, this.size, height - this.size);
        }
    }
    hasThot(t) {
        for (let thought of this.thoughts) {
            if (thought.data === t.data) {
                return [true, thought];
            }
        }
        let placeholder_thought = {
            x: 0,
            y: 0,
            time_made: 0,
            data: new Food(),
        };
        return [false, placeholder_thought];
    }
    turn_to(x, y) {
        let target_x = x - this.x;
        let target_y = y - this.y;
        let target_angle = atan2(target_y, target_x) % (2 * PI);
        this.angle %= 2 * PI;
        let diff = target_angle - this.angle;
        let dir = 1;
        if (diff < 0)
            diff += 2 * PI;
        if (diff > PI)
            dir = -1;
        if (diff > this.turn_speed) {
            this.angle += this.turn_speed * dir;
        }
        else {
            this.angle = target_angle;
        }
    }
    mitosis() {
        let spawn = new Ant();
        spawn.x = this.x;
        spawn.y = this.y;
        spawn.skill_tree.total = this.skill_tree.total;
        spawn.skill_tree.stats = new Map(this.skill_tree.stats);
        let st = spawn.skill_tree.stats;
        let pos_mutations = 0;
        if (random() > pos_mutation_chance &&
            spawn.skill_tree.total < max_skill_points) {
            pos_mutations++;
            spawn.skill_tree.total++;
            while (random() > sec_pos_mutation_chance &&
                spawn.skill_tree.total < max_skill_points) {
                pos_mutations++;
                spawn.skill_tree.total++;
            }
        }
        let branches = Array.from(st, ([name, value]) => name);
        for (let m = 0; m < pos_mutations; m++) {
            let choice = branches[Math.floor(random() * branches.length)];
            st.set(choice, st.get(choice) + 1);
        }
        spawn.speed += speed_effect * st.get("speed");
        spawn.move_energy -= max(move_energy_effect * st.get("move_energy"), this.move_energy - 1);
        spawn.energy_rate += energy_rate_effect * st.get("energy_rate");
        spawn.turn_speed +=
            (turn_speed_effect * st.get("turn_angle") * Math.PI) / 180;
        spawn.vision_range +=
            st.get("vision_range") * vision_range_effect;
        spawn.litter_size +=
            st.get("litter_size") * litter_size_effect;
        spawn.color = JSON.parse(JSON.stringify(this.color));
        spawn.color[0] +=
            random(-color_change_rate, color_change_rate) * pos_mutations;
        spawn.color[0] = clamp(spawn.color[0], 0, 360);
        return spawn;
    }
    show() {
        pg.strokeWeight(2);
        if (!this.dead) {
            pg.stroke(0);
            pg.colorMode(HSL);
            pg.fill(this.color);
            pg.colorMode(RGB);
            pg.ellipse(this.x, this.y, this.size, this.size);
            pg.fill(0);
            pg.text(int(this.food), this.x, this.y);
        }
        if (show_vision) {
            pg.fill(255, 255, 255, 20);
            pg.ellipse(this.x, this.y, this.vision_range, this.vision_range);
            pg.ellipse(this.x, this.y, this.shout_range, this.shout_range);
        }
        if (show_vel) {
            pg.stroke(255, 0, 0);
            pg.line(this.x, this.y, this.x + cos(this.angle) * 100, this.y + sin(this.angle) * 100);
        }
    }
    eat(food) {
        if (this.food < this.max_food) {
            food.consume(eat_rate);
            this.food += energy_rate;
            this.size = clamp(this.food / 100, 50, 75);
        }
    }
    drawClosest(points) {
        for (const a of points) {
            pg.line(this.x, this.y, a.x, a.y);
        }
    }
}
function doAnts() {
    for (let a of ants) {
        a.think();
    }
    ants = ants.filter((a) => !a.dead);
}
function bindVector(x, y, magnitude = 1) {
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
let pg;
let moveUpdate = Date.now();
let depos = [];
let ants = [];
let ant_tree = [];
let stats = [];
let tick = 0;
function setup() {
    width = size;
    height = size * (975 / 1920);
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    pg = createGraphics(size, size * (975 / 1920));
    for (let i = 0; i < num_food; i++) {
        depos.push(new Food());
    }
    for (let i = 0; i < num_ants; i++) {
        let a = new Ant();
        ants.push(a);
        ant_tree.push(a);
    }
    pg.textAlign(CENTER, CENTER);
    pg.ellipseMode(RADIUS);
}
function draw() {
    tick++;
    pg.fill(128, 175, 73);
    pg.rect(0, 0, width, height);
    gen_grid_lines();
    show_food();
    doAnts();
    depos.filter((depo) => depo.capacity > 0);
    let scale = min(windowWidth / 1920, windowHeight / 975);
    image(pg, 0, 0, 1920 * scale, 975 * scale);
    width = size;
    height = size * (975 / 1920);
    if (tick % record_every == 0) {
        stats.push(getStats(ants));
    }
}
function getColor() {
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var h = randomInt(0, 360);
    var s = randomInt(42, 98);
    var l = randomInt(40, 90);
    return [h, s, l];
}
function keyPressed() {
    if (key == "s") {
        save(ant_tree, "tree.json");
    }
    if (key == "d") {
        save(stats, "stats.json");
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = size;
    height = size * (975 / 1920);
}
function getStats(ants) {
    let pop = ants.length;
    let stats = {
        population_size: pop,
        num_points: ants.reduce((a, b) => a + b.skill_tree.total, 0) / pop,
        speed: ants.reduce((a, b) => a + b.speed, 0) / pop,
        energy_rate: ants.reduce((a, b) => a + b.energy_rate, 0) / pop,
        vision_range: ants.reduce((a, b) => a + b.vision_range, 0) / pop,
        turn_speed: ants.reduce((a, b) => a + b.turn_speed, 0) / pop,
    };
    return stats;
}
let size = 4000;
let show_vel = true;
let show_vision = false;
let record_every = 500;
let num_ants = 50;
let turn_speed = (0.5 * Math.PI) / 180;
let start_food = 500;
let birth_food = 1200;
let birth_energy = 700;
let litter_size = 4;
let litter_varience = 2;
let move_energy = 1;
let eat_rate = 1;
let energy_rate = 10;
let ant_speed = 100;
let vision_range = 100;
let shout_range = 300;
let vision_max = 2;
let num_food = 20;
let min_food_size = 25;
let max_food_size = 75;
let exist_time = 100;
let max_skill_points = 100;
let color_change_rate = 5;
let pos_mutation_chance = 0.5;
let sec_pos_mutation_chance = 0.2;
let speed_effect = 2;
let move_energy_effect = 0.1;
let energy_rate_effect = 0.1;
let turn_speed_effect = 0.5;
let vision_range_effect = 0.5;
let litter_size_effect = 1;
class Food {
    constructor(x = random(0, width), y = random(0, height), c = random(min_food_size, max_food_size)) {
        this.x = x;
        this.y = y;
        this.capacity = c;
    }
    show() {
        pg.fill(40, 64, 14);
        pg.ellipse(this.x, this.y, this.capacity * 2, this.capacity * 2);
        pg.fill(62, 93, 33);
        pg.ellipse(this.x, this.y, (this.capacity * 2 * 7) / 10, (this.capacity * 2 * 7) / 10);
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
function show_food() {
    pg.strokeWeight(0);
    for (let i = 0; i < depos.length; i++) {
        let f = depos[i];
        f.show();
        if (f.capacity <= 20) {
            depos[i] = new Food();
        }
    }
}
function gen_grid_lines() {
    let grid_spacing = width / 10;
    pg.stroke(0);
    pg.strokeWeight(2);
    for (let i = 0; i < width / grid_spacing; i++) {
        pg.line(i * grid_spacing, 0, i * grid_spacing, height);
    }
    for (let i = 0; i < height / grid_spacing; i++) {
        pg.line(0, i * grid_spacing, width, i * grid_spacing);
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