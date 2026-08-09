import { describe, expect, it } from "vitest";
import {
  parseBlocks,
  blockToHtml,
  renderMarkdown,
  wrapCodeCopyButtons,
} from "../markdown";

describe("parseBlocks", () => {
  it("markdown puro é um único bloco html", () => {
    expect(parseBlocks("# Titulo\n\ntexto")).toEqual([
      { type: "html", content: "# Titulo\n\ntexto" },
    ]);
  });

  it("tokeniza widget com query", () => {
    expect(parseBlocks("{{widget: distro-cmd?tool=git}}")).toEqual([
      { type: "widget", name: "distro-cmd", query: "tool=git" },
    ]);
  });

  it("tokeniza widget sem query", () => {
    expect(parseBlocks("{{widget: ksd-cards}}")).toEqual([
      { type: "widget", name: "ksd-cards", query: "" },
    ]);
  });

  it("tokeniza image", () => {
    expect(
      parseBlocks("{{image: https://ex.org/img.svg}}")
    ).toEqual([{ type: "image", url: "https://ex.org/img.svg" }]);
  });

  it("mantém icon inline dentro do texto", () => {
    const blocks = parseBlocks("**Ubuntu**{{icon: ubuntu}}, é uma distro");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toEqual({
      type: "html",
      content: "**Ubuntu**{{icon: ubuntu}}, é uma distro",
    });
  });

  it("distingue video de youtube", () => {
    expect(parseBlocks("{{video: https://ex.org/v.mp4}}")).toEqual([
      { type: "video", url: "https://ex.org/v.mp4", youtube: false },
    ]);
    expect(parseBlocks("{{youtube: dQw4w9WgXcQ}}")).toEqual([
      { type: "video", url: "dQw4w9WgXcQ", youtube: true },
    ]);
  });

  it("tokeniza alert e divider", () => {
    expect(parseBlocks("{{alert: cuidado}} e {{divider}}")).toEqual([
      { type: "alert", text: "cuidado" },
      { type: "html", content: " e " },
      { type: "divider" },
    ]);
  });

  it("mantém tags não fechadas como texto", () => {
    expect(parseBlocks("texto {{widget: x")).toEqual([
      { type: "html", content: "texto {{widget: x" },
    ]);
  });

  it("filtra blocos html em branco", () => {
    expect(parseBlocks("\n\n{{divider}}\n\n")).toEqual([{ type: "divider" }]);
  });
});

describe("blockToHtml", () => {
  it("widget → placeholder", () => {
    expect(blockToHtml({ type: "widget", name: "ksd-cards", query: "" })).toContain(
      'class="md-widget-placeholder"'
    );
  });

  it("youtube com id simples → iframe embed", () => {
    const html = blockToHtml({ type: "video", url: "dQw4w9WgXcQ", youtube: true });
    expect(html).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ"');
  });

  it("video youtube por URL → iframe embed", () => {
    const html = blockToHtml({
      type: "video",
      url: "https://youtu.be/dQw4w9WgXcQ?t=5",
      youtube: false,
    });
    expect(html).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ?t=5"');
  });

  it("video direto → tag <video>", () => {
    const html = blockToHtml({ type: "video", url: "https://ex.org/v.mp4", youtube: false });
    expect(html).toContain('<video src="https://ex.org/v.mp4" controls>');
  });

  it("escapa atributos", () => {
    const html = blockToHtml({ type: "image", url: 'https://ex.org/a&b"c.png' });
    expect(html).not.toContain('a&b"c');
  });
});

describe("renderMarkdown", () => {
  it("remove o frontmatter", () => {
    const html = renderMarkdown("---\ntitulo: A\n---\n\n# Ola");
    expect(html).toContain("<h1>Ola</h1>");
    expect(html).not.toContain("titulo:");
  });

  it("**Teoria — X** → h2", () => {
    const html = renderMarkdown("**Teoria — fundamentos**");
    expect(html).toContain("<h2>Teoria — fundamentos</h2>");
  });

  it("==texto== → mark", () => {
    expect(renderMarkdown("um ==destaque== aqui")).toContain(
      "um <mark>destaque</mark> aqui"
    );
  });

  it("[[termo]] → link de sub-aula", () => {
    const html = renderMarkdown("ver [[sudo]] para mais");
    expect(html).toContain('href="#sub-sudo" class="sub-lesson-link"');
  });

  it("{{icon:}} → img inline", () => {
    expect(renderMarkdown("**Ubuntu**{{icon: ubuntu}}")).toContain(
      '<img src="/icons/ubuntu.svg" class="inline-icon"'
    );
  });

  it("{{widget:}} → placeholder HTML", () => {
    const html = renderMarkdown("{{widget: ksd-cards}}");
    expect(html).toContain('class="md-widget-placeholder"');
    expect(html).toContain("widget: ksd-cards");
  });

  it("{{image:}} → div md-image", () => {
    const html = renderMarkdown("{{image: https://ex.org/img.png}}");
    expect(html).toContain('<div class="md-image">');
    expect(html).toContain('src="https://ex.org/img.png"');
  });

  it("{{alert:}} → div md-alert", () => {
    expect(renderMarkdown("{{alert: cuidado}}")).toContain(
      '<div class="md-alert">cuidado</div>'
    );
  });

  it("{{divider}} → hr com classe", () => {
    expect(renderMarkdown("{{divider}}")).toContain('<hr class="md-divider"');
  });

  it("tabela → wrapper", () => {
    const html = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |");
    expect(html).toContain('<div class="md-table-wrapper"><table>');
  });

  it("hr de markdown ganha classe", () => {
    expect(renderMarkdown("texto\n\n---")).toContain('<hr class="md-divider"');
  });

  it("domain solto → smart link", () => {
    const html = renderMarkdown("vê em kernel.org para mais");
    expect(html).toContain(
      '<a href="https://kernel.org" class="smart-link" target="_blank" rel="noopener noreferrer">kernel.org</a>'
    );
  });

  it("url completa já linkada pelo marked ganha smart-link", () => {
    const html = renderMarkdown("link: https://example.org/docs");
    expect(html).toContain(
      'href="https://example.org/docs" class="smart-link" target="_blank" rel="noopener noreferrer">https://example.org/docs</a>'
    );
  });

  it("não duplica link dentro de anchor existente", () => {
    const html = renderMarkdown("[texto](https://example.org)");
    const anchors = html.match(/<a /g) ?? [];
    expect(anchors).toHaveLength(1);
    expect(html).not.toContain("<a <a");
  });

  it("não linka dentro de src de imagem", () => {
    const html = renderMarkdown("{{image: https://example.org/img.png}}");
    expect(html.match(/<a /g)).toBeNull();
  });

  it("remove pontuação final do domínio", () => {
    const html = renderMarkdown("vê em kernel.org, agora");
    expect(html).toContain('>kernel.org</a>, agora');
  });
});

describe("renderMarkdown — sanitização", () => {
  it("remove <script>", () => {
    const html = renderMarkdown("# titulo\n<script>alert(1)</script>");
    expect(html).not.toContain("<script");
  });

  it("remove handlers on*", () => {
    const html = renderMarkdown('<b onclick="x()">texto</b>');
    expect(html).not.toContain("onclick");
    expect(html).toContain("<b>texto</b>");
  });

  it("remove javascript: em href", () => {
    const html = renderMarkdown("[x](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
  });

  it("remove iframe não-youtube", () => {
    const html = renderMarkdown('<iframe src="https://evil.com"></iframe>');
    expect(html).not.toContain("<iframe");
  });

  it("remove <object>/<embed>/<form>", () => {
    const html = renderMarkdown(
      '<object data="x"></object><embed src="x"><form action="x"></form>'
    );
    expect(html).not.toContain("<object");
    expect(html).not.toContain("<embed");
    expect(html).not.toContain("<form");
  });

  it("remove atributo style", () => {
    const html = renderMarkdown('<p style="background:url(javascript:x)">x</p>');
    expect(html).not.toContain("style=");
  });

  it("mantém iframe youtube do bloco {{youtube}}", () => {
    const html = renderMarkdown("{{youtube: dQw4w9WgXcQ}}");
    expect(html).toContain('<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"');
  });
});

describe("wrapCodeCopyButtons", () => {
  it("envolve code inline com copy button", () => {
    const html = wrapCodeCopyButtons("<p>corre <code>sudo apt install</code></p>");
    expect(html).toContain('class="cmd-copy-wrapper"');
    expect(html).toContain('data-copy-code="sudo apt install"');
  });

  it("descodifica entidades no data-copy-code", () => {
    const html = wrapCodeCopyButtons("<p><code>sudo apt install &lt;pacote&gt;</code></p>");
    expect(html).toContain('data-copy-code="sudo apt install &lt;pacote&gt;"');
  });

  it("não mexe em blocos <pre>", () => {
    const html = wrapCodeCopyButtons("<pre><code>apt install foo\napt update</code></pre>");
    expect(html).not.toContain("cmd-copy-wrapper");
    expect(html).toContain("<pre><code>apt install foo");
  });
});
