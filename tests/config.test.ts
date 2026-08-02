import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("uses defaults when env is empty", () => {
    expect(loadConfig({})).toEqual({
      appName: "fleekelon",
      nodeEnv: "development",
      contentRoot: "content",
      logLevel: "info",
    });
  });

  it("reads APP_NAME, NODE_ENV, CONTENT_ROOT, and LOG_LEVEL", () => {
    expect(
      loadConfig({
        APP_NAME: "demo",
        NODE_ENV: "production",
        CONTENT_ROOT: "notes",
        LOG_LEVEL: "debug",
      }),
    ).toEqual({
      appName: "demo",
      nodeEnv: "production",
      contentRoot: "notes",
      logLevel: "debug",
    });
  });

  it("falls back for unknown NODE_ENV and LOG_LEVEL values", () => {
    expect(loadConfig({ NODE_ENV: "staging", LOG_LEVEL: "verbose" })).toEqual({
      appName: "fleekelon",
      nodeEnv: "development",
      contentRoot: "content",
      logLevel: "info",
    });
  });
});
