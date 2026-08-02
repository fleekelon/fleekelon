export type ContentKind = "article" | "chat-export";

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
