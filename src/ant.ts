class Ant {
  x: number;
  y: number;

  size = 50;
  food = start_food;

  speed = ant_speed;

  max_food = max_food;

  angle = random(0, PI * 2);
  // vel = bindVector(random(-1, 1), random(-1, 1));
  dead = false;
  last_move = Date.now();
  target_food = depos[0];
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
    // this.x = width / 2;
    // this.y = height / 2;
  }
  spend(amount: number) {
    this.food -= amount;
  }
  move() {
    let time_scale = Date.now() - this.last_move;
    time_scale = 10;
    let vel = bindVector(
      cos(this.angle),
      sin(this.angle),
      (this.speed * time_scale) / 100
    );
    this.last_move = Date.now();
    this.x += vel[0];
    this.y += vel[1];

    if (
      this.x < this.size / 2 ||
      this.x > width - this.size / 2 ||
      this.y < this.size / 2 ||
      this.y > height - this.size / 2
    ) {
      // this.angle += PI;
      this.x = clamp(this.x, this.size / 2, width - this.size / 2);
      this.y = clamp(this.y, this.size / 2, height - this.size / 2);
    }

    if (!(depos.indexOf(this.target_food) > -1)) {
      this.target_food = random(depos);
    }
  }

  goto(x: number, y: number) {
    let target_x = x - this.x;
    let target_y = y - this.y;
    let target_angle = atan2(target_y, target_x) % (2 * PI);
    this.angle %= 2 * PI;

    target_angle =
      Math.abs(target_angle - this.angle) >
      Math.abs(target_angle - 2 * PI - this.angle)
        ? target_angle - 2 * PI
        : target_angle;
    this.angle +=
      turn_speed /
      ((target_angle - this.angle) / Math.abs(target_angle - this.angle));
  }

  show() {
    if (!this.dead) {
      stroke(0);

      ellipse(this.x, this.y, this.size, this.size);
      text(int(this.food), this.x, this.y);
    }
    if (show_vel) {
      stroke(255, 0, 0);
      line(
        this.x,
        this.y,
        this.x + cos(this.angle) * 100,
        this.y + sin(this.angle) * 100
      );
    }
  }

  eat(food: Food) {
    if (this.food < this.max_food) {
      food.consume(eat_rate);
      this.food += energy_rate;
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

    for (let i = 0; i < min(2, d.length); i++) {
      let c = d[i];
      line(this.x, this.y, c.ant.x, c.ant.y);
    }
  }
}

function doAnts() {
  let qtree = QuadTree.create();
  strokeWeight(2);

  fill(47, 185, 161);
  for (let a of ants) {
    a.goto(a.target_food.x, a.target_food.y);
    let point = new Point(a.x, a.y, a);
    qtree.insert(point);
    if (!a.dead) {
      //if overlapping, consume
      let eating = false;
      for (const f of depos) {
        if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
          a.eat(f);
          a.spend(move_energy / 2);

          eating = true;
        }
      }
      if (!eating) {
        a.move();
        a.spend(move_energy);
      }

      if (a.food <= 0) {
        a.dead = true;
      }
    }
    a.show();
  }
  stroke(255, 0, 0);
  strokeWeight(3);
  for (let a of ants) {
    let range = new Circle(a.x, a.y, 100);
    let points = qtree.query(range);

    a.drawClosest(points);
  }

  //delete dead ants
  ants = ants.filter((a) => !a.dead);
}
