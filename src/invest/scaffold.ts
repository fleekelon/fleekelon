import path from "node:path";
import { pathExists, readTextFile, writeTextFile } from "../lib/fs.js";
import { err, ok, type Result } from "../lib/result.js";
import {
  assertSlug,
  renderDecisionFiles,
  renderPredictionFiles,
  renderSettlementBlock,
  renderThesisFiles,
  slugify,
  type DecisionInput,
  type PredictionInput,
  type ThesisInput,
} from "./templates.js";

export type CreatedScaffold = {
  kind: "thesis" | "decision" | "prediction";
  id: string;
  directory: string;
  files: string[];
};

function todayIso(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function createThesisScaffold(
  contentRoot: string,
  input: Omit<ThesisInput, "createdAt"> & { createdAt?: string },
): Promise<Result<CreatedScaffold, string>> {
  const id = slugify(input.id);
  const slugError = assertSlug(id);
  if (slugError) {
    return err(slugError);
  }

  const directory = path.join(contentRoot, "theses", id);
  if (await pathExists(directory)) {
    return err(`thesis already exists: ${id}`);
  }

  const files = renderThesisFiles({
    ...input,
    id,
    createdAt: input.createdAt ?? todayIso(),
  });

  await writeTextFile(path.join(directory, "meta.json"), files.meta);
  await writeTextFile(path.join(directory, files.bodyName), files.body);

  return ok({
    kind: "thesis",
    id,
    directory,
    files: ["meta.json", files.bodyName],
  });
}

export async function createDecisionScaffold(
  contentRoot: string,
  input: Omit<DecisionInput, "createdAt"> & { createdAt?: string },
): Promise<Result<CreatedScaffold, string>> {
  const id = slugify(input.id);
  const slugError = assertSlug(id);
  if (slugError) {
    return err(slugError);
  }

  const directory = path.join(contentRoot, "notes", id);
  if (await pathExists(directory)) {
    return err(`note already exists: ${id}`);
  }

  const files = renderDecisionFiles({
    ...input,
    id,
    createdAt: input.createdAt ?? todayIso(),
  });

  await writeTextFile(path.join(directory, "meta.json"), files.meta);
  await writeTextFile(path.join(directory, files.bodyName), files.body);

  return ok({
    kind: "decision",
    id,
    directory,
    files: ["meta.json", files.bodyName],
  });
}

export async function createPredictionScaffold(
  contentRoot: string,
  input: Omit<PredictionInput, "createdAt"> & { createdAt?: string },
): Promise<Result<CreatedScaffold, string>> {
  const id = slugify(input.id);
  const slugError = assertSlug(id);
  if (slugError) {
    return err(slugError);
  }

  const directory = path.join(contentRoot, "notes", id);
  if (await pathExists(directory)) {
    return err(`note already exists: ${id}`);
  }

  const files = renderPredictionFiles({
    ...input,
    id,
    createdAt: input.createdAt ?? todayIso(),
  });

  await writeTextFile(path.join(directory, "meta.json"), files.meta);
  await writeTextFile(path.join(directory, files.bodyName), files.body);

  return ok({
    kind: "prediction",
    id,
    directory,
    files: ["meta.json", files.bodyName],
  });
}

export async function settlePrediction(
  contentRoot: string,
  id: string,
  result: string,
  notes = "",
  settledAt = todayIso(),
): Promise<Result<string, string>> {
  const allowed = new Set(["win", "lose", "mixed", "void"]);
  if (!allowed.has(result)) {
    return err("result must be one of: win|lose|mixed|void");
  }

  const slug = slugify(id);
  const bodyPath = path.join(contentRoot, "notes", slug, "note.md");
  if (!(await pathExists(bodyPath))) {
    return err(`prediction note not found: ${slug}`);
  }

  const body = await readTextFile(bodyPath);
  if (!body.includes("prediction") && !body.includes("Settle by:")) {
    return err(`${slug} does not look like a prediction note`);
  }

  const block = renderSettlementBlock({ settledAt, result, notes });
  const replaced = body.replace(/## Settlement[\s\S]*$/m, `${block}\n`);
  const next =
    replaced === body
      ? `${body.trimEnd()}\n\n${block}\n`
      : replaced.replace(/^> Status: open$/m, `> Status: settled (${result})`);

  await writeTextFile(bodyPath, next.endsWith("\n") ? next : `${next}\n`);
  return ok(bodyPath);
}

export function formatCreatedScaffold(created: CreatedScaffold): string {
  return [
    `created ${created.kind}: ${created.id}`,
    `directory: ${created.directory}`,
    `files: ${created.files.join(", ")}`,
    "",
  ].join("\n");
}
