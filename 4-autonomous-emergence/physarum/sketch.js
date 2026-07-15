// 점균류 시뮬레이션 — 흰 배경 위 검은 잉크 네트워크. 클릭: 재시작
const W = 250, NA = 5000;
const SENSE_D = 9, SENSE_A = 0.42, TURN = 0.5, SPEED = 1.0, DEPOSIT = 0.9, DECAY = 0.92, DIFFUSE = 0.35;
let trail, next, agents, img;

function setup() {
  createCanvas(500, 500);
  pixelDensity(1);
  img = createImage(W, W);
  reset();
}

function reset() {
  trail = new Float32Array(W * W);
  next = new Float32Array(W * W);
  agents = [];
  for (let i = 0; i < NA; i++) {
    agents.push({ x: random(W), y: random(W), a: random(TWO_PI) });
  }
}

function sense(ag, off) {
  const x = ((floor(ag.x + cos(ag.a + off) * SENSE_D) % W) + W) % W;
  const y = ((floor(ag.y + sin(ag.a + off) * SENSE_D) % W) + W) % W;
  return trail[y * W + x];
}

function draw() {
  // 1) 에이전트: 감지 → 회전 → 이동 → 침적
  for (const ag of agents) {
    const f = sense(ag, 0), l = sense(ag, SENSE_A), r = sense(ag, -SENSE_A);
    if (f >= l && f >= r) { /* 직진 */ }
    else if (l > r) ag.a += TURN;
    else if (r > l) ag.a -= TURN;
    else ag.a += random(-TURN, TURN);
    ag.x = (ag.x + cos(ag.a) * SPEED + W) % W;
    ag.y = (ag.y + sin(ag.a) * SPEED + W) % W;
    trail[floor(ag.y) * W + floor(ag.x)] += DEPOSIT;
  }

  // 2) 약한 확산 + 감쇠 (원값과 이웃 평균의 블렌딩 — 필라멘트 유지)
  for (let y = 0; y < W; y++) {
    const ym = ((y - 1 + W) % W) * W, y0 = y * W, yp = ((y + 1) % W) * W;
    for (let x = 0; x < W; x++) {
      const xm = (x - 1 + W) % W, xp = (x + 1) % W;
      const s = trail[ym + xm] + trail[ym + x] + trail[ym + xp]
              + trail[y0 + xm] + trail[y0 + x] + trail[y0 + xp]
              + trail[yp + xm] + trail[yp + x] + trail[yp + xp];
      const c = trail[y0 + x];
      next[y0 + x] = (c * (1 - DIFFUSE) + (s / 9) * DIFFUSE) * DECAY;
    }
  }
  [trail, next] = [next, trail];

  // 3) 렌더: 흔적이 짙을수록 검게
  img.loadPixels();
  for (let i = 0; i < W * W; i++) {
    const ink = 255 * (1 - Math.exp(-trail[i] * 0.45));
    const v = 255 - ink;
    img.pixels[i * 4] = img.pixels[i * 4 + 1] = img.pixels[i * 4 + 2] = v;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  image(img, 0, 0, width, height);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
