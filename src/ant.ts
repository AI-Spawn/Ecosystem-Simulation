class Ant {
  x: number;
  y: number;

  size = 50;
  food = start_food;

  speed = ant_speed;

  max_food = max_food;

  angle = random(0, PI * 2);

  dead = false;
  last_move = Date.now();
  thoughts: Thought[] = [];
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
    // this.x = width / 2;
    // this.y = height / 2;
  }
  tell(ants: Point[]) {
    // let thoughts = this.thoughts.filter((t) => t.time_made + exist_time > tick);
    // for (const ant of ants) {
    //   const a = ant.data;
    //   for (const t of this.thoughts) {
    //     if (!a.hasThot(t)[0]) {
    //       a.thoughts.unshift(t);
    //     }
    //   }
    // }
  }

  spend(amount: number) {
    this.food -= amount;
  }
  think() {
    // for (let t = 0; t < this.thoughts.length; t++) {
    //   if (this.thoughts[t].time_made + exist_time * 2 < tick) {
    //     this.thoughts.splice(t, t);
    //   }
    // }
    let thoughts = this.thoughts.filter((t) => t.time_made + exist_time > tick);
    thoughts.sort((a, b) => {
      return dist(this.x, this.y, a.x, a.y) < dist(this.x, this.y, b.x, b.y)
        ? 1
        : -1;
    });
    if (thoughts.length > 0) {
      this.turn_to(thoughts[0].x, thoughts[0].y);
    }

    //if overlapping, consume
    let eating = false;
    for (const f of depos) {
      if (dist(this.x, this.y, f.x, f.y) <= (this.size + f.capacity) / 2) {
        this.eat(f);
        this.spend(move_energy);

        eating = true;
      }
    }
    if (!eating) {
      this.move();
      this.spend(move_energy);
    }

    if (this.food <= 0) {
      this.dead = true;
    }
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

    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.angle += 2 * (PI / 2 - this.angle);
      this.x = clamp(this.x, this.size / 2, width - this.size / 2);
      this.y = clamp(this.y, this.size / 2, height - this.size / 2);
    }
    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.angle += 2 * (PI - this.angle);
      this.x = clamp(this.x, this.size / 2, width - this.size / 2);
      this.y = clamp(this.y, this.size / 2, height - this.size / 2);
    }
  }

  hasThot(t: Thought): [Boolean, Thought] {
    for (let thought of this.thoughts) {
      if (thought.data === t.data) {
        return [true, thought];
      }
    }
    let placeholder_thought: Thought = {
      x: 0,
      y: 0,
      time_made: 0,
      data: new Food(),
    };
    return [false, placeholder_thought];
  }

  turn_to(x: number, y: number) {
    let target_x = x - this.x;
    let target_y = y - this.y;
    let target_angle = atan2(target_y, target_x) % (2 * PI);
    this.angle %= 2 * PI;

    let diff = target_angle - this.angle;
    let dir = 1;
    if (diff < 0) diff += 360;
    if (diff > 180) dir = -1; // left turn

    if (diff > turn_speed) {
      this.angle += turn_speed * dir;
    }
  }

  show() {
    if (!this.dead) {
      stroke(0);
      fill(47, 185, 161);

      ellipse(this.x, this.y, this.size, this.size);
      fill(0);
      text(int(this.food), this.x, this.y);
    }
    if (show_vision) {
      fill(255, 255, 255, 70);
      ellipse(this.x, this.y, vision_range, vision_range);
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

  for (let a of ants) {
    if (!a.dead) {
      let point = new Point(a.x, a.y, a);
      qtree.insert(point);
      a.think();
      a.show();
    }
  }
  stroke(255, 0, 0);
  strokeWeight(3);
  for (let a of ants) {
    let range = new Circle(a.x, a.y, shout_range);
    let points = qtree.query(range);

    a.tell(points);
    a.drawClosest(points);
  }

  //delete dead ants
  ants = ants.filter((a) => !a.dead);
}
