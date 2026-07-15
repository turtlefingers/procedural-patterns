// IFS 카오스 게임 — 시에르핀스키 카펫(8개 축소 아핀 변환). 클릭: 다시 그리기.
const MAPS = (() => {
  const ms = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!(i === 1 && j === 1))
        ms.push({ m: [1 / 3, 0, 0, 1 / 3, i / 3, j / 3], p: 1 / 8 });
  return ms;
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
