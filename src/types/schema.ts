import { z } from "zod";

export const ColorToken = z.enum(["white", "yellow", "green", "red", "gray"]);
export type ColorToken = z.infer<typeof ColorToken>;

export const TransitionType = z.enum(["fade", "cut"]);
export type TransitionType = z.infer<typeof TransitionType>;

export const MediaFit = z.enum(["cover", "contain"]);
export type MediaFit = z.infer<typeof MediaFit>;

// --- 각 장면 data 스키마 ---

const IconGridItem = z.object({
  icon: z.string(),
  label: z.string(),
  color: ColorToken.default("white"),
});

const IconGridData = z.object({
  title: z.string(),
  items: z.array(IconGridItem).min(2).max(8),
});

const TimelineEntry = z.object({
  year: z.string(),
  label: z.string(),
  color: ColorToken.default("yellow"),
});

const TimelineData = z.object({
  title: z.string(),
  entries: z.array(TimelineEntry).min(2).max(8),
});

const MappingItem = z.object({
  from: z.string(),
  to: z.array(z.string()).min(1).max(4),
});

const MappingData = z.object({
  title: z.string(),
  items: z.array(MappingItem).min(1).max(4),
});

const BranchItem = z.object({
  label: z.string(),
  color: ColorToken.default("white"),
});

const BranchDiagramData = z.object({
  title: z.string(),
  center: z.string(),
  branches: z.array(BranchItem).min(2).max(6),
});

const IconTextCardData = z.object({
  icon: z.string(),
  heading: z.string(),
  body: z.string(),
  color: ColorToken.default("yellow"),
});

const SectionTitleData = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
});

const ProgressBarItem = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  color: ColorToken.default("green"),
});

const ProgressBarData = z.object({
  title: z.string(),
  bars: z.array(ProgressBarItem).min(1).max(6),
});

const FeatureItem = z.object({
  text: z.string(),
  badge: z.string().optional(),
  color: ColorToken.default("white"),
});

const FeatureListData = z.object({
  title: z.string(),
  items: z.array(FeatureItem).min(1).max(8),
});

const ComparisonSide = z.object({
  heading: z.string(),
  points: z.array(z.string()).min(1).max(5),
  color: ColorToken.default("white"),
});

const ComparisonData = z.object({
  title: z.string(),
  left: ComparisonSide,
  right: ComparisonSide,
});

// --- BarChart: 애니메이션 바 차트 (VS 비교 모드 지원) ---
const BarChartBar = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  color: ColorToken.default("green"),
});

const BarChartGroup = z.object({
  heading: z.string(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  bars: z.array(BarChartBar).min(1).max(8),
  color: ColorToken.default("green"),
});

const BarChartData = z.object({
  title: z.string(),
  left: BarChartGroup,
  right: BarChartGroup.optional(),
});

// --- DonutChart: 원형 진행률 차트 ---
const DonutChartData = z.object({
  title: z.string(),
  value: z.number().min(0).max(100),
  label: z.string(),
  color: ColorToken.default("green"),
  items: z.array(z.object({
    text: z.string(),
    icon: z.string().optional(),
    positive: z.boolean().default(true),
  })).optional(),
});

// --- FlowDiagram: 터미널 스타일 파이프라인 (A → B → C) ---
const FlowStep = z.object({
  icon: z.string().optional(),
  label: z.string(),
  sub: z.string().optional(),
  color: ColorToken.default("green"),
});

const FlowDiagramData = z.object({
  title: z.string(),
  steps: z.array(FlowStep).min(2).max(6),
});

// --- BigNumber: 숫자 하나를 크게 강조 ---
const BigNumberData = z.object({
  title: z.string(),
  number: z.string(),
  unit: z.string().optional(),
  subtitle: z.string().optional(),
  color: ColorToken.default("green"),
});

const GifSceneData = z.object({
  src: z.string().optional(),
  stillSrc: z.string().optional(),
  query: z.string().min(1),
  caption: z.string().max(80).optional(),
  subcaption: z.string().max(140).optional(),
  credit: z.string().max(80).optional(),
  fit: MediaFit.default("cover"),
  darken: z.number().min(0).max(1).default(0.28),
  overlay: z.enum(["none", "caption", "title-card"]).default("caption"),
});

// --- Discriminated union ---

const IconGridScene = z.object({
  id: z.string(),
  type: z.literal("IconGrid"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: IconGridData,
});

const TimelineScene = z.object({
  id: z.string(),
  type: z.literal("Timeline"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: TimelineData,
});

const MappingScene = z.object({
  id: z.string(),
  type: z.literal("Mapping"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: MappingData,
});

const BranchDiagramScene = z.object({
  id: z.string(),
  type: z.literal("BranchDiagram"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: BranchDiagramData,
});

const IconTextCardScene = z.object({
  id: z.string(),
  type: z.literal("IconTextCard"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: IconTextCardData,
});

const SectionTitleScene = z.object({
  id: z.string(),
  type: z.literal("SectionTitle"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: SectionTitleData,
});

const ProgressBarScene = z.object({
  id: z.string(),
  type: z.literal("ProgressBar"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: ProgressBarData,
});

const FeatureListScene = z.object({
  id: z.string(),
  type: z.literal("FeatureList"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: FeatureListData,
});

const ComparisonScene = z.object({
  id: z.string(),
  type: z.literal("Comparison"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: ComparisonData,
});

const BarChartScene = z.object({
  id: z.string(),
  type: z.literal("BarChart"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: BarChartData,
});

const DonutChartScene = z.object({
  id: z.string(),
  type: z.literal("DonutChart"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: DonutChartData,
});

const FlowDiagramScene = z.object({
  id: z.string(),
  type: z.literal("FlowDiagram"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: FlowDiagramData,
});

const BigNumberScene = z.object({
  id: z.string(),
  type: z.literal("BigNumber"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("fade"),
  data: BigNumberData,
});

const GifScene = z.object({
  id: z.string(),
  type: z.literal("GifScene"),
  durationInSeconds: z.number().min(2).max(120),
  transition: TransitionType.default("cut"),
  data: GifSceneData,
});

export const SceneSchema = z.discriminatedUnion("type", [
  IconGridScene,
  TimelineScene,
  MappingScene,
  BranchDiagramScene,
  IconTextCardScene,
  SectionTitleScene,
  ProgressBarScene,
  FeatureListScene,
  ComparisonScene,
  BarChartScene,
  DonutChartScene,
  FlowDiagramScene,
  BigNumberScene,
  GifScene,
]);

export type Scene = z.infer<typeof SceneSchema>;

export const VideoSchema = z.object({
  title: z.string(),
  fps: z.literal(30).default(30),
  scenes: z.array(SceneSchema).min(1),
});

export type VideoData = z.infer<typeof VideoSchema>;
