import path from "node:path";
import { loadContentCatalog } from "../content/catalog.js";
import type { ContentItem, ContentKind } from "../content/types.js";
import { pathExists, readTextFile, writeTextFile } from "../lib/fs.js";
import { err, ok, type Result } from "../lib/result.js";
import { defaultProfileInput } from "../profile/render.js";
import { markdownToHtml } from "./markdown.js";
import { renderArticlePage, renderHomePage, siteAssets } from "./templates.js";

export type SiteBuildReport = {
  outputDir: string;
  pages: string[];
};

function kindLabel(kind: ContentKind): string {
  switch (kind) {
    case "article":
      return "Article";
    case "note":
      return "Note";
    case "thesis":
      return "Thesis";
    case "chat-export":
      return "Archive";
    default:
      return kind;
  }
}

function pageFileName(item: ContentItem): string {
  return `${item.id}.html`;
}

export async function buildPersonalSite(
  contentRoot: string,
  outputDir: string,
): Promise<Result<SiteBuildReport, string>> {
  const catalog = await loadContentCatalog(contentRoot);
  if (!catalog.ok) {
    return err(catalog.error.join("\n"));
  }

  if (!(await pathExists(contentRoot))) {
    return err(`content root not found: ${contentRoot}`);
  }

  const pages: string[] = [];
  const entries = [];

  for (const item of catalog.value) {
    const body = await readTextFile(item.path);
    const htmlBody = markdownToHtml(body);
    const fileName = pageFileName(item);
    const page = renderArticlePage({
      title: item.title,
      kindLabel: kindLabel(item.kind),
      summary: item.summary,
      tags: item.tags,
      bodyHtml: htmlBody,
      sourcePath: item.path.replace(/\\/g, "/"),
    });
    const target = path.join(outputDir, fileName);
    await writeTextFile(target, page);
    pages.push(fileName);
    entries.push({
      id: item.id,
      title: item.title,
      kind: item.kind,
      kindLabel: kindLabel(item.kind),
      summary: item.summary,
      tags: item.tags,
      href: fileName,
    });
  }

  const home = renderHomePage({
    name: defaultProfileInput.name,
    tagline: defaultProfileInput.tagline,
    location: defaultProfileInput.location,
    highlights: [...defaultProfileInput.highlights],
    links: [...defaultProfileInput.links],
    entries,
  });
  await writeTextFile(path.join(outputDir, "index.html"), home);
  pages.unshift("index.html");

  for (const [fileName, contents] of Object.entries(siteAssets)) {
    await writeTextFile(path.join(outputDir, fileName), contents);
    pages.push(fileName);
  }

  return ok({ outputDir, pages });
}

export function formatSiteBuildReport(report: SiteBuildReport): string {
  return [
    `site built: ${report.outputDir}`,
    `pages: ${report.pages.length}`,
    ...report.pages.map((page) => `- ${page}`),
    "",
  ].join("\n");
}
