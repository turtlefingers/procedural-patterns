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

# IFS 카오스 게임 — 시에르핀스키 삼각형 (3개 아핀 변환)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
세 개의 "절반 축소" 아핀 변환으로 시에르핀스키 삼각형을 카오스 게임으로 그린다. fractal-koch 폴더의 재귀판과 **같은 형태를 다른 방법**으로 만든다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
세 변환(각 확률 1/3): 점을 세 꼭짓점 중 하나 쪽으로 절반 이동.
```
map0: x'=0.5x,      y'=0.5y            // 좌하 꼭짓점
map1: x'=0.5x+0.5,  y'=0.5y            // 우하 꼭짓점
map2: x'=0.5x+0.25, y'=0.5y+0.5        // 상단 꼭짓점
```
이것은 유명한 "주사위를 굴려 꼭짓점 방향으로 절반 이동" 카오스 게임과 동일.

## 3. 알고리즘 의사코드 (Pseudocode)
```
x,y = 0.5,0.5;  30스텝 버림
repeat:
    r = random();  변환 선택(확률 누적)
    (x,y) = affine(선택)
    점 찍기 (화면 좌표로 스케일)
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- carpet/spiral 폴더와 **완전히 동일한 iterate()** 를 쓰고 `MAPS`(변환 목록)만 교체.
- 난수·점찍기·좌표변환만 필요. 초기 30스텝 버리기를 잊지 말 것.
