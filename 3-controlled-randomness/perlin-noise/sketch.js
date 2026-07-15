// 펄린 노이즈 — 그레이스케일 2D 필드가 시간 축으로 흐른다. 1~6: 옥타브 수
const RES = 125, SCALE = 4; // 125 x 4 = 500
let img, z = 0, octaves = 4;

function setup() {
  createCanvas(500, 500);
  pixelDensity(1);
  img = createImage(RES, RES);
  noiseDetail(octaves, 0.5);
}

function draw() {
  z += 0.008;
  const sc = 0.045;
  img.loadPixels();
  for (let y = 0; y < RES; y++) {
    for (let x = 0; x < RES; x++) {
      const v = noise(x * sc, y * sc, z) * 255;
      const i = (y * RES + x) * 4;
      img.pixels[i] = img.pixels[i + 1] = img.pixels[i + 2] = v;
      img.pixels[i + 3] = 255;
    }
  }
  img.updatePixels();
  image(img, 0, 0, width, height);
}

function keyPressed() {
  const n = parseInt(key);
  if (n >= 1 && n <= 6) { octaves = n; noiseDetail(octaves, 0.5); }
}
