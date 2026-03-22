# Loopy YouTube Template

바이브코더 루피 유튜브 채널에서 사용하는 **레트로 스타일 영상 비주얼 템플릿**입니다.

[Remotion](https://www.remotion.dev/) 기반으로, SRT 자막 파일을 넣으면 AI가 씬을 생성하고 자동으로 영상이 렌더링됩니다.

## 전체 흐름

```
SRT 자막 파일 → Claude Code(AI)가 씬 JSON 생성 → Remotion 렌더링 → MP4 영상
```

## 시작하기

### 1. 설치

```bash
git clone https://github.com/vibecoder-loopy/loopy-youtube-template.git
cd loopy-youtube-template
npm install
```

### 2. Claude Code 설치

이 템플릿은 로컬 Claude Code CLI를 사용합니다. [Claude Code](https://docs.anthropic.com/en/docs/claude-code)를 설치하세요:

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

| 씬 타입 | 용도 |
|---|---|
| SectionTitle | 섹션 제목 |
| IconTextCard | 아이콘 + 텍스트 카드 |
| IconGrid | 아이콘 그리드 |
| Timeline | 타임라인 |
| ProgressBar | 프로그레스 바 (ASCII) |
| FeatureList | 기능 목록 |
| Comparison | A vs B 비교 |
| BarChart | 막대 차트 |
| DonutChart | 도넛 차트 |
| FlowDiagram | 플로우 다이어그램 |
| BigNumber | 숫자 강조 |
| BranchDiagram | 방사형 다이어그램 |
| Mapping | 매핑 관계 |
| GifScene | 이미지/영상 삽입 |

## 사용 가능한 아이콘

`star`, `check`, `arrow`, `heart`, `lightning`, `shield`, `globe`, `chart`, `user`, `code`, `lock`, `money`, `rocket`, `settings`, `warning`, `info`, `search`, `cloud`, `database`, `cpu`

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
│   ├── Root.tsx              # 컴포지션 정의
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

## 기술 스택

- [Remotion](https://www.remotion.dev/) v4.0.261 — React 기반 영상 렌더링
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — AI 씬 생성 (로컬 CLI)
- TypeScript + Zod — 타입 안전한 스키마 검증
- 네오둥근모 — 레트로 한글 픽셀 폰트

## 라이선스

MIT
