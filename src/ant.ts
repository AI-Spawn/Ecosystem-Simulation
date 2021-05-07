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
  }

  think() {}
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
    a.turn_to(mouseX, mouseY);
    a.move();
    a.show();
  }

  //delete dead ants
  ants = ants.filter((a) => !a.dead);
}
