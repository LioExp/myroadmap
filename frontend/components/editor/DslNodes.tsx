"use client";
import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { parseFenceBlock, blockToHtml } from "@/lib/markdown";
import type { Block } from "@/lib/markdown";
import { FENCE_TYPES, TAG_TYPES } from "@/lib/dslEditor";
import {
  PerguntaBlock,
  TerminalBlock,
  ExercicioBlock,
  AudioBlock,
  ImagemBlock,
  AnimacaoBlock,
} from "@/components/blocks";
import WidgetRenderer from "@/components/widgets";

export type DslEditHandler = (
  type: string,
  dsl: string,
  update: (next: string) => void
) => void;

interface DslNodeOptions {
  blockType: string;
  className: string;
}

/** Reconstrói o Block DSL a partir do texto data-dsl guardado no nó. */
function dslToBlock(type: string, dsl: string): Block | null {
  if ((FENCE_TYPES as readonly string[]).includes(type)) {
    const body = dsl.replace(/^```\w+\s*\n/, "").replace(/\n?```\s*$/, "");
    return parseFenceBlock(type, body);
  }
  switch (type) {
    case "widget": {
      const m = dsl.match(/\{\{widget:\s*([^}]+)\}\}/);
      if (!m) return null;
      const raw = m[1].trim();
      const qi = raw.indexOf("?");
      return {
        type: "widget",
        name: (qi >= 0 ? raw.slice(0, qi) : raw).trim(),
        query: qi >= 0 ? raw.slice(qi + 1) : "",
      };
    }
    case "alert": {
      const m = dsl.match(/\{\{alert:\s*([^}]+)\}\}/);
      return m ? { type: "alert", text: m[1].trim() } : null;
    }
    case "divider":
      return { type: "divider" };
    case "image": {
      const m = dsl.match(/\{\{image:\s*([^}]+)\}\}/);
      return m ? { type: "image", url: m[1].trim() } : null;
    }
    case "video": {
      const m = dsl.match(/\{\{(?:video|youtube):\s*([^}]+)\}\}/);
      return m ? { type: "video", url: m[1].trim(), youtube: false } : null;
    }
    default:
      return null;
  }
}

function DslNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
  opts,
  onEdit,
}: NodeViewProps & { opts: DslNodeOptions; onEdit: () => DslEditHandler | null }) {
  const dsl = (node.attrs.dsl as string) ?? "";
  const block = dslToBlock(opts.blockType, dsl);
  const interactive = (FENCE_TYPES as readonly string[]).includes(opts.blockType);

  let body: React.ReactNode;
  if (!block) {
    body = (
      <div className="text-xs text-red-500 border border-red-300 dark:border-red-900 rounded-lg p-2">
        bloco inválido — {opts.blockType}
      </div>
    );
  } else if (interactive) {
    switch (block.type) {
      case "pergunta":
        body = (
          <PerguntaBlock
            pergunta={block.pergunta}
            resposta={block.resposta}
            dica={block.dica}
            onAnswered={() => {}}
          />
        );
        break;
      case "terminal":
        body = (
          <TerminalBlock
            pergunta={block.pergunta}
            resposta={block.resposta}
            dica={block.dica}
            limite={block.limite}
            onAnswered={() => {}}
          />
        );
        break;
      case "exercicio":
        body = (
          <ExercicioBlock
            titulo={block.titulo}
            instrucoes={block.instrucoes}
            arquivo={block.arquivo}
            dica={block.dica}
            inicio={block.inicio}
            esperado={block.esperado}
            onAnswered={() => {}}
          />
        );
        break;
      case "audio":
        body = <AudioBlock url={block.url} title={block.title} />;
        break;
      case "imagem":
        body = <ImagemBlock url={block.url} titulo={block.titulo} legenda={block.legenda} />;
        break;
      case "animacao":
        body = <AnimacaoBlock titulo={block.titulo} passos={block.passos} />;
        break;
      default:
        body = null;
    }
  } else if (block.type === "widget") {
    body = <WidgetRenderer name={block.name} query={block.query} />;
  } else {
    body = <div dangerouslySetInnerHTML={{ __html: blockToHtml(block) }} />;
  }

  return (
    <NodeViewWrapper
      className={`relative group my-3 rounded-xl transition-shadow ${
        selected ? "ring-2 ring-purple-400/60" : "hover:ring-1 hover:ring-purple-300/50"
      }`}
    >
      {body}
      <div
        className={`absolute top-1.5 right-1.5 flex gap-1 z-10 transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onEdit()?.(opts.blockType, dsl, (next) => updateAttributes({ dsl: next }))}
          title="Editar bloco"
          className="w-6 h-6 flex items-center justify-center rounded-md bg-surface border border-line text-muted hover:text-purple-600 dark:hover:text-purple-400 text-[11px]"
        >
          ✎
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => deleteNode()}
          title="Apagar bloco"
          className="w-6 h-6 flex items-center justify-center rounded-md bg-surface border border-line text-muted hover:text-red-500 text-[11px]"
        >
          ✕
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export function createDslNode(
  opts: DslNodeOptions,
  onEdit: () => DslEditHandler | null
) {
  const name = `${opts.blockType}Block`;
  return Node.create({
    name,
    group: "block",
    atom: true,
    addAttributes() {
      return {
        dsl: {
          default: "",
          parseHTML: (el) => el.getAttribute("data-dsl") ?? "",
        },
      };
    },
    parseHTML() {
      return [{ tag: `div[class~="${opts.className}"]`, priority: 200 }];
    },
    renderHTML({ node }) {
      return ["div", { class: opts.className, "data-dsl": node.attrs.dsl }, 0];
    },
    addNodeView() {
      return ReactNodeViewRenderer((props) => (
        <DslNodeView {...props} opts={opts} onEdit={onEdit} />
      ));
    },
  });
}

/** Nós DSL para o editor: fences e tags da sintaxe. */
export function createDslNodes(onEdit: () => DslEditHandler | null) {
  const fenceNodes: { blockType: string; className: string }[] = [
    { blockType: "pergunta", className: "md-pergunta" },
    { blockType: "terminal", className: "md-terminal" },
    { blockType: "exercicio", className: "md-exercicio" },
    { blockType: "audio", className: "md-audio" },
    { blockType: "imagem", className: "md-figure" },
    { blockType: "animacao", className: "md-animacao" },
  ];
  const tagNodes: { blockType: string; className: string }[] = [
    { blockType: "alert", className: "md-alert" },
    { blockType: "divider", className: "md-divider" },
    { blockType: "widget", className: "md-widget-placeholder" },
    { blockType: "image", className: "md-image" },
    { blockType: "video", className: "md-video" },
  ];
  return [...fenceNodes, ...tagNodes].map((o) => createDslNode(o, onEdit));
}

/** Tipos de bloco que podem ser inseridos pela toolbar. */
export const INSERTABLE_TYPES: string[] = [
  "pergunta",
  "terminal",
  "exercicio",
  "audio",
  "imagem",
  "animacao",
  "alert",
];

export const WIDGET_NAMES: string[] = [
  "linux-arch",
  "distro-selector",
  "distro-cmd",
  "ksd-cards",
  "distro-grid",
  "linux-where",
];