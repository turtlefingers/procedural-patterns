// 반응확산(Gray-Scott) 3가지 파라미터 프리셋(산호/유사분열/솔리톤)을 한 캔버스에
// 3개 띠로 동시 시뮬레이션한다. B가 우세한 곳이 검게 나타난다. 클릭: 재시드.
const PRESETS = [
  { f: 0.0545, k: 0.062 },   // 산호
  { f: 0.0367, k: 0.0649 },  // 유사분열
  { f: 0.030, k: 0.060 },    // 솔리톤
];
const W = 160, BAND_H = 160, GAP = 10;
const dA = 1.0, dB = 0.5;
let sims, imgs;

function makeSim() {
  const A = new Float32Array(W * W).fill(1);
  const B = new Float32Array(W * W).fill(0);
  for (let n = 0; n < 8; n++) {
    const cx = floor(random(16, W - 16)), cy = floor(random(16, W - 16));
    for (let y = -3; y <= 3; y++)
      for (let x = -3; x <= 3; x++)
        B[(cy + y) * W + cx + x] = 1;
  }
  return { A, B, A2: new Float32Array(W * W), B2: new Float32Array(W * W) };
}

function lap(F, x, y) {
  const xm = (x - 1 + W) % W, xp = (x + 1) % W, ym = (y - 1 + W) % W, yp = (y + 1) % W;
  return F[y * W + xm] * 0.2 + F[y * W + xp] * 0.2 + F[ym * W + x] * 0.2 + F[yp * W + x] * 0.2
       + F[ym * W + xm] * 0.05 + F[ym * W + xp] * 0.05 + F[yp * W + xm] * 0.05 + F[yp * W + xp] * 0.05
       - F[y * W + x];
}

function step(sim, f, k) {
  const { A, B, A2, B2 } = sim;
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = A[i], b = B[i];
      const abb = a * b * b;
      A2[i] = a + dA * lap(A, x, y) - abb + f * (1 - a);
      B2[i] = b + dB * lap(B, x, y) + abb - (k + f) * b;
    }
  }
  sim.A = A2; sim.A2 = A;
  sim.B = B2; sim.B2 = B;
}

function reseed() {
  sims = PRESETS.map(makeSim);
}

function setup() {
  createCanvas(500, 500);
  pixelDensity(1);
  imgs = PRESETS.map(() => createImage(W, W));
  reseed();
}

function draw() {
  background(248);
  sims.forEach((sim, idx) => {
    for (let i = 0; i < 8; i++) step(sim, PRESETS[idx].f, PRESETS[idx].k);
    const img = imgs[idx];
    img.loadPixels();
    for (let i = 0; i < W * W; i++) {
      const v = constrain(sim.A[i] - sim.B[i], 0, 1) * 255;
      img.pixels[i * 4] = img.pixels[i * 4 + 1] = img.pixels[i * 4 + 2] = v;
      img.pixels[i * 4 + 3] = 255;
    }
    img.updatePixels();
    image(img, 0, idx * (BAND_H + GAP), width, BAND_H);
  });
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reseed();
}
