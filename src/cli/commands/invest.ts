import {
  filterContentByKind,
  filterContentByTag,
  loadContentCatalog,
} from "../../content/catalog.js";
import {
  createDecisionScaffold,
  createPredictionScaffold,
  createThesisScaffold,
  formatCreatedScaffold,
  settlePrediction,
} from "../../invest/scaffold.js";
import { slugify } from "../../invest/templates.js";
import { err, ok, type Result } from "../../lib/result.js";

function flagString(
  flags: Record<string, string | boolean>,
  key: string,
): string | undefined {
  const value = flags[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseTags(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function defaultTitle(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export async function runInvestCommand(
  subcommand: string | undefined,
  contentRoot: string,
  positionals: string[] = [],
  flags: Record<string, string | boolean> = {},
): Promise<Result<string, string>> {
  switch (subcommand) {
    case undefined:
    case "help":
      return ok(`invest — judgment workflows

Usage:
  invest thesis new <id> [--title=] [--summary=] [--tags=a,b]
  invest decision new <id> [--title=] [--summary=] [--tags=a,b]
  invest prediction new <id> [--title=] [--summary=] [--domain=] [--settle-by=YYYY-MM-DD] [--tags=a,b]
  invest settle <id> --result=win|lose|mixed|void [--notes=]
  invest list [--kind=thesis|decision|prediction]
`);

    case "list": {
      const catalog = await loadContentCatalog(contentRoot);
      if (!catalog.ok) {
        return err(catalog.error.join("\n"));
      }

      const kind = flagString(flags, "kind");
      let items = catalog.value;

      if (kind === "thesis") {
        items = filterContentByKind(items, "thesis");
      } else if (kind === "decision") {
        items = filterContentByTag(items, "decision");
      } else if (kind === "prediction") {
        items = filterContentByTag(items, "prediction");
      } else if (kind) {
        return err("kind must be thesis|decision|prediction");
      } else {
        items = items.filter(
          (item) =>
            item.kind === "thesis" ||
            item.tags.includes("decision") ||
            item.tags.includes("prediction"),
        );
      }

      if (items.length === 0) {
        return ok("no invest items found\n");
      }

      const lines = items.map(
        (item) =>
          `${item.id}\t${item.kind}\t${item.tags.join(",")}\t${item.title}`,
      );
      return ok(`${lines.join("\n")}\n`);
    }

    case "thesis": {
      if (positionals[0] !== "new" || !positionals[1]) {
        return err("usage: invest thesis new <id>");
      }
      const id = slugify(positionals[1]);
      const title = flagString(flags, "title") ?? defaultTitle(id);
      const summary =
        flagString(flags, "summary") ??
        `${title} — investment thesis scaffold (edit before acting).`;
      const created = await createThesisScaffold(contentRoot, {
        id,
        title,
        summary,
        tags: parseTags(flagString(flags, "tags")),
      });
      return created.ok ? ok(formatCreatedScaffold(created.value)) : created;
    }

    case "decision": {
      if (positionals[0] !== "new" || !positionals[1]) {
        return err("usage: invest decision new <id>");
      }
      const id = slugify(positionals[1]);
      const title = flagString(flags, "title") ?? defaultTitle(id);
      const summary =
        flagString(flags, "summary") ??
        `${title} — decision memo scaffold (write before sizing).`;
      const created = await createDecisionScaffold(contentRoot, {
        id,
        title,
        summary,
        tags: parseTags(flagString(flags, "tags")),
      });
      return created.ok ? ok(formatCreatedScaffold(created.value)) : created;
    }

    case "prediction": {
      if (positionals[0] !== "new" || !positionals[1]) {
        return err("usage: invest prediction new <id>");
      }
      const id = slugify(positionals[1]);
      const title = flagString(flags, "title") ?? defaultTitle(id);
      const summary =
        flagString(flags, "summary") ??
        `${title} — falsifiable prediction with settle date.`;
      const domain = flagString(flags, "domain") ?? "investing";
      const settleBy =
        flagString(flags, "settle-by") ??
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
          .toISOString()
          .slice(0, 10);
      const created = await createPredictionScaffold(contentRoot, {
        id,
        title,
        summary,
        domain,
        settleBy,
        tags: parseTags(flagString(flags, "tags")),
      });
      return created.ok ? ok(formatCreatedScaffold(created.value)) : created;
    }

    case "settle": {
      const id = positionals[0];
      if (!id) {
        return err("usage: invest settle <id> --result=win|lose|mixed|void");
      }
      const result = flagString(flags, "result");
      if (!result) {
        return err("missing --result=win|lose|mixed|void");
      }
      const settled = await settlePrediction(
        contentRoot,
        id,
        result,
        flagString(flags, "notes") ?? "",
      );
      if (!settled.ok) {
        return settled;
      }
      return ok(`settled ${slugify(id)} → ${result}\nfile: ${settled.value}\n`);
    }

    default:
      return err(`unknown invest subcommand: ${subcommand}`);
  }
}
