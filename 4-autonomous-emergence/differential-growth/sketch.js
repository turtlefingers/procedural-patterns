// 차분 성장 — 검은 폐곡선이 접히며 자란다. 클릭: 재시작
const REP_R = 26, REP_F = 1.1, SPRING = 0.36, ALIGN = 0.28, REST = 6, MAX_LEN = 10, MAX_N = 1300;
let nodes = [];

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  nodes = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * TWO_PI;
    nodes.push({ x: 250 + 50 * cos(a) + random(-2, 2), y: 250 + 50 * sin(a) + random(-2, 2) });
  }
}

function iterate() {
  const n = nodes.length;
  const fx = new Float32Array(n), fy = new Float32Array(n);
  const R2 = REP_R * REP_R;
  // 척력
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const f = ((REP_R - d) / REP_R) * REP_F;
        const ux = dx / d, uy = dy / d;
        fx[i] -= ux * f; fy[i] -= uy * f;
        fx[j] += ux * f; fy[j] += uy * f;
      }
    }
  }
  // 인력(스프링) + 정렬
  for (let i = 0; i < n; i++) {
    const prev = nodes[(i - 1 + n) % n], next_ = nodes[(i + 1) % n], me = nodes[i];
    for (const nb of [prev, next_]) {
      const dx = nb.x - me.x, dy = nb.y - me.y;
      const d = Math.hypot(dx, dy) || 1;
      const f = ((d - REST) / d) * SPRING;
      fx[i] += dx * f; fy[i] += dy * f;
    }
    fx[i] += ((prev.x + next_.x) / 2 - me.x) * ALIGN;
    fy[i] += ((prev.y + next_.y) / 2 - me.y) * ALIGN;
  }
  for (let i = 0; i < n; i++) {
    // 미세 요동: 좌굴(buckling) 유발
    nodes[i].x = constrain(nodes[i].x + fx[i] * 0.55 + random(-0.25, 0.25), 5, width - 5);
    nodes[i].y = constrain(nodes[i].y + fy[i] * 0.55 + random(-0.25, 0.25), 5, height - 5);
  }
  // 성장 1: 긴 간선에 노드 삽입
  if (nodes.length < MAX_N) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const a = nodes[i], b = nodes[(i + 1) % nodes.length];
      if (dist(a.x, a.y, b.x, b.y) > MAX_LEN) {
        nodes.splice(i + 1, 0, { x: (a.x + b.x) / 2 + random(-0.5, 0.5), y: (a.y + b.y) / 2 + random(-0.5, 0.5) });
      }
    }
  }
  // 성장 2: 무작위 간선에 노드 주입
  if (nodes.length < MAX_N) {
    for (let k = 0; k < 3; k++) {
      const i = floor(random(nodes.length));
      const a = nodes[i], b = nodes[(i + 1) % nodes.length];
      nodes.splice(i + 1, 0, { x: (a.x + b.x) / 2 + random(-0.5, 0.5), y: (a.y + b.y) / 2 + random(-0.5, 0.5) });
    }
  }
}

function draw() {
  background(248);
  for (let k = 0; k < 2; k++) iterate();
  noFill();
  stroke(0);
  strokeWeight(1.5);
  beginShape();
  for (const p of nodes) curveVertex(p.x, p.y);
  curveVertex(nodes[0].x, nodes[0].y);
  curveVertex(nodes[1].x, nodes[1].y);
  curveVertex(nodes[2].x, nodes[2].y);
  endShape();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
