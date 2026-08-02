export type InvestScaffoldKind = "thesis" | "decision" | "prediction";

export type ThesisInput = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
};

export type DecisionInput = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: string;
};

export type PredictionInput = {
  id: string;
  title: string;
  summary: string;
  domain: string;
  settleBy: string;
  tags: string[];
  createdAt: string;
};

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function assertSlug(id: string): string | undefined {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    return "id must be kebab-case (a-z, 0-9, hyphens)";
  }
  return undefined;
}

export function renderThesisFiles(input: ThesisInput): {
  meta: string;
  body: string;
  bodyName: string;
} {
  const tags = uniqueTags(["investing", "thesis", ...input.tags]);
  const meta = {
    id: input.id,
    title: input.title,
    summary: input.summary,
    tags,
    body: "thesis.md",
  };

  const body = `# ${input.title}

> Created: ${input.createdAt}  
> Status: draft · not investment advice

## Core claim

_One falsifiable sentence: what must be true for this thesis to pay._

## Stage / bottleneck map

| Layer | Current state | Evidence | Next trigger |
| ----- | ------------- | -------- | ------------ |
| Labs / models | | | |
| Compute / semis | | | |
| Memory | | | |
| Cloud | | | |
| Physical (power / cooling) | | | |
| Software / apps | | | |

## Position plan

- Core sleeve (50–60% of AI book):
- Cyclical sleeve (20–30%):
- Option sleeve (≤15%):

## Trigger lights

- Add / rebuy when:
- Rotate when:
- Cut / exit when:

## Falsifiers

1.
2.
3.

## Decision links

- Related decisions:
- Related predictions:

## Review cadence

- Next review date:
- What data will be checked:
`;

  return {
    meta: `${JSON.stringify(meta, null, 2)}\n`,
    body,
    bodyName: "thesis.md",
  };
}

export function renderDecisionFiles(input: DecisionInput): {
  meta: string;
  body: string;
  bodyName: string;
} {
  const tags = uniqueTags(["investing", "decision", ...input.tags]);
  const meta = {
    id: input.id,
    title: input.title,
    summary: input.summary,
    tags,
    body: "note.md",
  };

  const body = `# ${input.title}

> Created: ${input.createdAt}  
> Kind: decision memo · cooling-off before size changes

## Facts I see

-

## Mechanism I believe

-

## Action

- Sleeve: core / cyclical / entertainment
- Direction: buy / sell / hold / rebalance
- Size / constraint:

## Where I might be wrong

-

## Pre-committed stop / reverse check

- If this happens, I reverse:
- Time stop / review date:

## Process check

- [ ] Written before the trade impulse peaked
- [ ] Cost basis / worldview bias named
- [ ] Not using entertainment sleeve for core risk

## Aftermath (fill later)

- What happened:
- Process grade (A–F):
- Rule to keep / change:
`;

  return {
    meta: `${JSON.stringify(meta, null, 2)}\n`,
    body,
    bodyName: "note.md",
  };
}

export function renderPredictionFiles(input: PredictionInput): {
  meta: string;
  body: string;
  bodyName: string;
} {
  const tags = uniqueTags([
    "investing",
    "prediction",
    input.domain,
    ...input.tags,
  ]);
  const meta = {
    id: input.id,
    title: input.title,
    summary: input.summary,
    tags,
    body: "note.md",
  };

  const body = `# ${input.title}

> Created: ${input.createdAt}  
> Domain: ${input.domain}  
> Settle by: ${input.settleBy}  
> Status: open

## Assertion (falsifiable)

_Plain statement that can be judged true/false on the settle date._

## Observation window

- Start: ${input.createdAt}
- End: ${input.settleBy}
- Metrics / data sources:

## Stake / action implication

- What I will do if this is right:
- What I will avoid if this is wrong:
- Sleeve affected:

## Settlement

- Result: _pending_ (win / lose / mixed / void)
- Evidence at settlement:
- Lessons:

Use \`fleekelon invest settle ${input.id} --result=win|lose|mixed|void\` to stamp this section.
`;

  return {
    meta: `${JSON.stringify(meta, null, 2)}\n`,
    body,
    bodyName: "note.md",
  };
}

export function renderSettlementBlock(options: {
  settledAt: string;
  result: string;
  notes: string;
}): string {
  const noteLine = options.notes.trim()
    ? options.notes.trim()
    : "_No extra notes._";
  return `## Settlement

- Result: **${options.result}**
- Settled at: ${options.settledAt}
- Evidence at settlement:
  ${noteLine}
- Lessons:
`;
}

function uniqueTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}
