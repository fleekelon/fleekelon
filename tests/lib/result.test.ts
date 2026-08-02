import { describe, expect, it } from "vitest";
import { err, ok } from "../../src/lib/result.js";

describe("result", () => {
  it("constructs ok and err values", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
    expect(err("nope")).toEqual({ ok: false, error: "nope" });
  });
});
