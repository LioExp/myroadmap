"use client";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback, useRef } from "react";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Code, Highlighter, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        "w-5 h-5 flex items-center justify-center rounded text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors",
        active && "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      )}
    >
      {children}
    </button>
  );
}

function useMobileZoom(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  const zoomedRef = useRef(false);

  const zoomIn = useCallback(() => {
    if (zoomedRef.current) return;
    const el = wrapperRef.current;
    if (!el) return;
    zoomedRef.current = true;
    el.classList.add("tiptap-focused");
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [wrapperRef]);

  const zoomOut = useCallback(() => {
    if (!zoomedRef.current) return;
    const el = wrapperRef.current;
    if (!el) return;
    zoomedRef.current = false;
    el.classList.remove("tiptap-focused");
  }, [wrapperRef]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;

    const contentEditable = el.querySelector("[contenteditable]");
    if (!contentEditable) return;

    const handleFocusIn = () => zoomIn();
    const handleFocusOut = (e: Event) => {
      const related = (e as FocusEvent).relatedTarget as HTMLElement | null;
      if (related && el.contains(related)) return;
      zoomOut();
    };

    contentEditable.addEventListener("focusin", handleFocusIn);
    contentEditable.addEventListener("focusout", handleFocusOut);

    let prevHeight = 0;
    const handleViewportResize = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      if (prevHeight > 0 && vh > prevHeight + 50) {
        zoomOut();
      }
      prevHeight = vh;
    };
    window.visualViewport?.addEventListener("resize", handleViewportResize);

    return () => {
      contentEditable.removeEventListener("focusin", handleFocusIn);
      contentEditable.removeEventListener("focusout", handleFocusOut);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
    };
  }, [wrapperRef, zoomIn, zoomOut]);
}

export default function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  useMobileZoom(isMobile ? wrapperRef : { current: null });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escreve aqui..." }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[60px] max-md:min-h-[44px] text-[10px] leading-relaxed",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getText();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      ref={wrapperRef}
      className="tiptap-wrapper border border-[#E5E7EB] dark:border-[#374151] rounded-xl bg-white dark:bg-[#1a1a1a] overflow-hidden focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-400/30 transition-all duration-300"
      style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E\") 2 18, auto" }}
    >
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100, placement: "top" }}
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#374151] shadow-lg z-50"
      >
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito">
          <Bold className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico">
          <Italic className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sublinhado">
          <UnderlineIcon className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Destacar">
          <Highlighter className="w-3 h-3" />
        </ToolbarBtn>
        <div className="w-px h-3 bg-[#E5E7EB] dark:bg-[#374151] mx-0.5" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <List className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Checklist">
          <CheckSquare className="w-3 h-3" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Código inline">
          <Code className="w-3 h-3" />
        </ToolbarBtn>
      </BubbleMenu>
      <div className="px-2.5 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
