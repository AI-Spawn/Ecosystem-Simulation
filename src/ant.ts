class Ant {
  x: number;
  y: number;
  size = 50;
  food = 500;

  speed = 10;

  eat_rate = 1;
  energy_rate = 2;
  max_food = 1000;

  vel = [random(-1, 1), random(-1, 1)];
  dead = false;
  last_move = Date.now();
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  move() {
    // this.food -= 1;

    let vel = bindVector(
      this.vel[0],
      this.vel[1],
      (this.speed * (Date.now() - this.last_move)) / 100
    );
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
      fill(99, 202, 216);
      ellipse(this.x, this.y, this.size, this.size);
      fill(0);
    }
  }

  eat(food: Food) {
    if (this.food < this.max_food) {
      food.consume(this.eat_rate);
      this.food += this.energy_rate;
      this.size = clamp(this.food / 100, 50, 75);
    }
  }

  drawClosest(points: Point[]) {
    let d: { ant: Ant; dist: number }[] = [];
    for (const point of points) {
      let p = point.data;
      if (p != this) {
        d.push({ ant: p, dist: dist(this.x, this.y, p.x, p.y) });
      }
    }
    d.sort((a, b) => (a.dist > b.dist ? 1 : -1));

    for (let i = 0; i < min(5, d.length); i++) {
      let c = d[i];
      // line(this.x, this.y, c.ant.x, c.ant.y);
    }
  }
}
