# 컬 노이즈 (Curl Noise) — 비압축성 흐름

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
펄린 노이즈의 **회전(curl)** 을 속도장으로 삼아 입자를 흘려보낸다. 발산(divergence)이 0이라 입자가 한 점에 뭉치지 않고 유체처럼 소용돌이친다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
스칼라장 `N(x,y)`(펄린 노이즈)의 2D 컬:
```
V(x,y) = ( ∂N/∂y , −∂N/∂x )
```
이렇게 만든 벡터장은 항상 `div V = 0`(비압축성). 편미분은 **중앙차분**으로 근사:
```
∂N/∂x ≈ (N(x+ε,y) − N(x−ε,y)) / (2ε)
∂N/∂y ≈ (N(x,y+ε) − N(x,y−ε)) / (2ε)
```

## 3. 알고리즘 의사코드 (Pseudocode)
```
매 프레임, 각 입자 p:
    nx, ny = p.x·scale, p.y·scale
    dNdx = (noise(nx+ε,ny) − noise(nx−ε,ny)) / (2ε)
    dNdy = (noise(nx,ny+ε) − noise(nx,ny−ε)) / (2ε)
    v = (dNdy, −dNdx)              // 컬
    v = normalize(v) · SPEED
    선분 p→(p+v) 그림;  p += v
    수명 다하거나 화면 벗어나면 재배치
옅은 반투명 배경으로 잔상(트레일) 유지
```

### 주요 파라미터 (Main Parameters)
- `NOISE_SC=0.0045`(장의 크기), `SPEED=1.5`, `ε=0.01`(미분 간격), 입자 1500.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- **일관된 노이즈 함수**(펄린/심플렉스)가 필요. 없으면 격자 노이즈+보간 직접 구현(perlin-noise 폴더 참고).
- flow-field와 거의 같되, 각도를 노이즈로 직접 정하는 대신 **노이즈의 미분(컬)** 을 쓰는 것이 차이(뭉침 없음).
- 3D로 확장하려면 벡터 포텐셜의 컬을 쓴다.
