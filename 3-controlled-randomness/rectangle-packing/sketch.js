// 사각형 채우기 (guillotine) — 검은 윤곽선 사각형. 클릭: 재시작
let queue = [], placed = [], free = [];

function setup() {
  createCanvas(500, 500);
  regenerate();
}

function regenerate() {
  placed = [];
  free = [{ x: 4, y: 4, w: width - 8, h: height - 8 }];
  queue = [];
  for (let i = 0; i < 260; i++) {
    const s = random() < 0.15 ? random(47, 118) : random(9, 55);
    queue.push({ w: s * random(0.6, 1.6), h: s * random(0.6, 1.6) });
  }
  queue.sort((a, b) => max(b.w, b.h) - max(a.w, a.h));
}

function placeOne() {
  while (queue.length) {
    const r = queue.shift();
    let best = -1, bestWaste = Infinity;
    for (let i = 0; i < free.length; i++) {
      const f = free[i];
      if (r.w <= f.w && r.h <= f.h) {
        const waste = f.w * f.h - r.w * r.h;
        if (waste < bestWaste) { bestWaste = waste; best = i; }
      }
    }
    if (best < 0) continue;
    const f = free.splice(best, 1)[0];
    placed.push({ x: f.x, y: f.y, w: r.w, h: r.h });
    const rw = f.w - r.w, rh = f.h - r.h;
    if (rw > rh) {
      if (rw > 1) free.push({ x: f.x + r.w, y: f.y, w: rw, h: f.h });
      if (rh > 1) free.push({ x: f.x, y: f.y + r.h, w: r.w, h: rh });
    } else {
      if (rw > 1) free.push({ x: f.x + r.w, y: f.y, w: rw, h: r.h });
      if (rh > 1) free.push({ x: f.x, y: f.y + r.h, w: f.w, h: rh });
    }
    return true;
  }
  return false;
}

function draw() {
  background(248);
  for (let i = 0; i < 3; i++) placeOne();
  noFill();
  stroke(0);
  strokeWeight(1.5);
  for (const p of placed) rect(p.x, p.y, p.w, p.h);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
