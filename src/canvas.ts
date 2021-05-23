let cnv: p5.Renderer;
let pg: p5.Graphics;

let moveUpdate = Date.now();

let depos: Food[] = [];

let ants: Ant[] = [];
let ant_tree: Ant[] = [];

let stats: Stats[] = [];

let tick = 0;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  pg = createGraphics(1920, 975);

  for (let i = 0; i < num_food; i++) {
    depos.push(new Food());
  }
  for (let i = 0; i < num_ants; i++) {
    let a = new Ant();
    ants.push(a);
    ant_tree.push(a);
  }
  pg.textAlign(CENTER, CENTER);
  pg.ellipseMode(RADIUS);
}
function draw() {
  tick++;

  pg.fill(128, 175, 73);
  pg.rect(0, 0, 1920, 975);

  gen_grid_lines();
  show_food();
  doAnts();
  depos.filter((depo) => depo.capacity > 0);

  let scale = min(windowWidth / 1920, windowHeight / 975);
  image(pg, 0, 0, 1920 * scale, 975 * scale);
  width = 1920;
  height = 975;

  if (tick % record_every == 0) {
    stats.push(getStats(ants));
  }
}

function getColor() {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var h = randomInt(0, 360);
  var s = randomInt(42, 98);
  var l = randomInt(40, 90);
  return [h, s, l];
}

function keyPressed() {
  if (key == "s") {
    save(ant_tree, "tree.json");
  }

  if (key == "d") {
    save(stats, "stats.json");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getStats(ants: Ant[]) {
  let pop = ants.length;
  let stats: Stats = {
    population_size: pop,
    speed: ants.reduce((a, b) => a + b.speed, 0) / pop,
    energy_rate: ants.reduce((a, b) => a + b.energy_rate, 0) / pop,
    vision_range: ants.reduce((a, b) => a + b.vision_range, 0) / pop,
    turn_speed: ants.reduce((a, b) => a + b.turn_speed, 0) / pop,
  };

  return stats;
}

interface Stats {
  population_size: number;
  speed: number;
  energy_rate: number;
  vision_range: number;
  turn_speed: number;
}
