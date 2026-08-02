export type ContentKind = "article" | "note" | "thesis" | "chat-export";

export type ContentItem = {
  id: string;
  kind: ContentKind;
  title: string;
  path: string;
  summary: string;
  tags: string[];
  hasPdf: boolean;
};

export type ContentIssue = {
  id: string;
  level: "error" | "warning";
  message: string;
};

export type ContentValidationReport = {
  items: ContentItem[];
  issues: ContentIssue[];
  ok: boolean;
};

export type ContentStats = {
  total: number;
  byKind: Record<ContentKind, number>;
  tags: Array<{ tag: string; count: number }>;
  withPdf: number;
};

export type ContentSearchHit = {
  item: ContentItem;
  score: number;
  matchedIn: Array<"id" | "title" | "summary" | "tags" | "body">;
};
