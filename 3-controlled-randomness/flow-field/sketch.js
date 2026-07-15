// 플로우필드 — 펄린 노이즈 벡터장 위 입자들의 검은 자취. 클릭: 새 장
const NP = 1500, NOISE_SC = 0.0045, SPEED = 1.5;
let particles = [];

function setup() {
  createCanvas(500, 500);
  reset();
}

function reset() {
  noiseSeed(floor(random(1e9)));
  background(248);
  particles = [];
  for (let i = 0; i < NP; i++) spawn();
}

function spawn() {
  particles.push({ x: random(width), y: random(height), life: random(100, 400) });
}

function draw() {
  // 잔상: 아주 옅게 흰색으로 덮는다
  noStroke();
  fill(248, 12);
  rect(0, 0, width, height);

  stroke(0, 40);
  strokeWeight(1);
  for (const p of particles) {
    const a = noise(p.x * NOISE_SC, p.y * NOISE_SC) * TWO_PI * 2.6;
    const nx = p.x + cos(a) * SPEED;
    const ny = p.y + sin(a) * SPEED;
    line(p.x, p.y, nx, ny);
    p.x = nx; p.y = ny;
    p.life--;
    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width); p.y = random(height); p.life = random(100, 400);
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
