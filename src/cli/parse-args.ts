export type ParsedArgs = {
  command: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
};

export function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...rest] = argv;
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token) {
      continue;
    }

    if (token.startsWith("--")) {
      const body = token.slice(2);
      const eq = body.indexOf("=");
      if (eq >= 0) {
        flags[body.slice(0, eq)] = body.slice(eq + 1);
        continue;
      }

      const next = rest[i + 1];
      if (next && !next.startsWith("-")) {
        flags[body] = next;
        i += 1;
      } else {
        flags[body] = true;
      }
      continue;
    }

    positionals.push(token);
  }

  return { command, positionals, flags };
}
