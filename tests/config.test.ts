import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("uses defaults when env is empty", () => {
    expect(loadConfig({})).toEqual({
      appName: "fleekelon",
      nodeEnv: "development",
    });
  });

  it("reads APP_NAME and NODE_ENV", () => {
    expect(
      loadConfig({
        APP_NAME: "demo",
        NODE_ENV: "production",
      }),
    ).toEqual({
      appName: "demo",
      nodeEnv: "production",
    });
  });

  it("falls back for unknown NODE_ENV values", () => {
    expect(loadConfig({ NODE_ENV: "staging" }).nodeEnv).toBe("development");
  });
});
