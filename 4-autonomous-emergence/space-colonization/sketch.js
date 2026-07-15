// 공간 점유 알고리즘 — 검은 가지, 연회색 유인점. 클릭: 재시작
const INFLUENCE = 60, KILL = 12, STEP = 5.5, MAX_NODES = 4000;
let attractors = [], nodes = [];

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  attractors = [];
  while (attractors.length < 380) {
    const x = random(40, 460), y = random(30, 340);
    const dx = (x - 250) / 205, dy = (y - 185) / 155;
    if (dx * dx + dy * dy < 1) attractors.push({ x, y });
  }
  nodes = [{ x: 250, y: 492, parent: null, w: 0 }];
}

function grow() {
  if (!attractors.length || nodes.length >= MAX_NODES) return;
  const pulls = new Map();
  const dead = new Set();
  let influenced = false;

  for (let ai = 0; ai < attractors.length; ai++) {
    const a = attractors[ai];
    let best = -1, bestD = Infinity;
    for (let ni = 0; ni < nodes.length; ni++) {
      const d = (a.x - nodes[ni].x) ** 2 + (a.y - nodes[ni].y) ** 2;
      if (d < bestD) { bestD = d; best = ni; }
    }
    const d = sqrt(bestD);
    if (d < KILL) { dead.add(ai); continue; }
    if (d < INFLUENCE) {
      influenced = true;
      const p = pulls.get(best) || { dx: 0, dy: 0 };
      p.dx += (a.x - nodes[best].x) / d;
      p.dy += (a.y - nodes[best].y) / d;
      pulls.set(best, p);
    }
  }
  attractors = attractors.filter((_, i) => !dead.has(i));

  if (influenced) {
    for (const [ni, p] of pulls) {
      const m = sqrt(p.dx * p.dx + p.dy * p.dy) || 1;
      nodes.push({
        x: nodes[ni].x + (p.dx / m) * STEP + random(-0.4, 0.4),
        y: nodes[ni].y + (p.dy / m) * STEP + random(-0.4, 0.4),
        parent: ni, w: 0,
      });
      let c = ni;
      while (c !== null) { nodes[c].w++; c = nodes[c].parent; }
    }
  } else if (attractors.length) {
    let bn = 0, ba = 0, bd = Infinity;
    for (let ni = 0; ni < nodes.length; ni++)
      for (let ai = 0; ai < attractors.length; ai++) {
        const d = (attractors[ai].x - nodes[ni].x) ** 2 + (attractors[ai].y - nodes[ni].y) ** 2;
        if (d < bd) { bd = d; bn = ni; ba = ai; }
      }
    const d = sqrt(bd) || 1;
    nodes.push({
      x: nodes[bn].x + ((attractors[ba].x - nodes[bn].x) / d) * STEP,
      y: nodes[bn].y + ((attractors[ba].y - nodes[bn].y) / d) * STEP,
      parent: bn, w: 0,
    });
    let c = bn;
    while (c !== null) { nodes[c].w++; c = nodes[c].parent; }
  }
}

function draw() {
  background(248);
  grow();

  noStroke();
  fill(185);
  for (const a of attractors) circle(a.x, a.y, 3);

  stroke(0);
  for (const n of nodes) {
    if (n.parent === null) continue;
    const p = nodes[n.parent];
    strokeWeight(constrain(0.6 + sqrt(n.w) * 0.2, 0.6, 6));
    line(n.x, n.y, p.x, p.y);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
