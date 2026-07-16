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

# 울프람 1차원 세포 자동자 (Elementary CA) — Rule 30

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
한 줄(1D) 셀들이 **자기+좌우 이웃 3칸**으로 다음 줄을 정한다. 각 세대를 아래로 쌓아 2D 무늬로 그린다. Rule 30은 혼돈, Rule 110은 튜링 완전.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
셀 하나의 다음 상태는 (왼쪽 L, 자신 C, 오른쪽 R) 3비트가 결정하는 8가지 경우. "규칙 번호"의 각 비트가 각 경우의 결과다:
```
next = (RULE >> ((L<<2)|(C<<1)|R)) & 1
```
예: RULE=30 = `00011110`(2진). 패턴 111→0, 110→0, 101→0, 100→1, 011→1, 010→1, 001→1, 000→0.

## 3. 알고리즘 의사코드 (Pseudocode)
```
row = 초기 줄 (가운데 1개만 1, 또는 전체 랜덤)
for y = 0 .. ROWS-1:
    row 를 y번째 줄로 그림(1인 칸을 검게)
    next[x] = (RULE >> ((row[x-1]<<2)|(row[x]<<1)|row[x+1])) & 1   // 좌우는 wrap
    row = next
```

### 주요 파라미터 (Main Parameters)
- `RULE=30`, 셀 크기 2px, 250×250. 시드: 단일 점 또는 랜덤.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 배열 하나 + 비트 연산이면 끝. 가장 이식성 높은 CA.
- RULE만 0~255로 바꾸면 256가지 자동자 전부. 110은 계산 보편성으로 유명.
