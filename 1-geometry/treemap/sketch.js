// 트리맵 (slice-and-dice) — 중첩 사각형의 검은 윤곽선. 클릭: 새 데이터
let root;

function genNode(depth) {
  if (depth === 0 || (depth < 2 && random() < 0.3)) return { v: random(1, 12) };
  const kids = [];
  const n = floor(random(2, 5));
  for (let i = 0; i < n; i++) kids.push(genNode(depth - 1));
  return { ch: kids };
}

function value(node) {
  if (node.ch === undefined) return node.v;
  return node.ch.reduce((s, k) => s + value(k), 0);
}

function layout(node, x, y, w, h, depth) {
  if (w <= 2 || h <= 2) return;
  noFill();
  stroke(0);
  strokeWeight(max(0.6, 2.6 - depth * 0.6));
  rect(x, y, w, h);
  if (node.ch === undefined) return;
  const total = value(node);
  const pad = 4;
  let off = 0;
  node.ch.forEach(kid => {
    const frac = value(kid) / total;
    if (depth % 2 === 0) {
      layout(kid, x + off * w + pad, y + pad, frac * w - 2 * pad, h - 2 * pad, depth + 1);
    } else {
      layout(kid, x + pad, y + off * h + pad, w - 2 * pad, frac * h - 2 * pad, depth + 1);
    }
    off += frac;
  });
}

function setup() {
  createCanvas(500, 500);
  regenerate();
  noLoop();
}

function regenerate() {
  root = genNode(4);
  redraw();
}

function draw() {
  background(248);
  layout(root, 6, 6, width - 12, height - 12, 0);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
