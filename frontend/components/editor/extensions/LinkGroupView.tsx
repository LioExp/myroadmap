"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { LinkGroup } from "@/components/ui/link-group";

export function LinkGroupView(props: any) {
  const { items } = props.node.attrs;

  if (!items || items.length === 0) {
    return (
      <NodeViewWrapper className="my-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-500 text-sm">
        Grupo de links vazio. Clique para editar.
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <LinkGroup items={items} />
    </NodeViewWrapper>
  );
}
