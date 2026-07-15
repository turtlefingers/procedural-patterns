const ORDER = ['p1', 'p2', 'pm', 'pg', 'pmm', 'pmg', 'pgg', 'p4', 'p4g', 'p4m'];

const hexVerts = [];
const sqVerts = [];
const rectVerts = [];

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

  sqVerts.push(
    createVector(0.75, 0.75),
    createVector(0.75, 0.75),
    createVector(-0.75, 0.75),
    createVector(-0.75, -0.75),
    createVector(-0.75, -0.75),
    createVector(0.75, -0.75)
  );

  rectVerts.push(
    createVector(0.75, 1),
    createVector(0.75, 1),
    createVector(-0.75, 1),
    createVector(-0.75, -1),
    createVector(-0.75, -1),
    createVector(0.75, -1)
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
  if (grp === "pmm") {
    const pts = [];
    const xb = 1.5 * x, yb = 2 * y;
    for (let v of rectVerts) pts.push(createVector(v.x + xb, v.y + yb));
    const ret = [];
    for (let idx = 0; idx < 6; ++idx) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
    return ret;
  } else if (["p4", "p4m", "p4g", "pm"].includes(grp)) {
    const pts = [];
    const xb = 1.5 * x, yb = 1.5 * y;
    for (let v of sqVerts) pts.push(createVector(v.x + xb, v.y + yb));

    if (grp === "p4") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], ess));
      return ret;
    } else if (grp === "pm") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        if (idx === 1) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], bump1));
        else if (idx === 4) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], bump2));
        else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      }
      return ret;
    } else if (grp === "p4g") {
      const bumps = (x + y + 10000) % 2 === 0 ? [bump1, bump2] : [bump2, bump1];
      const ret = [];
      let count = 0;
      for (let idx = 0; idx < 6; ++idx) {
        if (idx !== 0 && idx !== 3) {
          ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], bumps[count]));
          count = 1 - count;
        } else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      }
      return ret;
    } else { // p4m
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      return ret;
    }
  } else {
    const pts = [];
    const xb = 1.5 * x, yb = (-x * Math.sqrt(3)) / 2 + y * Math.sqrt(3);
    for (let v of hexVerts) pts.push(createVector(v.x + xb, v.y + yb));

    if (grp === "p1") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        if (idx === 1) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], jay1));
        else if (idx === 4) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], jay2));
        else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      }
      return ret;
    } else if (grp === "p2") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        if (idx === 1 || idx === 4) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], ess));
        else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      }
      return ret;
    } else if (grp === "pg") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        if ((x + 100) % 2 === 0) {
          if (idx === 2) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], pg1));
          else if (idx === 3) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], pg2));
          else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
        } else {
          if (idx === 5) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], pg4));
          else if (idx === 0) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], pg3));
          else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
        }
      }
      return ret;
    } else if (grp === "pmg") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        if ((x + 100) % 2 === 0) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [ess, null, sse, null, null, null][idx]));
        else ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [null, null, null, ess, null, sse][idx]));
      }
      return ret;
    } else if (grp === "pgg") {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) {
        const xm = (x + 100) % 4;
        if (xm === 0) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [sse, null, jay1, jay4, null, null][idx]));
        else if (xm === 1) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [jay4, null, null, sse, null, jay1][idx]));
        else if (xm === 2) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [null, null, jay2, jay3, null, ess][idx]));
        else if (xm === 3) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6], [jay3, null, ess, null, null, jay2][idx]));
      }
      return ret;
    } else {
      const ret = [];
      for (let idx = 0; idx < 6; ++idx) ret.push(constructCurve(pts[idx], pts[(idx + 1) % 6]));
      return ret;
    }
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
  scale(14, -14); // 적절한 스케일
  
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
  rect(px + 3, py + 3, textWidth(name) + 25, 15, 3);
  fill(20);
  textSize(11);
  textStyle(BOLD);
  text(name, px + 7, py + 15);
  
  drawingContext.restore();
  
  // 패널 외곽선
  noFill();
  stroke(140);
  strokeWeight(1);
  rect(px + 0.5, py + 0.5, pw - 1, ph - 1);
}

function draw() {
  background(248);
  ORDER.forEach((name, idx) => {
    let px = (idx % 4) * 125;
    let py = floor(idx / 4) * 125 + 62.5;
    if (idx >= 8) px += 125;
    drawPanel(name, px, py, 125, 125);
  });
}
