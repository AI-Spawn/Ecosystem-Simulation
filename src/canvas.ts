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
  ellipseMode(RADIUS);
}
function draw() {
  tick++;
  scale(windowWidth / size);

  background(128, 175, 73);

  gen_grid_lines();
  show_food();
  doAnts();
  depos.filter((depo) => depo.capacity > 0);
}

function getColor() {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var h = randomInt(0, 360);
  var s = randomInt(42, 98);
  var l = randomInt(40, 90);
  return [h, s, l];

  // return [
  //   360 * Math.random(),
  //   25 + 70 * Math.random(),
  //   85 + 10 * Math.random(),
  // ];
}
