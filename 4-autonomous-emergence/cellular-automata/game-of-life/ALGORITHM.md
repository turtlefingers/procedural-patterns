---
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
---

# 콘웨이 생명 게임 (Conway's Game of Life) — 2D 세포 자동자

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
격자의 각 셀이 살아있음(1)/죽음(0) 상태를 가지며, **이웃 8칸의 생존 수**에 따라 동시에 다음 세대로 갱신된다. 단순 규칙에서 글라이더·발진자 같은 복잡한 패턴이 창발한다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
무어 이웃(주변 8칸)의 살아있는 수 n으로:
- 살아있는 셀: `n ∈ {2,3}` 이면 생존, 아니면 죽음(고립/과밀).
- 죽은 셀: `n == 3` 이면 탄생.

**모든 셀을 동시에** 갱신해야 한다(현재 세대를 읽어 새 배열에 쓴다). 제자리 갱신하면 결과가 틀린다.

## 3. 알고리즘 의사코드 (Pseudocode)
```
step():
    next = 새 격자
    for each (x,y):
        n = 이웃 8칸의 합 (가장자리는 토러스로 wrap: (x+dx+W)%W)
        if life[y][x]==1: next = (n==2 or n==3) ? 1 : 0
        else:             next = (n==3) ? 1 : 0
    life = next
```

### 주요 파라미터 (Main Parameters)
- 격자 100×100, 초기 생존 확률 0.22, 4프레임마다 1세대.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 2D 배열 두 개(더블 버퍼), 셀 그리기.
- 경계 처리(토러스 vs 벽)와 **동시 갱신**이 핵심.
- 규칙표(B3/S23)를 바꾸면 다른 CA(HighLife 등). 큰 격자는 비트보드/합성곱으로 가속.
