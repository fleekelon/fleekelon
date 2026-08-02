export type AppConfig = {
  appName: string;
  nodeEnv: "development" | "test" | "production";
};

function resolveNodeEnv(value: string | undefined): AppConfig["nodeEnv"] {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  return "development";
}

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  return {
    appName: env.APP_NAME?.trim() || "fleekelon",
    nodeEnv: resolveNodeEnv(env.NODE_ENV),
  };
}
