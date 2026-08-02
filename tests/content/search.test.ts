import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContentCatalog } from "../../src/content/catalog.js";
import { searchContent } from "../../src/content/search.js";

async function makeCatalog(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-search-"));
  const articleDir = path.join(root, "articles", "bottleneck");
  await mkdir(articleDir, { recursive: true });
  await writeFile(
    path.join(articleDir, "meta.json"),
    JSON.stringify({
      id: "bottleneck",
      title: "AI bottleneck map",
      summary: "Where profits migrate next",
      tags: ["ai", "investing"],
      body: "article.md",
    }),
  );
  await writeFile(
    path.join(articleDir, "article.md"),
    "# AI bottleneck map\n\nPower transformers are the scarce asset.\n",
  );
  return root;
}

describe("searchContent", () => {
  it("ranks title and body matches", async () => {
    const root = await makeCatalog();
    const catalog = await loadContentCatalog(root);
    expect(catalog.ok).toBe(true);
    if (!catalog.ok) {
      return;
    }

    const hits = await searchContent(catalog.value, "transformer power");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.item.id).toBe("bottleneck");
    expect(hits[0]?.matchedIn).toContain("body");
  });
});
