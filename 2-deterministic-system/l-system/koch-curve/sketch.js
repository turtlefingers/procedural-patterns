// L-System — 코흐 곡선. F→F+F-F-F+F. 검은 선, 흰 배경.
const AXIOM = 'F', RULES = { F: 'F+F-F-F+F' }, ANGLE = 90, ITER = 4;

function expand() {
  let s = AXIOM;
  for (let i = 0; i < ITER; i++) {
    let out = '';
    for (const ch of s) out += RULES[ch] !== undefined ? RULES[ch] : ch;
    s = out;
  }
  return s;
}

function turtle(s, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  let x = 0, y = 0, dir = -Math.PI / 2;
  const stack = [], out = [];
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  for (const ch of s) {
    if (ch === 'F') {
      const nx = x + Math.cos(dir), ny = y + Math.sin(dir);
      out.push([x, y, nx, ny]);
      x = nx; y = ny;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    } else if (ch === '+') dir += a;
    else if (ch === '-') dir -= a;
    else if (ch === '[') stack.push([x, y, dir]);
    else if (ch === ']') [x, y, dir] = stack.pop();
  }
  return { out, minX, maxX, minY, maxY };
}

let segs, bbox;

function setup() {
  createCanvas(500, 500);
  const t = turtle(expand(), ANGLE);
  segs = t.out;
  bbox = t;
  noLoop();
}

function draw() {
  background(248);
  const w = max(1e-6, bbox.maxX - bbox.minX), h = max(1e-6, bbox.maxY - bbox.minY);
  const sc = min((width - 50) / w, (height - 50) / h);
  push();
  translate(width / 2 - ((bbox.minX + bbox.maxX) / 2) * sc,
            height / 2 - ((bbox.minY + bbox.maxY) / 2) * sc);
  stroke(0);
  strokeWeight(1.1);
  for (const [x1, y1, x2, y2] of segs) line(x1 * sc, y1 * sc, x2 * sc, y2 * sc);
  pop();
}
