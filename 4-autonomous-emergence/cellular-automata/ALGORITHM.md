# 세포 자동자 (Cellular Automata) — 규칙과 창발성

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 0. 메인 기법 컨셉 (Main Technique Concept)
격자(Grid)로 이루어진 공간의 각 세포(Cell)들이 자신의 이웃들의 상태에 따라 다음 세대의 상태를 결정하는 모델입니다. 아주 단순하고 국소적인(Local) 생존/탄생 규칙만을 주더라도, 모든 세포가 '동시에' 업데이트 되면서 전체적으로는 매우 복잡하고 예측 불가능한 거시적 무늬(창발성, Emergence)가 나타납니다.

## 0. 메인 기법 코드 (Main Technique Code)
```javascript
// 현재 세대와 다음 세대를 저장할 두 개의 격자 배열 준비
let grid = createGrid();
let nextGrid = createGrid();

function step() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // 이웃 상태 확인 (국소 규칙)
            let neighbors = countAliveNeighbors(grid, x, y);
            
            // 현재 세포의 다음 세대 상태 결정
            if (grid[y][x] === 1) {
                // 생존 혹은 사망 규칙 (예: 2~3명이면 생존)
                nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                // 탄생 규칙 (예: 3명이면 탄생)
                nextGrid[y][x] = (neighbors === 3) ? 1 : 0;
            }
        }
    }
    
    // 세대 교체 (반드시 전체 판별이 끝난 후 '동시에' 업데이트)
    swap(grid, nextGrid);
}
```

## 5. 세부 기법 요약 (Sub-techniques Summary)
- **[game-of-life](game-of-life/ALGORITHM.md)**: 2차원 격자 기반으로 주변 8칸의 이웃 수에 따라 생존과 탄생이 결정되는 가장 유명한 CA 모델입니다.
- **[wolfram](wolfram/ALGORITHM.md)**: 1차원(한 줄) 세포들이 좌우 이웃과 자신의 3개 상태(8가지 경우)에 따라 다음 세대를 결정하며, 그 세대들을 누적하여 2D 패턴(Rule 30 등)을 만듭니다.
