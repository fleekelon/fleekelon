export type AppConfig = {
  appName: string;
  nodeEnv: "development" | "test" | "production";
  contentRoot: string;
  logLevel: "debug" | "info" | "warn" | "error";
};

function resolveNodeEnv(value: string | undefined): AppConfig["nodeEnv"] {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  return "development";
}

function resolveLogLevel(value: string | undefined): AppConfig["logLevel"] {
  if (
    value === "debug" ||
    value === "info" ||
    value === "warn" ||
    value === "error"
  ) {
    return value;
  }

  return "info";
}

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  return {
    appName: env.APP_NAME?.trim() || "fleekelon",
    nodeEnv: resolveNodeEnv(env.NODE_ENV),
    contentRoot: env.CONTENT_ROOT?.trim() || "content",
    logLevel: resolveLogLevel(env.LOG_LEVEL),
  };
}
