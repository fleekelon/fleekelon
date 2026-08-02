import { describe, expect, it } from "vitest";
import { getGreeting } from "../src/greeting.js";

describe("getGreeting", () => {
  it("returns a greeting for a valid name", () => {
    expect(getGreeting("fleekelon")).toBe("Hello from fleekelon");
  });

  it("trims surrounding whitespace", () => {
    expect(getGreeting("  scaffold  ")).toBe("Hello from scaffold");
  });

  it("rejects empty names", () => {
    expect(() => getGreeting("   ")).toThrow("name must not be empty");
  });
});
