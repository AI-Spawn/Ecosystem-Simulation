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
    ants.push(a);
  }
  textAlign(CENTER, CENTER);
}
function draw() {
  tick++;
  scale(windowWidth / size);

  background(128, 175, 73);

  gen_grid_lines();
  show_food();
  doAnts();
}
