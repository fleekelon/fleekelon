import { readTextFile } from "../lib/fs.js";
import type { ContentItem, ContentSearchHit } from "./types.js";

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,/|;]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function scoreField(haystack: string, token: string): number {
  const lower = haystack.toLowerCase();
  if (!lower.includes(token)) {
    return 0;
  }
  if (lower === token) {
    return 8;
  }
  if (lower.startsWith(token)) {
    return 5;
  }
  return 2;
}

export async function searchContent(
  items: ContentItem[],
  query: string,
  options: { includeBody?: boolean; limit?: number } = {},
): Promise<ContentSearchHit[]> {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [];
  }

  const includeBody = options.includeBody ?? true;
  const limit = options.limit ?? 20;
  const hits: ContentSearchHit[] = [];

  for (const item of items) {
    let score = 0;
    const matchedIn = new Set<ContentSearchHit["matchedIn"][number]>();

    for (const token of tokens) {
      const idScore = scoreField(item.id, token);
      if (idScore > 0) {
        score += idScore * 3;
        matchedIn.add("id");
      }

      const titleScore = scoreField(item.title, token);
      if (titleScore > 0) {
        score += titleScore * 4;
        matchedIn.add("title");
      }

      const summaryScore = scoreField(item.summary, token);
      if (summaryScore > 0) {
        score += summaryScore * 2;
        matchedIn.add("summary");
      }

      for (const tag of item.tags) {
        const tagScore = scoreField(tag, token);
        if (tagScore > 0) {
          score += tagScore * 3;
          matchedIn.add("tags");
        }
      }
    }

    if (includeBody) {
      const body = await readTextFile(item.path);
      for (const token of tokens) {
        const bodyScore = scoreField(body.slice(0, 20_000), token);
        if (bodyScore > 0) {
          score += bodyScore;
          matchedIn.add("body");
        }
      }
    }

    if (score > 0) {
      hits.push({
        item,
        score,
        matchedIn: [...matchedIn],
      });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  return hits.slice(0, limit);
}

export function formatSearchHits(hits: ContentSearchHit[]): string {
  if (hits.length === 0) {
    return "no matches\n";
  }

  const lines = hits.map(
    (hit) =>
      `${hit.score}\t${hit.item.id}\t${hit.item.kind}\t${hit.item.title}\t${hit.matchedIn.join(",")}`,
  );
  return `${lines.join("\n")}\n`;
}
