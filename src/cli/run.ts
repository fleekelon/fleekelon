import { getGreeting } from "../greeting.js";
import type { AppConfig } from "../config.js";
import { createLogger } from "../lib/logger.js";
import { parseArgs } from "./parse-args.js";
import { runContentCommand } from "./commands/content.js";
import { formatDoctorReport, runDoctor } from "./commands/doctor.js";
import { renderHelp } from "./commands/help.js";
import { runInvestCommand } from "./commands/invest.js";
import { runProfileCommand } from "./commands/profile.js";
import { runSiteCommand } from "./commands/site.js";

export type CliIo = {
  log: (message: string) => void;
  error: (message: string) => void;
};

export async function runCli(
  argv: string[],
  config: AppConfig,
  io: CliIo = { log: console.log, error: console.error },
): Promise<number> {
  const args = parseArgs(argv);
  const contentRoot =
    typeof args.flags["content-root"] === "string"
      ? args.flags["content-root"]
      : config.contentRoot;
  const logger = createLogger(config.logLevel, io.error);

  switch (args.command) {
    case "help":
    case "--help":
    case "-h":
      io.log(renderHelp(config.appName));
      return 0;

    case "greet": {
      const name = args.positionals[0] ?? config.appName;
      try {
        io.log(getGreeting(name));
        return 0;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        io.error(message);
        return 1;
      }
    }

    case "doctor": {
      const checks = await runDoctor(config);
      io.log(formatDoctorReport(checks));
      return checks.every((check) => check.ok) ? 0 : 1;
    }

    case "content": {
      const [subcommand, ...rest] = args.positionals;
      const result = await runContentCommand(
        subcommand,
        contentRoot,
        rest,
        args.flags,
      );
      if (!result.ok) {
        io.error(result.error);
        return 1;
      }
      io.log(result.value);
      return 0;
    }

    case "profile": {
      const result = await runProfileCommand(args.positionals[0], contentRoot);
      if (!result.ok) {
        io.error(result.error);
        return 1;
      }
      io.log(result.value);
      return 0;
    }

    case "site": {
      const result = await runSiteCommand(args.positionals[0], contentRoot);
      if (!result.ok) {
        io.error(result.error);
        return 1;
      }
      io.log(result.value);
      return 0;
    }

    case "invest": {
      const [subcommand, ...rest] = args.positionals;
      const result = await runInvestCommand(
        subcommand,
        contentRoot,
        rest,
        args.flags,
      );
      if (!result.ok) {
        io.error(result.error);
        return 1;
      }
      io.log(result.value);
      return 0;
    }

    default:
      logger.error(`unknown command: ${args.command}`);
      io.error(renderHelp(config.appName));
      return 1;
  }
}
