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
  invest thesis new    Scaffold an investment thesis under content/theses/
  invest decision new  Scaffold a decision memo under content/notes/
  invest prediction new  Scaffold a falsifiable prediction note
  invest settle <id>   Stamp prediction settlement [--result=]
  invest list          List theses / decisions / predictions
  profile render       Render GitHub profile README markdown
  profile write        Write rendered markdown to README.md
  site build           Build personal site into sites/fleekelon

Global options:
  --content-root <dir>  Override content directory (default: content)
`;
}
