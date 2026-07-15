// 트루셰 타일링 3종(사분원 호 / 대각선 / 삼각형)을 한 캔버스에 3개 띠로 함께 보여준다. 클릭: 재생성.
const S = 20, BAND_H = 160, GAP = 10;
const STYLES = ['arcs', 'diagonals', 'triangles'];
let bandCells = [];

function setup() {
  createCanvas(500, 500);
  regenerate();
  noLoop();
}

function regenerate() {
  const cols = width / S, rowsPerBand = BAND_H / S;
  bandCells = STYLES.map(() => {
    const cells = [];
    for (let i = 0; i < cols * rowsPerBand; i++) cells.push(random() < 0.5);
    return cells;
  });
  redraw();
}

function drawBand(style, cells, offsetY) {
  const cols = width / S, rows = BAND_H / S;
  strokeCap(SQUARE);
  for (let i = 0; i < cells.length; i++) {
    const x = (i % cols) * S, y = offsetY + floor(i / cols) * S;
    const f = cells[i];
    if (style === 'arcs') {
      stroke(0);
      strokeWeight(3);
      noFill();
      if (f) {
        arc(x, y, S, S, 0, HALF_PI);
        arc(x + S, y + S, S, S, PI, PI + HALF_PI);
      } else {
        arc(x + S, y, S, S, HALF_PI, PI);
        arc(x, y + S, S, S, PI + HALF_PI, TWO_PI);
      }
    } else if (style === 'diagonals') {
      stroke(0);
      strokeWeight(2.4);
      if (f) line(x, y, x + S, y + S);
      else line(x + S, y, x, y + S);
    } else {
      noStroke();
      fill(0);
      if (f) triangle(x, y, x + S, y, x, y + S);
      else triangle(x + S, y, x + S, y + S, x, y);
    }
  }
}

function draw() {
  background(248);
  STYLES.forEach((style, i) => drawBand(style, bandCells[i], i * (BAND_H + GAP)));
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
