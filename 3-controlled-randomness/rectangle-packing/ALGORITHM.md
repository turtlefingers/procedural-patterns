# 사각형 채우기 (Rectangle Packing) — Guillotine 빈 패킹

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
크기가 제각각인 직사각형들을 큰 영역에 겹치지 않게 배치한다. 텍스처 아틀라스·레이아웃에 쓰이는 실용 알고리즘.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
빈 공간(free rectangles) 목록을 유지한다. 새 사각형을 넣을 때:
1. 들어갈 수 있는 빈 공간 중 **남는 면적이 가장 작은** 곳(best fit)을 고른다.
2. 그 자리에 배치하고, 남은 L자 공간을 **두 직사각형으로 절단(guillotine)**해 빈 목록에 되돌린다.
- 사각형을 **큰 것부터** 정렬해 넣으면 배치 품질이 좋아진다(FFDH류).

## 3. 알고리즘 의사코드 (Pseudocode)
```
free = [전체 영역]
queue = 랜덤 사각형들, 최대변 기준 내림차순 정렬
placeOne():
    r = queue.pop_front
    best = argmin over free where r 가 들어감 of (칸면적 − r면적)
    if none: 건너뜀
    f = free.remove(best)
    placed += {f.x, f.y, r.w, r.h}
    // L자 잔여를 두 조각으로 자름(더 긴 쪽을 기준으로 분할)
    rw = f.w-r.w; rh = f.h-r.h
    if rw > rh: free += [오른쪽 세로 스트립(f 전체 높이), 아래 가로 스트립(r 폭)]
    else:       free += [오른쪽 세로 스트립(r 높이), 아래 가로 스트립(f 전체 폭)]
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 순수 자료구조 문제(사각형 목록). 사각형 그리기만 있으면 렌더 가능.
- 진짜 최적 빈 패킹은 NP-난해 — 이건 빠른 휴리스틱. 더 나은 품질은 MaxRects 알고리즘.
