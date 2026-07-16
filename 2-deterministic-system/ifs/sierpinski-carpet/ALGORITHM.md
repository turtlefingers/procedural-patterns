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

# IFS 카오스 게임 — 시에르핀스키 카펫 (8개 아핀 변환)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
정사각형을 3×3으로 나눠 **가운데만 비운** 8칸을, 각각 1/3로 축소하는 아핀 변환 8개로 표현하고, 카오스 게임으로 찍어 카펫 프랙탈을 만든다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
IFS: 여러 축소 변환의 합집합이 만드는 유일한 끌개가 프랙탈. 카오스 게임: 매 스텝 변환 하나를 (확률적으로) 골라 점에 적용하고 찍는다.

8개 변환: `(i,j) ∈ {0,1,2}² \ {(1,1)}` 에 대해
```
map: x' = x/3 + i/3,  y' = y/3 + j/3      // 각 확률 1/8
```

## 3. 알고리즘 의사코드 (Pseudocode)
```
x, y = 0.5, 0.5
초기 30스텝은 버림(끌개로 수렴시키기)
repeat 많이:
    변환 하나를 확률대로 선택
    (x,y) = affine(선택, x, y)
    화면에 점 찍기
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 아핀 계수 `[a,b,c,d,e,f]` 표현: `x' = a·x+b·y+e`, `y' = c·x+d·y+f`.
- 변환 집합만 바꾸면 어떤 IFS 프랙탈이든 동일 코드로 생성(카펫/삼각형/나선 폴더가 이를 증명).
- 균등 확률 대신 변환의 축소율에 비례한 확률을 주면 점 분포가 더 고르다.
