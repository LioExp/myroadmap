/**
 * Simple markdown renderer matching the original script.js implementation.
 * Supports custom tags: {{youtube: ID}}, {{video: URL}}, {{image: URL}},
 * {{alert: text}}, {{divider}}
 */
export function renderMarkdown(md: string): string {
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
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\| (.+)$/gm, (_: string, row: string) => {
      const cells = row.split(" | ");
      return "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (m: string) => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m: string) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<[hult])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "")
    .trim();
  return html;
}
