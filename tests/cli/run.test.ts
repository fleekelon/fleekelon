import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.js";
import { runCli } from "../../src/cli/run.js";

describe("runCli", () => {
  it("prints help", async () => {
    const lines: string[] = [];
    const code = await runCli(["help"], loadConfig({}), {
      log: (message) => {
        lines.push(message);
      },
      error: () => undefined,
    });

    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("personal engineering toolkit");
  });

  it("lists repository content", async () => {
    const lines: string[] = [];
    const code = await runCli(["content", "list"], loadConfig({}), {
      log: (message) => {
        lines.push(message);
      },
      error: () => undefined,
    });

    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("ai-execution-vs-judgment");
  });

  it("validates repository content", async () => {
    const lines: string[] = [];
    const errors: string[] = [];
    const code = await runCli(["content", "validate"], loadConfig({}), {
      log: (message) => {
        lines.push(message);
      },
      error: (message) => {
        errors.push(message);
      },
    });

    expect(code).toBe(0);
    expect([...lines, ...errors].join("\n")).toContain("status: ok");
  });

  it("runs doctor successfully in this repo", async () => {
    const lines: string[] = [];
    const code = await runCli(["doctor"], loadConfig({}), {
      log: (message) => {
        lines.push(message);
      },
      error: () => undefined,
    });

    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("all checks passed");
  });

  it("renders the profile README", async () => {
    const lines: string[] = [];
    const code = await runCli(["profile", "render"], loadConfig({}), {
      log: (message) => {
        lines.push(message);
      },
      error: () => undefined,
    });

    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("# Frank Li");
    expect(lines.join("\n")).toContain("ai-execution-vs-judgment");
  });
});
