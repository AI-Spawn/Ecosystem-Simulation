class Ant {
  x: number;
  y: number;
  size = 50;
  food = 50;

  speed = 5;
  eat_rate = 1;
  max_food = 255;

  vel = [random(-1, 1), random(-1, 1)];

  constructor(x = random(0, width), y = random(0, height)) {
    this.x = x;
    this.y = y;
  }

  move() {
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
    fill(99, 202, 216);
    ellipse(this.x, this.y, this.size, this.size);
  }

  eat(food: Food) {
    if (this.food < this.max_food) {
      food.consume(this.eat_rate);
      this.food += this.eat_rate;
      this.size = clamp(this.food, 50, 75);
    }
  }
}
