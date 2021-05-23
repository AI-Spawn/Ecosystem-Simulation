function gen_grid_lines() {
  let grid_spacing = width / 10;

  pg.stroke(0);
  pg.strokeWeight(2);

  for (let i = 0; i < width / grid_spacing; i++) {
    pg.line(i * grid_spacing, 0, i * grid_spacing, height);
  }

  for (let i = 0; i < height / grid_spacing; i++) {
    pg.line(0, i * grid_spacing, width, i * grid_spacing);
  }
}
