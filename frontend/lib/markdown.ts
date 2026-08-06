import { marked } from "marked";
import { parseFrontmatter } from "./frontmatter";

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
 * Markdown renderer. Standard markdown goes through `marked` (GFM);
 * project-specific syntax is handled with a thin pre/post-processing layer:
 * - Custom tags: {{youtube: ID}}, {{video: URL}}, {{image: URL}},
 *   {{icon: name}}, {{alert: text}}, {{divider}}
 * - `**Teoria — X**` / `**Prática — X**` block headings → <h2>
 * - ==highlight== → <mark>
 * - [[term]] → sub-lesson link (#sub-term)
 * - Bare domains / full URLs → smart links
 */
export function renderMarkdown(md: string): string {
  const { content } = parseFrontmatter(md);
  const html = marked.parse(
    content
      // Custom widgets (raw HTML passthrough)
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
      .replace(/\{\{icon:\s*([^}]+)\}\}/g, '<img src="/icons/$1.svg" class="inline-icon" alt="$1">')
      .replace(/\{\{alert:\s*([^}]+)\}\}/g, '<div class="md-alert">$1</div>')
      .replace(/\{\{divider\}\}/g, '<hr class="md-divider">')
      // Teoria / Prática section headings (block-level, before inline bold)
      .replace(/^\*\*(Teoria|Prática) — (.+?)\*\*$/gm, "## $1 — $2")
      // Highlight ==text== (marked has no native support)
      .replace(/==([^=]+)==/g, "<mark>$1</mark>")
      // Sub-lesson links: [[term]] → anchor link
      .replace(/\[\[([^\]]+)\]\]/g, "[$1](#sub-$1)"),
    { async: false }
  );

  return sanitizeHtml(
    html
      .replace(/<hr>/g, '<hr class="md-divider">')
      .replace(/(<table>[\s\S]*?<\/table>)/g, '<div class="md-table-wrapper">$1</div>')
      .replace(/<a href="#sub-([^"]+)">/g, '<a href="#sub-$1" class="sub-lesson-link">')
      .replace(/<a href="(https?:\/\/[^"]+)">/g, '<a href="$1" class="smart-link" target="_blank" rel="noopener noreferrer">')
      // Smart links: bare domains + full URLs → clickable links
      .replace(
        /(^|[\s(,])\.?(https?:\/\/)?(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.(org|com|io|net|dev|pt|br|app|gov|edu|me|co)(\/[^\s<)]*)?)/gi,
        (_: string, before: string, proto: string, www: string, domain: string) => {
          const full = `${proto || "https://"}${www || ""}${domain}`;
          const label = domain.startsWith("www.") ? domain.slice(4) : domain;
          return `${before}<a href="${full}" class="smart-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
      )
  );
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const COPY_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

/**
 * Wraps inline <code> elements (outside <pre> blocks) with a copy button.
 * The button stores the plain text in a data attribute, so the rendered HTML
 * stays declarative and no imperative DOM work is needed at runtime.
 */
export function wrapCodeCopyButtons(html: string): string {
  const preBlocks: string[] = [];
  const protectedHtml = html.replace(/<pre[\s\S]*?<\/pre>/gi, (m) => {
    preBlocks.push(m);
    return `\u0000PRE${preBlocks.length - 1}\u0000`;
  });
  const wrapped = protectedHtml.replace(/<code>([\s\S]*?)<\/code>/g, (_m, code: string) => {
    const text = decodeEntities(code.replace(/<[^>]+>/g, ""));
    return `<span class="cmd-copy-wrapper"><button type="button" class="cmd-copy-btn" aria-label="Copiar comando" data-copy-code="${escapeAttr(text)}">${COPY_SVG}</button>${code}</span>`;
  });
  return wrapped.replace(/\u0000PRE(\d+)\u0000/g, (_m, i: string) => preBlocks[Number(i)]);
}
