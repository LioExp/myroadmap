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
 * Code-fences especiais (conteúdo `chave: valor`, uma por linha):
 * - ```pergunta  → pergunta interativa (resposta em tiles, dica, limite)
 * - ```terminal  → pergunta estilo terminal (resposta curta digitada)
 * - ```exercicio → exercício de código (editor com inicio/esperado)
 * - ```audio     → player de áudio (url, titulo)
 * - ```imagem    → figura com titulo/legenda (url, titulo, legenda)
 * - ```animacao  → passos que se revelam em sequência (titulo, passo*)
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
  | { type: "divider" }
  | { type: "audio"; url: string; title?: string }
  | { type: "imagem"; url: string; titulo?: string; legenda?: string }
  | { type: "animacao"; titulo?: string; passos: string[] }
  | {
      type: "pergunta";
      pergunta: string;
      resposta: string;
      dica?: string;
      limite?: number;
    }
  | {
      type: "terminal";
      pergunta: string;
      resposta: string;
      dica?: string;
      limite?: number;
    }
  | {
      type: "exercicio";
      titulo: string;
      instrucoes: string[];
      arquivo?: string;
      dica?: string;
      inicio: string;
      esperado: string;
    };

const BLOCK_TAG_RE =
  /\{\{(widget|image|video|youtube|alert|divider)(?::\s*([^}]+))?\}\}/g;

/** Code-fences com linguagem especial (sintaxe da referência Duolingo). */
const FENCE_RE = /```(pergunta|terminal|exercicio|audio|imagem|animacao)\s*\n([\s\S]*?)```/g;

const FIRST_VALUE_RE = /^([a-zA-Z\u00e0-\u00ff]+):\s*(.*)$/;

/** Parseia o corpo `chave: valor` de um code-fence especial; null se inválido. */
export function parseFenceBlock(lang: string, body: string): Block | null {
  const fields = new Map<string, string[]>();
  for (const line of body.split("\n")) {
    const m = line.match(FIRST_VALUE_RE);
    if (!m) continue;
    const list = fields.get(m[1]) ?? [];
    list.push(m[2]);
    fields.set(m[1], list);
  }
  const first = (key: string) => fields.get(key)?.[0]?.trim() ?? "";
  const optional = (key: string) => {
    const v = first(key);
    return v ? v : undefined;
  };
  switch (lang) {
    case "audio": {
      const url = first("url");
      if (!url) return null;
      return { type: "audio", url, ...(optional("titulo") ? { title: optional("titulo") } : {}) };
    }
    case "imagem": {
      const url = first("url");
      if (!url) return null;
      return {
        type: "imagem",
        url,
        ...(optional("titulo") ? { titulo: optional("titulo") } : {}),
        ...(optional("legenda") ? { legenda: optional("legenda") } : {}),
      };
    }
    case "animacao": {
      const passos = (fields.get("passo") ?? [])
        .map((s) => s.trim())
        .filter(Boolean);
      if (passos.length === 0) return null;
      return {
        type: "animacao",
        ...(optional("titulo") ? { titulo: optional("titulo") } : {}),
        passos,
      };
    }
    case "pergunta": {
      const pergunta = first("pergunta");
      const resposta = first("resposta");
      if (!pergunta || !resposta) return null;
      const limiteRaw = first("limite");
      const limite = limiteRaw ? Number(limiteRaw) : undefined;
      return {
        type: "pergunta",
        pergunta,
        resposta,
        ...(optional("dica") ? { dica: optional("dica") } : {}),
        ...(limite && Number.isFinite(limite) ? { limite } : {}),
      };
    }
    case "terminal": {
      const pergunta = first("pergunta");
      const resposta = first("resposta");
      if (!pergunta || !resposta) return null;
      const limiteRaw = first("limite");
      const limite = limiteRaw ? Number(limiteRaw) : undefined;
      return {
        type: "terminal",
        pergunta,
        resposta,
        ...(optional("dica") ? { dica: optional("dica") } : {}),
        ...(limite && Number.isFinite(limite) ? { limite } : {}),
      };
    }
    case "exercicio": {
      const instrucoes: string[] = [];
      let titulo = "";
      let arquivo: string | undefined;
      let dica: string | undefined;
      let mode: "keys" | "instrucoes" | "inicio" | "esperado" = "keys";
      const inicioLines: string[] = [];
      const esperadoLines: string[] = [];
      for (const line of body.split("\n")) {
        if (mode === "inicio") {
          if (/^esperado:\s*$/.test(line)) {
            mode = "esperado";
            continue;
          }
          inicioLines.push(line);
          continue;
        }
        if (mode === "esperado") {
          esperadoLines.push(line);
          continue;
        }
        const m = line.match(FIRST_VALUE_RE);
        if (mode === "instrucoes") {
          if (m) {
            mode = "keys";
          } else {
            const step = line.trim();
            if (step) instrucoes.push(step);
            continue;
          }
        }
        if (m) {
          const key = m[1];
          const value = m[2].trim();
          if (key === "titulo") titulo = value;
          else if (key === "arquivo") arquivo = value;
          else if (key === "dica") dica = value;
          else if (key === "instrucoes") mode = "instrucoes";
          else if (key === "inicio") mode = "inicio";
          else if (key === "esperado") mode = "esperado";
        }
      }
      const inicio = inicioLines.join("\n").trim();
      const esperado = esperadoLines.join("\n").trim();
      if (!titulo || !inicio || !esperado) return null;
      return {
        type: "exercicio",
        titulo,
        instrucoes,
        ...(arquivo ? { arquivo } : {}),
        ...(dica ? { dica } : {}),
        inicio,
        esperado,
      };
    }
    default:
      return null;
  }
}

/** Tokeniza o markdown em blocos; tags inline (ex: {{icon:}})) ficam no texto. */
export function parseBlocks(content: string): Block[] {
  const fenceBlocks: Block[] = [];
  const masked = content.replace(FENCE_RE, (full, lang: string, body: string) => {
    const block = parseFenceBlock(lang, body);
    if (!block) return full;
    fenceBlocks.push(block);
    return `\u0000F${fenceBlocks.length - 1}\u0000`;
  });

  const blocks: Block[] = [];
  const pushHtmlText = (text: string) => {
    let pos = 0;
    const phRe = /\u0000F(\d+)\u0000/g;
    let ph: RegExpExecArray | null;
    while ((ph = phRe.exec(text)) !== null) {
      if (ph.index > pos) {
        blocks.push({ type: "html", content: text.slice(pos, ph.index) });
      }
      blocks.push(fenceBlocks[Number(ph[1])]);
      pos = ph.index + ph[0].length;
    }
    if (pos < text.length) {
      blocks.push({ type: "html", content: text.slice(pos) });
    }
  };

  let last = 0;
  const re = new RegExp(BLOCK_TAG_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(masked)) !== null) {
    const index = match.index;
    if (index > last) {
      pushHtmlText(masked.slice(last, index));
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

  if (last < masked.length) {
    pushHtmlText(masked.slice(last));
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

/** Reconstrói o texto DSL original (fence ou tag) a partir de um bloco. */
export function blockToDsl(block: Block): string {
  switch (block.type) {
    case "widget":
      return block.query
        ? `{{widget: ${block.name}?${block.query}}}`
        : `{{widget: ${block.name}}}`;
    case "image":
      return `{{image: ${block.url}}}`;
    case "video":
      return `{{${block.youtube ? "youtube" : "video"}: ${block.url}}}`;
    case "alert":
      return `{{alert: ${block.text}}}`;
    case "divider":
      return "{{divider}}";
    case "audio":
      return [
        "```audio",
        `url: ${block.url}`,
        ...(block.title ? [`titulo: ${block.title}`] : []),
        "```",
      ].join("\n");
    case "imagem":
      return [
        "```imagem",
        `url: ${block.url}`,
        ...(block.titulo ? [`titulo: ${block.titulo}`] : []),
        ...(block.legenda ? [`legenda: ${block.legenda}`] : []),
        "```",
      ].join("\n");
    case "animacao":
      return [
        "```animacao",
        ...(block.titulo ? [`titulo: ${block.titulo}`] : []),
        ...block.passos.map((p) => `passo: ${p}`),
        "```",
      ].join("\n");
    case "pergunta":
    case "terminal":
      return [
        `\`\`\`${block.type}`,
        `pergunta: ${block.pergunta}`,
        `resposta: ${block.resposta}`,
        ...(block.dica ? [`dica: ${block.dica}`] : []),
        ...(block.limite ? [`limite: ${block.limite}`] : []),
        "```",
      ].join("\n");
    case "exercicio":
      return [
        "```exercicio",
        `titulo: ${block.titulo}`,
        ...(block.instrucoes.length
          ? ["instrucoes:", ...block.instrucoes]
          : []),
        ...(block.arquivo ? [`arquivo: ${block.arquivo}`] : []),
        ...(block.dica ? [`dica: ${block.dica}`] : []),
        "inicio:",
        block.inicio,
        "esperado:",
        block.esperado,
        "```",
      ].join("\n");
    case "html":
      throw new Error("blockToDsl: html blocks não têm DSL");
  }
}

/**
 * Serialização HTML de blocos não-markdown (widgets ficam como placeholder).
 * Com `includeDsl` embute o texto DSL original num data-dsl (usado só pelo
 * editor WYSIWYG — no viewer nunca é emitido, para não expor as respostas).
 */
export function blockToHtml(block: Block, includeDsl = false): string {
  const dsl = includeDsl ? ` data-dsl="${escapeAttr(blockToDsl(block))}"` : "";
  switch (block.type) {
    case "widget":
      return `<div class="md-widget-placeholder"${dsl}>widget: ${block.name}</div>`;
    case "image":
      return `<div class="md-image"${dsl}><img src="${escapeAttr(block.url)}" alt=""></div>`;
    case "alert":
      return `<div class="md-alert"${dsl}>${block.text}</div>`;
    case "divider":
      return `<hr class="md-divider"${dsl}>`;
    case "video": {
      const id = youtubeIdFromUrl(block.url);
      if (block.youtube || id) {
        return `<div class="md-video"${dsl}><iframe src="https://www.youtube.com/embed/${escapeAttr(id ?? block.url)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      return `<div class="md-video"${dsl}><video src="${escapeAttr(block.url)}" controls></video></div>`;
    }
    case "audio":
      return `<div class="md-audio"${dsl}>${block.title ? `<div class="md-media-title">${escapeAttr(block.title)}</div>` : ""}<audio controls preload="metadata" src="${escapeAttr(block.url)}"></audio></div>`;
    case "imagem":
      return `<figure class="md-figure"${dsl}>${block.titulo ? `<figcaption class="md-figure-title">${escapeAttr(block.titulo)}</figcaption>` : ""}<img src="${escapeAttr(block.url)}" alt="${escapeAttr(block.titulo ?? "")}">${block.legenda ? `<figcaption class="md-figure-caption">${escapeAttr(block.legenda)}</figcaption>` : ""}</figure>`;
    case "animacao":
      return `<div class="md-animacao"${dsl}>${block.titulo ? `<div class="md-animacao-title">${escapeAttr(block.titulo)}</div>` : ""}<ol>${block.passos.map((p) => `<li>${escapeAttr(p)}</li>`).join("")}</ol></div>`;
    case "pergunta":
      return `<div class="md-pergunta"${dsl}>${block.dica ? `<p class="md-pergunta-dica">💡 ${escapeAttr(block.dica)}</p>` : ""}<p class="md-pergunta-enunciado">${escapeAttr(block.pergunta)}</p></div>`;
    case "terminal":
      return `<div class="md-terminal"${dsl}>${block.dica ? `<p class="md-terminal-dica">💡 ${escapeAttr(block.dica)}</p>` : ""}<p class="md-terminal-enunciado">${escapeAttr(block.pergunta)}</p></div>`;
    case "exercicio":
      return `<div class="md-exercicio"${dsl}><p class="md-exercicio-titulo">${escapeAttr(block.titulo)}</p>${block.instrucoes.length ? `<ol class="md-exercicio-instrucoes">${block.instrucoes.map((s) => `<li>${escapeAttr(s)}</li>`).join("")}</ol>` : ""}<pre class="md-exercicio-codigo"><code>${escapeAttr(block.inicio)}</code></pre></div>`;
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

/**
 * Renderiza markdown → HTML sanitizado. Partilhado por viewer e editor;
 * `includeDsl` (só editor) embute o texto DSL original nos blocos.
 */
export function renderMarkdown(md: string, includeDsl = false): string {
  const { content } = parseFrontmatter(md);
  const html = parseBlocks(content)
    .map((block) =>
      block.type === "html" ? markdownToHtml(block.content) : blockToHtml(block, includeDsl)
    )
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
