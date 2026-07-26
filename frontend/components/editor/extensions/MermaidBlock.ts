import { Node, mergeAttributes } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";

export interface MermaidBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mermaidBlock: {
      insertMermaidBlock: () => ReturnType;
    };
  }
}

export const MermaidBlock = Node.create<MermaidBlockOptions>({
  name: "mermaidBlock",
  group: "block",
  content: "inline*",
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      code: { default: "graph TD\n  A[Início] --> B[Fim]" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-mermaid]" }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }): DOMOutputSpec {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-mermaid": "",
        class:
          "my-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-950/20 p-4",
      }),
      ["div", { class: "flex items-center gap-2 mb-2" },
        ["span", { class: "text-base" }, "📊"],
        ["span", { class: "text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400" }, "Diagrama Mermaid"],
      ],
      ["div", { class: "font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap" }, 0],
    ];
  },

  addCommands() {
    return {
      insertMermaidBlock:
        () =>
        ({ chain }: any) =>
          chain()
            .insertContent({ type: this.name })
            .run(),
    };
  },
});
