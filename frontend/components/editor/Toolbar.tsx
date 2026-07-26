"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Strikethrough, Code2,
  Heading1, Heading2, Heading3, Pilcrow, Quote, Minus,
  ListOrdered, List, CheckSquare,
  Terminal, ShieldAlert, GitGraph, Bell,
  Link2, Image, Users, FileCode,
  Undo2, Redo2, Eye, Save, Rocket, Sparkles,
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

interface ToolbarProps {
  editor: Editor | null;
  onSave?: () => void;
  onPublish?: () => void;
  onTogglePreview?: () => void;
  onOpenImageModal?: () => void;
  onOpenLinkGroupModal?: () => void;
}

export default function Toolbar({ editor, onSave, onPublish, onTogglePreview, onOpenImageModal, onOpenLinkGroupModal }: ToolbarProps) {
  if (!editor) return null;

  const handleInsert = (type: string) => {
    switch (type) {
      case "terminal":
        editor.chain().focus().insertTerminalBlock().run();
        break;
      case "vulnerability":
        editor.chain().focus().insertVulnerabilityCard().run();
        break;
      case "mermaid":
        editor.chain().focus().insertMermaidBlock().run();
        break;
      case "alert":
        editor.chain().focus().insertAlertBlock().run();
        break;
      default:
        break;
    }
  };

  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-gray-200 bg-gray-50/80 px-2 py-1.5 backdrop-blur-sm dark:border-gray-800 dark:bg-[#0a0a0a]/80">
      {/* Grupo 1 — Formatação básica */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          tooltip="Negrito (Ctrl+B)"
          active={editor.isActive("bold")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          tooltip="Itálico (Ctrl+I)"
          active={editor.isActive("italic")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={Underline}
          tooltip="Sublinhado (Ctrl+U)"
          active={editor.isActive("underline")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={Strikethrough}
          tooltip="Tachado"
          active={editor.isActive("strike")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={Code2}
          tooltip="Código inline"
          active={editor.isActive("code")}
        />
      </ToolbarGroup>

      {/* Grupo 2 — Estrutura */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={Heading1}
          tooltip="Título 1"
          active={editor.isActive("heading", { level: 1 })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          tooltip="Título 2"
          active={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={Heading3}
          tooltip="Título 3"
          active={editor.isActive("heading", { level: 3 })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          icon={Pilcrow}
          tooltip="Parágrafo"
          active={editor.isActive("paragraph")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
          tooltip="Citação"
          active={editor.isActive("blockquote")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          tooltip="Linha horizontal"
        />
      </ToolbarGroup>

      {/* Grupo 3 — Listas */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          tooltip="Lista numerada"
          active={editor.isActive("orderedList")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          tooltip="Lista com marcadores"
          active={editor.isActive("bulletList")}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          icon={CheckSquare}
          tooltip="Checklist"
          active={editor.isActive("taskList")}
        />
      </ToolbarGroup>

      {/* Grupo 4 — Blocos especiais */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => handleInsert("terminal")}
          icon={Terminal}
          tooltip="Bloco de terminal"
        />
        <ToolbarButton
          onClick={() => handleInsert("vulnerability")}
          icon={ShieldAlert}
          tooltip="Card de vulnerabilidade"
        />
        <ToolbarButton
          onClick={() => handleInsert("mermaid")}
          icon={GitGraph}
          tooltip="Diagrama Mermaid"
        />
        <ToolbarButton
          onClick={() => handleInsert("alert")}
          icon={Bell}
          tooltip="Caixa de alerta"
        />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().toggleLink({ href: url }).run();
          }}
          icon={Link2}
          tooltip="Inserir link"
          active={editor.isActive("link")}
        />
        <ToolbarButton
          onClick={() => onOpenImageModal?.()}
          icon={Image}
          tooltip="Inserir imagem"
        />
        <ToolbarButton
          onClick={() => onOpenLinkGroupModal?.()}
          icon={Users}
          tooltip="Grupo de links"
        />
      </ToolbarGroup>

      {/* Grupo 5 — Código */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={FileCode}
          tooltip="Bloco de código"
          active={editor.isActive("codeBlock")}
        />
      </ToolbarGroup>

      {/* Grupo 6 — Ações */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo2}
          tooltip="Desfazer (Ctrl+Z)"
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo2}
          tooltip="Refazer (Ctrl+Y)"
          disabled={!editor.can().redo()}
        />
        <ToolbarButton
          onClick={() => onTogglePreview?.()}
          icon={Eye}
          tooltip="Alternar visualização"
        />
        <ToolbarButton
          onClick={() => onSave?.()}
          icon={Save}
          tooltip="Salvar rascunho"
        />
        <ToolbarButton
          onClick={() => onPublish?.()}
          icon={Rocket}
          tooltip="Publicar aula"
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        />
        <ToolbarButton
          onClick={() => {}}
          icon={Sparkles}
          tooltip="Moti (em breve)"
          className="opacity-50"
        />
      </ToolbarGroup>
    </div>
  );
}
