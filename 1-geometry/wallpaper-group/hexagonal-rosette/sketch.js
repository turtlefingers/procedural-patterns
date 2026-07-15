const ORDER = ['p3', 'p3m1', 'p31m', 'p6', 'p6m'];

const hexVerts = [];

let jay1, jay2, jay3, jay4, bump1, bump2, ess, sse, pg1, pg2, pg3, pg4;

function setup() {
  createCanvas(500, 500);

  const hr3 = 0.5 * Math.sqrt(3);
  hexVerts.push(
    createVector(1, 0),
    createVector(0.5, hr3),
    createVector(-0.5, hr3),
    createVector(-1, 0),
    createVector(-0.5, -hr3),
    createVector(0.5, -hr3)
  );

  jay1 = [createVector(0, 0), createVector(0.75, 0.25), createVector(1, 0)];
  jay2 = [createVector(0, 0), createVector(0.25, -0.25), createVector(1, 0)];
  bump1 = [createVector(0, 0), createVector(0.5, -0.25), createVector(1, 0)];
  bump2 = [createVector(0, 0), createVector(0.5, 0.25), createVector(1, 0)];
  ess = [createVector(0, 0), createVector(0.25, 0.25), createVector(0.75, -0.25), createVector(1, 0)];
  sse = [createVector(0, 0), createVector(0.25, -0.25), createVector(0.75, 0.25), createVector(1, 0)];

  noLoop();
}

function constructCurve(P, Q, pth = null) {
  const v = p5.Vector.sub(Q, P);
  const w = createVector(-v.y, v.x);
  const ret = [];
  if (pth === null) {
    ret.push(P, Q);
  } else {
    for (let p of pth) {
      ret.push(createVector(P.x + p.x * v.x + p.y * w.x, P.y + p.x * v.y + p.y * w.y));
    }
  }
  return ret;
}

function getOutline(grp, x, y) {
  const pts = [];
  const xb = 1.5 * x, yb = (-x * Math.sqrt(3)) / 2 + y * Math.sqrt(3);
  for (let v of hexVerts) pts.push(createVector(v.x + xb, v.y + yb));

  if (grp === "p3") {
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [jay1, jay2][idx % 2]));
    }
    return ret;
  } else if (grp === "p6") {
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], ess));
    }
    return ret;
  } else if (grp === "p31m") {
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [bump1, bump2, bump1, bump2, bump1, bump2][idx]));
    }
    return ret;
  } else { // p3m1, p6m (straight mirrors mean tile boundaries must be straight)
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
    }
    return ret;
  }
}

function drawStaticShape(shp) {
  beginShape();
  for (let idx = 0; idx < 6; ++idx) {
    for (let p of shp[idx]) {
      vertex(p.x, p.y);
    }
  }
  endShape(CLOSE);
}

function drawPanel(name, px, py, pw, ph) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(px, py, pw, ph);
  drawingContext.clip();
  
  push();
  translate(px + pw/2, py + ph/2);
  scale(18, -18); // 적절한 스케일
  
  stroke(255);
  strokeWeight(0.05);

  const colors = ['#ed7472', '#c59700', '#00b7a6', '#16aaf0'];
  
  for (let x = -6; x < 6; ++x) {
    for (let y = -6; y < 6; ++y) {
      const hv = getOutline(name, x, y);
      fill(colors[(x * 3 + y * 1 + 10000) % colors.length]);
      drawStaticShape(hv);
    }
  }
  pop();
  
  // 패널 라벨
  noStroke();
  fill(248, 220);
  rect(px + 8, py + 8, textWidth(name) + 28, 18, 3);
  fill(20);
  textSize(12);
  textStyle(BOLD);
  text(name, px + 12, py + 21);
  
  drawingContext.restore();
  
  // 패널 외곽선
  noFill();
  stroke(140);
  strokeWeight(1);
  rect(px + 0.5, py + 0.5, pw - 1, ph - 1);
}

function draw() {
  background(248);
  const w = 500 / 3;
  ORDER.forEach((name, idx) => {
    let px = (idx % 3) * w;
    let py = floor(idx / 3) * w + (500 - w*2)/2;
    if (idx >= 3) px += w / 2;
    drawPanel(name, px, py, w, w);
  });
}
