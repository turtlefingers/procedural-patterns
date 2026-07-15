// 컬 노이스 (Curl Noise) — 발산이 없는 비압축성 유체 흐름 시뮬레이션
// 스칼라 노이즈(Perlin Noise)의 회전(Curl) 미분을 계산하여 뭉침이 없는 벡터장을 만듭니다.
const NP = 1500, NOISE_SC = 0.0045, SPEED = 1.5;
let particles = [];
let eps = 0.01; // 미분 근사를 위한 미소 변위

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
  // 잔상 효과
  noStroke();
  fill(248, 12);
  rect(0, 0, width, height);

  stroke(0, 40);
  strokeWeight(1);
  for (const p of particles) {
    let nx = p.x * NOISE_SC;
    let ny = p.y * NOISE_SC;
    
    // 편미분 근사치 계산 (중앙차분법)
    let dN_dx = (noise(nx + eps, ny) - noise(nx - eps, ny)) / (2 * eps);
    let dN_dy = (noise(nx, ny + eps) - noise(nx, ny - eps)) / (2 * eps);
    
    // Curl 연산: V(x,y) = (dN/dy, -dN/dx)
    // 이 연산을 통해 벡터장의 발산(divergence)이 0이 되어 입자가 뭉치지 않습니다.
    let vx = dN_dy;
    let vy = -dN_dx;
    
    // 정규화 후 속도 곱하기
    let len = sqrt(vx * vx + vy * vy);
    if (len > 0) {
      vx = (vx / len) * SPEED;
      vy = (vy / len) * SPEED;
    }

    let nX = p.x + vx;
    let nY = p.y + vy;
    
    line(p.x, p.y, nX, nY);
    p.x = nX; p.y = nY;
    p.life--;
    
    if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width); p.y = random(height); p.life = random(100, 400);
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) reset();
}
