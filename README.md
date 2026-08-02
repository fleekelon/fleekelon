# Frank Li

Building judgment-heavy systems at the edge of AI, markets, and cross-border ops.

**Hangzhou · Wormhole Tech Consulting**

## Now

- Shipping personal engineering infrastructure that stays reusable across projects
- Writing about AI-era leverage: execution gets cheap, judgment gets expensive
- Operating Wormhole Tech Consulting around cross-border commerce and tax systems
- Running a personal content OS: frameworks, notes, and chat archives under one catalog

## Writing & notes

- [AI 时代，执行层贬值，判断层升值](content/articles/ai-execution-vs-judgment/article.md) — 从 Dan Koe 的人性杠杆框架出发，推演 AI 时代执行层与判断层的价值分化，并落到新人反馈闭环与声誉货币。
- [基于 AI 进展的投资框架：利润迁移地图与阶段切换信号灯](content/articles/ai-progress-investing-framework/article.md) — AI利润正沿产业链迁移，投资本质是判断「现在瓶颈在哪、下一站去哪」；本文给出四阶段利润地图、六层状态卡与再买硬件、轮动软件、系统性离场三组信号灯，据此定位当前②→③交接带的仓位切换规则与证伪条件。
- [跨境电商财税合规实操摘要（综试区 · 通关 · 退税 · 金税四期）](content/articles/cross-border-tax-playbook/article.md) — 面向跨境电商从业者的财税合规实操摘要：覆盖创业主体与综试区路径选择、9610/9710/9810/1210通关组合、出口退税SOP与回款周期、核定征收税负粗算、金税四期三流一致要求、海外VAT与平台责任，并附常见踩坑与服务边界。
- [影响力观点验证：把判断公开成可结算的记录](content/articles/influence-verification-practice/article.md) — 把声誉当慢铸币：用带时间戳、可被打脸的公开记录，把判断从感觉变成可复盘的资产。
- [对个人来说，最理性的决策是一套制度](content/articles/personal-investing-system/article.md) — 对个人而言，最理性的不是某次英雄式买卖，而是用底仓、观点仓与娱乐仓搭一套可执行制度：用决策日志、冷却期与模糊择时锁住期限优势，让过程纪律替代精准幻觉，避免此刻的你伤害十年后的你。

## Field notes & archives

- [AI 应用分类草图：按瓶颈与价值捕获分层](content/notes/ai-application-taxonomy/note.md) — 按自动化深度与价值捕获方式拆分 AI 应用，区分判断层业务与执行层工具，便于客户对话中快速定位产品位置。
- [苹果市值投资笔记：当存储超级周期变成 iPhone 的成本毒药](content/notes/apple-ai-cycle-mirror/note.md) — 苹果在存储超级周期中沦为需求侧成本受害者：七月创近5万亿高点后财报暴跌、市值蒸发约3500亿；本文对照云厂商因AI现金流被奖励、消费硬件因内存通胀承压的镜像，并记下近两季规避姿态与开放问题。
- [美股科技股与 AI 投资讨论完整聊天记录](content/chat-export/us-tech-ai-chat-transcript.md) — 归档一轮关于美股科技股与 AI 投资框架的完整对话，便于离线检索与复盘。

## Toolkit in this repo

`fleekelon` is also a TypeScript personal toolkit with:

- CLI commands: `doctor`, `content`, `invest`, `profile`, `site`, `greet`
- Content catalog + validation for articles / notes / theses / chat exports
- Investing workflows: thesis / decision memo / prediction ledger
- Search, tag index, stats, and digest generation
- GitHub profile README renderer (`profile render` / `profile write`)
- Static personal site builder (`site build`)
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
| `npm run content:validate` | Validate articles, notes, theses, chat exports      |
| `npm run content:search`   | Full-text search across the catalog                 |
| `npm run profile:render`   | Render profile README markdown                      |
| `npm run profile:write`    | Sync rendered markdown into `README.md`             |
| `npm run site:build`       | Build the personal site under `sites/fleekelon`     |
| `npm run invest:list`      | List theses / decisions / predictions               |
| `npm run check`            | typecheck + lint + format + test + content validate |

More detail: [docs/getting-started.md](docs/getting-started.md) · [docs/architecture.md](docs/architecture.md) · [docs/backlog.md](docs/backlog.md)

## Links

- [Personal site](https://fleekelon.github.io/fleekelon/)
- [Wormhole tax website](https://github.com/fleekelon/wormhole-tax-website)
- [This toolkit](https://github.com/fleekelon/fleekelon)

---

<sub>Built and maintained with the `fleekelon` personal toolkit in this repo.</sub>
