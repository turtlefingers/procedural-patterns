// 코흐 눈송이 — 재귀 깊이가 자동 순환한다. 검은 채움, 흰 배경.
let depth = 0, timer = 0;

function kochStep(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const dx = (b.x - a.x) / 3, dy = (b.y - a.y) / 3;
    const p1 = { x: a.x + dx, y: a.y + dy };
    const p2 = { x: a.x + 2 * dx, y: a.y + 2 * dy };
    const px = p1.x + dx * cos(-PI / 3) - dy * sin(-PI / 3);
    const py = p1.y + dx * sin(-PI / 3) + dy * cos(-PI / 3);
    out.push(a, p1, { x: px, y: py }, p2);
  }
  return out;
}

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(248);
  if (millis() - timer > 1400) { depth = (depth + 1) % 6; timer = millis(); }

  const cx = 250, cy = 275, R = 195;
  let pts = [];
  for (let i = 0; i < 3; i++) {
    const a = -HALF_PI + (i * TWO_PI) / 3;
    pts.push({ x: cx + R * cos(a), y: cy + R * sin(a) });
  }
  for (let i = 0; i < depth; i++) pts = kochStep(pts);
  fill(0);
  noStroke();
  beginShape();
  for (const p of pts) vertex(p.x, p.y);
  endShape(CLOSE);
}
