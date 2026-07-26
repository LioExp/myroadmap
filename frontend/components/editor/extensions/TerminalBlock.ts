import { Node, mergeAttributes } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";

export interface TerminalBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    terminalBlock: {
      insertTerminalBlock: () => ReturnType;
    };
  }
}

export const TerminalBlock = Node.create<TerminalBlockOptions>({
  name: "terminalBlock",
  group: "block",
  content: "inline*",
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      command: { default: "" },
      output: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-terminal]" }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }): DOMOutputSpec {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-terminal": "",
        class:
          "my-4 rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm text-gray-100 [&_code]:text-green-400",
      }),
      ["div", { class: "flex items-center gap-1.5 mb-2" },
        ["span", { class: "h-2.5 w-2.5 rounded-full bg-red-500" }],
        ["span", { class: "h-2.5 w-2.5 rounded-full bg-yellow-500" }],
        ["span", { class: "h-2.5 w-2.5 rounded-full bg-green-500" }],
        ["span", { class: "ml-2 text-[10px] text-gray-500 uppercase tracking-wider" }, "Terminal"],
      ],
      ["div", { class: "leading-relaxed" }, 0],
    ];
  },

  addCommands() {
    return {
      insertTerminalBlock:
        () =>
        ({ chain }: any) =>
          chain()
            .insertContent({ type: this.name })
            .run(),
    };
  },
});
