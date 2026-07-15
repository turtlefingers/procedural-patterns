// 형태 문법 — 「정사각형 → 일부 변에 축소·회전된 정사각형 부착」 규칙의 재귀 적용.
// 검은 윤곽선. 클릭: 새 규칙.
let rule, shapes = [];

function setup() {
  createCanvas(500, 500);
  regenerate();
  noLoop();
}

function regenerate() {
  const edges = shuffle([0, 1, 2, 3]).slice(0, floor(random(2, 4)));
  rule = {
    edges,
    scale: random(0.55, 0.74),
    rot: random(-0.45, 0.45),
    depth: 8,
  };
  shapes = [];
  applyRule(width / 2, height / 2 + 90, 100, -HALF_PI, rule.depth);
  redraw();
}

function applyRule(x, y, s, a, depth) {
  if (depth <= 0 || s < 2.5 || shapes.length > 4000) return;
  shapes.push({ x, y, s, a, depth });
  for (const e of rule.edges) {
    const childS = s * rule.scale;
    const edgeA = a + e * HALF_PI;
    const childA = edgeA + rule.rot;
    const cx = x + cos(edgeA) * (s / 2 + childS / 2 * cos(rule.rot));
    const cy = y + sin(edgeA) * (s / 2 + childS / 2 * cos(rule.rot));
    applyRule(cx, cy, childS, childA, depth - 1);
  }
}

function draw() {
  background(248);
  rectMode(CENTER);
  noFill();
  stroke(0);
  for (const sh of shapes) {
    push();
    translate(sh.x, sh.y);
    rotate(sh.a + HALF_PI);
    strokeWeight(map(sh.depth, 0, rule.depth, 0.5, 1.8));
    rect(0, 0, sh.s, sh.s);
    pop();
  }
  rectMode(CORNER);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
