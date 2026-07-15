const ORDER = ['cm', 'cmm'];

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
  jay3 = [createVector(0, 0), createVector(0.25, 0.25), createVector(1, 0)];
  jay4 = [createVector(0, 0), createVector(0.75, -0.25), createVector(1, 0)];
  bump1 = [createVector(0, 0), createVector(0.5, -0.25), createVector(1, 0)];
  bump2 = [createVector(0, 0), createVector(0.5, 0.25), createVector(1, 0)];
  ess = [createVector(0, 0), createVector(0.25, 0.25), createVector(0.75, -0.25), createVector(1, 0)];
  sse = [createVector(0, 0), createVector(0.25, -0.25), createVector(0.75, 0.25), createVector(1, 0)];
  pg1 = [createVector(0, 0), createVector(0.25, -0.25 * Math.sqrt(3)), createVector(1, 0)];
  pg2 = [createVector(0, 0), createVector(0.25, 0.25 * Math.sqrt(3)), createVector(1, 0)];
  pg3 = [createVector(0, 0), createVector(0.75, -0.25 * Math.sqrt(3)), createVector(1, 0)];
  pg4 = [createVector(0, 0), createVector(0.75, 0.25 * Math.sqrt(3)), createVector(1, 0)];

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

  if (grp === "cm") {
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      if (idx === 1) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], bump1));
      else if (idx === 4) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], bump2));
      else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
    }
    return ret;
  } else if (grp === "cmm") {
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) {
      ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [ess, null, sse, ess, null, sse][idx]));
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
  scale(25, -25); // 패널 크기가 크므로 스케일을 키움
  
  stroke(255);
  strokeWeight(0.05);

  const colors = ['#ed7472', '#c59700', '#00b7a6', '#16aaf0'];
  
  for (let x = -8; x < 8; ++x) {
    for (let y = -8; y < 8; ++y) {
      const hv = getOutline(name, x, y);
      fill(colors[(x * 3 + y * 1 + 10000) % colors.length]);
      drawStaticShape(hv);
    }
  }
  pop();
  
  // 패널 라벨
  noStroke();
  fill(248, 220);
  rect(px + 10, py + 10, textWidth(name) + 30, 20, 4);
  fill(20);
  textSize(13);
  textStyle(BOLD);
  text(name, px + 15, py + 25);
  
  drawingContext.restore();
  
  // 패널 외곽선
  noFill();
  stroke(140);
  strokeWeight(2);
  rect(px + 1, py + 1, pw - 2, ph - 2);
}

function draw() {
  background(248);
  ORDER.forEach((name, idx) => {
    drawPanel(name, 0, idx * 250, 500, 250);
  });
}
