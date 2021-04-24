class Food {
  x: number;
  y: number;
  capacity: number;
  constructor(x = 0, y = 0, c = 50) {
    this.x = x;
    this.y = y;
    this.capacity = c;
  }

  show() {
    fill(255);
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
