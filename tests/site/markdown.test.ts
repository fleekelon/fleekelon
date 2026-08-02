import { describe, expect, it } from "vitest";
import { markdownToHtml } from "../../src/site/markdown.js";

describe("markdownToHtml", () => {
  it("renders headings, emphasis, and links", () => {
    const html = markdownToHtml(
      "# Title\n\nHello **world** and [x](https://example.com)\n",
    );
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>world</strong>");
    expect(html).toContain('<a href="https://example.com">x</a>');
  });

  it("renders lists and tables", () => {
    const html = markdownToHtml(
      "- one\n- two\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n",
    );
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<table>");
    expect(html).toContain("<th>A</th>");
    expect(html).toContain("<td>1</td>");
  });
});
