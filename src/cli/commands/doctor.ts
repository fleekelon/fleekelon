import { access } from "node:fs/promises";
import path from "node:path";
import type { AppConfig } from "../../config.js";

export type DoctorCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

async function exists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function runDoctor(
  config: AppConfig,
  cwd = process.cwd(),
): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];

  const nodeMajor = Number(process.versions.node.split(".")[0] ?? "0");
  checks.push({
    name: "node-version",
    ok: nodeMajor >= 22,
    detail: `detected Node ${process.versions.node}`,
  });

  const requiredPaths = [
    "package.json",
    "tsconfig.json",
    "eslint.config.js",
    ".github/workflows/ci.yml",
    config.contentRoot,
  ];

  for (const relative of requiredPaths) {
    const absolute = path.join(cwd, relative);
    const ok = await exists(absolute);
    checks.push({
      name: `path:${relative}`,
      ok,
      detail: ok ? "found" : "missing",
    });
  }

  checks.push({
    name: "app-name",
    ok: Boolean(config.appName.trim()),
    detail: config.appName,
  });

  return checks;
}

export function formatDoctorReport(checks: DoctorCheck[]): string {
  const lines = checks.map(
    (check) => `${check.ok ? "PASS" : "FAIL"}  ${check.name} — ${check.detail}`,
  );
  const failed = checks.filter((check) => !check.ok).length;
  lines.push(
    "",
    failed === 0
      ? "doctor: all checks passed"
      : `doctor: ${failed} check(s) failed`,
  );
  return `${lines.join("\n")}\n`;
}
