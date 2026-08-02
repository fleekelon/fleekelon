import type { ContentItem, ContentKind } from "../content/types.js";

export type ProfileInput = {
  name: string;
  tagline: string;
  location: string;
  highlights: string[];
  links: Array<{ label: string; url: string }>;
  content: ContentItem[];
  includeToolkitSection?: boolean;
};

function relativeContentPath(itemPath: string): string {
  return itemPath.replace(/\\/g, "/");
}

function sectionItems(
  content: ContentItem[],
  kinds: ContentKind[],
): ContentItem[] {
  return content.filter((item) => kinds.includes(item.kind));
}

function renderContentBullets(items: ContentItem[]): string {
  if (items.length === 0) {
    return "- _No published notes yet._";
  }

  return items
    .map((item) => {
      const relative = relativeContentPath(item.path);
      return `- [${item.title}](${relative}) — ${item.summary}`;
    })
    .join("\n");
}

export function renderProfileReadme(input: ProfileInput): string {
  const highlightLines = input.highlights.map((item) => `- ${item}`).join("\n");
  const linkLines = input.links
    .map((link) => `- [${link.label}](${link.url})`)
    .join("\n");

  const writing = sectionItems(input.content, ["article", "thesis"]);
  const notes = sectionItems(input.content, ["note", "chat-export"]);

  const writingSection =
    writing.length > 0
      ? `## Writing & notes\n\n${renderContentBullets(writing)}\n`
      : `## Writing & notes\n\n${renderContentBullets(input.content)}\n`;

  const notesSection =
    writing.length > 0 && notes.length > 0
      ? `\n## Field notes & archives\n\n${renderContentBullets(notes)}\n`
      : "";

  const toolkitSection =
    input.includeToolkitSection === false
      ? ""
      : `
## Toolkit in this repo

\`fleekelon\` is also a TypeScript personal toolkit with:

- CLI commands: \`doctor\`, \`content\`, \`invest\`, \`profile\`, \`site\`, \`greet\`
- Content catalog + validation for articles / notes / theses / chat exports
- Investing workflows: thesis / decision memo / prediction ledger
- Search, tag index, stats, and digest generation
- GitHub profile README renderer (\`profile render\` / \`profile write\`)
- Static personal site builder (\`site build\`)
- Strict TypeScript scaffold, Vitest, ESLint/Prettier, Husky, GitHub Actions CI

\`\`\`bash
cp .env.example .env
npm install
npm run check
npm run fleekelon -- help
\`\`\`

| Script                     | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| \`npm run doctor\`           | Local toolchain / repo health checks                |
| \`npm run content:list\`     | List catalogued content                             |
| \`npm run content:validate\` | Validate articles, notes, theses, chat exports      |
| \`npm run content:search\`   | Full-text search across the catalog                 |
| \`npm run profile:render\`   | Render profile README markdown                      |
| \`npm run profile:write\`    | Sync rendered markdown into \`README.md\`             |
| \`npm run site:build\`       | Build the personal site under \`sites/fleekelon\`     |
| \`npm run invest:list\`      | List theses / decisions / predictions               |
| \`npm run check\`            | typecheck + lint + format + test + content validate |

More detail: [docs/getting-started.md](docs/getting-started.md) · [docs/architecture.md](docs/architecture.md) · [docs/backlog.md](docs/backlog.md)
`;

  return `# ${input.name}

${input.tagline}

**${input.location}**

## Now

${highlightLines}

${writingSection}${notesSection}${toolkitSection}
## Links

${linkLines}

---

<sub>Built and maintained with the \`fleekelon\` personal toolkit in this repo.</sub>
`;
}

export const defaultProfileInput = {
  name: "Frank Li",
  tagline:
    "Building judgment-heavy systems at the edge of AI, markets, and cross-border ops.",
  location: "Hangzhou · Wormhole Tech Consulting",
  highlights: [
    "Shipping personal engineering infrastructure that stays reusable across projects",
    "Writing about AI-era leverage: execution gets cheap, judgment gets expensive",
    "Operating Wormhole Tech Consulting around cross-border commerce and tax systems",
    "Running a personal content OS: frameworks, notes, and chat archives under one catalog",
  ],
  links: [
    {
      label: "Personal site",
      url: "https://fleekelon.github.io/fleekelon/",
    },
    {
      label: "Wormhole tax website",
      url: "https://github.com/fleekelon/wormhole-tax-website",
    },
    {
      label: "This toolkit",
      url: "https://github.com/fleekelon/fleekelon",
    },
  ],
} as const;
