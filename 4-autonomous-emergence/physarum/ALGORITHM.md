# 점균류 시뮬레이션 (Physarum) — 에이전트 + 화학주성

## 무엇을 만드나
수천 개의 단순 에이전트가 앞의 화학 흔적(trail)을 감지·추종하며 자신도 흔적을 남긴다. 아무도 설계하지 않은 효율적 수송 네트워크가 창발한다.

## 핵심 개념 — 감지→회전→이동→침적, 그리고 확산·감쇠
각 에이전트는 위치와 방향을 갖고, 앞·좌·우 세 지점의 흔적 농도를 감지해 짙은 쪽으로 튼다(chemotaxis). 이동 후 자기 자리에 흔적을 더한다(deposit). 흔적 맵은 매 스텝 **약하게 확산(흐림)** 되고 **감쇠(decay)** 되어 필라멘트가 유지·정리된다.

## 알고리즘 (의사코드)
```
매 스텝:
  # 1) 에이전트
  for ag in agents:
      f = trail(앞), l = trail(좌 SENSE_A), r = trail(우 SENSE_A)   # 앞 SENSE_D 거리
      if f>=l and f>=r: 직진
      elif l>r: ag.angle += TURN
      elif r>l: ag.angle -= TURN
      else:     ag.angle += random(-TURN,TURN)
      ag.pos += (cos,sin)·SPEED   (토러스 wrap)
      trail[ag.pos] += DEPOSIT
  # 2) 확산 + 감쇠 (3×3 평균과 원값 블렌딩 후 DECAY 곱)
  next = (원값·(1-DIFFUSE) + 이웃9평균·DIFFUSE)·DECAY
  swap(trail, next)
  # 3) 렌더: 농도 → 잉크 (1 - e^(-trail·0.45))
```

## 주요 파라미터
- 에이전트 5000, `SENSE_D=9, SENSE_A=0.42, TURN=0.5, DEPOSIT=0.9, DECAY=0.92, DIFFUSE=0.35`.

## 다른 언어로 옮길 때
- 필요한 것: 부동소수 배열(흔적 맵), 에이전트 배열, 픽셀 렌더.
- 감지 각/거리, 회전각, 확산·감쇠의 균형이 네트워크 모양을 좌우(파라미터 민감).
- 대규모는 GPU(셰이더)로 흔적맵 확산과 에이전트 갱신을 병렬화.
