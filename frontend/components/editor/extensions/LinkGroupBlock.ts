import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { LinkGroupView } from "./LinkGroupView";

export interface LinkGroupBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkGroup: {
      insertLinkGroup: (items: { label: string; href: string; icon?: string }[]) => ReturnType;
    };
  }
}

export const LinkGroupBlock = Node.create<LinkGroupBlockOptions>({
  name: "linkGroup",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      items: { default: [] },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-link-group]",
        getAttrs: (el) => ({
          items: JSON.parse((el as HTMLElement).getAttribute("data-items") || "[]"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-link-group": "",
        "data-items": JSON.stringify(HTMLAttributes.items),
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkGroupView);
  },

  addCommands() {
    return {
      insertLinkGroup:
        (items) =>
        ({ chain }) =>
          chain()
            .insertContent({ type: this.name, attrs: { items } })
            .run(),
    };
  },
});
