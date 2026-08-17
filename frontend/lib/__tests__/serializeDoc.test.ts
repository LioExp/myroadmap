import { describe, expect, it } from "vitest";
import { serializeDoc } from "../serializeDoc";
import type { PmNode } from "../serializeDoc";
import { renderMarkdown } from "../markdown";

const doc: PmNode = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Teoria — Kernel" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "o kernel é " },
        { type: "text", text: "importante", marks: [{ type: "bold" }] },
        { type: "text", text: " e " },
        { type: "text", text: "termo", marks: [{ type: "link", attrs: { href: "#sub-termo" } }] },
        { type: "text", text: " e " },
        { type: "text", text: "destacado", marks: [{ type: "highlight" }] },
      ],
    },
    { type: "perguntaBlock", attrs: { dsl: "```pergunta\npergunta: O que é?\nresposta: kernel\n```" } },
    { type: "paragraph", content: [{ type: "text", text: "texto normal" }] },
    { type: "dividerBlock", attrs: { dsl: "{{divider}}" } },
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "a" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "b" }] }] },
      ],
    },
    {
      type: "orderedList",
      content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "x" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "y" }] }] },
      ],
    },
    { type: "widgetBlock", attrs: { dsl: "{{widget: linux-arch}}" } },
    { type: "alertBlock", attrs: { dsl: "{{alert: cuidado}}" } },
  ],
};

describe("serializeDoc", () => {
  it("serializa o doc de volta para markdown DSL", () => {
    expect(serializeDoc(doc)).toBe(
      [
        "## Teoria — Kernel",
        "",
        "o kernel é **importante** e [[termo]] e ==destacado==",
        "",
        "```pergunta",
        "pergunta: O que é?",
        "resposta: kernel",
        "```",
        "",
        "texto normal",
        "",
        "{{divider}}",
        "",
        "- a",
        "- b",
        "",
        "1. x",
        "2. y",
        "",
        "{{widget: linux-arch}}",
        "",
        "{{alert: cuidado}}",
      ].join("\n")
    );
  });

  it("o markdown serializado volta a renderizar sem perder blocos", () => {
    const md = serializeDoc(doc);
    const html = renderMarkdown(md, true);
    expect(html).toContain('class="md-pergunta"');
    expect(html).toContain("O que é?");
    expect(html).toContain("resposta: kernel");
    expect(html).toContain('class="md-divider"');
    expect(html).toContain('class="md-widget-placeholder"');
    expect(html).toContain("cuidado");
    expect(html).toContain("<mark>destacado</mark>");
    expect(html).toContain('href="#sub-termo"');
  });

  it("os blocos serializados não expõem respostas no viewer", () => {
    const md = serializeDoc(doc);
    const html = renderMarkdown(md, false);
    expect(html).not.toContain("data-dsl");
    expect(html).not.toContain("resposta: kernel");
  });
});
