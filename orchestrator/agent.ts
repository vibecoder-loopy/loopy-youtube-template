import { spawn } from "child_process";
import { getSrtSystemPrompt } from "./prompts/system";

function parseArgsFromEnv(): string[] {
  const jsonArgs = process.env.AI_CLI_ARGS_JSON;
  if (jsonArgs) {
    try {
      const parsed = JSON.parse(jsonArgs);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        return parsed;
      }
      throw new Error("AI_CLI_ARGS_JSON must be a JSON string array");
    } catch (err) {
      throw new Error(
        `AI_CLI_ARGS_JSON 파싱 실패: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const rawArgs = process.env.AI_CLI_ARGS;
  if (!rawArgs) return ["-p", "--output-format", "text"];
  return rawArgs.split(/\s+/).filter(Boolean);
}

function getCliConfig(): { command: string; args: string[]; env: NodeJS.ProcessEnv } {
  const command = process.env.AI_CLI_COMMAND ?? "claude";
  const args = parseArgsFromEnv();
  const env = { ...process.env };

  // Claude CLI 실행 시 Codex 환경변수 충돌 방지
  if (command === "claude") {
    delete env.CLAUDECODE;
  }

  return { command, args, env };
}

function runAiCli(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { command, args, env } = getCliConfig();

    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("error", (err) => {
      reject(new Error(`${command} CLI 실행 실패: ${err.message}`));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} CLI 종료 코드 ${code}\n${stderr}`));
        return;
      }
      resolve(stdout.trim());
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

export async function generateFromSrt(srtFormatted: string): Promise<string> {
  const systemPrompt = getSrtSystemPrompt();
  const prompt = `${systemPrompt}\n\n---\n\n아래 SRT 자막 데이터를 분석하여 비주얼 장면 JSON을 생성해주세요. JSON만 출력하세요.\n\n${srtFormatted}`;

  return runAiCli(prompt);
}

export async function regenerateWithFeedback(
  srtFormatted: string,
  previousJson: string,
  errors: string
): Promise<string> {
  const systemPrompt = getSrtSystemPrompt();
  const prompt = `${systemPrompt}\n\n---\n\n아래 JSON에 검증 오류가 있습니다. 오류를 수정하여 올바른 JSON을 다시 생성해주세요. JSON만 출력하세요.\n\nSRT 자막:\n${srtFormatted}\n\n이전 JSON:\n${previousJson}\n\n오류:\n${errors}`;

  return runAiCli(prompt);
}
