let cnv: p5.Renderer;
let moveUpdate = Date.now();

let num_food = 1;
let depos: Food[] = [];

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);

  for (let i = 0; i < num_food; i++) {
    depos.push(new Food());
  }
}
function draw() {
  background(0);
  for (let i = 0; i < depos.length; i++) {
    let f = depos[i];
    f.show();
    f.consume(1);
    if (f.capacity <= 20) {
      depos[i] = new Food();
    }
  }
}
