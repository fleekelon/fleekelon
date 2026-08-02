import { readTextFile } from "../lib/fs.js";
import { loadContentCatalog } from "./catalog.js";
import type { ContentIssue, ContentValidationReport } from "./types.js";

const MIN_BODY_CHARS: Record<string, number> = {
  article: 200,
  note: 200,
  thesis: 200,
  "chat-export": 200,
};

export async function validateContent(
  contentRoot: string,
): Promise<ContentValidationReport> {
  const issues: ContentIssue[] = [];
  const catalog = await loadContentCatalog(contentRoot);

  if (!catalog.ok) {
    for (const message of catalog.error) {
      issues.push({ id: "catalog", level: "error", message });
    }

    return { items: [], issues, ok: false };
  }

  for (const item of catalog.value) {
    if (item.tags.length === 0) {
      issues.push({
        id: item.id,
        level: "warning",
        message: "no tags defined",
      });
    }

    const body = await readTextFile(item.path);
    const minChars = MIN_BODY_CHARS[item.kind] ?? 200;
    if (body.trim().length < minChars) {
      issues.push({
        id: item.id,
        level: "error",
        message: `body shorter than ${minChars} characters`,
      });
    }

    if (!body.trimStart().startsWith("#")) {
      issues.push({
        id: item.id,
        level: "warning",
        message: "body does not start with a markdown heading",
      });
    }

    if (item.kind === "article" && !item.hasPdf) {
      issues.push({
        id: item.id,
        level: "warning",
        message: "article has no PDF companion",
      });
    }
  }

  const hasErrors = issues.some((issue) => issue.level === "error");
  return {
    items: catalog.value,
    issues,
    ok: !hasErrors,
  };
}

export function formatValidationReport(
  report: ContentValidationReport,
): string {
  const lines = [
    `content items: ${report.items.length}`,
    `issues: ${report.issues.length}`,
    `status: ${report.ok ? "ok" : "failed"}`,
  ];

  if (report.items.length > 0) {
    lines.push("", "items:");
    for (const item of report.items) {
      lines.push(
        `- [${item.kind}] ${item.id} — ${item.title}${item.hasPdf ? " (pdf)" : ""}`,
      );
    }
  }

  if (report.issues.length > 0) {
    lines.push("", "issues:");
    for (const issue of report.issues) {
      lines.push(`- (${issue.level}) ${issue.id}: ${issue.message}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
