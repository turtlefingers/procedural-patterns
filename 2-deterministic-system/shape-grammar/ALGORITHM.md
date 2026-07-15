# 형태 문법 (Shape Grammar)

## 무엇을 만드나
"정사각형 하나의 **일부 변에** 축소·회전된 정사각형을 붙인다"는 규칙을 재귀 적용해 유기적으로 뻗어나가는 형태를 생성한다. 클릭할 때마다 규칙(어느 변에, 얼마나 축소·회전)이 무작위로 바뀐다.

## 핵심 개념
형태 문법(Stiny & Gips, 1971)은 L-System의 "문자열" 대신 **형태 자체**를 다시쓰기 대상으로 삼는다. 여기서 규칙은:
- 대상: 정사각형
- 선택된 변들(edges 부분집합)마다 → 자식 정사각형 부착
- 자식은 부모보다 `scale`배 작고, 부착 방향에서 `rot`만큼 회전

한 번 정해진 규칙(edges, scale, rot)을 모든 노드에 **동일하게** 적용하는 것이 자기유사성을 만든다.

## 알고리즘 (의사코드)
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

## 다른 언어로 옮길 때
- 필요한 것: 변환(회전) 사각형 그리기 + 재귀. 노드 상한(예: 4000)으로 폭주 방지.
- `scale < 1` 이어야 수렴한다. edges/scale/rot을 바꾸면 전혀 다른 "양식"이 나온다 — 이것이 형태 문법의 요지(규칙이 곧 디자인 언어).
