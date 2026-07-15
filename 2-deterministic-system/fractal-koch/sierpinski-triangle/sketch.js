// 시에르핀스키 삼각형 — 재귀적 삼각형 세분화. 재귀 깊이가 자동 순환한다.
let depth = 0, timer = 0;

function sierpinski(x1, y1, x2, y2, x3, y3, d) {
  if (d === 0) { triangle(x1, y1, x2, y2, x3, y3); return; }
  const mx1 = (x1 + x2) / 2, my1 = (y1 + y2) / 2;
  const mx2 = (x2 + x3) / 2, my2 = (y2 + y3) / 2;
  const mx3 = (x1 + x3) / 2, my3 = (y1 + y3) / 2;
  sierpinski(x1, y1, mx1, my1, mx3, my3, d - 1);
  sierpinski(mx1, my1, x2, y2, mx2, my2, d - 1);
  sierpinski(mx3, my3, mx2, my2, x3, y3, d - 1);
}

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(248);
  if (millis() - timer > 1400) { depth = (depth + 1) % 8; timer = millis(); }
  fill(0);
  noStroke();
  sierpinski(30, 455, 470, 455, 250, 75, depth);
}
