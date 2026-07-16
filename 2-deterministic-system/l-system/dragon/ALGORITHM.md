---
## 0. 메인 기법 컨셉 (Main Technique Concept)
식물의 세포 분열과 성장 방식을 모방한 형식 문법입니다. 초기 문자열(공리)에서 시작해, 반복 횟수만큼 모든 문자를 정해진 규칙에 따라 병렬로 '재작성(치환)'하여 긴 문자열을 생성합니다. 최종 생성된 문자열을 '터틀 그래픽스(거북이 이동, 회전, 스택 저장 등)' 명령어로 해석하여 기하학적 형태나 식물을 그립니다.

## 0. 메인 기법 코드 (Main Technique Code)
```javascript
// 1. 문자열 재작성 (Rewriting)
let currentStr = axiom;
for (let i = 0; i < iterations; i++) {
  let nextStr = '';
  // 모든 문자를 규칙에 맞게 동시 치환 (세포 동시분열 은유)
  for (let char of currentStr) {
    nextStr += rules[char] || char; 
  }
  currentStr = nextStr;
}

// 2. 터틀 그래픽스 해석 (Interpretation)
function drawLSystem(str) {
  for (let char of str) {
    if (char === 'F') { 
      line(0, 0, 0, -len); // 전진하며 선 긋기
      translate(0, -len);
    } else if (char === '+') { rotate(ANGLE); } // 회전
    else if (char === '-') { rotate(-ANGLE); }
    else if (char === '[') { push(); }          // 가지치기 시작 (상태 저장)
    else if (char === ']') { pop(); }           // 가지 끝에서 복귀 (상태 복구)
  }
}
```
---

# L-System — 드래곤 곡선 (Heighway Dragon)

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


## 1. 개요 및 목적 (Overview)
90° 회전만으로 자기 위를 겹치지 않고 접히는 유명한 프랙탈 곡선.

## 2. 핵심 이론 및 원리 (Core Concept & Math)
```
공리: FX
규칙: X → X+YF+ ,  Y → -FX-Y
각도: 90°
반복: 12
전진: F (X, Y 는 전진하지 않는 보조 기호 = 방향만 유도)
```
X, Y는 그리지 않고 재귀 구조만 담는 "변수" 기호라는 점이 포인트.

## 3. 알고리즘 의사코드 (Pseudocode)
L-System은 두 단계다.

### 1) 재작성(rewriting): 문자열을 병렬로 치환
```
s = AXIOM
repeat ITER 번:
    out = ""
    for 각 문자 ch in s:
        out += RULES[ch] 있으면 그 치환문자열, 없으면 ch 그대로
    s = out
```
Chomsky 문법과 달리 **모든 문자를 동시에(병렬)** 치환하는 것이 핵심(세포 동시분열의 은유).

### 2) 해석(interpretation): 터틀 그래픽스
최종 문자열을 왼쪽부터 읽으며 거북이를 움직인다.
```
상태: 위치(x,y), 방향각 dir;  스택
'F'(또는 전진문자): 앞으로 한 칸 → 선분 기록,  위치 갱신
'+' : dir += ANGLE
'-' : dir -= ANGLE
'[' : 현재 (x,y,dir) 스택에 push   (가지치기 시작)
']' : 스택에서 pop 해 복귀          (가지 끝에서 되돌아옴)
```
그린 뒤 전체 선분의 바운딩 박스로 화면에 맞춰 스케일/센터링.

## 4. 데이터 구조 및 이식 가이드 (Data Structures & Porting Guide)
- 필요한 것: 문자열 처리, 스택, 선분 그리기, `cos/sin`.
- 문자열 길이가 반복마다 폭증하니 ITER 상한과 메모리에 유의(드래곤은 12회에 수천~수만 문자).
- 전진문자(F 또는 A/B)와 회전각(ANGLE)만 규칙에 맞추면 어떤 곡선/식물이든 같은 엔진으로 그린다.
