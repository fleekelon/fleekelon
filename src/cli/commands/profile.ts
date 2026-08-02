import path from "node:path";
import { loadContentCatalog } from "../../content/catalog.js";
import { writeTextFile } from "../../lib/fs.js";
import { err, ok, type Result } from "../../lib/result.js";
import {
  defaultProfileInput,
  renderProfileReadme,
} from "../../profile/render.js";

async function buildProfileMarkdown(
  contentRoot: string,
): Promise<Result<string, string>> {
  const catalog = await loadContentCatalog(contentRoot);
  if (!catalog.ok) {
    return err(catalog.error.join("\n"));
  }

  const markdown = renderProfileReadme({
    ...defaultProfileInput,
    highlights: [...defaultProfileInput.highlights],
    links: [...defaultProfileInput.links],
    content: catalog.value,
    includeToolkitSection: true,
  });

  return ok(markdown.endsWith("\n") ? markdown : `${markdown}\n`);
}

export async function runProfileCommand(
  subcommand: string | undefined,
  contentRoot: string,
  cwd = process.cwd(),
): Promise<Result<string, string>> {
  const action = subcommand ?? "render";

  if (action !== "render" && action !== "write") {
    return err(`unknown profile subcommand: ${subcommand}`);
  }

  const markdown = await buildProfileMarkdown(contentRoot);
  if (!markdown.ok) {
    return markdown;
  }

  if (action === "render") {
    return markdown;
  }

  const target = path.join(cwd, "README.md");
  await writeTextFile(target, markdown.value);
  return ok(`wrote ${path.relative(cwd, target) || "README.md"}\n`);
}
