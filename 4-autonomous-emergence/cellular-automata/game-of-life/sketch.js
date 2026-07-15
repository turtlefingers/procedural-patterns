// Conway 생명 게임 — 이웃 3이면 탄생, 2·3이면 생존. 검은 셀, 흰 배경. 클릭: 재시드.
const GW = 100, GH = 100, GC = 5;
let life;

function setup() {
  createCanvas(500, 500);
  seedLife();
}

function seedLife() {
  life = [];
  for (let y = 0; y < GH; y++) {
    life.push([]);
    for (let x = 0; x < GW; x++) life[y].push(random() < 0.22 ? 1 : 0);
  }
}

function stepLife() {
  const next = [];
  for (let y = 0; y < GH; y++) {
    next.push([]);
    for (let x = 0; x < GW; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          n += life[(y + dy + GH) % GH][(x + dx + GW) % GW];
        }
      next[y].push(life[y][x] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0));
    }
  }
  life = next;
}

function draw() {
  if (frameCount % 4 === 0) stepLife();
  background(248);
  noStroke();
  fill(0);
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++)
      if (life[y][x]) rect(x * GC, y * GC, GC - 1, GC - 1);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) seedLife();
}
