import type { ContentItem, ContentKind, ContentStats } from "./types.js";

const EMPTY_BY_KIND: Record<ContentKind, number> = {
  article: 0,
  note: 0,
  thesis: 0,
  "chat-export": 0,
};

export function computeContentStats(items: ContentItem[]): ContentStats {
  const byKind: Record<ContentKind, number> = { ...EMPTY_BY_KIND };
  const tagCounts = new Map<string, number>();
  let withPdf = 0;

  for (const item of items) {
    byKind[item.kind] += 1;
    if (item.hasPdf) {
      withPdf += 1;
    }
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const tags = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return {
    total: items.length,
    byKind,
    tags,
    withPdf,
  };
}

export function formatContentStats(stats: ContentStats): string {
  const lines = [
    `total: ${stats.total}`,
    `with-pdf: ${stats.withPdf}`,
    "",
    "by-kind:",
    ...Object.entries(stats.byKind).map(
      ([kind, count]) => `- ${kind}: ${count}`,
    ),
    "",
    "tags:",
  ];

  if (stats.tags.length === 0) {
    lines.push("- (none)");
  } else {
    for (const entry of stats.tags) {
      lines.push(`- ${entry.tag}: ${entry.count}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function formatTagIndex(stats: ContentStats): string {
  if (stats.tags.length === 0) {
    return "no tags\n";
  }

  return `${stats.tags.map((entry) => `${entry.tag}\t${entry.count}`).join("\n")}\n`;
}
