---
## 0. 메인 기법 컨셉 (Main Technique Concept)
기하학적 재귀는 주어진 형태(예: 선분이나 다각형)를 더 작고 동일한 형태의 조합으로 '치환'하는 과정을 반복하는 것입니다. 무한히 반복하면 자기유사성(Self-similarity)을 갖는 프랙탈 기하학(Fractal Geometry) 형태가 생성됩니다.

## 0. 메인 기법 코드 (Main Technique Code)
```javascript
function drawFractal(A, B, depth) {
    // 1. 종료 조건 (Base case): 최대 깊이에 도달하면 최종 형태 렌더링
    if (depth === 0) {
        drawLine(A, B); // 또는 다각형 채우기
        return;
    }

    // 2. 재귀 단계 (Recursive step): 주어진 선분/면적을 규칙에 따라 세분화
    let points = calculateSubPoints(A, B); 
    
    // 3. 세분화된 각 파트에 대해 자기자신 호출
    for (let i = 0; i < points.length - 1; i++) {
        drawFractal(points[i], points[i+1], depth - 1);
    }
}
```
---

# 시에르핀스키 삼각형 (Sierpiński Triangle) — 재귀 세분

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
큰 삼각형을 네 개의 반쪽 삼각형으로 나누고, **가운데를 비운 채** 나머지 세 개를 재귀적으로 다시 나눈다. 깊이 0→7 자동 순환.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
"삼각형 → 세 개의 절반 크기 삼각형(모서리 세 곳)"이라는 규칙의 재귀. 가운데(역삼각형)는 항상 비워진다. 자기유사(self-similar) 프랙탈.

## 3. 알고리즘 의사코드 (Pseudocode)
```
sierpinski(A, B, C, depth):
    if depth == 0:
        draw triangle(A, B, C)      // 실제로 채우는 건 잎 단계뿐
        return
    mAB = (A+B)/2;  mBC = (B+C)/2;  mCA = (C+A)/2   // 각 변 중점
    sierpinski(A,   mAB, mCA, depth-1)
    sierpinski(mAB, B,   mBC, depth-1)
    sierpinski(mCA, mBC, C,   depth-1)              // 가운데(mAB,mBC,mCA)는 호출 안 함
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 삼각형 그리기 + 재귀. 매우 이식성 높음.
- 같은 형태를 IFS 카오스 게임(ifs/sierpinski-triangle)이나 파스칼 삼각형 mod 2로도 만들 수 있다 — "여러 길이 한 형태로 이어진다"는 좋은 예.
- 깊이 8이면 3⁸ ≈ 6561개 삼각형. 상한 관리.
