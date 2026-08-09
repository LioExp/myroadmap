import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { renderMarkdown } from "../markdown";
import type { Material } from "@/types";

const INDEX_PATH = path.resolve(__dirname, "..", "..", "public", "materiais-index.json");
const materials: Material[] = JSON.parse(readFileSync(INDEX_PATH, "utf8"));

describe("renderMarkdown sobre conteúdo real", () => {
  it("tem material de teste disponível", () => {
    expect(materials.length).toBeGreaterThan(0);
  });

  it("renderiza todo o conteúdo sem falhas e sem tags não processadas", () => {
    for (const material of materials) {
      const html = renderMarkdown(material.conteudo);
      expect(html, `material ${material.modulo}/${material.aula}`).not.toMatch(/\{\{/);
      expect(html).not.toMatch(/<script/i);
      expect(html).not.toMatch(/on\w+=/);
    }
  });

  it("converte widgets, icons e images do conteúdo real", () => {
    const html = renderMarkdown(materials[0].conteudo);
    expect(html).toContain('class="md-widget-placeholder"');
    expect(html).toContain('class="inline-icon"');
    expect(html).toContain('class="md-image"');
  });

  it("produz HTML sem `javascript:` ou `data:`", () => {
    for (const material of materials) {
      expect(renderMarkdown(material.conteudo)).not.toMatch(/javascript\s*:/i);
      expect(renderMarkdown(material.conteudo)).not.toMatch(/data\s*:/i);
    }
  });
});
