function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe(?![^>]*youtube\.com)(?![^>]*\/widgets\/)[^>]*>/gi, "")
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
 * {{alert: text}}, {{divider}}, {{widget: name}}
 */
export function renderMarkdown(md: string, dark?: boolean): string {
  let html = md
    .replace(/^---[\s\S]*?---\n*/m, "")
    .replace(/\{\{youtube:?\s*([^}]+)\}\}/g, (_: string, id: string) => {
      const videoId =
        id.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? id.trim();
      return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    })
    .replace(/\{\{video:\s*([^}]+)\}\}/g, (_: string, url: string) => {
      const videoId = url.trim().match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? "";
      if (videoId)
        return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      return `<div class="md-video"><video src="${url.trim()}" controls></video></div>`;
    })
    .replace(
      /\{\{image:\s*([^}]+)\}\}/g,
      '<div class="md-image"><img src="$1" alt=""></div>'
    )
    .replace(
      /\{\{alert:\s*([^}]+)\}\}/g,
      '<div class="md-alert">$1</div>'
    )
    .replace(/\{\{divider\}\}/g, '<hr class="md-divider">')
    .replace(/\{\{widget:\s*([^}]+)\}\}/g, (_: string, raw: string) => {
      const parts = raw.trim().split('?');
      const base = parts[0].trim();
      const qs = parts.length > 1 ? '?' + parts.slice(1).join('?') : '';
      return `<div class="md-widget" data-widget="${base}" data-widget-qs="${qs.replace('?', '')}"></div>`;
    })
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\| (.+)$/gm, (_: string, row: string) => {
      const cells = row.split(" | ");
      return "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
    })
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (m: string) => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m: string) => `<ul>${m}</ul>`)
    .split(/\n{2,}/)
    .map(part => {
      part = part.trim();
      if (!part || /^</.test(part)) return part;
      return `<p>${part.replace(/  \n/g, '<br>\n').replace(/\n/g, ' ')}</p>`;
    })
    .join('\n')
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
  return sanitizeHtml(html);
}
