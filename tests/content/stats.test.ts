import { describe, expect, it } from "vitest";
import { computeContentStats } from "../../src/content/stats.js";
import type { ContentItem } from "../../src/content/types.js";

const sample: ContentItem[] = [
  {
    id: "a",
    kind: "article",
    title: "A",
    path: "a.md",
    summary: "s",
    tags: ["ai", "investing"],
    hasPdf: true,
  },
  {
    id: "b",
    kind: "note",
    title: "B",
    path: "b.md",
    summary: "s",
    tags: ["ai"],
    hasPdf: false,
  },
];

describe("computeContentStats", () => {
  it("aggregates kinds and tags", () => {
    const stats = computeContentStats(sample);
    expect(stats.total).toBe(2);
    expect(stats.byKind.article).toBe(1);
    expect(stats.byKind.note).toBe(1);
    expect(stats.withPdf).toBe(1);
    expect(stats.tags[0]).toEqual({ tag: "ai", count: 2 });
  });
});
