---
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
---

# 벽지군 (Wallpaper Groups) — 사각/직사각 격자 계열 10종

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
평면 전체를 덮는 반복 무늬의 대칭 유형은 **정확히 17가지**뿐이다(벽지군). 이 패널은 그중 사각/직사각/일반 격자 계열 **10종**(p1, p2, pm, pg, pmm, pmg, pgg, p4, p4g, p4m)을 각각 작은 창에 타일링해 보여준다. (나머지는 육각 로제트, 마름모 로제트 폴더 참고.)

## 2. 핵심 이론 및 원리 (Core Concept & Math)
기본 셀은 정다각형(육각형/정사각형/직사각형)이다. 각 **변을 곧은 직선 대신 구불구불한 경로(path)** 로 바꾸면, 인접 셀과 아귀가 맞아야 평면이 메워진다. 이 "변에 어떤 굴곡을 넣는가"의 규칙이 곧 대칭군을 결정한다.
- `constructCurve(P, Q, path)` : 변 P→Q를 로컬 좌표계(변 방향 v, 수직 w)로 삼아, 미리 정의된 굴곡 path(jay/bump/ess/sse/pg…)를 실제 좌표로 매핑.
- 예: `p1`은 마주보는 두 변에 비대칭 굴곡(jay1/jay2), `pmm`은 모든 변이 직선(거울 대칭이라 경계가 곧아야 함), `pg`는 글라이드에 맞춰 굴곡을 교대 배치.

## 3. 알고리즘 의사코드 (Pseudocode)
```
for 각 격자 좌표 (x, y):
    셀 중심 = 격자 기저벡터로 계산
        사각계열:   xb = 1.5x,  yb = 1.5y (or 2y)
        육각계열:   xb = 1.5x,  yb = -x·√3/2 + y·√3
    꼭짓점 = 중심 + 정다각형 꼭짓점
    for 각 변 idx:
        그룹 규칙에 따라 굴곡 path 선택(없으면 직선)
        outline += constructCurve(v[idx], v[idx+1], path)
    fill(색); drawShape(outline)   // 색은 (x,y)로 결정 → 대칭적 색칠
```
`(x + 100) % 2`, `% 4` 같은 **좌표 패리티**로 셀마다 굴곡을 교대시켜 글라이드/회전 대칭을 만든다.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 폴리곤 채우기, 좌표 변환, 클리핑(패널 안만 그리기).
- 핵심은 그래픽이 아니라 **각 군의 변-굴곡 규칙 테이블**이다. 위 매핑을 그대로 옮기면 된다.
- `constructCurve`의 로컬→월드 변환: `world = P + local.x·v + local.y·w`, 여기서 `v = Q−P`, `w = perp(v)`.
