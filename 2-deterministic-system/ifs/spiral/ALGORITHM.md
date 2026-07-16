---
## 0. 메인 기법 컨셉 (Main Technique Concept)
IFS는 여러 개의 축소 아핀 변환(Affine Transformation: 회전, 축소, 평행이동)을 정의해 둔 집합입니다. 무작위의 시작점에서 출발하여 매번 확률적으로 변환 중 하나를 선택해 점의 위치를 이동시키는 '카오스 게임(Chaos Game)'을 수만 번 반복하면, 결국 점들의 궤적이 특정한 프랙탈 형태(끌개, Attractor)로 수렴합니다.

## 0. 메인 기법 코드 (Main Technique Code)
```javascript
// 여러 아핀 변환(축소 매핑)과 각각이 선택될 확률 정의
const transforms = [
  { p: 0.85, map: (x, y) => [0.85*x + 0.04*y, -0.04*x + 0.85*y + 1.6] },
  { p: 0.07, map: (x, y) => [0.2*x - 0.26*y, 0.23*x + 0.22*y + 1.6] },
  // ...
];

let x = 0, y = 0; // 임의의 시작점

function draw() {
    // 한 프레임에 수백~수천 번 점을 찍어 시각화 속도 확보
    for (let i = 0; i < 1000; i++) {
        // 확률에 기반하여 변환 하나를 무작위 선택
        let r = random();
        let selectedTransform = chooseTransformByProbability(transforms, r);
        
        // 점의 위치를 변환된 위치로 갱신
        [x, y] = selectedTransform.map(x, y);
        
        // 화면 좌표계로 변환하여 점 그리기
        drawPointAt(x, y);
    }
}
```
---

# IFS 카오스 게임 — 나선 (회전·축소 변환)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
"조금 회전하며 축소하는" 변환 1개(확률 0.92)와 "작게 축소 복제"하는 변환 1개(0.08)로 나선형 프랙탈을 그린다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
회전+축소 아핀 변환은 회전행렬에 스케일을 곱한 것:
```
θ = 15°, s = 0.94
a = s·cosθ,  b = -s·sinθ
c = s·sinθ,  d =  s·cosθ
e, f = 회전 중심이 (0.5,0.5)가 되도록 보정한 평행이동항
```
이 변환을 반복하면 점이 중심 주위를 돌며 안으로 말려 들어가 나선을 이룬다. 두 번째 작은 변환이 가지/디테일을 더한다.

## 3. 알고리즘 의사코드 (Pseudocode)
carpet/triangle과 동일한 카오스 게임 루프를 사용하며, `MAPS`만 위 회전·축소 변환으로 교체합니다.
```
x, y = (0, 0)
반복 (매 프레임 여러 번):
    r = 0.0 ~ 1.0 무작위 난수
    if r < 0.92:
        # 큰 회전 나선 변환
        x_new = 0.94 * cos(15) * x - 0.94 * sin(15) * y + tx
        y_new = 0.94 * sin(15) * x + 0.94 * cos(15) * y + ty
    else:
        # 작은 중심 가지 변환
        x_new = 0.2 * x - 0.26 * y + tx2
        y_new = 0.23 * x + 0.22 * y + ty2
    
    x, y = x_new, y_new
    점 그리기 (x, y)
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 회전 아핀의 평행이동항 계산: 점 `p0`를 고정점으로 하려면 `e,f = p0 − R·p0` (R은 회전·축소 행렬).
- `s < 1` 이어야 수렴한다. `s`와 `θ`를 바꾸면 나선의 조밀도/감김이 달라진다.
