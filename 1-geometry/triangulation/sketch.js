// 다각형 삼각분할 (Ear Clipping) — 흰 삼각형 + 검은 윤곽, 한 조각씩 애니메이션. 클릭: 새 다각형
let poly = [], tris = [], shown = 0;

function cross(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
function inTriangle(p, a, b, c) {
  const d1 = cross(a, b, p), d2 = cross(b, c, p), d3 = cross(c, a, p);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

function earClip(P) {
  const out = [];
  const idx = P.map((_, i) => i);
  let guard = 0;
  while (idx.length > 3 && guard++ < 10000) {
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i - 1 + idx.length) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length];
      const a = P[ia], b = P[ib], c = P[ic];
      if (cross(a, b, c) <= 0) continue;
      let ear = true;
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue;
        if (inTriangle(P[j], a, b, c)) { ear = false; break; }
      }
      if (ear) {
        out.push([a, b, c]);
        idx.splice(i, 1);
        clipped = true;
        break;
      }
    }
    if (!clipped) break;
  }
  if (idx.length === 3) out.push([P[idx[0]], P[idx[1]], P[idx[2]]]);
  return out;
}

function setup() {
  createCanvas(500, 500);
  regenerate();
}

function regenerate() {
  poly = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TWO_PI + random(-0.1, 0.1);
    const r = random(75, 230);
    poly.push({ x: 250 + r * cos(a), y: 250 + r * sin(a) });
  }
  tris = earClip(poly);
  shown = 0;
}

function draw() {
  background(248);
  if (frameCount % 12 === 0 && shown < tris.length) shown++;
  fill(248);
  stroke(0);
  strokeWeight(1.2);
  for (let i = 0; i < shown; i++) {
    const t = tris[i];
    triangle(t[0].x, t[0].y, t[1].x, t[1].y, t[2].x, t[2].y);
  }
  noFill();
  stroke(0);
  strokeWeight(3);
  beginShape();
  for (const p of poly) vertex(p.x, p.y);
  endShape(CLOSE);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
