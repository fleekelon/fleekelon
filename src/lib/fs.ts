import {
  access,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

export async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readTextFile(target: string): Promise<string> {
  return readFile(target, "utf8");
}

export async function writeTextFile(
  target: string,
  contents: string,
): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

export async function listDirectories(target: string): Promise<string[]> {
  const entries = await readdir(target, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(target, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

export async function fileSize(target: string): Promise<number> {
  const info = await stat(target);
  return info.size;
}
