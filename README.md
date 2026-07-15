# 절차적 무늬 (Procedural Patterns)

이 프로젝트는 **주체와 통제권의 관점**에서 그래픽 패턴과 형태가 생성되는 알고리즘들을 4개의 단계로 분류하고, 이를 p5.js 등의 웹 기술로 직접 구현해 놓은 컬렉션입니다. 창작자가 형태를 어디까지 직접 통제하고, 어디서부터 알고리즘과 수학에 위임하는지에 따라 프로젝트가 구조화되어 있습니다.

## 프로젝트 구조 및 분류 체계

### 1단계: 직접 통제와 규칙 (Direct Control & Rules)
> **디렉토리:** `1-geometry/`
> 인간이 조형의 최종 경계와 배치 규칙을 완벽하게 정의하고, 엄격한 결정론적 분할 규칙 내에서 형태를 구현하는 단계입니다. 조형의 최종 경계와 배치는 규칙의 틀을 벗어나지 않습니다.
* **구현체:** 
  * 벽지군 (Wallpaper Groups)
  * 프리즈군 (Frieze Groups)
  * 만화경 대칭 (Kaleidoscope)
  * 이슬람 기하학 패턴 (Girih)
  * 왕타일 (Wang Tiles)
  * 트루셰 타일링 (Truchet Tiling)
  * 삼각분할 (Ear Clipping)
  * 트리맵 (Treemap)

### 2단계: 결정론적 시스템의 설계 (Deterministic System Design)
> **디렉토리:** `2-deterministic-system/`
> 최종 결과물의 외형을 직접 그리지 않고, 오직 ’재작성 규칙(Rewriting Rule)’과 수식만을 설계합니다. 수식이 실행되면 결과는 100% 결정론적으로 도출되지만, 그 생성 과정은 인간의 직접 통제를 벗어나 재귀적 루프에 의해 구축됩니다.
* **구현체:** 
  * 프랙탈 (Fractal - 코흐 눈송이, 시에르핀스키 등)
  * IFS (반복 함수계 - 나선, 시에르핀스키 카펫, 반슬리 고사리)
  * L-System (식물 성장 모델, 드래곤 곡선 등)
  * 형태 문법 (Shape Grammar)
  * 잎차례 (Phyllotaxis)

### 3단계: 제어된 무작위성의 도입 (Controlled Randomness)
> **디렉토리:** `3-controlled-randomness/`
> 완벽한 규칙 아래 자연스러운 우연성을 주입합니다. 인간은 공간 내 기준점(Seed)들의 분포 규칙(예: 무작위 분포, 푸아송 디스크 샘플링 등)을 제어하고, 알고리즘은 이 기준점들을 바탕으로 수학적 경계를 자동으로 도출해냅니다. 거시적인 제약 조건은 인간이 부여하되, 구체적인 픽셀이나 선의 방향 결정은 무작위적 분포와 노이즈 장(Field)에 위임합니다.
* **구현체:** 
  * 펄린 노이즈 (Perlin Noise)
  * 플로우필드 (Flow Field)
  * 컬 노이즈 (Curl Noise)
  * 푸아송 디스크 샘플링 (Poisson Disk Sampling)
  * 원 / 사각형 채우기 (Circle / Rectangle Packing)
  * 아폴로니안 가스켓 (Apollonian Gasket)
  * 보로노이 다이어그램 (Voronoi Diagram)
  * 델로네 삼각분할 (Delaunay Triangulation)

### 4단계: 자율적 창발과 시뮬레이션 (Autonomous Emergence)
> **디렉토리:** `4-autonomous-emergence/`
> 초기 상태와 상호작용을 제어하는 국소적 규칙(Local Rule)만 주어집니다. 거시적인 최종 패턴은 시스템 내부의 자율적인 상향식(Bottom-up) 시뮬레이션 과정을 거쳐 예측 불가능하게 ‘스스로 자라납니다’.
* **구현체:** 
  * 세포 자동자 (Cellular Automata - Rule 110, 생명 게임)
  * 반응확산 및 튜링 패턴 (Reaction-Diffusion)
  * 확산 제한 응집 (DLA - Laplacian Growth)
  * 점균류 시뮬레이션 (Physarum)
  * 공간 점유 알고리즘 (Space Colonization)
  * 차분 성장 (Differential Growth)
  * 랭턴의 개미 (Langton's Ant)

## 실행 방법

루트 디렉토리에 있는 `index.html` 파일을 웹 브라우저로 열면, 전체 알고리즘 목록을 한눈에 보고 각각의 구현 결과물을 클릭하여 실시간 렌더링으로 감상할 수 있습니다. 

```bash
# MacOS 터미널에서 여는 법
open index.html
```
