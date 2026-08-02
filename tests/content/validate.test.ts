import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateContent } from "../../src/content/validate.js";

describe("validateContent", () => {
  it("accepts a well-formed article", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-validate-"));
    const articleDir = path.join(root, "articles", "ok");
    await mkdir(articleDir, { recursive: true });
    await writeFile(
      path.join(articleDir, "meta.json"),
      JSON.stringify({
        id: "ok",
        title: "OK",
        summary: "long enough summary",
        tags: ["ok"],
        body: "article.md",
      }),
    );
    await writeFile(
      path.join(articleDir, "article.md"),
      `${"# OK"}\n\n${"word ".repeat(80)}\n`,
    );

    const report = await validateContent(root);
    expect(report.ok).toBe(true);
    expect(report.items).toHaveLength(1);
  });

  it("fails when body is too short", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-validate-"));
    const articleDir = path.join(root, "articles", "short");
    await mkdir(articleDir, { recursive: true });
    await writeFile(
      path.join(articleDir, "meta.json"),
      JSON.stringify({
        id: "short",
        title: "Short",
        summary: "summary",
        tags: ["x"],
        body: "article.md",
      }),
    );
    await writeFile(path.join(articleDir, "article.md"), "# Short\n\nhi\n");

    const report = await validateContent(root);
    expect(report.ok).toBe(false);
    expect(report.issues.some((issue) => issue.level === "error")).toBe(true);
  });
});
