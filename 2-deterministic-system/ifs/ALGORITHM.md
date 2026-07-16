# 반복 함수계 (Iterated Function Systems) — 카오스 게임

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


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

## 5. 세부 기법 요약 (Sub-techniques Summary)
- **[barnsley-fern](barnsley-fern/ALGORITHM.md)**: 4개의 아핀 변환을 조합하여 아주 사실적인 고사리 잎을 생성합니다.
- **[sierpinski-carpet](sierpinski-carpet/ALGORITHM.md)**: 8개의 변환을 사용하여 3x3 격자의 가운데를 비우는 사각 카펫 무늬를 만듭니다.
- **[sierpinski-triangle](sierpinski-triangle/ALGORITHM.md)**: 3개의 변환을 사용하여 세 꼭짓점을 향해 점을 절반씩 이동시키는 카오스 게임을 보여줍니다.
- **[spiral](spiral/ALGORITHM.md)**: 회전이 포함된 축소 변환을 활용하여 나선형으로 빨려 들어가는 궤적을 만듭니다.
