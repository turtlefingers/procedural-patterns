// 랭턴의 개미 — 흰 배경, 검은 칠해진 칸. 개미 마커는 팔레트 red. 클릭: 재시작
const ANT_COLOR = '#ed7472'; // OKLCH 정규화 팔레트 red (L=0.70, C=0.15)
const N = 250, C = 2;
let grid, ax, ay, adx, ady;
const STEPS_PER_FRAME = 300;

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  grid = new Uint8Array(N * N);
  ax = floor(N / 2); ay = floor(N / 2);
  adx = 0; ady = -1;
  background(248);
  noStroke();
}

function draw() {
  // 이전 프레임의 개미 마커 지우기 (현재 칸 색 복원)
  fill(grid[ay * N + ax] ? 0 : 248);
  rect(ax * C, ay * C, C, C);

  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    const idx = ay * N + ax;
    if (grid[idx] === 0) {           // 흰 칸 → 우회전
      const t = adx; adx = -ady; ady = t;
      grid[idx] = 1;
      fill(0);
    } else {                          // 검은 칸 → 좌회전
      const t = adx; adx = ady; ady = -t;
      grid[idx] = 0;
      fill(248);
    }
    rect(ax * C, ay * C, C, C);
    ax = (ax + adx + N) % N;
    ay = (ay + ady + N) % N;
  }
  fill(ANT_COLOR);
  rect(ax * C, ay * C, C, C);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
