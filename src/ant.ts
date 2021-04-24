class Ant {
  x: number;
  y: number;
  size = 50;
  food = 500;

  speed = 5;

  eat_rate = 1;
  energy_rate = 2;
  max_food = 1000;

  vel = [random(-1, 1), random(-1, 1)];
  dead = false;
  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  move() {
    this.food -= 1;

    let vel = bindVector(this.vel[0], this.vel[1], this.speed);
    this.x += vel[0];
    this.y += vel[1];

    if (this.x < this.size / 2 || this.x > width - this.size / 2) {
      this.vel[0] *= -1;
      this.x = clamp(
        this.x,
        this.size / 2 + this.speed,
        width - this.size / 2 - this.speed
      );
    }

    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.vel[1] *= -1;
      this.y = clamp(
        this.y,
        this.size / 2 + this.speed,
        height - this.size / 2 - this.speed
      );
    }
  }

  show() {
    if (!this.dead) {
      fill(99, 202, 216);
      ellipse(this.x, this.y, this.size, this.size);
      fill(0);
      text(this.food, this.x, this.y);
    }
  }

  eat(food: Food) {
    if (this.food < this.max_food) {
      food.consume(this.eat_rate);
      this.food += this.energy_rate;
      this.size = clamp(this.food / 100, 50, 75);
    }
  }
}
