import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadContentCatalog } from "../../src/content/catalog.js";

const tempDirs: string[] = [];

afterEach(() => {
  // temp dirs are left for OS cleanup; track for clarity in failures
  tempDirs.length = 0;
});

async function makeContentRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-content-"));
  tempDirs.push(root);
  return root;
}

describe("loadContentCatalog", () => {
  it("loads article metadata and body paths", async () => {
    const root = await makeContentRoot();
    const articleDir = path.join(root, "articles", "demo");
    await mkdir(articleDir, { recursive: true });
    await writeFile(
      path.join(articleDir, "meta.json"),
      JSON.stringify({
        id: "demo",
        title: "Demo",
        summary: "A demo note",
        tags: ["demo"],
        body: "article.md",
      }),
    );
    await writeFile(
      path.join(articleDir, "article.md"),
      "# Demo\n\nhello world\n",
    );

    const result = await loadContentCatalog(root);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value).toHaveLength(1);
    expect(result.value[0]).toMatchObject({
      id: "demo",
      kind: "article",
      title: "Demo",
      hasPdf: false,
    });
  });

  it("collects metadata errors", async () => {
    const root = await makeContentRoot();
    const articleDir = path.join(root, "articles", "broken");
    await mkdir(articleDir, { recursive: true });
    await writeFile(path.join(articleDir, "meta.json"), "{not-json");

    const result = await loadContentCatalog(root);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error[0]).toContain("invalid meta.json");
  });
});
