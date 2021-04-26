class Ant {
  x: number;
  y: number;

  size = 50;
  food = start_food;

  speed = ant_speed;

  max_food = max_food;

  vel = bindVector(random(-1, 1), random(-1, 1));
  dead = false;
  last_move = Date.now();
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
    this.x = width / 2;
    this.y = height / 2;
  }

  // move() {
  //   this.food -= move_energy;
  //   let time_scale = Date.now() - this.last_move;
  //   time_scale = 10;
  //   let vel = bindVector(
  //     this.vel[0],
  //     this.vel[1],
  //     (this.speed * time_scale) / 100
  //   );
  //   this.last_move = Date.now();
  //   this.x += vel[0];
  //   this.y += vel[1];

  //   if (this.x < this.size / 2 || this.x > width - this.size / 2) {
  //     this.vel[0] *= -1;
  //     this.x = clamp(this.x, this.size / 2, width - this.size / 2);
  //   }

  //   if (this.y < this.size / 2 || this.y > height - this.size / 2) {
  //     this.vel[1] *= -1;
  //     this.y = clamp(this.y, this.size / 2, height - this.size / 2);
  //   }
  // }

  goto(x: number, y: number) {
    let bob = bindVector(this.vel[0], this.vel[1]);
    let angle = Math.atan2(bob[1], bob[0]);
    let target_angle = 90;

    angle = angle > target_angle + turn_speed ? angle - turn_speed : angle;
    angle = angle < target_angle - turn_speed ? angle + turn_speed : angle;

    this.vel = [1, tan(angle), 1];
    console.log(int((angle * 180) / Math.PI));
  }

  show() {
    if (!this.dead) {
      ellipse(this.x, this.y, this.size, this.size);
      text(int(this.food), this.x, this.y);
    }
    if (show_vel) {
      stroke(255, 0, 0);
      line(
        this.x,
        this.y,
        this.x + this.vel[0] * 100,
        this.y + this.vel[1] * 100
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
  stroke(0);

  fill(47, 185, 161);
  for (let a of ants) {
    // a.move();
    a.goto(depos[0].x, depos[0].y);
    let point = new Point(a.x, a.y, a);
    qtree.insert(point);
    if (!a.dead) {
      a.show();

      //if overlapping, consume
      for (const f of depos) {
        if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
          a.eat(f);
        }
      }

      if (a.food <= 0) {
        a.dead = true;
      }
    }
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
