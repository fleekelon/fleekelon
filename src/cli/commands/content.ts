import {
  filterContentByKind,
  filterContentByTag,
  loadContentCatalog,
} from "../../content/catalog.js";
import { renderContentDigest } from "../../content/digest.js";
import { formatSearchHits, searchContent } from "../../content/search.js";
import {
  computeContentStats,
  formatContentStats,
  formatTagIndex,
} from "../../content/stats.js";
import type { ContentItem, ContentKind } from "../../content/types.js";
import {
  formatValidationReport,
  validateContent,
} from "../../content/validate.js";
import { err, ok, type Result } from "../../lib/result.js";

const KIND_VALUES = new Set<ContentKind>([
  "article",
  "note",
  "thesis",
  "chat-export",
]);

function parseKind(value: unknown): ContentKind | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  return KIND_VALUES.has(value as ContentKind)
    ? (value as ContentKind)
    : undefined;
}

function formatList(items: ContentItem[]): string {
  if (items.length === 0) {
    return "no content items found\n";
  }

  const lines = items.map(
    (item) => `${item.id}\t${item.kind}\t${item.title}\t${item.tags.join(",")}`,
  );
  return `${lines.join("\n")}\n`;
}

export type ContentCommandFlags = Record<string, string | boolean>;

export async function runContentCommand(
  subcommand: string | undefined,
  contentRoot: string,
  positionals: string[] = [],
  flags: ContentCommandFlags = {},
): Promise<Result<string, string>> {
  switch (subcommand) {
    case undefined:
    case "list": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }

      const kind = parseKind(flags.kind);
      if (flags.kind !== undefined && !kind) {
        return err(
          `unknown kind: ${String(flags.kind)} (expected article|note|thesis|chat-export)`,
        );
      }

      const tag =
        typeof flags.tag === "string" && flags.tag.trim()
          ? flags.tag.trim()
          : undefined;

      let items = catalog.value;
      items = filterContentByKind(items, kind);
      items = filterContentByTag(items, tag);
      return ok(formatList(items));
    }

    case "validate": {
      const report = await validateContent(contentRoot);
      const text = formatValidationReport(report);
      return report.ok ? ok(text) : err(text);
    }

    case "search": {
      const query = positionals.join(" ");
      if (!query.trim()) {
        return err("usage: content search <query>");
      }

      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }

      const includeBody = flags["titles-only"] !== true;
      const hits = await searchContent(catalog.value, query, { includeBody });
      return ok(formatSearchHits(hits));
    }

    case "tags": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }
      return ok(formatTagIndex(computeContentStats(catalog.value)));
    }

    case "stats": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }
      return ok(formatContentStats(computeContentStats(catalog.value)));
    }

    case "digest": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }
      const digest = renderContentDigest(catalog.value);
      return ok(digest.endsWith("\n") ? digest : `${digest}\n`);
    }

    default:
      return err(`unknown content subcommand: ${subcommand}`);
  }
}
