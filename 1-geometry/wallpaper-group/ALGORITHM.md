# 벽지군 (Wallpaper Groups) — 대칭을 이용한 평면 타일링

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 0. 메인 기법 컨셉 (Main Technique Concept)
17개 벽지군(Wallpaper Groups)은 평면을 빈틈없이 채우는 반복 무늬를 수학적 대칭성(평행이동, 회전, 반사, 미끄러짐 반사) 기준으로 분류한 것입니다. 정다각형 셀(Cell)의 테두리를 구불구불한 경로(Path)로 변형하고, 이 경로를 이웃 셀과 맞물리게 매핑함으로써 평면 전체에 패턴을 형성합니다.

### 벽지군 명칭 (IUCr Notation)
p3, p6, cm 등의 이름은 결정학 국제 연합(IUCr)에서 정한 표준 표기법으로, 다음 4자리의 기호 조합(또는 축약형)으로 패턴의 대칭성을 설명합니다.

1. **격자의 형태 (첫 번째 글자)**
   - `p` (Primitive): 기본 격자 (단순 사각, 육각 격자 등 평행이동)
   - `c` (Centered): 중심 격자 (마름모 형태로 엇갈려 배치된 격자)
2. **최대 회전 대칭 (두 번째 숫자)**
   - `1`, `2`, `3`, `4`, `6`: $360^\circ$를 해당 숫자로 나눈 만큼의 회전 대칭이 있음을 의미. (예: `6`은 $60^\circ$ 회전 대칭)
3. **거울 및 미끄러짐 반사 (세/네 번째 글자)**
   - `m` (Mirror): 거울 반사 대칭 (데칼코마니)
   - `g` (Glide): 미끄러짐 반사 (발자국처럼 반사된 후 반 보 앞으로 이동)
   - `1`: 해당 방향으로 대칭이 없음

> **💡 예시 해석**
> - **p1**: 기본 평행이동(`p`)만 있고 회전이나 거울이 없는 가장 단순한 패턴
> - **p6m**: 기본 격자(`p`) + $60^\circ$ 회전 대칭(`6`) + 거울 반사(`m`)를 가진 화려한 눈송이 패턴
> - **cm**: 마름모형 엇갈린 격자(`c`)에 거울 반사(`m`)만 존재하는 패턴

## 0. 메인 기법 코드 (Main Technique Code)
```javascript
// 기본 셀(Cell)을 격자 위에 반복 생성 및 배치
for (let y = -rows; y <= rows; y++) {
  for (let x = -cols; x <= cols; x++) {
    push();
    translate(x * cellWidth, y * cellHeight);
    
    // 각 셀의 변(Edge)에 벽지군 그룹에 따른 굴곡 매핑
    let outline = [];
    for (let idx = 0; idx < numEdges; idx++) {
        let pathType = getPathForGroup(groupName, idx, x, y); // 그룹별 대칭 규칙 적용
        let curvePoints = constructCurve(vertices[idx], vertices[idx+1], pathType);
        outline.push(...curvePoints);
    }
    
    // 렌더링
    fill(getColorForPosition(x, y));
    drawShape(outline);
    pop();
  }
}
```

## 5. 세부 기법 요약 (Sub-techniques Summary)
- **[cell-transformation](cell-transformation/ALGORITHM.md)**: 사각/직사각/일반 격자 계열 10종. 변에 굴곡을 넣어 글라이드 및 회전 대칭을 만듭니다.
- **[hexagonal-rosette](hexagonal-rosette/ALGORITHM.md)**: 육각 격자 계열 5종 (p3, p6 등). 3중/6중 회전 대칭을 보여줍니다.
- **[rhombic-rosette](rhombic-rosette/ALGORITHM.md)**: 중심 격자(마름모) 계열 2종 (cm, cmm). 마름모 구조 안에서 거울/글라이드 대칭을 구현합니다.
