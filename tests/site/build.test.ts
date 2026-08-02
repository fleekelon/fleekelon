import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildPersonalSite } from "../../src/site/build.js";

describe("buildPersonalSite", () => {
  it("generates home and article pages", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-site-"));
    const contentRoot = path.join(root, "content");
    const outputDir = path.join(root, "sites", "fleekelon");
    const articleDir = path.join(contentRoot, "articles", "demo");
    await mkdir(articleDir, { recursive: true });
    await writeFile(
      path.join(articleDir, "meta.json"),
      JSON.stringify({
        id: "demo",
        title: "Demo Piece",
        summary: "Site build demo summary",
        tags: ["demo"],
        body: "article.md",
      }),
    );
    await writeFile(
      path.join(articleDir, "article.md"),
      "# Demo Piece\n\nBody for the site builder.\n",
    );

    const result = await buildPersonalSite(contentRoot, outputDir);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const home = await readFile(path.join(outputDir, "index.html"), "utf8");
    const page = await readFile(path.join(outputDir, "demo.html"), "utf8");
    expect(home).toContain("fleekelon");
    expect(home).toContain("Demo Piece");
    expect(page).toContain("Demo Piece");
    expect(page).toContain("Body for the site builder");
  });
});
