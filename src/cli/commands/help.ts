export function renderHelp(appName: string): string {
  return `${appName} — personal engineering toolkit

Usage:
  npx tsx src/index.ts <command> [options]
  node dist/index.js <command> [options]

Commands:
  help                 Show this help
  greet [name]         Print a greeting
  doctor               Check local toolchain / repo health
  content list         List content catalog entries
  content validate     Validate articles and chat exports
  profile render       Render GitHub profile README markdown

Global options:
  --content-root <dir>  Override content directory (default: content)
`;
}
