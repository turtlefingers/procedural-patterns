# L-System (Lindenmayer System) — 문자열 재작성과 터틀 그래픽스

> **[AI Implementation Context]**
> 이 문서는 해당 알고리즘을 다른 프로그래밍 언어(C++, Python, Unity, Rust 등)나 그래픽스 환경으로 이식(Porting)할 때 참조하기 위한 기하학/알고리즘 명세서입니다. 특정 언어의 그래픽스 API에 종속되지 않은 순수 논리와 수학적 규칙을 담고 있습니다.


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

## 5. 세부 기법 요약 (Sub-techniques Summary)
- **[arrowhead](arrowhead/ALGORITHM.md)**: A와 B 두 개의 전진 기호를 사용하여 시에르핀스키 삼각형 모양을 하나의 연속된 선으로 그립니다.
- **[dragon](dragon/ALGORITHM.md)**: 그리지 않는 더미 변수(X,Y)를 활용하여 90도씩 회전하며 접히는 드래곤 곡선을 만듭니다.
- **[koch-curve](koch-curve/ALGORITHM.md)**: 하나의 선분을 뾰족한 4개의 선분으로 분할하는 코흐 곡선을 문자열 치환으로 표현합니다.
- **[plant](plant/ALGORITHM.md)**: 상태 저장('[')과 복구(']') 기호를 적극적으로 사용하여 자연스러운 식물의 줄기와 잎(가지치기)을 그립니다.
