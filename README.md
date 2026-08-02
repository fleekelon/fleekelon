# Frank Li

Building judgment-heavy systems at the edge of AI, markets, and cross-border ops.

**Hangzhou · Wormhole Tech Consulting**

## Now

- Shipping personal engineering infrastructure that stays reusable across projects
- Writing about AI-era leverage: execution gets cheap, judgment gets expensive
- Operating Wormhole Tech Consulting around cross-border commerce and tax systems

## Writing & notes

- [AI 时代，执行层贬值，判断层升值](content/articles/ai-execution-vs-judgment/article.md) — 从 Dan Koe 的人性杠杆框架出发，推演 AI 时代执行层与判断层的价值分化
- [美股科技股与 AI 投资讨论完整聊天记录](content/chat-export/us-tech-ai-chat-transcript.md) — 归档一轮投资框架对话，便于离线复盘

## Toolkit in this repo

`fleekelon` is also a TypeScript personal toolkit with:

- CLI commands: `doctor`, `content`, `profile`, `greet`
- Content catalog + validation for articles / chat exports
- GitHub profile README renderer
- Strict TypeScript scaffold, Vitest, ESLint/Prettier, Husky, GitHub Actions CI

```bash
cp .env.example .env
npm install
npm run check
npm run fleekelon -- help
```

| Script                     | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| `npm run doctor`           | Local toolchain / repo health checks                |
| `npm run content:list`     | List catalogued content                             |
| `npm run content:validate` | Validate articles and chat exports                  |
| `npm run profile:render`   | Render profile README markdown                      |
| `npm run check`            | typecheck + lint + format + test + content validate |

More detail: [docs/getting-started.md](docs/getting-started.md) · [docs/architecture.md](docs/architecture.md) · [docs/backlog.md](docs/backlog.md)

## Links

- [Wormhole tax website](https://github.com/fleekelon/wormhole-tax-website)
- [This toolkit](https://github.com/fleekelon/fleekelon)
