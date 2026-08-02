#!/usr/bin/env node
import { loadConfig } from "./config.js";
import { runCli } from "./cli/run.js";

async function main(): Promise<void> {
  const config = loadConfig(process.env);
  const code = await runCli(process.argv.slice(2), config);
  process.exitCode = code;
}

await main();
