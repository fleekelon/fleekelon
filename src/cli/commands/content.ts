import {
  formatValidationReport,
  validateContent,
} from "../../content/validate.js";
import { loadContentCatalog } from "../../content/catalog.js";
import { err, ok, type Result } from "../../lib/result.js";

export async function runContentCommand(
  subcommand: string | undefined,
  contentRoot: string,
): Promise<Result<string, string>> {
  switch (subcommand) {
    case undefined:
    case "list": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }

      if (catalog.value.length === 0) {
        return ok("no content items found\n");
      }

      const lines = catalog.value.map(
        (item) =>
          `${item.id}\t${item.kind}\t${item.title}\t${item.tags.join(",")}`,
      );
      return ok(`${lines.join("\n")}\n`);
    }
    case "validate": {
      const report = await validateContent(contentRoot);
      const text = formatValidationReport(report);
      return report.ok ? ok(text) : err(text);
    }
    default:
      return err(`unknown content subcommand: ${subcommand}`);
  }
}
