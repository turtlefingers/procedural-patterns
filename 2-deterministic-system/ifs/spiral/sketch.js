// IFS 카오스 게임 — 나선(회전+축소 변환 1개 + 축소 복제 1개). 클릭: 다시 그리기.
const MAPS = (() => {
  const th = Math.PI / 12, s = 0.94; // 15° 회전 + 0.94 축소
  return [
    { m: [s * Math.cos(th), -s * Math.sin(th), s * Math.sin(th), s * Math.cos(th),
          0.5 - 0.5 * s * Math.cos(th) + 0.5 * s * Math.sin(th),
          0.5 - 0.5 * s * Math.sin(th) - 0.5 * s * Math.cos(th)], p: 0.92 },
    { m: [0.14, 0, 0, 0.14, 0.82, 0.12], p: 0.08 },
  ];
})();

let x = 0.5, y = 0.5;

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  background(248);
  x = 0.5; y = 0.5;
  for (let i = 0; i < 30; i++) iterate();
}

function iterate() {
  let r = random(), pick = MAPS[MAPS.length - 1];
  for (const mp of MAPS) {
    if (r < mp.p) { pick = mp; break; }
    r -= mp.p;
  }
  const [a, b, c, d, e, f] = pick.m;
  const nx = a * x + b * y + e, ny = c * x + d * y + f;
  x = nx; y = ny;
}

function draw() {
  stroke(0, 140);
  strokeWeight(1);
  for (let i = 0; i < 6000; i++) {
    iterate();
    point(10 + x * 480, 490 - y * 480);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
