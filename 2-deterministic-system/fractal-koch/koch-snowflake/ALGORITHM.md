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

# 코흐 눈송이 (Koch Snowflake) — 기하학적 재귀

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
정삼각형에서 시작해, 각 변을 **재귀적으로 세분**한다. 매 단계 모든 변의 가운데 1/3을 바깥으로 튀어나온 삼각형 돌기로 바꾼다. 재귀 깊이가 0→5로 자동 순환.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
"각 선분을 4개의 짧은 선분으로 치환한다"는 규칙 하나를 무한 반복. 둘레는 매 단계 4/3배로 늘어 무한대가 되지만 넓이는 유한 — 프랙탈의 대표적 역설.

한 선분 A→B의 세분:
```
1/3 지점 p1, 2/3 지점 p2
peak = p1 을 기준으로 (B-A)/3 벡터를 -60° 회전시켜 얻은 뾰족점
결과: A, p1, peak, p2  (그리고 다음 선분의 시작이 B)
```
회전: `(dx,dy)` 를 `-60°` 회전 → `(dx·cos−dy·sin, dx·sin+dy·cos)`.

## 3. 알고리즘 의사코드 (Pseudocode)
```
points = 정삼각형 세 꼭짓점
repeat depth 번:
    newpts = []
    for 각 변 (a, b):
        d = (b - a) / 3
        p1 = a + d;  p2 = a + 2d
        peak = p1 + rotate(d, -60°)
        newpts += [a, p1, peak, p2]
    points = newpts
폐곡선으로 채우기
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 점 배열, 벡터 회전, 폴리곤 그리기.
- 깊이가 커지면 점 수가 4배씩 폭증(깊이 6 = 3·4⁶ ≈ 12k점). 상한을 둘 것.
- "선분 → 여러 선분 치환"은 L-System(koch-curve)과 동치. 여기선 좌표로 직접, L-System은 문자열로 표현하는 차이.
