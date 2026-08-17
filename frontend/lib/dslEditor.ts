import { parseFenceBlock } from "./markdown";
import type { Block } from "./markdown";

/**
 * Ponte entre o editor WYSIWYG e a sintaxe DSL. Cada bloco guarda o seu texto
 * DSL original (atributo data-dsl) e é editado através de um formulário de
 * campos; estas funções convertem dsl ⇄ campos.
 */

export type FieldValue = string | number;
export type BlockFields = Record<string, FieldValue>;

export const FENCE_TYPES = [
  "pergunta",
  "terminal",
  "exercicio",
  "audio",
  "imagem",
  "animacao",
] as const;

export const TAG_TYPES = ["alert", "divider", "widget", "image", "video"] as const;

export type DslType = (typeof FENCE_TYPES)[number] | (typeof TAG_TYPES)[number];

function blockToFields(block: Block): BlockFields {
  switch (block.type) {
    case "audio":
      return { url: block.url, ...(block.title ? { titulo: block.title } : {}) };
    case "imagem":
      return {
        url: block.url,
        ...(block.titulo ? { titulo: block.titulo } : {}),
        ...(block.legenda ? { legenda: block.legenda } : {}),
      };
    case "animacao":
      return {
        ...(block.titulo ? { titulo: block.titulo } : {}),
        passos: block.passos.join("\n"),
      };
    case "pergunta":
    case "terminal":
      return {
        pergunta: block.pergunta,
        resposta: block.resposta,
        ...(block.dica ? { dica: block.dica } : {}),
        ...(block.limite ? { limite: block.limite } : {}),
      };
    case "exercicio":
      return {
        titulo: block.titulo,
        ...(block.instrucoes.length ? { instrucoes: block.instrucoes.join("\n") } : {}),
        ...(block.arquivo ? { arquivo: block.arquivo } : {}),
        ...(block.dica ? { dica: block.dica } : {}),
        inicio: block.inicio,
        esperado: block.esperado,
      };
    default:
      return {};
  }
}

export function dslToFields(type: string, dsl: string): BlockFields {
  if (type === "divider") return {};
  if (type === "widget") {
    const m = dsl.match(/\{\{widget:\s*([^}]+)\}\}/);
    if (!m) return {};
    const raw = m[1].trim();
    const qIdx = raw.indexOf("?");
    return {
      name: (qIdx >= 0 ? raw.slice(0, qIdx) : raw).trim(),
      query: qIdx >= 0 ? raw.slice(qIdx + 1) : "",
    };
  }
  if (type === "alert") {
    const m = dsl.match(/\{\{alert:\s*([^}]+)\}\}/);
    return { text: m ? m[1].trim() : "" };
  }
  if (type === "image" || type === "video") {
    const m = dsl.match(/\{\{(?:image|video|youtube):\s*([^}]+)\}\}/);
    return { url: m ? m[1].trim() : "" };
  }
  const body = dsl.replace(/^```\w+\s*\n/, "").replace(/\n?```\s*$/, "");
  const block = parseFenceBlock(type, body);
  return block ? blockToFields(block) : {};
}

export function fieldsToDsl(type: string, f: BlockFields): string {
  const s = (k: string) =>
    typeof f[k] === "string" ? (f[k] as string).trim() : f[k] != null ? String(f[k]) : "";
  if (type === "divider") return "{{divider}}";
  if (type === "widget") {
    const name = s("name");
    const query = s("query");
    return query ? `{{widget: ${name}?${query}}}` : `{{widget: ${name}}}`;
  }
  if (type === "alert") return `{{alert: ${s("text")}}}`;
  if (type === "image") return `{{image: ${s("url")}}}`;
  if (type === "video") return `{{video: ${s("url")}}}`;

  const lines: string[] = [`\`\`\`${type}`];
  const push = (k: string) => {
    const v = s(k);
    if (v) lines.push(`${k}: ${v}`);
  };
  switch (type) {
    case "audio":
      push("url");
      push("titulo");
      break;
    case "imagem":
      push("url");
      push("titulo");
      push("legenda");
      break;
    case "animacao":
      push("titulo");
      for (const passo of (f.passos as string | undefined ?? "").split("\n")) {
        const v = passo.trim();
        if (v) lines.push(`passo: ${v}`);
      }
      break;
    case "pergunta":
    case "terminal":
      push("pergunta");
      push("resposta");
      push("dica");
      const lim = Number(f.limite);
      if (Number.isFinite(lim) && lim > 0) lines.push(`limite: ${lim}`);
      break;
    case "exercicio": {
      push("titulo");
      const steps = ((f.instrucoes as string | undefined) ?? "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
      if (steps.length) {
        lines.push("instrucoes:");
        lines.push(...steps);
      }
      push("arquivo");
      push("dica");
      lines.push("inicio:");
      lines.push(s("inicio"));
      lines.push("esperado:");
      lines.push(s("esperado"));
      break;
    }
  }
  lines.push("```");
  return lines.join("\n");
}

/** Fields de arranque para inserir um bloco novo do zero. */
export function blankFields(type: string): BlockFields {
  switch (type) {
    case "pergunta":
    case "terminal":
      return { pergunta: "", resposta: "", dica: "", limite: 32 };
    case "exercicio":
      return { titulo: "", instrucoes: "", arquivo: "script.py", dica: "", inicio: "", esperado: "" };
    case "audio":
      return { url: "", titulo: "" };
    case "imagem":
      return { url: "", titulo: "", legenda: "" };
    case "animacao":
      return { titulo: "", passos: "" };
    case "alert":
      return { text: "" };
    case "widget":
      return { name: "", query: "" };
    case "image":
    case "video":
      return { url: "" };
    default:
      return {};
  }
}
