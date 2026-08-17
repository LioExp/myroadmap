import { describe, expect, it } from "vitest";
import {
  parseBlocks,
  blockToHtml,
  blockToDsl,
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

describe("parseBlocks — code-fences especiais", () => {
  it("```pergunta completo → bloco pergunta", () => {
    expect(
      parseBlocks(
        "```pergunta\npergunta: Qual é o kernel?\nresposta: linux\ndica: é o kernel\nlimite: 32\n```"
      )
    ).toEqual([
      {
        type: "pergunta",
        pergunta: "Qual é o kernel?",
        resposta: "linux",
        dica: "é o kernel",
        limite: 32,
      },
    ]);
  });

  it("```pergunta sem resposta → fica como texto", () => {
    expect(parseBlocks("```pergunta\npergunta: X\n```")).toEqual([
      { type: "html", content: "```pergunta\npergunta: X\n```" },
    ]);
  });

  it("```animacao com passos repetidos", () => {
    expect(
      parseBlocks("```animacao\ntitulo: Como criar\npasso: Um\npasso: Dois\n```")
    ).toEqual([
      { type: "animacao", titulo: "Como criar", passos: ["Um", "Dois"] },
    ]);
  });

  it("```animacao sem passos → fica como texto", () => {
    expect(parseBlocks("```animacao\ntitulo: X\n```")).toEqual([
      { type: "html", content: "```animacao\ntitulo: X\n```" },
    ]);
  });

  it("```audio e ```imagem", () => {
    expect(parseBlocks("```audio\nurl: https://ex.org/a.mp3\ntitulo: Narração\n```")).toEqual([
      { type: "audio", url: "https://ex.org/a.mp3", title: "Narração" },
    ]);
    expect(
      parseBlocks("```imagem\nurl: https://ex.org/i.png\ntitulo: Diagrama\nlegenda: Fonte: ex\n```")
    ).toEqual([
      {
        type: "imagem",
        url: "https://ex.org/i.png",
        titulo: "Diagrama",
        legenda: "Fonte: ex",
      },
    ]);
  });

  it("fence misturado com tags {{}} mantém ordem", () => {
    const blocks = parseBlocks(
      "texto\n\n```audio\nurl: https://ex.org/a.mp3\n```\n\n{{divider}}"
    );
    expect(blocks).toEqual([
      { type: "html", content: "texto\n\n" },
      { type: "audio", url: "https://ex.org/a.mp3" },
      { type: "divider" },
    ]);
  });

  it("fence sem fechar → fica como texto", () => {
    expect(parseBlocks("```pergunta\npergunta: X\nresposta: Y")).toEqual([
      { type: "html", content: "```pergunta\npergunta: X\nresposta: Y" },
    ]);
  });

  it("```terminal → bloco terminal", () => {
    expect(
      parseBlocks("```terminal\npergunta: Qual comando mostra o kernel?\nresposta: uname -r\n```")
    ).toEqual([
      { type: "terminal", pergunta: "Qual comando mostra o kernel?", resposta: "uname -r" },
    ]);
  });

  it("```terminal sem resposta → fica como texto", () => {
    expect(parseBlocks("```terminal\npergunta: X\n```")).toEqual([
      { type: "html", content: "```terminal\npergunta: X\n```" },
    ]);
  });

  it("```exercicio completo → bloco exercicio", () => {
    const blocks = parseBlocks(
      "```exercicio\ntitulo: Imprime três vezes\ninstrucoes:\n1. Cria um while.\n2. Incrementa.\narquivo: script.py\ndica: Usa while\ninicio:\nn = 0\n\n\nesperado:\nn = 0\nwhile n < 3:\n    print('x')\n    n += 1\n```"
    );
    expect(blocks).toEqual([
      {
        type: "exercicio",
        titulo: "Imprime três vezes",
        instrucoes: ["1. Cria um while.", "2. Incrementa."],
        arquivo: "script.py",
        dica: "Usa while",
        inicio: "n = 0",
        esperado: "n = 0\nwhile n < 3:\n    print('x')\n    n += 1",
      },
    ]);
  });

  it("```exercicio sem esperado → fica como texto", () => {
    expect(
      parseBlocks("```exercicio\ntitulo: X\ninicio:\nn = 0\n```")
    ).toEqual([
      { type: "html", content: "```exercicio\ntitulo: X\ninicio:\nn = 0\n```" },
    ]);
  });
});

describe("blockToHtml — novos blocos", () => {
  it("audio → player com título", () => {
    const html = blockToHtml({
      type: "audio",
      url: "https://ex.org/a.mp3",
      title: "Narração",
    });
    expect(html).toContain('<div class="md-audio">');
    expect(html).toContain('src="https://ex.org/a.mp3"');
    expect(html).toContain("controls");
    expect(html).toContain("Narração");
  });

  it("imagem → figure com título e legenda", () => {
    const html = blockToHtml({
      type: "imagem",
      url: "https://ex.org/i.png",
      titulo: "Diagrama",
      legenda: "Fonte: ex",
    });
    expect(html).toContain('<figure class="md-figure">');
    expect(html).toContain('<figcaption class="md-figure-title">Diagrama</figcaption>');
    expect(html).toContain('<figcaption class="md-figure-caption">Fonte: ex</figcaption>');
  });

  it("pergunta → estático sem expor a resposta", () => {
    const html = blockToHtml({
      type: "pergunta",
      pergunta: "Qual é o kernel?",
      resposta: "linux",
      dica: "dica x",
      limite: 32,
    });
    expect(html).toContain("Qual é o kernel?");
    expect(html).toContain("dica x");
    expect(html).not.toContain("linux");
  });

  it("animacao → lista de passos", () => {
    const html = blockToHtml({
      type: "animacao",
      titulo: "T",
      passos: ["Um", "Dois"],
    });
    expect(html).toContain('<ol>');
    expect(html).toContain("<li>Um</li>");
    expect(html).toContain("<li>Dois</li>");
  });

  it("terminal → estático sem expor a resposta", () => {
    const html = blockToHtml({
      type: "terminal",
      pergunta: "Qual comando mostra o kernel?",
      resposta: "uname -r",
      dica: "dica x",
    });
    expect(html).toContain("Qual comando mostra o kernel?");
    expect(html).toContain("dica x");
    expect(html).not.toContain("uname -r");
  });

  it("exercicio → estático com inicio mas sem a solução", () => {
    const html = blockToHtml({
      type: "exercicio",
      titulo: "Imprime",
      instrucoes: ["1. Usa while"],
      arquivo: "script.py",
      inicio: "n = 0",
      esperado: "n = 0\nprint(1)",
    });
    expect(html).toContain("Imprime");
    expect(html).toContain("n = 0");
    expect(html).not.toContain("print(1)");
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

  it("```audio → player sanitizado", () => {
    const html = renderMarkdown("```audio\nurl: https://ex.org/a.mp3\n```");
    expect(html).toContain('<audio controls preload="metadata" src="https://ex.org/a.mp3"');
  });

  it("```pergunta → renderização estática sem resposta", () => {
    const html = renderMarkdown(
      "```pergunta\npergunta: O que é o kernel?\nresposta: linux\n```"
    );
    expect(html).toContain("O que é o kernel?");
    expect(html).not.toContain("resposta");
  });

  it("```imagem → figure", () => {
    const html = renderMarkdown("```imagem\nurl: https://ex.org/i.png\nlegenda: Fig\n```");
    expect(html).toContain('<figure class="md-figure">');
    expect(html).toContain("Fig");
  });

  it("```terminal → estático sem resposta", () => {
    const html = renderMarkdown(
      "```terminal\npergunta: Qual comando?\nresposta: uname -r\n```"
    );
    expect(html).toContain("Qual comando?");
    expect(html).not.toContain("uname");
  });

  it("```exercicio → estático sem solução", () => {
    const html = renderMarkdown(
      "```exercicio\ntitulo: T\ninicio:\nn = 0\n\nesperado:\nprint('x')\n```"
    );
    expect(html).toContain("n = 0");
    expect(html).not.toContain("print");
  });

  it("tabela → wrapper", () => {
    const html = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |");
    expect(html).toContain('<div class="md-table-wrapper"><table>');
  });

  it("renderMarkdown sem includeDsl não expõe data-dsl nem respostas", () => {
    const html = renderMarkdown(
      "```pergunta\npergunta: Qual é?\nresposta: segredo\n```\n\n{{divider}}"
    );
    expect(html).not.toContain("data-dsl");
    expect(html).not.toContain("segredo");
  });

  it("blockToHtml com includeDsl embute o DSL original", () => {
    const html = blockToHtml(
      {
        type: "pergunta",
        pergunta: "Qual é?",
        resposta: "segredo",
        dica: "pista",
        limite: 32,
      },
      true
    );
    expect(html).toContain('data-dsl="```pergunta');
    expect(html).toContain("pergunta: Qual é?");
    expect(html).toContain("resposta: segredo");
    expect(html).not.toContain("<p>resposta");
  });

  it("blockToDsl reconstrói fences e tags", () => {
    expect(
      blockToDsl({ type: "widget", name: "linux-arch", query: "" })
    ).toBe("{{widget: linux-arch}}");
    expect(
      blockToDsl({ type: "widget", name: "distro-cmd", query: "tool=git" })
    ).toBe("{{widget: distro-cmd?tool=git}}");
    expect(blockToDsl({ type: "divider" })).toBe("{{divider}}");
    expect(blockToDsl({ type: "alert", text: "oi" })).toBe("{{alert: oi}}");
    expect(
      blockToDsl({ type: "terminal", pergunta: "Q", resposta: "R", limite: 32 })
    ).toBe("```terminal\npergunta: Q\nresposta: R\nlimite: 32\n```");
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
