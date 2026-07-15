// 프리즈군 7종을 한 캔버스에 7개 띠로 함께 보여준다. 검은 모티프(깃발), 흰 배경.
const P = 60, ROW_GAP = 68, TOP = 36;

function motif() {
  stroke(0);
  strokeWeight(2.5);
  line(0, 15, 0, -15);
  noStroke();
  fill(0);
  triangle(0, -15, 20, -8, 0, -1);
  circle(0, 15, 4);
}

function place(x, sx, sy) {
  push();
  translate(x, 0);
  scale(sx, sy);
  motif();
  pop();
}

// 7개 프리즈군: p1, p11g, p1m1, p11m, p2, p2mg, p2mm
const GROUPS = [
  x => { place(x, 1, 1); },
  x => { place(x, 1, 1); place(x + P / 2, 1, -1); },
  x => { place(x, 1, 1); place(x, -1, 1); },
  x => { place(x, 1, 1); place(x, 1, -1); },
  x => { place(x, 1, 1); place(x + P / 2, -1, -1); },
  x => { place(x, 1, 1); place(x, -1, 1); place(x + P / 2, 1, -1); place(x + P / 2, -1, -1); },
  x => { place(x, 1, 1); place(x, -1, 1); place(x, 1, -1); place(x, -1, -1); },
];

function setup() {
  createCanvas(500, 500);
  noLoop();
}

function draw() {
  background(248);
  GROUPS.forEach((fn, row) => {
    push();
    translate(0, TOP + row * ROW_GAP);
    stroke(210);
    strokeWeight(1);
    line(28, 0, width - 12, 0);
    for (let x = 30; x < width - 14; x += P) fn(x);
    pop();
  });
}
