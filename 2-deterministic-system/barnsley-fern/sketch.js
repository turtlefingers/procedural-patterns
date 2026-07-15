// 반슬리 고사리 — 4개의 아핀 변환, 검은 점. 클릭: 다시 그리기
let x = 0, y = 0;

function setup() {
  createCanvas(500, 500);
  background(248);
}

function next() {
  const r = random();
  let nx, ny;
  if (r < 0.01)      { nx = 0;                    ny = 0.16 * y; }
  else if (r < 0.86) { nx = 0.85 * x + 0.04 * y;  ny = -0.04 * x + 0.85 * y + 1.6; }
  else if (r < 0.93) { nx = 0.20 * x - 0.26 * y;  ny = 0.23 * x + 0.22 * y + 1.6; }
  else               { nx = -0.15 * x + 0.28 * y; ny = 0.26 * x + 0.24 * y + 0.44; }
  x = nx; y = ny;
}

function draw() {
  stroke(0, 130);
  strokeWeight(1);
  for (let i = 0; i < 3000; i++) {
    next();
    const sx = map(x, -2.5, 2.9, 0, width);
    const sy = map(y, 0, 10.2, height - 8, 8);
    point(sx, sy);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    background(248);
    x = 0; y = 0;
  }
}
