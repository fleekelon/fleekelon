import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runInvestCommand } from "../../src/cli/commands/invest.js";

describe("runInvestCommand", () => {
  it("scaffolds thesis/decision/prediction and lists them", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-invest-cli-"));

    const thesis = await runInvestCommand(
      "thesis",
      root,
      ["new", "power-bottleneck"],
      {
        title: "Power bottleneck",
        summary: "Physical power remains the binding constraint into 2027.",
      },
    );
    expect(thesis.ok).toBe(true);

    const decision = await runInvestCommand(
      "decision",
      root,
      ["new", "add-gev-on-dip"],
      { title: "Add GEV on dip" },
    );
    expect(decision.ok).toBe(true);

    const prediction = await runInvestCommand(
      "prediction",
      root,
      ["new", "azure-stays-hot"],
      { domain: "cloud", "settle-by": "2026-10-31" },
    );
    expect(prediction.ok).toBe(true);

    const listed = await runInvestCommand("list", root, [], {});
    expect(listed.ok).toBe(true);
    if (!listed.ok) {
      return;
    }
    expect(listed.value).toContain("power-bottleneck");
    expect(listed.value).toContain("add-gev-on-dip");
    expect(listed.value).toContain("azure-stays-hot");
  });
});
