// 푸아송 디스크 샘플링 (Bridson) — 확정점: 검은 점, 활성점: 빈 원. 클릭: 재시작
const R = 18, K = 30;
let cell, cols, rows, grid, active, points;

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  cell = R / Math.SQRT2;
  cols = ceil(width / cell);
  rows = ceil(height / cell);
  grid = new Array(cols * rows).fill(null);
  points = [];
  active = [];
  insert(createVector(width / 2, height / 2));
}

function insert(p) {
  points.push(p);
  active.push(p);
  grid[floor(p.y / cell) * cols + floor(p.x / cell)] = p;
}

function farEnough(p) {
  if (p.x < 2 || p.x >= width - 2 || p.y < 2 || p.y >= height - 2) return false;
  const gx = floor(p.x / cell), gy = floor(p.y / cell);
  for (let j = max(0, gy - 2); j <= min(rows - 1, gy + 2); j++)
    for (let i = max(0, gx - 2); i <= min(cols - 1, gx + 2); i++) {
      const q = grid[j * cols + i];
      if (q && dist(p.x, p.y, q.x, q.y) < R) return false;
    }
  return true;
}

function step() {
  if (!active.length) return;
  const idx = floor(random(active.length));
  const base = active[idx];
  for (let k = 0; k < K; k++) {
    const a = random(TWO_PI), d = random(R, 2 * R);
    const cand = createVector(base.x + d * cos(a), base.y + d * sin(a));
    if (farEnough(cand)) { insert(cand); return; }
  }
  active.splice(idx, 1);
}

function draw() {
  background(248);
  for (let i = 0; i < 40; i++) step();
  noStroke();
  fill(0);
  for (const p of points) circle(p.x, p.y, 4.5);
  noFill();
  stroke(0);
  strokeWeight(1.2);
  for (const p of active) circle(p.x, p.y, 8);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
