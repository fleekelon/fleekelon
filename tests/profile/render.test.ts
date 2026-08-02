import { describe, expect, it } from "vitest";
import { renderProfileReadme } from "../../src/profile/render.js";

describe("renderProfileReadme", () => {
  it("renders a profile with content links", () => {
    const markdown = renderProfileReadme({
      name: "Frank Li",
      tagline: "Builder",
      location: "Hangzhou",
      highlights: ["Ship tools"],
      links: [{ label: "GitHub", url: "https://github.com/fleekelon" }],
      content: [
        {
          id: "demo",
          kind: "article",
          title: "Demo Article",
          path: "content/articles/demo/article.md",
          summary: "A short summary",
          tags: ["demo"],
          hasPdf: true,
        },
      ],
    });

    expect(markdown).toContain("# Frank Li");
    expect(markdown).toContain(
      "[Demo Article](content/articles/demo/article.md)",
    );
    expect(markdown).toContain("[GitHub](https://github.com/fleekelon)");
  });
});
