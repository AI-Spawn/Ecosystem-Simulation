class Ant {
  x: number;
  y: number;

  learning_rate = 1.1;

  color = getColor();
  color_change_rate = 1;

  size = 25;
  food = start_food;

  speed = ant_speed;
  speed_change_rate = 2;

  move_energy = move_energy;
  move_energy_change_rate = 0.1;

  vision_range = vision_range;
  vision_range_change_rate = 2;

  max_food = birth_food;
  shout_range = shout_range;

  angle = random(0, PI * 2);

  last_move = Date.now();
  thoughts: Thought[] = [];

  spawn_time = 0;
  death_time = Number.MAX_SAFE_INTEGER;
  dead = false;

  children: Ant[] = [];
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  think() {
    let [depo, dist] = this.get_closest_food(depos);
    if (dist < this.vision_range) {
      let thought: Thought = {
        x: depo.x,
        y: depo.y,
        time_made: tick,
        data: depo,
      };
      if (!this.hasThot(thought)[0]) {
        this.thoughts.unshift(thought);
      } else {
        this.hasThot(thought)[1].time_made = tick;
      }
    }

    if (this.thoughts.length >= 1) {
      let t = this.thoughts[0];
      this.turn_to(t.x, t.y);
    }

    this.communicate();

    this.forget();
    //if in range eat depo
    if (dist < 0) {
      depo.capacity -= eat_rate;
      this.food += energy_rate;
      if (this.food >= this.max_food) {
        this.food -= birth_energy;
        for (let i = 0; i < random(litter_min, litter_max); i++) {
          let spawn = this.mitosis();
          ants.push(spawn);
          this.children.push(spawn);
        }
      }
    } else {
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
        const a: Ant = p.data;
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

  get_closest_ants(an: Ant[]) {
    let qtree = QuadTree.create();
    for (const a of an) {
      let point = new Point(a.x, a.y, a);
      qtree.insert(point);
    }
    let range = new Circle(this.x, this.y, this.shout_range);
    let closest = qtree.query(range);
    return closest;
  }

  get_closest_food(items: Food[]): [Food, number] {
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
    } else {
      this.angle = target_angle;
    }
  }

  mitosis() {
    let spawn = new Ant();

    spawn.x = this.x;
    spawn.y = this.y;

    spawn.color = this.color;
    for (let c = 0; c < spawn.color.length; c++) {
      spawn.color[c] += random(-this.color_change_rate, this.color_change_rate);
    }

    spawn.speed = this.speed;
    spawn.speed += random(-this.speed_change_rate, this.speed_change_rate);

    spawn.move_energy = this.move_energy;
    spawn.move_energy += random(
      -this.move_energy_change_rate,
      this.move_energy_change_rate
    );

    spawn.vision_range =
      this.vision_range +
      random(-this.vision_range_change_rate, this.vision_range_change_rate);
    return spawn;
  }

  show() {
    strokeWeight(2);
    if (!this.dead) {
      stroke(0);
      colorMode(HSL);
      fill(this.color);
      colorMode(RGB);
      ellipse(this.x, this.y, this.size, this.size);
      fill(0);
      text(int(this.food), this.x, this.y);
    }
    if (show_vision) {
      fill(255, 255, 255, 20);
      ellipse(this.x, this.y, this.vision_range, this.vision_range);
      ellipse(this.x, this.y, this.shout_range, this.shout_range);
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
    for (const a of points) {
      line(this.x, this.y, a.x, a.y);
    }
  }
}

function doAnts() {
  for (let a of ants) {
    a.think();
  }

  //delete dead ants
  ants = ants.filter((a) => !a.dead);
}
