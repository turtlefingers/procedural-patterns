# 트리맵 (Treemap) — Slice-and-Dice

## 무엇을 만드나
계층 구조(트리) 데이터를, 각 노드의 값에 비례하는 **중첩 사각형**으로 화면을 빈틈없이 채워 시각화한다. 이 스케치는 가장 단순한 **slice-and-dice(번갈아 가로/세로 분할)** 방식.

## 핵심 개념
- 각 노드의 **값** = 잎이면 자기 값, 내부 노드면 자식 값의 합(재귀).
- 부모 사각형을 자식들의 값 비율대로 나눈다. 깊이(depth)가 **짝수면 가로로, 홀수면 세로로** 잘라 번갈아 분할한다(그래서 정사각형에 가까운 조각이 나온다).

## 알고리즘 (의사코드)
```
value(node): node가 잎이면 node.v, 아니면 sum(value(child))

layout(node, x, y, w, h, depth):
    draw rectangle(x, y, w, h)          // 윤곽선
    if node는 잎: return
    total = value(node)
    offset = 0
    for child in node.children:
        frac = value(child) / total
        if depth 짝수:                   // 가로 분할
            layout(child, x + offset*w, y, frac*w, h, depth+1)
        else:                            // 세로 분할
            layout(child, x, y + offset*h, w, frac*h, depth+1)
        offset += frac
```
안쪽 여백(padding)을 주면 계층이 눈에 보인다.

## 주요 파라미터
- 랜덤 트리 생성: 깊이 4, 자식 2~4개, 잎 값 1~12.
- `pad = 4`(중첩 여백), 선 굵기는 깊이가 얕을수록 굵게.

## 다른 언어로 옮길 때
- 그래픽스는 사각형 그리기 하나면 충분하다. 핵심은 **재귀 분할 로직**.
- slice-and-dice는 종횡비가 나빠질 수 있다. 더 정사각형에 가까운 조각을 원하면 **squarified treemap** 알고리즘으로 교체.
