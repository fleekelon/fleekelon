import type { ContentItem } from "../content/types.js";

export type ProfileInput = {
  name: string;
  tagline: string;
  location: string;
  highlights: string[];
  links: Array<{ label: string; url: string }>;
  content: ContentItem[];
};

export function renderProfileReadme(input: ProfileInput): string {
  const highlightLines = input.highlights.map((item) => `- ${item}`).join("\n");
  const linkLines = input.links
    .map((link) => `- [${link.label}](${link.url})`)
    .join("\n");

  const articleLines =
    input.content.length === 0
      ? "- _No published notes yet._"
      : input.content
          .map((item) => {
            const relative = item.path.replace(/\\/g, "/");
            return `- [${item.title}](${relative}) — ${item.summary}`;
          })
          .join("\n");

  return `# ${input.name}

${input.tagline}

**${input.location}**

## Now

${highlightLines}

## Writing & notes

${articleLines}

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
  ],
  links: [
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
