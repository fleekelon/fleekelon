import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runProfileCommand } from "../../src/cli/commands/profile.js";

describe("runProfileCommand write", () => {
  it("writes README.md from the catalog", async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), "fleekelon-profile-"));
    const contentRoot = path.join(cwd, "content");
    const articleDir = path.join(contentRoot, "articles", "demo");
    await mkdir(articleDir, { recursive: true });
    await writeFile(
      path.join(articleDir, "meta.json"),
      JSON.stringify({
        id: "demo",
        title: "Demo",
        summary: "A demo note for profile write",
        tags: ["demo"],
        body: "article.md",
      }),
    );
    await writeFile(
      path.join(articleDir, "article.md"),
      "# Demo\n\n".padEnd(220, "x"),
    );

    const result = await runProfileCommand("write", contentRoot, cwd);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const readme = await readFile(path.join(cwd, "README.md"), "utf8");
    expect(readme).toContain("# Frank Li");
    expect(readme).toContain("Demo");
    expect(readme).toContain("Toolkit in this repo");
  });
});
