const presets = [
  {
    name: "Square: 4 Corners (Design 1)",
    shapeType: "square",
    depth: 5,
    baseSize: 180,
    rules: [
      { tx: 0.5, ty: 0.5, scale: 0.5, rot: 0 },
      { tx: -0.5, ty: 0.5, scale: 0.5, rot: 0 },
      { tx: 0.5, ty: -0.5, scale: 0.5, rot: 0 },
      { tx: -0.5, ty: -0.5, scale: 0.5, rot: 0 }
    ]
  },
  {
    name: "Square: 3 Corners (Design 4)",
    shapeType: "square",
    depth: 6,
    baseSize: 200,
    rules: [
      { tx: 0.5, ty: 0.5, scale: 0.5, rot: 0 },
      { tx: -0.5, ty: 0.5, scale: 0.5, rot: 0 },
      { tx: 0.5, ty: -0.5, scale: 0.5, rot: 0 }
    ]
  },
  {
    name: "Square: Corner Spiral",
    shapeType: "square",
    depth: 14,
    baseSize: 160,
    rules: [
      { tx: 0.5, ty: 0.5, scale: 0.85, rot: Math.PI / 8 }
    ]
  },
  {
    name: "Square: Twin Spiral (Design 3)",
    shapeType: "square",
    depth: 10,
    baseSize: 150,
    rules: [
      { tx: 0.5, ty: 0.5, scale: 0.7, rot: Math.PI / 10 },
      { tx: -0.5, ty: -0.5, scale: 0.7, rot: Math.PI / 10 }
    ]
  },
  {
    name: "Square: Edge Connect",
    shapeType: "square",
    depth: 5,
    baseSize: 160,
    rules: [
      { tx: 0.5, ty: 0, scale: 0.45, rot: Math.PI / 4 },
      { tx: -0.5, ty: 0, scale: 0.45, rot: Math.PI / 4 },
      { tx: 0, ty: 0.5, scale: 0.45, rot: Math.PI / 4 },
      { tx: 0, ty: -0.5, scale: 0.45, rot: Math.PI / 4 }
    ]
  },
  {
    name: "Triangle: Sierpinski (Design 1)",
    shapeType: "triangle",
    depth: 6,
    baseSize: 250,
    rules: [
      { tx: 0, ty: -0.577, scale: 0.5, rot: 0 },
      { tx: 0.5, ty: 0.288, scale: 0.5, rot: 0 },
      { tx: -0.5, ty: 0.288, scale: 0.5, rot: 0 }
    ]
  },
  {
    name: "Triangle: Outer Spiral",
    shapeType: "triangle",
    depth: 7,
    baseSize: 200,
    rules: [
      { tx: 0, ty: -0.577, scale: 0.45, rot: Math.PI / 6 },
      { tx: 0.5, ty: 0.288, scale: 0.45, rot: Math.PI / 6 },
      { tx: -0.5, ty: 0.288, scale: 0.45, rot: Math.PI / 6 }
    ]
  },
  {
    name: "Triangle: Twin Swirl (Design 4)",
    shapeType: "triangle",
    depth: 12,
    baseSize: 180,
    rules: [
      { tx: 0.5, ty: 0.288, scale: 0.8, rot: Math.PI / 6 },
      { tx: -0.5, ty: 0.288, scale: 0.8, rot: Math.PI / 6 }
    ]
  },
  {
    name: "Triangle: Hexa Branch",
    shapeType: "triangle",
    depth: 5,
    baseSize: 150,
    rules: [
      { tx: 0, ty: -0.577, scale: 0.4, rot: Math.PI },
      { tx: 0.5, ty: 0.288, scale: 0.4, rot: Math.PI },
      { tx: -0.5, ty: 0.288, scale: 0.4, rot: Math.PI },
      { tx: 0, ty: 0.577, scale: 0.4, rot: 0 },
      { tx: -0.5, ty: -0.288, scale: 0.4, rot: 0 },
      { tx: 0.5, ty: -0.288, scale: 0.4, rot: 0 }
    ]
  }
];

let currentPresetIndex = 0;
let shapes = [];
let drawingProgress = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  loadPreset(currentPresetIndex);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  loadPreset(currentPresetIndex);
}

function applyPreset(preset, x, y, s, a, depth) {
  if (depth <= 0 || s < 2 || shapes.length > 15000) return;
  
  shapes.push({ type: preset.shapeType, x, y, s, a, depth, maxDepth: preset.depth });

  for (let rule of preset.rules) {
    // Relative coordinates
    let localX = rule.tx * s;
    let localY = rule.ty * s;
    
    // Rotate relative to current angle 'a'
    let rx = localX * cos(a) - localY * sin(a);
    let ry = localX * sin(a) + localY * cos(a);
    
    let nextX = x + rx;
    let nextY = y + ry;
    let nextS = s * rule.scale;
    let nextA = a + rule.rot;
    
    applyPreset(preset, nextX, nextY, nextS, nextA, depth - 1);
  }
}

function loadPreset(index) {
  let preset = presets[index];
  shapes = [];
  
  let cx = width / 2;
  let cy = height / 2;
  
  applyPreset(preset, cx, cy, preset.baseSize, 0, preset.depth);
  
  // Sort shapes by depth descending (base shapes drawn first)
  shapes.sort((a, b) => b.depth - a.depth);
  drawingProgress = 0;
  
  let nameEl = document.getElementById('preset-name');
  if (nameEl) {
    nameEl.innerText = `${index + 1}/${presets.length} - ${preset.name}`;
  }
}

function draw() {
  background('#1a1a1a');
  
  // Draw shapes up to drawingProgress
  stroke(255, 255, 255, 180);
  noFill();
  
  let drawCount = min(floor(drawingProgress), shapes.length);
  for(let i=0; i<drawCount; i++) {
    let sh = shapes[i];
    push();
    translate(sh.x, sh.y);
    rotate(sh.a);
    
    // Stroke weight based on generation depth
    let weight = map(sh.depth, 1, sh.maxDepth, 0.5, 2.5);
    strokeWeight(weight);
    
    if (sh.type === 'square') {
      rectMode(CENTER);
      rect(0, 0, sh.s, sh.s);
    } else if (sh.type === 'triangle') {
      let r = sh.s / sqrt(3);
      triangle(
        0, -r,
        sh.s/2, r/2,
        -sh.s/2, r/2
      );
    }
    pop();
  }
  
  if (drawingProgress < shapes.length) {
    drawingProgress += max(2, shapes.length / 50); // Finish drawing within roughly 50 frames
  }
}

function mousePressed() {
  currentPresetIndex = (currentPresetIndex + 1) % presets.length;
  loadPreset(currentPresetIndex);
}
