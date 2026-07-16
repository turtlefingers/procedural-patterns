# 플로우필드 (Flow Field)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
펄린 노이즈로 각 위치의 **흐름 방향(각도)** 을 정하고, 입자들이 그 방향을 따라 흐르며 남기는 자취로 유기적 곡선 다발을 그린다.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
각 위치 `(x,y)`에서 각도를 노이즈로 계산: `angle = noise(x·s, y·s) · 2π · k`. 입자는 매 스텝 그 각도로 한 칸 전진. 반투명 배경으로 자취를 남긴다.

## 3. 알고리즘 의사코드 (Pseudocode)
```
입자들을 화면에 랜덤 배치
매 프레임:
    배경을 아주 옅게 덮음(잔상 유지)
    for p in particles:
        a = noise(p.x·SC, p.y·SC) · TWO_PI · 2.6
        n = p + (cos a, sin a)·SPEED
        line(p, n);  p = n;  p.life--
        수명 끝/화면 밖 → 재배치
```

### 주요 파라미터 (Main Parameters)
- `NOISE_SC=0.0045`(장 규모), `SPEED=1.5`, 입자 1500, 각도 배율 2.6.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 일관된 노이즈 함수, 선 그리기, 반투명 채움(잔상).
- curl-noise와의 차이: 여기선 노이즈 값을 **각도로 직접** 사용(뭉칠 수 있음), curl은 미분을 써서 비압축.
- 격자에 각도를 미리 계산해 캐시하면 빨라진다.
