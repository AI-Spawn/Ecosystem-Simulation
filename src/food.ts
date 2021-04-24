let min_food_size = 100;
let max_food_size = 300;

class Food {
  x: number;
  y: number;
  capacity: number;
  constructor(
    x = random(0, width),
    y = random(0, height),
    c = random(min_food_size, max_food_size)
  ) {
    this.x = x;
    this.y = y;
    this.capacity = c;
  }

  show() {
    fill(58, 145, 11);
    ellipse(this.x, this.y, this.capacity, this.capacity);
  }

  consume(amount: number) {
    if (amount > 0) {
      this.capacity -= amount;
    }
    if (this.capacity < 0) {
      this.capacity = 0;
    }
  }
}
