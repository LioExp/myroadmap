/**
 * Serializa o documento do editor (JSON do ProseMirror/Tiptap) de volta para
 * markdown + sintaxe DSL do projeto. Os blocos especiais guardam o seu texto
 * DSL original no atributo `dsl` (mantido durante edições de texto normal).
 */

export interface PmNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: PmNode[];
}

function inlineText(node: PmNode): string {
  let text = node.text ?? "";
  const marks = node.marks ?? [];
  let out = text;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        out = `**${out}**`;
        break;
      case "italic":
        out = `*${out}*`;
        break;
      case "code":
        out = `\`${out}\``;
        break;
      case "highlight":
        out = `==${out}==`;
        break;
      case "strike":
        out = `~~${out}~~`;
        break;
      case "link": {
        const href = String(mark.attrs?.href ?? "");
        if (href.startsWith("#sub-")) {
          out = `[[${out}]]`;
        } else {
          out = `[${out}](${href})`;
        }
        break;
      }
      default:
        break;
    }
  }
  return out;
}

function serializeInline(nodes: PmNode[] | undefined): string {
  if (!nodes) return "";
  let out = "";
  for (const node of nodes) {
    if (node.type === "text") out += inlineText(node);
    else if (node.type === "hardBreak") out += "  \n";
    else if (node.type === "image") {
      const src = String(node.attrs?.src ?? "");
      if (src.startsWith("/icons/")) {
        const name = src.slice("/icons/".length).replace(/\.svg$/, "");
        out += `{{icon: ${name}}}`;
      } else {
        out += `![${node.attrs?.alt ?? ""}](${src})`;
      }
    } else if (node.content) {
      out += serializeInline(node.content);
    }
  }
  return out;
}

function blockText(node: PmNode, depth = 0): string {
  const pad = "> ".repeat(depth);
  return serializeInline(node.content)
    .split("\n")
    .map((line) => `${pad}${line}`)
    .join("\n");
}

export function serializeDoc(doc: PmNode): string {
  const out: string[] = [];

  const visit = (nodes: PmNode[] | undefined) => {
    if (!nodes) return;
    for (const node of nodes) {
      switch (node.type) {
        case "paragraph":
          out.push(blockText(node));
          out.push("");
          break;
        case "heading": {
          const level = Math.min(Number(node.attrs?.level ?? 2), 6);
          out.push(`${"#".repeat(level)} ${serializeInline(node.content)}`);
          out.push("");
          break;
        }
        case "bulletList": {
          for (const item of node.content ?? []) {
            const text = serializeInline(item.content).replace(/\n/g, "\n  ");
            out.push(`- ${text}`);
          }
          out.push("");
          break;
        }
        case "orderedList": {
          const start = Number(node.attrs?.start ?? 1);
          (node.content ?? []).forEach((item, i) => {
            const text = serializeInline(item.content).replace(/\n/g, "\n  ");
            out.push(`${start + i}. ${text}`);
          });
          out.push("");
          break;
        }
        case "taskList": {
          for (const item of node.content ?? []) {
            const done = item.attrs?.checked ? "x" : " ";
            const text = serializeInline(item.content).replace(/\n/g, "\n  ");
            out.push(`- [${done}] ${text}`);
          }
          out.push("");
          break;
        }
        case "codeBlock": {
          const lang = node.attrs?.language ? ` ${node.attrs.language}` : "";
          out.push("```" + lang);
          out.push(serializeInline(node.content));
          out.push("```");
          out.push("");
          break;
        }
        case "blockquote": {
          out.push(`> ${serializeInline(node.content).replace(/\n/g, "\n> ")}`);
          out.push("");
          break;
        }
        case "horizontalRule":
          out.push("{{divider}}");
          out.push("");
          break;
        case "image": {
          const src = String(node.attrs?.src ?? "");
          if (src.startsWith("/icons/")) {
            const name = src.slice("/icons/".length).replace(/\.svg$/, "");
            out.push(`{{icon: ${name}}}`);
          } else {
            out.push(`![${node.attrs?.alt ?? ""}](${src})`);
          }
          out.push("");
          break;
        }
        default: {
          const dsl = node.attrs?.dsl;
          if (typeof dsl === "string" && dsl.trim()) {
            out.push(dsl.trim());
            out.push("");
          }
          break;
        }
      }
    }
  };

  visit(doc.content);
  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}
