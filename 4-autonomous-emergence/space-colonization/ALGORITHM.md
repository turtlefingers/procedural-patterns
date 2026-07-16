# 공간 점유 알고리즘 (Space Colonization)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
공간에 뿌린 **유인점(attractor)** 을 향해 가지가 자라며 그 점들을 소비한다. 가지들이 자원을 두고 경쟁하며 나무·잎맥·혈관 구조가 창발한다(Runions 등, 2005/2007).

## 2. 핵심 이론 및 원리 (Core Concept & Math)
- 유인점 구름 + 성장하는 노드 트리(뿌리에서 시작).
- 각 유인점은 **영향 반경(INFLUENCE)** 내 가장 가까운 노드를 그쪽으로 끌어당긴다.
- 여러 유인점이 한 노드를 끌면 방향을 평균내 새 노드를 STEP만큼 전진 생성.
- 노드가 유인점에 **KILL 거리**보다 가까워지면 그 유인점 소비(제거) → 그 방향 성장 멈춤.

## 3. 알고리즘 의사코드 (Pseudocode)
```
attractors = 영역(예: 잎 모양) 안 랜덤 점들
nodes = [뿌리]
grow():
    pulls = {}
    for a in attractors:
        n = a에 가장 가까운 노드
        d = dist(a, n)
        if d < KILL: a 제거 예약
        elif d < INFLUENCE: pulls[n] += normalize(a - n)   # 방향 누적
    소비된 attractor 제거
    if pulls 있음:
        for (n, dir) in pulls: 새 노드 = n + normalize(dir)·STEP;  parent=n
    else:  # 아무도 안 끌면 가장 가까운 유인점으로 한 걸음(초기 도달용)
        가장 가까운 (노드,유인점) 쌍으로 한 노드 전진
가지 굵기: 각 노드가 뿌리까지 자식 수(w)를 누적 → √w 로 선 굵기
```

### 주요 파라미터 (Main Parameters)
- `INFLUENCE=60, KILL=12, STEP=5.5, MAX_NODES=4000`, 유인점 380개.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 점 리스트, 최근접 탐색, 선 그리기.
- 최근접 검색이 O(노드×유인점) — 크면 공간 격자/KD트리로 가속.
- 유인점 분포(영역 모양)를 바꾸면 나무·잎맥·산호 등 다른 구조. 잎차례(제1막)의 '완성된 배열'을 '성장 과정'으로 다시 그린 것.
