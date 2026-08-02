import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  createDecisionScaffold,
  createPredictionScaffold,
  createThesisScaffold,
  settlePrediction,
} from "../../src/invest/scaffold.js";
import { loadContentCatalog } from "../../src/content/catalog.js";
import { validateContent } from "../../src/content/validate.js";

describe("invest scaffolds", () => {
  it("creates a thesis that validates in the catalog", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-invest-"));
    const created = await createThesisScaffold(root, {
      id: "Cloud-Capex-Handoff",
      title: "Cloud capex handoff",
      summary: "Stage 2 to 3 handoff thesis scaffold for tests.",
      tags: ["ai", "cloud"],
      createdAt: "2026-08-02",
    });

    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    expect(created.value.id).toBe("cloud-capex-handoff");
    const catalog = await loadContentCatalog(root);
    expect(catalog.ok).toBe(true);
    if (!catalog.ok) {
      return;
    }
    expect(catalog.value[0]?.kind).toBe("thesis");

    const report = await validateContent(root);
    expect(report.ok).toBe(true);
  });

  it("creates and settles a prediction note", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-pred-"));
    const created = await createPredictionScaffold(root, {
      id: "nvda-guide-hold",
      title: "NVDA guide holds",
      summary: "Nvidia maintains guidance through August print.",
      domain: "semiconductors",
      settleBy: "2026-08-27",
      tags: ["nvda"],
      createdAt: "2026-08-02",
    });
    expect(created.ok).toBe(true);

    const settled = await settlePrediction(
      root,
      "nvda-guide-hold",
      "win",
      "Guidance reiterated; no cancel language.",
      "2026-08-27",
    );
    expect(settled.ok).toBe(true);
    if (!settled.ok) {
      return;
    }

    const body = await readFile(settled.value, "utf8");
    expect(body).toContain("**win**");
    expect(body).toContain("Guidance reiterated");
    expect(body).toContain("settled (win)");
  });

  it("creates a decision memo tagged for invest list", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "fleekelon-dec-"));
    const created = await createDecisionScaffold(root, {
      id: "trim-storage-beta",
      title: "Trim storage beta",
      summary: "Reduce crowded memory exposure into September.",
      tags: ["memory"],
      createdAt: "2026-08-02",
    });
    expect(created.ok).toBe(true);

    const catalog = await loadContentCatalog(root);
    expect(catalog.ok).toBe(true);
    if (!catalog.ok) {
      return;
    }
    expect(catalog.value[0]?.tags).toContain("decision");
  });
});
