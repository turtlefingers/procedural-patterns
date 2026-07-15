// 이슬람 기하학적 패턴 (Islamic Geometric Patterns) / Girih
// 참고하신 Daniel Shiffman의 'Islamic Pattern Generator' 구조를 바탕으로 재작성했습니다.
// (Polygon, Edge, Hankin 객체 지향 구조 활용 및 수학적 정확성 확보)
// Girih 타일의 핵심인 10각성(Decagon)과 5각성(Pentagon)을 이용한 10-fold Rosette 타일링을 구현했습니다.

var polys = [];
var angle = 54;
var delta = 10;

function setup() {
  createCanvas(500, 500);
  // 전체 캔버스를 채우는 타일링(참고용 레퍼런스의 DodecaHexaSquareTiling 적용)
  var tiles = new DodecaHexaSquareTiling(35);
  tiles.buildGrid();
  polys = tiles.polys;
  
  for (var i = 0; i < polys.length; i++) {
    // 초기 색상 설정
    if (polys[i].vertices.length === 12) polys[i].color = '#00b7a6'; // Teal
    else if (polys[i].vertices.length === 6) polys[i].color = '#16aaf0'; // Sky Blue
    else polys[i].color = '#c59700'; // Yellow
    
    polys[i].hankin();
  }
}

function draw() {
  background(248);

  for (var i = 0; i < polys.length; i++) {
    polys[i].show();
  }
}

// 클릭 시마다 베리에이션 생성
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    
    // Hankin 각도 랜덤화 (중심에 선이 모이는 현상 방지)
    // 사각형(45도), 육각형(60도), 십이고각형(75도) 근처가 되면 선이 중앙에서 만나 막혀보이므로 해당 각도를 피합니다.
    let validAngle = false;
    while (!validAngle) {
      angle = random(35, 82);
      if (abs(angle - 45) > 4 && abs(angle - 60) > 4 && abs(angle - 75) > 4) {
        validAngle = true;
      }
    }
    
    delta = random(5, 15); // delta 값도 너무 크지 않게 안정적인 범위로 설정
    
    // wang-tiles 색상 팔레트 무작위 재배치
    let colors = ['#00b7a6', '#16aaf0', '#c59700'];
    colors.sort(() => random() - 0.5);
    
    for (var i = 0; i < polys.length; i++) {
      if (polys[i].vertices.length === 12) polys[i].color = colors[0];
      else if (polys[i].vertices.length === 6) polys[i].color = colors[1];
      else polys[i].color = colors[2];
      
      polys[i].hankin();
    }
  }
}

// =========================================
// Reference Architecture (Polygon, Edge, Hankin)
// =========================================

function Polygon(sides) {
  this.interiorAngle = ((sides - 2) * PI) / sides;
  this.vertices = [];
  this.edges = [];
  this.color = '#ffffff';

  this.addVertex = function(x, y) {
    var a = createVector(x, y);
    var total = this.vertices.length;
    if (total > 0) {
      var prev = this.vertices[total - 1];
      var edge = new Edge(prev, a);
      this.edges.push(edge);
    }
    this.vertices.push(a);
  }

  this.close = function() {
    var total = this.vertices.length;
    var last = this.vertices[total - 1];
    var first = this.vertices[0];
    var edge = new Edge(last, first);
    this.edges.push(edge);
  }

  this.hankin = function() {
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].hankin(this.interiorAngle);
    }
  }

  this.show = function() {
    fill(this.color);

    stroke(255); // 조각의 경계선
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i < this.vertices.length; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape(CLOSE);
    
    // 엮임선 렌더링
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].show();
    }
  }
}

function Edge(a, b) {
  this.a = a;
  this.b = b;
  this.h1;
  this.h2;

  this.show = function() {
    if (this.h1) this.h1.show();
    if (this.h2) this.h2.show();
  }

  this.hankin = function(alpha) {
    var mid = p5.Vector.add(this.a, this.b);
    mid.mult(0.5);

    var v1 = p5.Vector.sub(this.a, mid);
    var v2 = p5.Vector.sub(this.b, mid);
    var half_len = v1.mag();

    var offset1 = mid;
    var offset2 = mid;
    if (delta > 0) {
      v1.setMag(delta);
      v2.setMag(delta);
      offset1 = p5.Vector.add(mid, v2);
      offset2 = p5.Vector.add(mid, v1);
    }
    v1.normalize();
    v2.normalize();

    v1.rotate(radians(-angle));
    v2.rotate(radians(angle));

    var a_half = alpha / 2;
    var beta = PI - a_half - radians(angle);
    var len = sin(a_half) * ((half_len + delta) / sin(beta));

    v1.setMag(len);
    v2.setMag(len);

    this.h1 = new Hankin(offset1, v1);
    this.h2 = new Hankin(offset2, v2);
  }
}

function Hankin(a, v) {
  this.a = a;
  this.v = v;
  this.end = p5.Vector.add(a, v);

  this.show = function() {
    // 엮임선 표현 (조각 내부의 별 무늬)
    stroke(255);
    strokeWeight(4);
    line(this.a.x, this.a.y, this.end.x, this.end.y);
    
    // wang-tiles Coral red 이너라인
    stroke('#ed7472');
    strokeWeight(1.5);
    line(this.a.x, this.a.y, this.end.x, this.end.y);
  }
}

// =========================================
// Reference Tiling: DodecaHexaSquareTiling
// =========================================

function build_poly(x,y,r,sides,init_angle) {
  var p = new Polygon(sides);
  if(!init_angle) init_angle = 0;
  var inc = 2 * Math.PI / sides;
  for (var index = 0; index < sides; index++) {
    var theta = (index * inc) - inc / 2 + init_angle;
    var vX = x + r * Math.cos(theta);
    var vY = y + r * Math.sin(theta);
    p.addVertex(vX, vY);
  }
  p.close();
  return p;
}

function DodecaHexaSquareTiling(r) {
  this.polys = [];
  this.buildCell = function(x, y) {
    var sides = 12;
    var p = build_poly(x, y, r, sides);
    this.polys.push(p);
    
    var h12 = r * Math.cos(Math.PI/sides);
    var side = r * Math.sin(Math.PI/sides);
    
    var r6 = side / Math.sin(Math.PI/6);
    var r4 = side / Math.sin(Math.PI/4);
    var h6 = r6 * Math.cos(Math.PI/6);
    var h4 = r4 * Math.cos(Math.PI/4);
    
    var d4 = h12 + h4;
    var d6 = h12 + h6;
    
    var D4A = p5.Vector.fromAngle(2 * Math.PI/12);
    var D4B = p5.Vector.fromAngle(-2 * Math.PI/12);
    var D6 = p5.Vector.fromAngle(4 * Math.PI/12);
    
    D4A.setMag(d4);
    D4B.setMag(d4);
    D6.setMag(d6);
    
    p = build_poly(x, y + d4, r4, 4);
    this.polys.push(p);
    
    p = build_poly(x + d6, y, r6, 6);
    this.polys.push(p);
    
    p = build_poly(x + D6.x, y + D6.y, r6, 6, Math.PI/3);
    this.polys.push(p);
    
    p = build_poly(x + D4A.x, y + D4A.y, r4, 4, Math.PI/6);
    this.polys.push(p);
    
    p = build_poly(x + D4B.x, y + D4B.y, r4, 4, -Math.PI/6);
    this.polys.push(p);
  }

  this.buildGrid = function() {
    var sides = 12;
    var h12 = r * Math.cos(Math.PI/sides);
    var side = r * Math.sin(Math.PI/sides);
    var r6 = side / Math.sin(Math.PI/6);
    var r4 = side / Math.sin(Math.PI/4);
    var h6 = r6 * Math.cos(Math.PI/6);
    var h4 = r4 * Math.cos(Math.PI/4);
    
    var h = h12 + h4;
    var w = 2 * h12 + 4 * h6 + 2 * h4;
    var inc = h;
    
    var row = 0;
    for (var y = -h / 2; y < height + h/2; y += inc) {
      var startX = ((row % 2) == 0) ? -w : -w / 2;
      for (var x = startX; x < width + w; x += w) {
        this.buildCell(x, y);
      }
      row++;
    }
  }
}
