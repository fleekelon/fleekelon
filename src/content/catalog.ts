import path from "node:path";
import { listDirectories, pathExists, readTextFile } from "../lib/fs.js";
import { err, ok, type Result } from "../lib/result.js";
import type { ContentItem, ContentKind } from "./types.js";

type RawMeta = {
  id?: unknown;
  title?: unknown;
  summary?: unknown;
  tags?: unknown;
  body?: unknown;
  pdf?: unknown;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadItemFromDir(
  dir: string,
  kind: ContentKind,
): Promise<Result<ContentItem, string>> {
  const metaPath = path.join(dir, "meta.json");
  if (!(await pathExists(metaPath))) {
    return err(`missing meta.json in ${dir}`);
  }

  let raw: RawMeta;
  try {
    raw = JSON.parse(await readTextFile(metaPath)) as RawMeta;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(`invalid meta.json in ${dir}: ${message}`);
  }

  const id = asString(raw.id) ?? path.basename(dir);
  const title = asString(raw.title);
  const summary = asString(raw.summary);
  const body = asString(raw.body) ?? "article.md";
  const bodyPath = path.join(dir, body);

  if (!title) {
    return err(`${id}: title is required`);
  }

  if (!summary) {
    return err(`${id}: summary is required`);
  }

  if (!(await pathExists(bodyPath))) {
    return err(`${id}: body file not found (${body})`);
  }

  const pdfName = asString(raw.pdf);
  const hasPdf = pdfName ? await pathExists(path.join(dir, pdfName)) : false;

  return ok({
    id,
    kind,
    title,
    path: bodyPath,
    summary,
    tags: asStringArray(raw.tags),
    hasPdf,
  });
}

export async function loadContentCatalog(
  contentRoot: string,
): Promise<Result<ContentItem[], string[]>> {
  const items: ContentItem[] = [];
  const errors: string[] = [];

  const articleRoot = path.join(contentRoot, "articles");
  if (await pathExists(articleRoot)) {
    const dirs = await listDirectories(articleRoot);
    for (const dir of dirs) {
      const result = await loadItemFromDir(dir, "article");
      if (result.ok) {
        items.push(result.value);
      } else {
        errors.push(result.error);
      }
    }
  }

  const chatRoot = path.join(contentRoot, "chat-export");
  if (await pathExists(path.join(chatRoot, "meta.json"))) {
    const result = await loadItemFromDir(chatRoot, "chat-export");
    if (result.ok) {
      items.push(result.value);
    } else {
      errors.push(result.error);
    }
  }

  items.sort((a, b) => a.id.localeCompare(b.id));

  if (errors.length > 0) {
    return err(errors);
  }

  return ok(items);
}
