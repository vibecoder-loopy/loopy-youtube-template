# Loopy YouTube Template

바이브코더 루피 유튜브 채널에서 사용하는 **레트로 스타일 영상 비주얼 템플릿**입니다.

[Remotion](https://www.remotion.dev/) 기반으로, SRT 자막 파일을 넣으면 AI가 씬을 생성하고 자동으로 영상이 렌더링됩니다.

## 전체 흐름

```
녹음 파일 (.mp4/.wav)
  ↓  Whisper (STT)
SRT 자막 파일
  ↓  npm run generate
Claude Code(AI)가 씬 JSON 생성
  ↓  Zod 스키마 검증
Remotion 렌더링
  ↓
MP4 영상 출력
```

## 시작하기

### 1. 설치

```bash
git clone https://github.com/vibecoder-loopy/loopy-youtube-template.git
cd loopy-youtube-template
npm install
```

### 2. Claude Code 설치

이 템플릿은 로컬 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI를 사용합니다.
Claude Code 구독이 필요합니다 (Max 플랜 등).

```bash
npm install -g @anthropic-ai/claude-code
```

### 3. SRT 파일로 영상 생성

```bash
# SRT → AI 씬 생성 → 렌더링 (전체 파이프라인)
npm run generate your-script.srt

# 쇼츠 (세로 영상 1080x1920)
npm run generate your-script.srt -- --shorts

# JSON만 생성 (렌더링 건너뛰기)
npm run generate your-script.srt -- --json-only
```

### 4. 프리뷰

```bash
# Remotion Studio에서 미리보기
npm run preview
```

## SRT 파일 만드는 법

녹음 파일이 있다면 [OpenAI Whisper](https://github.com/openai/whisper)로 변환할 수 있습니다:

```bash
# 로컬 (무료)
pip install openai-whisper
whisper recording.mp4 --language ko --output_format srt

# OpenAI API (유료, 빠름)
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@recording.mp4" \
  -F model="whisper-1" \
  -F response_format="srt" \
  -F language="ko" \
  -o output.srt
```

## 14가지 씬 타입

| 씬 타입 | 용도 | 예시 |
|---|---|---|
| SectionTitle | 섹션 제목 | 챕터 구분, 소주제 전환 |
| IconTextCard | 아이콘 + 텍스트 카드 | 핵심 개념 1개 설명 |
| IconGrid | 아이콘 그리드 | 기술 스택, 도구 모음 |
| Timeline | 타임라인 | 연도별 변화, 발전 과정 |
| ProgressBar | 프로그레스 바 (ASCII) | 퍼센트 수치 비교 |
| FeatureList | 기능 목록 | 장점 나열, 체크리스트 |
| Comparison | A vs B 비교 | 두 기술/개념 대조 |
| BarChart | 막대 차트 | 통계, 수치 비교 |
| DonutChart | 도넛 차트 | 비율 표시 (점유율 등) |
| FlowDiagram | 플로우 다이어그램 | 절차, 파이프라인 설명 |
| BigNumber | 숫자 강조 | 핵심 통계 하나 부각 |
| BranchDiagram | 방사형 다이어그램 | 중심 개념에서 파생 |
| Mapping | 매핑 관계 | A→B 관계 시각화 |
| GifScene | 이미지/영상 삽입 | 리액션, 화면 캡처 |

## 사용 가능한 아이콘

`star`, `check`, `arrow`, `heart`, `lightning`, `shield`, `globe`, `chart`, `user`, `code`, `lock`, `money`, `rocket`, `settings`, `warning`, `info`, `search`, `cloud`, `database`, `cpu`

**로고 아이콘**: `logo:claude`, `logo:openai`, `logo:gemini`, `logo:codex`

## 컬러 토큰

`white`, `yellow`, `green`, `red`, `gray`

## 프로젝트 구조

```
├── orchestrator/
│   ├── index.ts              # 메인 파이프라인 (SRT → AI → 렌더링)
│   ├── srt-parser.ts         # SRT 파싱
│   ├── agent.ts              # Claude Code CLI 호출
│   ├── prompts/system.ts     # AI 시스템 프롬프트
│   ├── validator.ts          # JSON 검증 + 템포 정규화
│   └── renderer.ts           # Remotion 렌더링
├── src/
│   ├── index.ts              # Remotion 진입점
│   ├── Root.tsx              # 컴포지션 정의 + 샘플 데이터
│   ├── Video.tsx             # 씬 시퀀서
│   ├── types/schema.ts       # 씬 타입 스키마 (Zod)
│   ├── components/
│   │   ├── SceneRouter.tsx   # 씬 타입별 라우팅
│   │   ├── scenes/           # 14개 씬 컴포넌트
│   │   └── shared/           # 공통 래퍼 (레트로 배경, 타자기 효과)
│   └── lib/
│       ├── colors.ts         # 컬러 팔레트
│       ├── fonts.ts          # 네오둥근모 폰트
│       ├── icons.ts          # SVG 아이콘
│       ├── animations.ts     # 애니메이션 유틸
│       ├── retro.ts          # CRT/글리치 이펙트
│       └── visualFrames.ts   # 프레임 계산
├── public/                   # 정적 에셋
└── output/                   # 생성된 JSON/MP4
```

## Claude Code로 커스터마이징하기

이 템플릿을 클론한 뒤, Claude Code를 열어서 자연어로 수정을 요청할 수 있습니다.

```bash
cd loopy-youtube-template
claude
```

### 스타일 커스터마이징 예시

```
# 컬러 팔레트 변경
"배경색을 다크 네이비로 바꾸고, 핑크 계열 색상을 블루 네온으로 변경해줘"

# 폰트 변경
"네오둥근모 대신 Pretendard 폰트로 바꿔줘"

# 레트로 효과 조절
"CRT 스캔라인 효과를 없애고 좀 더 모던한 느낌으로 만들어줘"
"글리치 효과를 더 강하게 해줘"
```

### 새 씬 타입 추가 예시

```
# 새로운 씬 타입 만들기
"WordCloud 타입을 추가해줘. 단어들이 크기가 다르게 랜덤 배치되는 씬이야"

# 기존 씬 수정
"BarChart에 애니메이션 속도를 더 빠르게 하고, 바 색상에 그라데이션 넣어줘"
```

### AI 프롬프트 튜닝 예시

```
# 씬 생성 스타일 조절
"orchestrator/prompts/system.ts에서 SectionTitle을 더 자주 쓰도록 프롬프트 수정해줘"

# 새 씬 타입을 프롬프트에 반영
"WordCloud 타입을 추가했으니까 시스템 프롬프트에도 추가해줘"
```

### 커스터마이징 팁

- **색상**: `src/lib/colors.ts`의 팔레트를 바꾸면 전체 톤이 바뀝니다
- **폰트**: `src/lib/fonts.ts`에서 CDN URL과 font-family를 교체하세요
- **애니메이션**: `src/lib/animations.ts`와 `src/lib/retro.ts`에서 효과를 조절합니다
- **새 씬 추가 시**: `src/types/schema.ts`에 타입 정의 → `src/components/scenes/`에 컴포넌트 → `SceneRouter.tsx`에 라우팅 추가 → `orchestrator/prompts/system.ts`에 프롬프트 반영

## 기술 스택

- [Remotion](https://www.remotion.dev/) v4.0.261 — React 기반 영상 렌더링
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — AI 씬 생성 (로컬 CLI)
- TypeScript + Zod — 타입 안전한 스키마 검증
- 네오둥근모 — 레트로 한글 픽셀 폰트

## 라이선스

MIT
