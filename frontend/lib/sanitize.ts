import sanitizeHtmlLib from "sanitize-html";

/**
 * Allowlist de tags/atributos para o HTML renderizado a partir de markdown.
 * Substitui a antiga sanitização por regex (frágil e burlável) por uma
 * allowlist real. Isomórfico: corre igual em SSR, cliente e testes.
 */

const ALLOWED_TAGS = [
  // Estrutura
  "div", "span", "p", "br", "hr", "section", "header", "footer", "main",
  "article", "aside", "details", "summary", "figure", "figcaption",
  // Headings / texto
  "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "strong", "em", "b", "i", "u", "s", "del", "ins", "small", "mark",
  "abbr", "bdi", "bdo", "cite", "code", "data", "dfn", "kbd", "q", "rb",
  "rp", "rt", "rtc", "ruby", "samp", "sub", "sup", "time", "var", "wbr",
  // Listas
  "ul", "ol", "li", "dl", "dt", "dd",
  // Blocos especiais
  "blockquote", "pre",
  // Tabelas
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
  "col", "colgroup",
  // Media
  "img", "iframe", "video", "audio", "source",
];

const ALLOWED_ATTRS: Record<string, string[]> = {
  "*": ["class", "id", "title"],
  a: ["href", "name", "target", "rel"],
  img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
  iframe: [
    "src",
    "title",
    "allow",
    "allowfullscreen",
    "frameborder",
    "width",
    "height",
    "loading",
  ],
  video: ["src", "controls", "poster", "width", "height"],
  audio: ["src", "controls", "preload", "loop"],
  source: ["src", "type"],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  ol: ["start"],
  code: ["class"],
  details: ["open"],
};

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "youtube-nocookie.com",
      "player.vimeo.com",
    ],
    allowProtocolRelative: false,
    // iframes com src não permitido ficam sem src após o filtro de hostnames;
    // removê-los por completo evita iframes vazios no DOM.
    exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  });
}
