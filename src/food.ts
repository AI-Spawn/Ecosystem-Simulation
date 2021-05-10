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
    strokeWeight(this.capacity / 2.5);

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

function show_food() {
  stroke(40, 64, 14);

  fill(62, 93, 33);
  for (let i = 0; i < depos.length; i++) {
    let f = depos[i];
    f.show();
    if (f.capacity <= 20) {
      depos[i] = new Food();
    }
  }
}
