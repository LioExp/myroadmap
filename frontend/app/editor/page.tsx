"use client";
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import DragHandle from "@tiptap/extension-drag-handle";
import type { Material } from "@/types";
import { renderMarkdown } from "@/lib/markdown";
import { serializeDoc } from "@/lib/serializeDoc";
import type { PmNode } from "@/lib/serializeDoc";
import { fieldsToDsl, blankFields } from "@/lib/dslEditor";
import { createDslNodes, INSERTABLE_TYPES, WIDGET_NAMES } from "@/components/editor/DslNodes";
import type { DslEditHandler } from "@/components/editor/DslNodes";
import BlockFormModal from "@/components/editor/BlockFormModal";
import {
  Bold,
  Italic,
  Highlighter,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Link as LinkIcon,
  BookMarked,
  Image as ImageIcon,
  Menu,
} from "lucide-react";

const DRAFT_PREFIX = "myroadmap-draft:";

interface Draft {
  titulo: string;
  conteudo: string;
  updatedAt: number;
}

interface FormState {
  type: string;
  dsl: string;
  onApply: (dsl: string) => void;
}

const draftKey = (mod: string, aula: number) => `${DRAFT_PREFIX}${mod}:${aula}`;

const readDraft = (mod: string, aula: number): Draft | null => {
  try {
    const raw = localStorage.getItem(draftKey(mod, aula));
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
};

const writeDraft = (mod: string, aula: number, titulo: string, conteudo: string) => {
  localStorage.setItem(
    draftKey(mod, aula),
    JSON.stringify({ titulo, conteudo, updatedAt: Date.now() } satisfies Draft)
  );
};

const deleteDraft = (mod: string, aula: number) => {
  localStorage.removeItem(draftKey(mod, aula));
};

const listDrafts = (): { mod: string; aula: number; draft: Draft }[] => {
  const out: { mod: string; aula: number; draft: Draft }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) {
      const [mod, aulaStr] = key.slice(DRAFT_PREFIX.length).split(":");
      const aula = Number(aulaStr);
      const draft = readDraft(mod, aula);
      if (Number.isInteger(aula) && draft) out.push({ mod, aula, draft });
    }
  }
  return out;
};

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
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded-md border transition-colors ${
        active
          ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [drafts, setDrafts] = useState<{ mod: string; aula: number; draft: Draft }[]>([]);
  const [selected, setSelected] = useState<{ mod: string; aula: number } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [title, setTitle] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newMod, setNewMod] = useState("");
  const [newAula, setNewAula] = useState("");
  const [newTitulo, setNewTitulo] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mdRef = useRef<string | null>(null);
  const onEditRef = useRef<DslEditHandler | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Escreve a tua aula aqui…" }),
      DragHandle.configure({
        render() {
          const el = document.createElement("div");
          el.className = "editor-drag-handle";
          el.title = "Arrastar para mover";
          el.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="19" r="1.6"/><circle cx="15" cy="19" r="1.6"/></svg>';
          return el;
        },
      }),
      ...createDslNodes(() => onEditRef.current),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[60vh]",
      },
    },
  });

  onEditRef.current = (type, dsl, update) => {
    setForm({ type, dsl, onApply: update });
  };

  const loadMaterials = async () => {
    try {
      const res = await fetch("/materiais-index.json");
      setMaterials(await res.json());
    } catch {}
    setDrafts(listDrafts());
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadLesson = async (mod: string, aula: number) => {
    setSelected({ mod, aula });
    setSidebarOpen(false);
    const draft = readDraft(mod, aula);
    if (draft) {
      setTitle(draft.titulo);
      mdRef.current = draft.conteudo;
      editor?.commands.setContent(renderMarkdown(draft.conteudo, true), false);
      setHasDraft(true);
      setSavedMsg(null);
      return;
    }
    setHasDraft(false);
    try {
      const res = await fetch(`/api/lesson?mod=${mod}&aula=${aula}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.titulo || "");
        mdRef.current = data.conteudo || "";
        editor?.commands.setContent(renderMarkdown(data.conteudo || "", true), false);
        setSavedMsg(null);
      }
    } catch {}
  };

  const handleSaveDraft = () => {
    if (!selected || !editor) return;
    const md = serializeDoc(editor.getJSON() as unknown as PmNode);
    writeDraft(selected.mod, selected.aula, title, md);
    mdRef.current = md;
    setHasDraft(true);
    setSavedMsg("Rascunho salvo ✓");
    loadMaterials();
  };

  const handleDiscardDraft = () => {
    if (!selected) return;
    deleteDraft(selected.mod, selected.aula);
    loadMaterials();
    loadLesson(selected.mod, selected.aula);
  };

  const handleNewLesson = () => {
    const aula = parseInt(newAula);
    const mod = newMod.trim();
    if (!/^\d+$/.test(mod) || !Number.isInteger(aula) || aula <= 0 || !newTitulo.trim()) return;
    writeDraft(mod, aula, newTitulo.trim(), "");
    setShowNew(false);
    setNewMod("");
    setNewAula("");
    setNewTitulo("");
    loadMaterials();
    loadLesson(mod, aula);
  };

  const insertDsl = (type: string) => {
    if (!editor) return;
    const dsl = fieldsToDsl(type, blankFields(type));
    editor
      .chain()
      .focus()
      .insertContent({ type: `${type}Block`, attrs: { dsl } })
      .run();
    setForm({
      type,
      dsl,
      onApply: (next) => {
        editor.chain().focus().updateAttributes(`${type}Block`, { dsl: next }).run();
      },
    });
  };

  const insertDivider = () => {
    if (!editor) return;
    editor.chain().focus().insertContent({ type: "dividerBlock", attrs: { dsl: "{{divider}}" } }).run();
  };

  const insertWidget = (name: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({ type: "widgetBlock", attrs: { dsl: `{{widget: ${name}}}` } })
      .run();
  };

  const insertHeading = (level: 2 | 3, text?: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "heading",
        attrs: { level },
        content: text ? [{ type: "text", text }] : [],
      })
      .run();
  };

  const insertSubLesson = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "text",
        text: "termo",
        marks: [{ type: "link", attrs: { href: "#sub-termo" } }],
      })
      .run();
  };

  const insertIcon = () => {
    if (!editor) return;
    setForm({
      type: "icon",
      dsl: "",
      onApply: (src) => {
        editor
          .chain()
          .focus()
          .insertContent({ type: "image", attrs: { src, alt: "" } })
          .run();
      },
    });
  };

  const insertLink = () => {
    if (!editor) return;
    const url = window.prompt("URL do link:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const draftMap = new Map<string, boolean>(drafts.map((d) => [`${d.mod}:${d.aula}`, true]));
  const known = new Set(materials.map((m) => `${m.modulo}:${m.aula}`));
  const items = [
    ...materials.map((m) => ({
      mod: m.modulo,
      aula: m.aula,
      titulo: m.titulo,
      isDraft: draftMap.has(`${m.modulo}:${m.aula}`),
    })),
    ...drafts
      .filter((d) => !known.has(`${d.mod}:${d.aula}`))
      .map((d) => ({
        mod: d.mod,
        aula: d.aula,
        titulo: d.draft.titulo || `Aula ${d.aula}`,
        isDraft: true,
      })),
  ];
  const modules = Array.from(new Set(items.map((m) => m.mod)));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-page text-gray-900 dark:text-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[80vw] border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-page p-4 overflow-y-auto flex-shrink-0 transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-extrabold">Editor</h1>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            + Nova
          </button>
        </div>

        {showNew ? (
          <div className="mb-4 p-3 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 space-y-2">
            <input
              value={newMod}
              onChange={(e) => setNewMod(e.target.value)}
              list="modulos"
              placeholder="módulo (ex: 1)"
              className="w-full text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
            <datalist id="modulos">
              {modules.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <input
              value={newAula}
              onChange={(e) => setNewAula(e.target.value)}
              type="number"
              min={1}
              placeholder="aula (ex: 2)"
              className="w-full text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
            <input
              value={newTitulo}
              onChange={(e) => setNewTitulo(e.target.value)}
              placeholder="título da aula"
              className="w-full text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none"
            />
            <button
              onClick={handleNewLesson}
              disabled={!newMod.trim() || !newAula || !newTitulo.trim()}
              className="w-full text-xs font-bold py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
            >
              Criar rascunho
            </button>
          </div>
        ) : null}

        {modules.map((mod) => (
          <div key={mod} className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Módulo {mod}
            </h2>
            {items
              .filter((m) => m.mod === mod)
              .sort((a, b) => a.aula - b.aula)
              .map((m) => (
                <button
                  key={`${m.mod}:${m.aula}`}
                  onClick={() => loadLesson(m.mod, m.aula)}
                  className={`flex items-center justify-between w-full text-left text-xs py-1.5 px-2 rounded ${
                    selected?.mod === m.mod && selected?.aula === m.aula
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="truncate">
                    {m.aula}. {m.titulo}
                  </span>
                  {m.isDraft ? (
                    <span className="ml-2 shrink-0 text-[9px] font-bold uppercase tracking-wide text-purple-600 dark:text-purple-400">
                      rascunho
                    </span>
                  ) : null}
                </button>
              ))}
          </div>
        ))}
      </aside>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-center gap-2 p-2.5 md:p-3 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            title="Aulas"
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-4 h-4" />
          </button>
          {hasDraft ? (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              rascunho
            </span>
          ) : null}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 min-w-[120px] text-sm font-bold bg-transparent border-none outline-none"
            placeholder="Título da aula"
          />
          {savedMsg ? (
            <span className="text-[11px] font-bold text-green-600 dark:text-green-400">
              {savedMsg}
            </span>
          ) : null}
          {hasDraft ? (
            <button
              onClick={handleDiscardDraft}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Descartar
            </button>
          ) : null}
          <button
            onClick={handleSaveDraft}
            disabled={!selected}
            className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
          >
            Guardar rascunho
          </button>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-200 dark:border-gray-800 overflow-x-auto flex-shrink-0">
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Negrito">
            <Bold className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Itálico">
            <Italic className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHighlight().run()} active={editor?.isActive("highlight")} title="Destacar">
            <Highlighter className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertHeading(2)} active={editor?.isActive("heading", { level: 2 })} title="Título (H2)">
            <Heading2 className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertHeading(3)} active={editor?.isActive("heading", { level: 3 })} title="Subtítulo (H3)">
            <Heading3 className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Lista">
            <List className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Lista numerada">
            <ListOrdered className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleTaskList().run()} active={editor?.isActive("taskList")} title="Checklist">
            <CheckSquare className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive("code")} title="Código inline">
            <Code className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={insertLink} title="Link">
            <LinkIcon className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={insertSubLesson} title="Sub-aula">
            <BookMarked className="w-3 h-3" />
          </ToolbarBtn>
          <ToolbarBtn onClick={insertIcon} title="Ícone">
            <ImageIcon className="w-3 h-3" />
          </ToolbarBtn>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1.5" />

          <ToolbarBtn onClick={() => insertHeading(2, "Teoria — ")} title="Secção de Teoria">
            Teoria
          </ToolbarBtn>
          <ToolbarBtn onClick={() => insertHeading(2, "Prática — ")} title="Secção de Prática">
            Prática
          </ToolbarBtn>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1.5" />

          {INSERTABLE_TYPES.map((t) => (
            <ToolbarBtn key={t} onClick={() => insertDsl(t)} title={`Inserir ${t}`}>
              {t}
            </ToolbarBtn>
          ))}
          <ToolbarBtn onClick={insertDivider} title="Divisor">
            Divisor
          </ToolbarBtn>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1.5" />

          {WIDGET_NAMES.map((w) => (
            <ToolbarBtn key={w} onClick={() => insertWidget(w)} title={`Widget ${w}`}>
              {w}
            </ToolbarBtn>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            {selected ? (
              <div className="pt-5 md:pt-6 pb-4 border-b border-gray-200 dark:border-gray-800 mb-5 md:mb-6">
                <p className="text-[11px] font-semibold text-faint uppercase tracking-wide mb-1">
                  {selected.mod} › Aula {selected.aula}
                </p>
                <h1 className="text-lg font-black leading-tight text-main">
                  {title.trim() || "Sem título"}
                </h1>
              </div>
            ) : null}
            {editor ? (
              <div className="lesson-material pb-6">
                <EditorContent editor={editor} />
              </div>
            ) : null}
            {selected ? (
              <p className="text-[11px] text-faint pb-10">
                💡 No site, as perguntas, terminais e exercícios aparecem agrupados na secção
                final de Prática — aqui ficam no sítio onde os escreves.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {form ? (
        <BlockFormModal
          type={form.type}
          dsl={form.dsl}
          onApply={(dsl) => {
            form.onApply(dsl);
            setForm(null);
          }}
          onClose={() => setForm(null)}
        />
      ) : null}
    </div>
  );
}