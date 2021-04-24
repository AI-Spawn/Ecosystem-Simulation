let cnv: p5.Renderer;
let moveUpdate = Date.now();

let num_food = 10;
let depos: Food[] = [];

let num_ants = 2;
let ants: Ant[] = [];

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);

  for (let i = 0; i < num_food; i++) {
    depos.push(new Food());
  }
  for (let i = 0; i < num_ants; i++) {
    ants.push(new Ant());
  }
}
function draw() {
  background(0);

  for (let i = 0; i < depos.length; i++) {
    let f = depos[i];
    f.show();
    if (f.capacity <= 20) {
      depos[i] = new Food();
    }
  }

  for (let i = 0; i < ants.length; i++) {
    let a = ants[i];
    a.show();

    //if overlapping, consume
    for (const f of depos) {
      if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
        a.eat(f);
      }
    }

    a.move();
  }
}
