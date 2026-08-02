import { describe, expect, it } from "vitest";
import { parseArgs } from "../../src/cli/parse-args.js";

describe("parseArgs", () => {
  it("defaults to help when argv is empty", () => {
    expect(parseArgs([])).toEqual({
      command: "help",
      positionals: [],
      flags: {},
    });
  });

  it("parses command, positionals, and flags", () => {
    expect(
      parseArgs([
        "content",
        "validate",
        "--content-root",
        "tmp/content",
        "--verbose",
      ]),
    ).toEqual({
      command: "content",
      positionals: ["validate"],
      flags: {
        "content-root": "tmp/content",
        verbose: true,
      },
    });
  });

  it("supports --flag=value syntax", () => {
    expect(parseArgs(["profile", "render", "--content-root=content"])).toEqual({
      command: "profile",
      positionals: ["render"],
      flags: { "content-root": "content" },
    });
  });
});
