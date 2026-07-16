# 원 채우기 (Circle Packing) — 탐욕적 성장

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
빈 곳에 무작위로 원을 놓되, 기존 원·경계에 닿기 직전까지 **최대 반지름**으로 키워 겹치지 않게 공간을 채운다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
"랜덤 위치 + 가능한 최대 크기"의 탐욕(greedy) 배치. 새 후보점에서 허용되는 최대 반지름은 "가장 가까운 원까지 거리 − 그 원의 반지름"과 "가장 가까운 경계까지 거리" 중 최소값.

## 3. 알고리즘 의사코드 (Pseudocode)
```
tryPlace():
    (x,y) = 랜덤
    maxR = min(MAX_R, x, y, W-x, H-y)      // 경계까지
    for c in circles:
        d = dist(x,y, c.x,c.y)
        if d < c.r: return                  // 기존 원 안 → 실패
        maxR = min(maxR, d - c.r)           // 이 원에 닿지 않는 최대
        if maxR < MIN_R: return             // 너무 작으면 포기
    circles.push({x, y, r: maxR - 여유})

매 프레임 tryPlace()를 수십~수백 번 시도
```

### 주요 파라미터 (Main Parameters)
- `MIN_R=2.5`, `MAX_R=60`. 프레임당 시도 횟수로 채워지는 속도 조절.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 난수, 거리 계산, 원 그리기. 매우 이식성 높음.
- 원이 많아지면 매 시도의 전수 검사가 느려진다 → 공간 격자(grid)/쿼드트리로 근접 원만 검사하면 가속.
- 변형: 반지름을 데이터·이미지 밝기로 정하면 원 패킹 초상화.
