let x: number = 500;

let speed: number = 500;

let cnv: p5.Renderer;
let moveUpdate: number = Date.now();
function setup() {
  console.log(`An example of a function from another file: ${squareNum(5)}`);

  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
}
function draw() {
  background(0);

  ellipse(x, height / 2, 50, 50);

  x += ((Date.now() - moveUpdate) / 1000) * speed;

  if (x < 25) {
    speed *= -1;
    x = 25;
  }
  if (x > width - 25) {
    speed *= -1;
    x = width - 25;
  }
  moveUpdate = Date.now();
}
