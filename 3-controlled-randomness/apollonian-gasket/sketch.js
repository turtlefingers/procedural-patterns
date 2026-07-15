// 아폴로니안 가스켓 — 검은 윤곽선 원. 클릭: 시작 비율 변경 재생성
class Cx {
  constructor(a, b) { this.a = a; this.b = b; }
  add(o) { return new Cx(this.a + o.a, this.b + o.b); }
  sub(o) { return new Cx(this.a - o.a, this.b - o.b); }
  scale(s) { return new Cx(this.a * s, this.b * s); }
  mul(o) { return new Cx(this.a * o.a - this.b * o.b, this.a * o.b + this.b * o.a); }
  sqrt() {
    const m = Math.sqrt(Math.hypot(this.a, this.b));
    const ang = Math.atan2(this.b, this.a) / 2;
    return new Cx(m * Math.cos(ang), m * Math.sin(ang));
  }
}
class Circ {
  constructor(k, x, y) { this.k = k; this.z = new Cx(x, y); this.r = Math.abs(1 / k); }
}

let all = [], queue = [];
const MIN_R = 1.1, EPS = 0.1;

function descartes(c1, c2, c3) {
  const k1 = c1.k, k2 = c2.k, k3 = c3.k;
  const sum = k1 + k2 + k3;
  const root = 2 * Math.sqrt(Math.abs(k1 * k2 + k2 * k3 + k1 * k3));
  return [sum + root, sum - root];
}

function complexDescartes(c1, c2, c3, ks) {
  const zk1 = c1.z.scale(c1.k), zk2 = c2.z.scale(c2.k), zk3 = c3.z.scale(c3.k);
  const sum = zk1.add(zk2).add(zk3);
  const root = zk1.mul(zk2).add(zk2.mul(zk3)).add(zk1.mul(zk3)).sqrt().scale(2);
  const out = [];
  for (const k of ks) {
    const zp = sum.add(root).scale(1 / k), zm = sum.sub(root).scale(1 / k);
    out.push(new Circ(k, zp.a, zp.b));
    out.push(new Circ(k, zm.a, zm.b));
  }
  return out;
}

function isTangent(a, b) {
  const d = Math.hypot(a.z.a - b.z.a, a.z.b - b.z.b);
  return Math.abs(d - (a.r + b.r)) < EPS || Math.abs(d - Math.abs(a.r - b.r)) < EPS;
}

function validate(c4, t) {
  if (c4.r < MIN_R || c4.r > 400) return false;
  for (const c of t) if (!isTangent(c4, c)) return false;
  for (const c of all)
    if (Math.hypot(c.z.a - c4.z.a, c.z.b - c4.z.b) < EPS && Math.abs(c.r - c4.r) < EPS)
      return false;
  return true;
}

function init() {
  all = []; queue = [];
  const R = 235, cx = 250, cy = 250;
  const f = random(0.3, 0.7);
  const r1 = R * f, r2 = R - r1;
  const ang = random(TWO_PI);
  const big = new Circ(-1 / R, cx, cy);
  const c1 = new Circ(1 / r1, cx - (R - r1) * cos(ang), cy - (R - r1) * sin(ang));
  const c2 = new Circ(1 / r2, cx + (R - r2) * cos(ang), cy + (R - r2) * sin(ang));
  all = [big, c1, c2];
  queue = [[big, c1, c2]];
}

function setup() {
  createCanvas(500, 500);
  init();
}

function draw() {
  background(248);
  let work = 0;
  while (queue.length && work < 12 && all.length < 1500) {
    const t = queue.shift();
    const ks = descartes(...t);
    for (const c4 of complexDescartes(...t, ks)) {
      if (validate(c4, t)) {
        all.push(c4);
        queue.push([t[0], t[1], c4], [t[0], t[2], c4], [t[1], t[2], c4]);
      }
    }
    work++;
  }
  noFill();
  stroke(0);
  for (const c of all) {
    strokeWeight(c.r > 90 ? 1.8 : 1);
    circle(c.z.a, c.z.b, c.r * 2);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) init();
}
