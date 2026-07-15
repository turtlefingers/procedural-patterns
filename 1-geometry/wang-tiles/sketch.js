// 왕타일 — 변 색 일치 제약. 색상은 OKLCH 정규화 팔레트:
// L=0.70 통일, C=0.15(teal만 sRGB 색역 한계로 0.125). 클릭: 새 타일 집합.
const NC = 4, GRID = 10, S = 50;
const PALETTE = ['#ed7472', '#c59700', '#00b7a6', '#16aaf0'];
let tileset, placed = [], cursor = 0;

function makeTileset() {
  tileset = [];
  for (let w = 0; w < NC; w++) {
    tileset.push([]);
    for (let n = 0; n < NC; n++) {
      tileset[w].push({ e: floor(random(NC)), s: floor(random(NC)) });
    }
  }
}

function setup() {
  createCanvas(500, 500);
  regenerate();
}

function regenerate() {
  makeTileset();
  placed = [];
  cursor = 0;
  background(248);
}

function drawTile(x, y, W, N, E, Sc) {
  const cx = x + S / 2, cy = y + S / 2;
  noStroke();
  fill(PALETTE[N]); triangle(x, y, x + S, y, cx, cy);
  fill(PALETTE[E]); triangle(x + S, y, x + S, y + S, cx, cy);
  fill(PALETTE[Sc]); triangle(x + S, y + S, x, y + S, cx, cy);
  fill(PALETTE[W]); triangle(x, y + S, x, y, cx, cy);
  stroke(0);
  strokeWeight(1);
  noFill();
  rect(x, y, S, S);
}

function draw() {
  for (let k = 0; k < 6 && cursor < GRID * GRID; k++, cursor++) {
    const gx = cursor % GRID, gy = floor(cursor / GRID);
    const W = gx > 0 ? placed[cursor - 1].e : floor(random(NC));
    const N = gy > 0 ? placed[cursor - GRID].s : floor(random(NC));
    const t = tileset[W][N];
    placed.push({ w: W, n: N, e: t.e, s: t.s });
    drawTile(gx * S, gy * S, W, N, t.e, t.s);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
