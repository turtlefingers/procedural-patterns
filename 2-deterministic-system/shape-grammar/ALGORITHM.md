# 형태 문법 (Shape Grammar)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
"정사각형 하나의 **일부 변에** 축소·회전된 정사각형을 붙인다"는 규칙을 재귀 적용해 유기적으로 뻗어나가는 형태를 생성한다. 클릭할 때마다 규칙(어느 변에, 얼마나 축소·회전)이 무작위로 바뀐다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
형태 문법(Stiny & Gips, 1971)은 L-System의 "문자열" 대신 **형태 자체**를 다시쓰기 대상으로 삼는다. 여기서 규칙은:
- 대상: 정사각형
- 선택된 변들(edges 부분집합)마다 → 자식 정사각형 부착
- 자식은 부모보다 `scale`배 작고, 부착 방향에서 `rot`만큼 회전

한 번 정해진 규칙(edges, scale, rot)을 모든 노드에 **동일하게** 적용하는 것이 자기유사성을 만든다.

## 3. 알고리즘 의사코드 (Pseudocode)
```
규칙 정하기: edges = {0..3} 중 2~3개, scale∈[0.55,0.74], rot∈[-0.45,0.45], depth=8

applyRule(x, y, size, angle, depth):
    if depth<=0 or size<임계: return
    이 위치·크기·각도의 정사각형을 목록에 추가
    for e in edges:
        childSize = size * scale
        edgeAngle = angle + e·90°
        childAngle = edgeAngle + rot
        // 부모 변 중앙에서 자식 반 칸만큼 떨어뜨려 붙임
        cx = x + cos(edgeAngle)·(size/2 + childSize/2·cos(rot))
        cy = y + sin(edgeAngle)·(size/2 + childSize/2·cos(rot))
        applyRule(cx, cy, childSize, childAngle, depth-1)

렌더: 각 정사각형을 자기 각도로 회전해 윤곽선만 그림(깊을수록 얇게)
```

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 변환(회전) 사각형 그리기 + 재귀. 노드 상한(예: 4000)으로 폭주 방지.
- `scale < 1` 이어야 수렴한다. edges/scale/rot을 바꾸면 전혀 다른 "양식"이 나온다 — 이것이 형태 문법의 요지(규칙이 곧 디자인 언어).
