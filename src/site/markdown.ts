/**
 * Minimal markdown → HTML for trusted local catalog bodies.
 * Supports headings, paragraphs, lists, blockquotes, tables, code, emphasis, links.
 */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.trim() === "---") {
      html.push("<hr />");
      i += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      html.push(`<h${level}>${inline(heading[2] ?? "")}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.trimStart().startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trimStart().startsWith(">")) {
        quote.push((lines[i] ?? "").replace(/^\s*>\s?/, ""));
        i += 1;
      }
      html.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*([-*+]|\d+\.)\s+/, ""));
        i += 1;
      }
      const tag = ordered ? "ol" : "ul";
      html.push(
        `<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`,
      );
      continue;
    }

    if (line.includes("|") && (lines[i + 1] ?? "").includes("---")) {
      const rows: string[] = [];
      while (i < lines.length && (lines[i] ?? "").includes("|")) {
        const row = lines[i] ?? "";
        if (!/^\s*\|?\s*:?-{3,}/.test(row)) {
          rows.push(row);
        }
        i += 1;
      }
      if (rows.length > 0) {
        const [header, ...body] = rows;
        const cells = (row: string) =>
          row
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => cell.trim());
        const head = cells(header ?? "")
          .map((cell) => `<th>${inline(cell)}</th>`)
          .join("");
        const bodyHtml = body
          .map(
            (row) =>
              `<tr>${cells(row)
                .map((cell) => `<td>${inline(cell)}</td>`)
                .join("")}</tr>`,
          )
          .join("");
        html.push(
          `<table><thead><tr>${head}</tr></thead><tbody>${bodyHtml}</tbody></table>`,
        );
      }
      continue;
    }

    if (line.trimStart().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      i += 1;
      const code: string[] = [];
      while (
        i < lines.length &&
        !(lines[i] ?? "").trimStart().startsWith("```")
      ) {
        code.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      html.push(
        `<pre><code${lang ? ` class="language-${escapeAttr(lang)}"` : ""}>${escapeHtml(code.join("\n"))}</code></pre>`,
      );
      continue;
    }

    const paragraph: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,4})\s+/.test(lines[i] ?? "") &&
      !(lines[i] ?? "").trimStart().startsWith(">") &&
      !(lines[i] ?? "").trimStart().startsWith("```") &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i] ?? "") &&
      (lines[i] ?? "").trim() !== "---"
    ) {
      paragraph.push(lines[i] ?? "");
      i += 1;
    }
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function inline(text: string): string {
  let value = escapeHtml(text);
  value = value.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label: string, href: string) =>
      `<a href="${escapeAttr(href)}">${label}</a>`,
  );
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  value = value.replace(/_([^_]+)_/g, "<em>$1</em>");
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
