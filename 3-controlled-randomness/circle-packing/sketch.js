// 원 채우기 — 검은 윤곽선 원. 클릭: 재시작
let circles = [];
const MIN_R = 2.5, MAX_R = 60;

function setup() {
  createCanvas(500, 500);
  circles = [];
}

function tryPlace() {
  const x = random(width), y = random(height);
  let maxR = min(MAX_R, x, y, width - x, height - y);
  for (const c of circles) {
    const d = dist(x, y, c.x, c.y);
    if (d < c.r) return;
    maxR = min(maxR, d - c.r);
    if (maxR < MIN_R) return;
  }
  circles.push({ x, y, r: maxR - 0.5 });
}

function draw() {
  background(248);
  for (let i = 0; i < 120; i++) tryPlace();
  noFill();
  stroke(0);
  strokeWeight(1.2);
  for (const c of circles) circle(c.x, c.y, c.r * 2);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) circles = [];
}
