// 만화경 대칭 — 마우스 드로잉 및 왕타일 색상 팔레트. ←/→: 대칭 수, Space: 지우기
const PALETTE = ['#ed7472', '#c59700', '#00b7a6', '#16aaf0'];
let n = 8;
let currentColor;
let hasStarted = false;

function setup() {
  createCanvas(500, 500);
  background(248);
  showInstruction();
  currentColor = random(PALETTE);
}

function showInstruction() {
  push();
  fill(120);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text("마우스를 드래그하여 그림을 그려보세요", width / 2, height / 2);
  pop();
}

function draw() {
  if (mouseIsPressed && hasStarted) {
    translate(width / 2, height / 2);
    let px = pmouseX - width / 2;
    let py = pmouseY - height / 2;
    let cx = mouseX - width / 2;
    let cy = mouseY - height / 2;

    let c = color(currentColor);
    c.setAlpha(200);
    stroke(c);
    strokeWeight(2);

    for (let i = 0; i < n; i++) {
      push();
      rotate((TWO_PI / n) * i);
      line(px, py, cx, cy);
      scale(1, -1);
      line(px, py, cx, cy);
      pop();
    }
  }
}

function mousePressed() {
  if (!hasStarted) {
    hasStarted = true;
    background(248);
  }
  currentColor = random(PALETTE);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) { n = max(3, n - 1); background(248); }
  if (keyCode === RIGHT_ARROW) { n = min(24, n + 1); background(248); }
  if (key === ' ') { background(248); return false; }
}
