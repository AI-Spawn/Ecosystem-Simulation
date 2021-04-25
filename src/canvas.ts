let cnv: p5.Renderer;
let moveUpdate = Date.now();

let num_food = 100;
let depos: Food[] = [];

let num_ants = 500;
let ants: Ant[] = [];

let size = 5000;

function setup() {
  cnv = createCanvas(size, size * (windowHeight / windowWidth));
  cnv.position(0, 0);

  for (let i = 0; i < num_food; i++) {
    depos.push(new Food());
  }
  for (let i = 0; i < num_ants; i++) {
    ants.push(new Ant());
  }
  textAlign(CENTER, CENTER);
}
function draw() {
  clear();
  scale(windowWidth / size);

  background(0);
  for (let i = 0; i < depos.length; i++) {
    let f = depos[i];
    f.show();
    if (f.capacity <= 20) {
      depos[i] = new Food();
    }
  }

  let qtree = QuadTree.create();
  for (let a of ants) {
    let point = new Point(a.x, a.y, a);
    qtree.insert(point);
    if (!a.dead) {
      a.show();

      //if overlapping, consume
      for (const f of depos) {
        if (dist(a.x, a.y, f.x, f.y) <= (a.size + f.capacity) / 2) {
          a.eat(f);
        }
      }

      if (a.food <= 0) {
        a.dead = true;
      }
      a.move();
    }
  }

  for (let a of ants) {
    let range = new Circle(a.x, a.y, 100);
    let points = qtree.query(range);
    stroke(255);
    strokeWeight(1);
    a.drawClosest(points);
  }
}
