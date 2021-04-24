function bindVector(x: number, y: number, magnitude = 1) {
  x *= 100 * magnitude;
  y *= 100 * magnitude;
  //scale x and y to values < 1
  if (x != 0 || y != 0) {
    let scaler = magnitude / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    x *= scaler;
    y *= scaler;
  } else {
    x = x <= -magnitude ? -magnitude : x >= magnitude ? magnitude : x;
    y = y <= -magnitude ? -magnitude : y >= magnitude ? magnitude : y;
  }

  return [x, y];
}

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
