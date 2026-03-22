import type { ColorToken } from "../types/schema";

// 레트로 핑크 팔레트 (로고 기반)
export const palette = {
  bg: "#1A1020",           // 다크 퍼플 배경
  bgLight: "#2A1830",      // 밝은 다크 퍼플
  bgCard: "rgba(244,160,160,0.08)", // 카드 배경
  pink: "#F4A0A0",         // 메인 핑크
  pinkBright: "#FF8DA1",   // 밝은 핑크
  pinkDark: "#C85070",     // 진한 핑크
  cream: "#FDE8E0",        // 크림 핑크
  accent: "#FFD700",       // 골드 액센트
  cyan: "#67E8F9",         // 사이버펑크 시안 (차트 강조)
  text: "#FDE8E0",         // 기본 텍스트 (크림)
  textDim: "#B8A0B0",      // 흐린 텍스트
  black: "#1A1A1A",        // 블랙
  grid: "rgba(244,160,160,0.06)", // 그리드 라인
  scanline: "rgba(0,0,0,0.15)",   // 스캔라인
};

const colorMap: Record<ColorToken, string> = {
  white: "#E8E0F0",       // 라벤더 화이트 (핑크 배경에 부드럽게 어울림)
  yellow: "#FFEAA7",      // 부드러운 크림 옐로우 (눈 안 아픔)
  green: "#67E8F9",       // 사이버펑크 시안 (핑크와 쿨톤 보색)
  red: "#FF8A8A",         // 소프트 코랄 (핑크와 톤 통일)
  gray: "#9B8FA8",        // 웜 라벤더 그레이
};

export function resolveColor(token: ColorToken): string {
  return colorMap[token];
}
