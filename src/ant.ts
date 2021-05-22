class Ant {
  x: number;
  y: number;

  size = 25;
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
  }

  think() {
    this.move();
    this.show();

    let [depo, dist] = this.get_closest(depos);
    if (dist < vision_range) {
      line(depo.x, depo.y, this.x, this.y);
      let thought: Thought = {
        x: depo.x,
        y: depo.y,
        time_made: tick,
        data: depo,
      };
      if (!this.hasThot(thought)[0]) {
        this.thoughts.unshift(thought);
      }
    }

    if (this.thoughts.length >= 1) {
      let t = this.thoughts[0];
      this.turn_to(t.x, t.y);
    }
  }
  get_closest(items: Food[]): [Food, number] {
    let ans = items[0];
    let ld = dist(ans.x, ans.y, this.x, this.y);

    for (let f = 0; f < items.length; f++) {
      let i = items[f];
      let d = dist(i.x, i.y, this.x, this.y) - i.capacity;
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
    let vel = bindVector(
      cos(this.angle),
      sin(this.angle),
      (this.speed * time_scale) / 100
    );
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
    if (diff < 0) diff += 2 * PI;
    if (diff > PI) dir = -1; // left turn

    if (diff > turn_speed) {
      this.angle += turn_speed * dir;
    }
  }

  show() {
    strokeWeight(2);
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

  drawClosest(points: Point[]) {}
}

function doAnts() {
  let qtree = QuadTree.create();

  for (let a of ants) {
    if (!a.dead) {
      let point = new Point(a.x, a.y, a);
      qtree.insert(point);
    }
  }
  for (let a of ants) {
    a.think();
  }

  //delete dead ants
  ants = ants.filter((a) => !a.dead);
}
