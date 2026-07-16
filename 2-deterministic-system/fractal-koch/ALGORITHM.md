# 기하학적 재귀 (Geometric Recursion) — 코흐 프랙탈

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


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

## 5. 세부 기법 요약 (Sub-techniques Summary)
- **[koch-snowflake](koch-snowflake/ALGORITHM.md)**: 선분의 가운데 1/3을 뾰족한 삼각형 돌기로 치환하여 무한한 둘레의 눈송이를 만듭니다.
- **[sierpinski-triangle](sierpinski-triangle/ALGORITHM.md)**: 삼각형의 내부에 역삼각형을 비워내며 3개의 작은 삼각형으로 분할하는 과정을 반복합니다.
