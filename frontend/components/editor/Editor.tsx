"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import { TerminalBlock, VulnerabilityCard, MermaidBlock, AlertBlock } from "./extensions";
import { ImageModal as ImageModalDialog, LinkGroupModal } from "./modals";

interface EditorProps {
  value: string;
  onChange: (html: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function Editor({
  value,
  onChange,
  onSave,
  onPublish,
  placeholder,
  readOnly = false,
}: EditorProps) {
  const [preview, setPreview] = useState(false);
  const [modal, setModal] = useState<"image" | "linkGroup" | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Comece a escrever..." }),
      TerminalBlock,
      VulnerabilityCard,
      MermaidBlock,
      AlertBlock,
    ],
    content: value || "",
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      {!readOnly && (
        <Toolbar
          editor={editor}
          onSave={onSave}
          onPublish={onPublish}
          onTogglePreview={() => setPreview((p) => !p)}
          onOpenImageModal={() => setModal("image")}
          onOpenLinkGroupModal={() => setModal("linkGroup")}
        />
      )}

      <div className="relative min-h-[300px]">
        {preview ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none p-4"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        ) : (
          <div className="px-4 py-3">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      <ImageModalDialog
        open={modal === "image"}
        onClose={() => setModal(null)}
        onInsert={(url, alt) => {
          editor
            .chain()
            .focus()
            .insertContent(`<img src="${url}" alt="${alt || ''}" />`)
            .run();
        }}
      />

      <LinkGroupModal
        open={modal === "linkGroup"}
        onClose={() => setModal(null)}
        onInsert={(links) => {
          const html = links
            .map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.title}</a>`)
            .join(" · ");
          editor.chain().focus().insertContent(html).run();
        }}
      />
    </div>
  );
}
