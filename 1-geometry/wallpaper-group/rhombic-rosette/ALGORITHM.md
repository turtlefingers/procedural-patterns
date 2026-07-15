# 벽지군 — 마름모(중심격자) 로제트 계열 2종 (cm, cmm)

## 무엇을 만드나
17개 벽지군 중 **중심 격자(centered/rhombic)** 계열 2종(cm, cmm)을 큰 패널 2개로 보여준다. 같은 "변 굴곡" 프레임워크.

## 핵심 개념
- **cm** : 하나의 거울 + 글라이드. 마주보는 두 변(idx 1, 4)에만 bump 굴곡, 나머지 직선.
- **cmm** : 두 방향 거울 + 2중 회전. 변마다 `[ess, 직선, sse, ess, 직선, sse]` 패턴의 굴곡.

## 알고리즘
cell-transformation과 동일 루프, `getOutline`의 굴곡 테이블만 cm/cmm용으로 교체.
```
for (x,y):
    육각 꼭짓점 계산 (xb=1.5x, yb=-x√3/2 + y√3)
    cm : idx 1→bump1, idx 4→bump2, 그 외 직선
    cmm: idx별 [ess,null,sse,ess,null,sse]
    fill·draw
```

## 다른 언어로 옮길 때
- 프레임워크는 세 벽지군 폴더가 공통이므로, `constructCurve` + 굴곡 정의(jay/bump/ess/sse)를 한 번 구현해 재사용하고 **그룹별 테이블만** 바꾸면 17종 전체를 만들 수 있다.
