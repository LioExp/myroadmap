import { describe, expect, it } from "vitest";
import { parseFrontmatter, buildFrontmatter } from "../frontmatter";

describe("parseFrontmatter", () => {
  it("parseia campos simples", () => {
    const { frontmatter, content } = parseFrontmatter(
      "---\nmodulo: 1\naula: 1\ntitulo: O que é Linux\n---\n\nConteúdo aqui"
    );
    expect(frontmatter).toEqual({ modulo: "1", aula: "1", titulo: "O que é Linux" });
    expect(content).toBe("\nConteúdo aqui");
  });

  it("remove aspas dos valores", () => {
    const { frontmatter } = parseFrontmatter("---\ntitulo: 'Texto com aspas'\n---\n\nx");
    expect(frontmatter.titulo).toBe("Texto com aspas");
  });

  it("devolve vazio quando não há frontmatter", () => {
    const { frontmatter, content } = parseFrontmatter("# Só markdown\n\nsem fm");
    expect(frontmatter).toEqual({});
    expect(content).toBe("# Só markdown\n\nsem fm");
  });

  it("suporta valores com dois-pontos", () => {
    const { frontmatter } = parseFrontmatter("---\ntitulo: Aula 1: Introdução\n---\n\nx");
    expect(frontmatter.titulo).toBe("Aula 1: Introdução");
  });
});

describe("buildFrontmatter", () => {
  it("serializa chave: valor", () => {
    expect(buildFrontmatter({ modulo: "1", aula: 2, titulo: "A" })).toBe(
      "modulo: 1\naula: 2\ntitulo: A"
    );
  });
});
