import path from "node:path";
import { err, ok, type Result } from "../../lib/result.js";
import { buildPersonalSite, formatSiteBuildReport } from "../../site/build.js";

export async function runSiteCommand(
  subcommand: string | undefined,
  contentRoot: string,
  cwd = process.cwd(),
): Promise<Result<string, string>> {
  const action = subcommand ?? "build";

  if (action !== "build") {
    return err(`unknown site subcommand: ${subcommand}`);
  }

  const outputDir = path.join(cwd, "sites", "fleekelon");
  const result = await buildPersonalSite(contentRoot, outputDir);
  if (!result.ok) {
    return err(result.error);
  }

  return ok(formatSiteBuildReport(result.value));
}
