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

const KIND_ROOTS: Array<{ kind: ContentKind; relative: string }> = [
  { kind: "article", relative: "articles" },
  { kind: "note", relative: "notes" },
  { kind: "thesis", relative: "theses" },
  { kind: "chat-export", relative: "chat-export" },
];

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

function defaultBodyName(kind: ContentKind): string {
  switch (kind) {
    case "note":
      return "note.md";
    case "thesis":
      return "thesis.md";
    case "chat-export":
      return "transcript.md";
    case "article":
    default:
      return "article.md";
  }
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
  const body = asString(raw.body) ?? defaultBodyName(kind);
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

async function loadKindCollection(
  contentRoot: string,
  kind: ContentKind,
  relative: string,
): Promise<{ items: ContentItem[]; errors: string[] }> {
  const items: ContentItem[] = [];
  const errors: string[] = [];
  const root = path.join(contentRoot, relative);

  if (!(await pathExists(root))) {
    return { items, errors };
  }

  // Legacy layout: a single meta.json directly under the kind root
  // (used historically by chat-export/).
  if (await pathExists(path.join(root, "meta.json"))) {
    const result = await loadItemFromDir(root, kind);
    if (result.ok) {
      items.push(result.value);
    } else {
      errors.push(result.error);
    }
  }

  const dirs = await listDirectories(root);
  for (const dir of dirs) {
    const result = await loadItemFromDir(dir, kind);
    if (result.ok) {
      items.push(result.value);
    } else {
      errors.push(result.error);
    }
  }

  return { items, errors };
}

export async function loadContentCatalog(
  contentRoot: string,
): Promise<Result<ContentItem[], string[]>> {
  const items: ContentItem[] = [];
  const errors: string[] = [];

  for (const { kind, relative } of KIND_ROOTS) {
    const loaded = await loadKindCollection(contentRoot, kind, relative);
    items.push(...loaded.items);
    errors.push(...loaded.errors);
  }

  items.sort((a, b) => a.id.localeCompare(b.id));

  if (errors.length > 0) {
    return err(errors);
  }

  return ok(items);
}

export function filterContentByKind(
  items: ContentItem[],
  kind: ContentKind | undefined,
): ContentItem[] {
  if (!kind) {
    return items;
  }
  return items.filter((item) => item.kind === kind);
}

export function filterContentByTag(
  items: ContentItem[],
  tag: string | undefined,
): ContentItem[] {
  if (!tag) {
    return items;
  }
  const normalized = tag.trim().toLowerCase();
  return items.filter((item) =>
    item.tags.some((entry) => entry.toLowerCase() === normalized),
  );
}
