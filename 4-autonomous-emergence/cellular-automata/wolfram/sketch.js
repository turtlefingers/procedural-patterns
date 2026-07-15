// Wolfram 1차원 세포 자동자 — Rule 30. 검은 셀, 흰 배경. 클릭: 재생성(무작위 시드).
const RULE = 30;
const C = 2, COLS = 250, ROWS = 250;
let randomSeed_ = false;

function setup() {
  createCanvas(500, 500);
  drawCA();
  noLoop();
}

function drawCA() {
  background(248);
  noStroke();
  fill(0);
  let row = new Array(COLS).fill(0);
  if (randomSeed_) row = row.map(() => (random() < 0.5 ? 1 : 0));
  else row[floor(COLS / 2)] = 1;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) if (row[x]) rect(x * C, y * C, C, C);
    const next = new Array(COLS);
    for (let x = 0; x < COLS; x++) {
      const l = row[(x - 1 + COLS) % COLS], c = row[x], r = row[(x + 1) % COLS];
      next[x] = (RULE >> ((l << 2) | (c << 1) | r)) & 1;
    }
    row = next;
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    randomSeed_ = !randomSeed_;
    drawCA();
  }
}
