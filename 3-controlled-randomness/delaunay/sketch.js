// 델로네 삼각분할 (Bowyer-Watson) — 검은 간선. V: 보로노이 쌍대 오버레이(팔레트 blue). 클릭: 재생성
const BLUE = '#16aaf0'; // OKLCH 정규화 팔레트 (L=0.70, C=0.15)
let pts = [], tris = [];
let showVoronoi = true;

function circum(t) {
  const [a, b, c] = t;
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null;
  const a2 = a.x * a.x + a.y * a.y, b2 = b.x * b.x + b.y * b.y, c2 = c.x * c.x + c.y * c.y;
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
  return { x: ux, y: uy, r2: (a.x - ux) ** 2 + (a.y - uy) ** 2 };
}

function triangulate(points) {
  const s1 = { x: -1e6, y: -1e6 }, s2 = { x: 1e6, y: -1e6 }, s3 = { x: 0, y: 1e6 };
  let T = [[s1, s2, s3]];
  for (const p of points) {
    const bad = [];
    for (const t of T) {
      const cc = circum(t);
      if (cc && (p.x - cc.x) ** 2 + (p.y - cc.y) ** 2 <= cc.r2) bad.push(t);
    }
    const edges = [];
    for (const t of bad)
      for (let i = 0; i < 3; i++) edges.push([t[i], t[(i + 1) % 3]]);
    const boundary = edges.filter(e => {
      let cnt = 0;
      for (const o of edges)
        if ((o[0] === e[0] && o[1] === e[1]) || (o[0] === e[1] && o[1] === e[0])) cnt++;
      return cnt === 1;
    });
    T = T.filter(t => !bad.includes(t));
    for (const e of boundary) T.push([e[0], e[1], p]);
  }
  return T.filter(t => !t.includes(s1) && !t.includes(s2) && !t.includes(s3));
}

function setup() {
  createCanvas(500, 500);
  regenerate();
}

function regenerate() {
  pts = [];
  for (let i = 0; i < 60; i++)
    pts.push({ x: random(35, width - 35), y: random(35, height - 35) });
  tris = triangulate(pts);
  redraw();
}

function draw() {
  background(248);
  noFill();
  stroke(0);
  strokeWeight(1);
  for (const t of tris) triangle(t[0].x, t[0].y, t[1].x, t[1].y, t[2].x, t[2].y);
  if (showVoronoi) {
    stroke(BLUE);
    strokeWeight(2);
    for (let i = 0; i < tris.length; i++) {
      for (let j = i + 1; j < tris.length; j++) {
        let shared = 0;
        for (const v of tris[i]) if (tris[j].includes(v)) shared++;
        if (shared === 2) {
          const c1 = circum(tris[i]), c2 = circum(tris[j]);
          if (c1 && c2) line(c1.x, c1.y, c2.x, c2.y);
        }
      }
    }
  }
  noStroke();
  fill(0);
  for (const p of pts) circle(p.x, p.y, 5);
  noLoop();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
function keyPressed() {
  if (key === 'v' || key === 'V') { showVoronoi = !showVoronoi; redraw(); }
}
