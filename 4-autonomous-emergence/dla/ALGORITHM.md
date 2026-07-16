# DLA — 확산 제한 응집 (Diffusion-Limited Aggregation)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
무작위로 떠도는 입자가 이미 붙은 덩어리에 닿으면 그 자리에 **달라붙는다**. 번개·서리·이끼·광물 침착 같은 가지 친 프랙탈이 자란다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
- 씨앗 하나를 중앙에 고정.
- 입자를 덩어리 바깥 원에서 출발시켜 **랜덤 워크**(상하좌우 무작위 한 칸). 덩어리에 인접하면 그 칸에 고정.
- 너무 멀리 나가면(kill 반경) 버리고 새로 출발.
성장 반경 `rMax`에 맞춰 출발/제거 반경을 조절해 효율을 높인다.

## 3. 알고리즘 의사코드 (Pseudocode)
```
occupied[center] = 1;  rMax = 2
runWalker():
    spawnR = min(rMax+6, ...);  killR = spawnR+24
    (x,y) = 중심 + spawnR·(cosθ, sinθ)
    repeat 많이:
        무작위로 x 또는 y 를 ±1
        if 중심에서 거리 > killR: 재출발
        if 8이웃 중 occupied 있음:
            occupied[x,y]=1;  rMax=max(rMax, 반경);  그리기;  return
매 프레임 runWalker() 여러 번, rMax 가 화면에 찰 때까지
```

### 주요 파라미터 (Main Parameters)
- 격자 250², 셀 2px. spawn/kill 반경 여유값이 속도·형태에 영향.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 2D 점유 배열, 난수. 그래픽 최소.
- 진짜 브라운 운동 대신 격자 랜덤워크로 근사. 붙는 확률(sticking<1)을 낮추면 더 조밀한 형태.
- 결과가 프랙탈 — 제3막의 "정적 프랙탈"을 시간으로 성장시킨 버전.
