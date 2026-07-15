// 보로노이 다이어그램 — 흰 배경, 검은 셀 경계선과 site 점. 클릭: 재생성
let sites = [];
const N_SITES = 40;

function setup() {
  createCanvas(500, 500);
  pixelDensity(1);
  regenerate();
  noLoop();
}

function regenerate() {
  sites = [];
  for (let i = 0; i < N_SITES; i++) sites.push({ x: random(width), y: random(height) });
  render();
}

function render() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let bestD = Infinity, second = Infinity;
      for (const s of sites) {
        const d = (x - s.x) ** 2 + (y - s.y) ** 2;
        if (d < bestD) { second = bestD; bestD = d; }
        else if (d < second) second = d;
      }
      // 1등·2등 site와의 거리가 비슷한 곳 = 셀 경계
      const v = Math.sqrt(second) - Math.sqrt(bestD) < 1.6 ? 0 : 248;
      const idx = 4 * (y * width + x);
      pixels[idx] = pixels[idx + 1] = pixels[idx + 2] = v;
      pixels[idx + 3] = 255;
    }
  }
  updatePixels();
  noStroke();
  fill(0);
  for (const s of sites) circle(s.x, s.y, 6);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) regenerate();
}
