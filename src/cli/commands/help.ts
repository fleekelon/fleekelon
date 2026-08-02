export function renderHelp(appName: string): string {
  return `${appName} — personal engineering toolkit

Usage:
  npx tsx src/index.ts <command> [options]
  node dist/index.js <command> [options]

Commands:
  help                 Show this help
  greet [name]         Print a greeting
  doctor               Check local toolchain / repo health
  content list         List catalog entries [--kind=] [--tag=]
  content validate     Validate articles / notes / theses / chat exports
  content search <q>   Search titles, tags, summaries, and bodies
  content tags         Print tag index
  content stats        Print catalog statistics
  content digest       Render a markdown digest of the catalog
  profile render       Render GitHub profile README markdown
  profile write        Write rendered markdown to README.md
  site build           Build personal site into sites/fleekelon

Global options:
  --content-root <dir>  Override content directory (default: content)
`;
}
