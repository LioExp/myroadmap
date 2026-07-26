function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe(?![^>]*(youtube\.com|player\.vimeo\.com))[^>]*>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "");
}

/**
 * Simple markdown renderer matching the original script.js implementation.
 * Supports custom tags: {{youtube: ID}}, {{video: URL}}, {{image: URL}},
 * {{alert: text}}, {{divider}}
 */
export function renderMarkdown(md: string): string {
  let html = md
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n*/m, "")
    // Custom widgets
    .replace(/\{\{youtube:?\s*([^}]+)\}\}/g, (_: string, id: string) => {
      const videoId = id.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? id.trim();
      return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    })
    .replace(/\{\{video:\s*([^}]+)\}\}/g, (_: string, url: string) => {
      const videoId = url.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? "";
      if (videoId)
        return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      return `<div class="md-video"><video src="${url.trim()}" controls></video></div>`;
    })
    .replace(/\{\{image:\s*([^}]+)\}\}/g, '<div class="md-image"><img src="$1" alt=""></div>')
    .replace(/\{\{alert:\s*([^}]+)\}\}/g, '<div class="md-alert">$1</div>')
    .replace(/\{\{divider\}\}/g, '<hr class="md-divider">')
    // Horizontal rule: standalone ---
    .replace(/^---\s*$/gm, '<hr class="md-divider">')
    // Headings
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    // Bold, italic, inline code, strikethrough, highlight
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    // Tables: process each table block
    .replace(/(^\|.+\|\n?)+/gm, (block: string) => {
      const rows = block.trim().split("\n").filter(r => r.trim());
      const filtered = rows.filter(r => !/^\|[\s:-]+\|/.test(r));
      if (filtered.length === 0) return "";
      const tableRows = filtered
        .map((row) => {
          const cells = row
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("\n");
      return `<div class="md-table-wrapper"><table>${tableRows}</table></div>`;
    })
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m: string) => `<ul>${m}</ul>`)
    // Paragraphs: split by blank lines
    .split(/\n{2,}/)
    .map((part) => {
      part = part.trim();
      if (!part || /^</.test(part)) return part;
      if (/^<(ul|ol|table|div|h[234]|hr|blockquote)/.test(part)) return part;
      return `<p>${part.replace(/  \n/g, "<br>\n").replace(/\n/g, " ")}</p>`;
    })
    .join("\n")
    .replace(/<p>\s*<\/p>/g, "")
    // Nest consecutive blockquotes together
    .replace(/(<blockquote>[\s\S]*?<\/blockquote>\n?)+/g, (m: string) => {
      const inner = m.replace(/<\/blockquote>\n?<blockquote>/g, "\n");
      return inner;
    })
    .trim();

  return sanitizeHtml(html);
}
