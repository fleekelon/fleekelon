import { loadContentCatalog } from "../../content/catalog.js";
import { err, ok, type Result } from "../../lib/result.js";
import {
  defaultProfileInput,
  renderProfileReadme,
} from "../../profile/render.js";

export async function runProfileCommand(
  subcommand: string | undefined,
  contentRoot: string,
): Promise<Result<string, string>> {
  if (subcommand !== undefined && subcommand !== "render") {
    return err(`unknown profile subcommand: ${subcommand}`);
  }

  const catalog = await loadContentCatalog(contentRoot);
  if (!catalog.ok) {
    return err(catalog.error.join("\n"));
  }

  const markdown = renderProfileReadme({
    ...defaultProfileInput,
    highlights: [...defaultProfileInput.highlights],
    links: [...defaultProfileInput.links],
    content: catalog.value,
  });

  return ok(markdown.endsWith("\n") ? markdown : `${markdown}\n`);
}
