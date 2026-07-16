# 보로노이 다이어그램 (Voronoi Diagram) — 픽셀 기반

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
평면의 각 점을 **가장 가까운 site(씨앗점)** 에 배정해 영역을 나눈다. 세포 조직·균열·스테인드글라스 같은 무늬. 이 스케치는 픽셀마다 최근접 site를 찾는 브루트포스 방식.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
- 각 픽셀에서 모든 site까지 거리(제곱)를 재 1등·2등을 찾는다.
- **1등과 2등 거리가 거의 같은 픽셀 = 셀 경계**(두 site의 수직이등분선 위). 이 조건으로 경계선을 그린다.

## 3. 알고리즘 의사코드 (Pseudocode)
```
sites = 랜덤 N개
for each pixel (x,y):
    best, second = 무한대
    for s in sites:
        d = (x-s.x)² + (y-s.y)²
        d 로 best, second 갱신
    color = (√second − √best < 1.6) ? 검정(경계) : 배경
site 점 표시
```

### 주요 파라미터 (Main Parameters)
- `N_SITES=40`, 경계 두께 임계 `1.6`.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 픽셀 접근(프레임버퍼)만 있으면 된다. O(픽셀수 × site수)로 느리지만 명확.
- 빠른 정확본은 Fortune's sweep 또는 delaunay의 쌍대로 구성(delaunay 폴더 참고).
- 거리 척도를 맨해튼/체비셰프로 바꾸면 다른 셀 모양.
