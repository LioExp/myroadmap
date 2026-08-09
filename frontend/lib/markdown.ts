import { marked } from "marked";
import { parseFrontmatter } from "./frontmatter";
import { sanitizeHtml } from "./sanitize";

/**
 * Renderer de markdown. O markdown standard passa pelo `marked` (GFM);
 * a sintaxe própria do projeto é processada num passo único e partilhado:
 *
 * Blocos (tokenizados e renderizados fora do marked):
 * - {{widget: nome?query}}   → componente React (só no viewer)
 * - {{image: URL}}
 * - {{video: URL}}           → iframe YouTube se aplicável, senão <video>
 * - {{youtube: ID|URL}}
 * - {{alert: texto}}
 * - {{divider}}
 *
 * Inline (convertidos antes do marked):
 * - {{icon: nome}}           → <img class="inline-icon">
 * - `**Teoria — X**` / `**Prática — X**` → <h2>
 * - ==texto==                → <mark>
 * - [[termo]]                → link de sub-aula (#sub-termo)
 *
 * Bare domains (ex: kernel.org) → smart links. Todo o HTML de saída passa
 * por uma sanitização allowlist (lib/sanitize.ts) antes de ser devolvido.
 */

export type Block =
  | { type: "html"; content: string }
  | { type: "widget"; name: string; query: string }
  | { type: "image"; url: string }
  | { type: "video"; url: string; youtube: boolean }
  | { type: "alert"; text: string }
  | { type: "divider" };

const BLOCK_TAG_RE =
  /\{\{(widget|image|video|youtube|alert|divider)(?::\s*([^}]+))?\}\}/g;

/** Tokeniza o markdown em blocos; tags inline (ex: {{icon:}})) ficam no texto. */
export function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let last = 0;
  const re = new RegExp(BLOCK_TAG_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(content)) !== null) {
    const index = match.index;
    if (index > last) {
      blocks.push({ type: "html", content: content.slice(last, index) });
    }
    const tag = match[1];
    const raw = (match[2] ?? "").trim();
    if (tag === "divider") {
      blocks.push({ type: "divider" });
    } else if (tag === "image") {
      blocks.push({ type: "image", url: raw });
    } else if (tag === "alert") {
      blocks.push({ type: "alert", text: raw });
    } else if (tag === "widget") {
      const qIdx = raw.indexOf("?");
      blocks.push({
        type: "widget",
        name: (qIdx >= 0 ? raw.slice(0, qIdx) : raw).trim(),
        query: qIdx >= 0 ? raw.slice(qIdx + 1) : "",
      });
    } else {
      blocks.push({ type: "video", url: raw, youtube: tag === "youtube" });
    }
    last = index + match[0].length;
  }

  if (last < content.length) {
    blocks.push({ type: "html", content: content.slice(last) });
  }
  return blocks.filter((b) => b.type !== "html" || b.content.trim().length > 0);
}

function youtubeIdFromUrl(url: string): string | null {
  return url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? null;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Serialização HTML de blocos não-markdown (widgets ficam como placeholder). */
export function blockToHtml(block: Block): string {
  switch (block.type) {
    case "widget":
      return `<div class="md-widget-placeholder">widget: ${block.name}</div>`;
    case "image":
      return `<div class="md-image"><img src="${escapeAttr(block.url)}" alt=""></div>`;
    case "alert":
      return `<div class="md-alert">${block.text}</div>`;
    case "divider":
      return `<hr class="md-divider">`;
    case "video": {
      const id = youtubeIdFromUrl(block.url);
      if (block.youtube || id) {
        return `<div class="md-video"><iframe src="https://www.youtube.com/embed/${escapeAttr(id ?? block.url)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      return `<div class="md-video"><video src="${escapeAttr(block.url)}" controls></video></div>`;
    }
    case "html":
      throw new Error("blockToHtml: html blocks são processados via marked");
  }
}

// ── Extensões inline (aplicadas ao texto markdown antes do marked) ──────────

function applyInlineExtensions(md: string): string {
  return md
    .replace(/\{\{icon:\s*([^}]+)\}\}/g, '<img src="/icons/$1.svg" class="inline-icon" alt="$1">')
    .replace(/^\*\*(Teoria|Prática) — (.+?)\*\*$/gm, "## $1 — $2")
    .replace(/==([^=]+)==/g, "<mark>$1</mark>")
    .replace(/\[\[([^\]]+)\]\]/g, "[$1](#sub-$1)");
}

// ── Smart links (bare domains) ──────────────────────────────────────────────

const BARE_URL_RE =
  /(^|[^\w@/.-])((?:https?:\/\/)?(?:www\.)?[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.(?:org|com|io|net|dev|pt|br|app|gov|edu|me|co)(?:\/[^\s<>"'()]*)?)/gi;

/**
 * Converte domínios soltos (sem protocolo) em links. Os anchors existentes e
 * atributos href/src/srcset são mascarados primeiro, para nunca duplicar
 * links nem tocar em atributos já renderizados pelo marked.
 */
function linkifyBareUrls(html: string): string {
  const keep: string[] = [];
  const masked = html
    .replace(/<a[\s\S]*?<\/a>/gi, (m) => {
      keep.push(m);
      return `\u0000L${keep.length - 1}\u0000`;
    })
    .replace(/(?:href|src|srcset)="[^"]*"/gi, (m) => {
      keep.push(m);
      return `\u0000L${keep.length - 1}\u0000`;
    });
  const linked = masked.replace(BARE_URL_RE, (_m, before: string, url: string) => {
    const clean = url.replace(/[.,;:!?]+$/, "");
    const href = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    const label = clean.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    return `${before}<a href="${escapeAttr(href)}" class="smart-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  return linked.replace(/\u0000L(\d+)\u0000/g, (_m, i: string) => keep[Number(i)]);
}

// ── Render ──────────────────────────────────────────────────────────────────

function markdownToHtml(md: string): string {
  const html = marked.parse(applyInlineExtensions(md), { async: false }) as string;
  return linkifyBareUrls(
    html
      .replace(/<hr>/g, '<hr class="md-divider">')
      .replace(/(<table>[\s\S]*?<\/table>)/g, '<div class="md-table-wrapper">$1</div>')
      .replace(/<a href="#sub-([^"]+)">/g, '<a href="#sub-$1" class="sub-lesson-link">')
      .replace(
        /<a href="(https?:\/\/[^"]+)">/g,
        '<a href="$1" class="smart-link" target="_blank" rel="noopener noreferrer">'
      )
  );
}

/** Renderiza markdown → HTML sanitizado. Partilhado por viewer e editor. */
export function renderMarkdown(md: string): string {
  const { content } = parseFrontmatter(md);
  const html = parseBlocks(content)
    .map((block) => (block.type === "html" ? markdownToHtml(block.content) : blockToHtml(block)))
    .join("\n");
  return sanitizeHtml(html);
}

// ── Copy buttons (inline code) ──────────────────────────────────────────────

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
