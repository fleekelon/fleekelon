import { getGreeting } from "./greeting.js";
import { loadConfig } from "./config.js";

function main(): void {
  const config = loadConfig(process.env);
  const message = getGreeting(config.appName);

  console.log(message);
}

main();
