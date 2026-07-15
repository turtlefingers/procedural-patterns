// DLA 확산 제한 응집 — 검은 입자, 흰 배경. 클릭: 재시작
const N = 250, C = 2;
let occupied, stuckCount, rMax;

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  occupied = new Uint8Array(N * N);
  const c = floor(N / 2);
  occupied[c * N + c] = 1;
  stuckCount = 1;
  rMax = 2;
  background(248);
  noStroke();
  fill(0);
  rect(c * C, c * C, C, C);
}

function hasNeighbor(x, y) {
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < N && ny >= 0 && ny < N && occupied[ny * N + nx]) return true;
    }
  return false;
}

function runWalker() {
  const c = floor(N / 2);
  const spawnR = min(rMax + 6, c - 2);
  const killR = min(spawnR + 24, c - 1);
  let a = random(TWO_PI);
  let x = floor(c + spawnR * cos(a));
  let y = floor(c + spawnR * sin(a));
  for (let s = 0; s < 6000; s++) {
    const dir = floor(random(4));
    if (dir === 0) x++; else if (dir === 1) x--; else if (dir === 2) y++; else y--;
    const dx = x - c, dy = y - c;
    if (dx * dx + dy * dy > killR * killR) {
      a = random(TWO_PI);
      x = floor(c + spawnR * cos(a));
      y = floor(c + spawnR * sin(a));
      continue;
    }
    if (hasNeighbor(x, y)) {
      occupied[y * N + x] = 1;
      stuckCount++;
      rMax = max(rMax, sqrt(dx * dx + dy * dy));
      fill(0);
      rect(x * C, y * C, C, C);
      return true;
    }
  }
  return false;
}

function draw() {
  if (rMax < floor(N / 2) - 8 && stuckCount < 9000) {
    for (let i = 0; i < 25; i++) runWalker();
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
