let cnv: p5.Renderer;
let moveUpdate = Date.now();

let depos: Food[] = [];

let ants: Ant[] = [];

let tick = 0;

function setup() {
  cnv = createCanvas(size, size * (windowHeight / windowWidth));
  cnv.position(0, 0);

  for (let i = 0; i < num_food; i++) {
    depos.push(new Food());
  }
  for (let i = 0; i < num_ants; i++) {
    let a = new Ant();
    // a.thoughts = random(depos);
    ants.push(a);
  }
  textAlign(CENTER, CENTER);
}
function draw() {
  tick++;
  clear();
  scale(windowWidth / size);

  background(128, 175, 73);

  gen_grid_lines();
  show_food();
  doAnts();
  let qtree = QuadTree.create();
  for (const f of depos) {
    let point = new Point(f.x, f.y, f);
    qtree.insert(point);
  }
  for (const a of ants) {
    let range = new Circle(a.x, a.y, (vision_range + max_food_size) / 2);
    let nearby = qtree.query(range);
    for (const food of nearby) {
      let f: Food = food.data;
      let t: Thought = {
        x: f.x,
        y: f.y,
        data: f,
        time_made: tick,
      };
      if (dist(a.x, a.y, t.x, t.y) - f.capacity < vision_range / 2) {
        let ht = a.hasThot(t);
        if (ht[0]) {
          ht[1].time_made = tick;
        } else {
          a.thoughts.unshift(t);
          console.log(a.thoughts);
        }
      }
    }
  }
}
