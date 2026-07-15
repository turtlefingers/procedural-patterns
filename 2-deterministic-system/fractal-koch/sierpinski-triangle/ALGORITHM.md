# 시에르핀스키 삼각형 (Sierpiński Triangle) — 재귀 세분

## 무엇을 만드나
큰 삼각형을 네 개의 반쪽 삼각형으로 나누고, **가운데를 비운 채** 나머지 세 개를 재귀적으로 다시 나눈다. 깊이 0→7 자동 순환.

## 핵심 개념
"삼각형 → 세 개의 절반 크기 삼각형(모서리 세 곳)"이라는 규칙의 재귀. 가운데(역삼각형)는 항상 비워진다. 자기유사(self-similar) 프랙탈.

## 알고리즘 (의사코드)
```
sierpinski(A, B, C, depth):
    if depth == 0:
        draw triangle(A, B, C)      // 실제로 채우는 건 잎 단계뿐
        return
    mAB = (A+B)/2;  mBC = (B+C)/2;  mCA = (C+A)/2   // 각 변 중점
    sierpinski(A,   mAB, mCA, depth-1)
    sierpinski(mAB, B,   mBC, depth-1)
    sierpinski(mCA, mBC, C,   depth-1)              // 가운데(mAB,mBC,mCA)는 호출 안 함
```

## 다른 언어로 옮길 때
- 필요한 것: 삼각형 그리기 + 재귀. 매우 이식성 높음.
- 같은 형태를 IFS 카오스 게임(ifs/sierpinski-triangle)이나 파스칼 삼각형 mod 2로도 만들 수 있다 — "여러 길이 한 형태로 이어진다"는 좋은 예.
- 깊이 8이면 3⁸ ≈ 6561개 삼각형. 상한 관리.
