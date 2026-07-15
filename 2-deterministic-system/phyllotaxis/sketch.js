// 잎차례 (Vogel 1979: θ=n·137.5°, r=c√n) — 검은 점, 흰 배경.
// ←/→: 발산각 ±0.1°, G: 황금각 복귀
const GOLDEN = 137.5077640500378;
let angleDeg = GOLDEN, n = 0;
const C_SCALE = 3.4, DOTS_PER_FRAME = 8, MAX_R = 240;

function setup() {
  createCanvas(500, 500);
  restart();
}

function restart() {
  n = 0;
  background(248);
}

function draw() {
  translate(width / 2, height / 2);
  const a = radians(angleDeg);
  noStroke();
  fill(0);
  for (let i = 0; i < DOTS_PER_FRAME; i++) {
    const r = C_SCALE * sqrt(n);
    if (r > MAX_R) break;
    circle(r * cos(n * a), r * sin(n * a), map(r, 0, MAX_R, 2.5, 7));
    n++;
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) { angleDeg -= 0.1; restart(); }
  if (keyCode === RIGHT_ARROW) { angleDeg += 0.1; restart(); }
  if (key === 'g' || key === 'G') { angleDeg = GOLDEN; restart(); }
}
