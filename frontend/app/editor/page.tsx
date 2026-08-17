"use client";
import { useState, useEffect, useRef } from "react";
import type { Material } from "@/types";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const CURSOR = "\u0001";

interface Snippet {
  label: string;
  template: string;
}

const SNIPPETS: Record<string, Snippet[]> = {
  "Secções": [
    { label: "Teoria", template: "**Teoria — ${CURSOR}**\n\n" },
    { label: "Prática", template: "**Prática — ${CURSOR}**\n\n" },
    { label: "Divisor", template: "{{divider}}\n\n" },
  ],
  "Blocos": [
    {
      label: "Pergunta",
      template:
        "```pergunta\npergunta: ${CURSOR}\nresposta: \ndica: \n```\n\n",
    },
    {
      label: "Terminal",
      template:
        "```terminal\npergunta: ${CURSOR}\nresposta: \ndica: \nlimite: 32\n```\n\n",
    },
    {
      label: "Exercício",
      template:
        "```exercicio\ntitulo: ${CURSOR}\ninstrucoes:\n1. \narquivo: script.py\ndica: \ninicio:\n\nesperado:\n```\n\n",
    },
    {
      label: "Áudio",
      template: "```audio\nurl: ${CURSOR}\ntitulo: \n```\n\n",
    },
    {
      label: "Imagem",
      template: "```imagem\nurl: ${CURSOR}\ntitulo: \nlegenda: \n```\n\n",
    },
    {
      label: "Animação",
      template: "```animacao\ntitulo: ${CURSOR}\npasso: \npasso: \n```\n\n",
    },
  ],
  "Tags": [
    { label: "Alert", template: "{{alert: ${CURSOR}}}\n\n" },
    { label: "Imagem", template: "{{image: ${CURSOR}}}\n\n" },
    { label: "Vídeo", template: "{{video: ${CURSOR}}}\n\n" },
    { label: "Ícone", template: "{{icon: ${CURSOR}}}" },
    { label: "Destaque", template: "==${CURSOR}==" },
    { label: "Sub-aula", template: "[[${CURSOR}]]" },
  ],
  "Widgets": [
    { label: "Linux Arch", template: "{{widget: linux-arch}}" },
    { label: "Distro Selector", template: "{{widget: distro-selector}}" },
    { label: "Distro Cmd", template: "{{widget: distro-cmd?tool=git}}" },
    { label: "KSD Cards", template: "{{widget: ksd-cards}}" },
    { label: "Distro Grid", template: "{{widget: distro-grid}}" },
    { label: "Linux Where", template: "{{widget: linux-where}}" },
  ],
};

export default function EditorPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selected, setSelected] = useState<{ mod: string; aula: number } | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newMod, setNewMod] = useState("");
  const [newAula, setNewAula] = useState("");
  const [newTitulo, setNewTitulo] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const res = await fetch("/materiais-index.json");
      setMaterials(await res.json());
    } catch {}
  };

  const loadLesson = async (mod: string, aula: number) => {
    setSelected({ mod, aula });
    try {
      const res = await fetch(`/api/lesson?mod=${mod}&aula=${aula}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.titulo || "");
        setContent(data.conteudo || "");
        setSavedMsg(null);
      }
    } catch {}
  };

  const handleSave = async (mod: string, aula: number, titulo: string, conteudo: string) => {
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mod, aula, titulo, conteudo }),
      });
      if (res.ok) setSavedMsg("Salvo ✓");
      else setSavedMsg("Erro ao salvar");
    } catch {
      setSavedMsg("Erro ao salvar");
    }
    setSaving(false);
    await loadMaterials();
  };

  const handleNewLesson = async () => {
    const aula = parseInt(newAula);
    if (!newMod.trim() || !Number.isInteger(aula) || aula <= 0 || !newTitulo.trim()) return;
    await handleSave(newMod.trim(), aula, newTitulo.trim(), "");
    setShowNew(false);
    setNewMod("");
    setNewAula("");
    setNewTitulo("");
    await loadLesson(newMod.trim(), aula);
  };

  const insertSnippet = (snippet: Snippet) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const markerIdx = snippet.template.indexOf(CURSOR);
    const template = snippet.template.replace(CURSOR, "");
    const next = content.slice(0, start) + template + content.slice(end);
    setContent(next);
    const cursorAt = start + (markerIdx >= 0 ? markerIdx : template.length);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorAt, cursorAt);
    });
  };

  const modules = Array.from(new Set(materials.map((m) => m.modulo)));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-page text-gray-900 dark:text-gray-100">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto flex-shrink-0">
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
              placeholder="módulo (ex: linux)"
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
              Criar aula
            </button>
          </div>
        ) : null}

        {modules.map((mod) => (
          <div key={mod} className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              {mod}
            </h2>
            {materials
              .filter((m) => m.modulo === mod)
              .sort((a, b) => a.aula - b.aula)
              .map((m) => (
                <button
                  key={m.aula}
                  onClick={() => loadLesson(mod, m.aula)}
                  className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                    selected?.mod === mod && selected?.aula === m.aula
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {m.aula}. {m.titulo}
                </button>
              ))}
          </div>
        ))}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-800">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-sm font-bold bg-transparent border-none outline-none"
            placeholder="Título da aula"
          />
          {savedMsg ? (
            <span className="text-[11px] font-bold text-green-600 dark:text-green-400">
              {savedMsg}
            </span>
          ) : null}
          <button
            onClick={() => selected && handleSave(selected.mod, selected.aula, title, content)}
            disabled={saving || !selected}
            className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-200 dark:border-gray-800 overflow-x-auto flex-shrink-0">
          {Object.entries(SNIPPETS).map(([group, items]) => (
            <div key={group} className="flex items-center gap-1 mr-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1 whitespace-nowrap">
                {group}
              </span>
              {items.map((snippet) => (
                <button
                  key={snippet.label}
                  onClick={() => insertSnippet(snippet)}
                  title={`Inserir ${snippet.label}`}
                  className="whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {snippet.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-1 flex min-h-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-4 text-xs font-mono bg-transparent border-r border-gray-200 dark:border-gray-800 resize-none outline-none"
            placeholder='Conteúdo em markdown — usa os botões acima para inserir blocos. Sintaxe completa em docs/sintaxe-markdown.md'
          />
          <div className="flex-1 overflow-y-auto">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
