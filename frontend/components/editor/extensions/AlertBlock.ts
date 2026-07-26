import { Node, mergeAttributes } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";

export interface AlertBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    alertBlock: {
      insertAlertBlock: () => ReturnType;
    };
  }
}

const ALERT_STYLES: Record<string, string> = {
  info: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
  warning: "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20",
  success: "border-l-green-500 bg-green-50/50 dark:bg-green-950/20",
  danger: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
};

const ALERT_ICONS: Record<string, string> = {
  info: "ℹ️",
  warning: "⚠️",
  success: "✅",
  danger: "🚨",
};

export const AlertBlock = Node.create<AlertBlockOptions>({
  name: "alertBlock",
  group: "block",
  content: "inline*",
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      type: { default: "info" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-alert]" }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }): DOMOutputSpec {
    const type = (HTMLAttributes.type as string) || "info";
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-alert": "",
        "data-type": type,
        class: `my-4 rounded-xl border-l-4 border border-gray-200 dark:border-gray-700 p-4 ${ALERT_STYLES[type] || ALERT_STYLES.info}`,
      }),
      ["div", { class: "flex items-center gap-2 mb-2" },
        ["span", { class: "text-base" }, ALERT_ICONS[type] || ALERT_ICONS.info],
        ["span", { class: "text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400" }, type.toUpperCase()],
      ],
      ["div", { class: "text-sm leading-relaxed text-gray-800 dark:text-gray-200" }, 0],
    ];
  },

  addCommands() {
    return {
      insertAlertBlock:
        () =>
        ({ chain }: any) =>
          chain()
            .insertContent({ type: this.name, attrs: { type: "info" } })
            .run(),
    };
  },
});
