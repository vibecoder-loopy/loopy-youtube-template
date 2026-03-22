export interface SrtEntry {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
}

function timeToMs(time: string): number {
  const [h, m, rest] = time.split(":");
  const [s, ms] = rest.split(",");
  return (
    parseInt(h) * 3600000 +
    parseInt(m) * 60000 +
    parseInt(s) * 1000 +
    parseInt(ms)
  );
}

export function parseSrt(content: string): SrtEntry[] {
  const entries: SrtEntry[] = [];
  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const index = parseInt(lines[0]);
    const timeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!timeMatch) continue;

    entries.push({
      index,
      startMs: timeToMs(timeMatch[1]),
      endMs: timeToMs(timeMatch[2]),
      text: lines.slice(2).join(" "),
    });
  }

  return entries;
}

export function formatEntriesForAi(entries: SrtEntry[]): string {
  return entries
    .map((e) => `[${e.index}] ${msToTime(e.startMs)}~${msToTime(e.endMs)} "${e.text}"`)
    .join("\n");
}

function msToTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function getTotalDurationSec(entries: SrtEntry[]): number {
  if (entries.length === 0) return 0;
  return entries[entries.length - 1].endMs / 1000;
}
