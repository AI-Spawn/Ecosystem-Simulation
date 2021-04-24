class Ant {
    constructor(xs = 0, ys = 0) {
        this.x = xs;
        this.y = ys;
    }
}
let cnv;
let moveUpdate = Date.now();
let num_food = 1;
let depos = [];
function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    for (let i = 0; i < num_food; i++) {
        depos.push(new Food());
    }
}
function draw() {
    background(0);
    for (let i = 0; i < depos.length; i++) {
        let f = depos[i];
        f.show();
        f.consume(1);
        if (f.capacity <= 20) {
            depos[i] = new Food();
        }
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
        fill(58, 145, 11);
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