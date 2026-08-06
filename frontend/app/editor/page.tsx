"use client";
import { useState, useEffect } from "react";
import type { Material } from "@/types";
import { renderMarkdown } from "@/lib/markdown";
import WidgetRenderer from "@/components/widgets";

export default function EditorPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selected, setSelected] = useState<{ mod: string; file: string } | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/materiais-index.json")
      .then((r) => r.json())
      .then(setMaterials)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPreview(renderMarkdown(content));
  }, [content]);

  const loadLesson = async (mod: string, aula: number) => {
    setSelected({ mod, file: `0${aula}` });
    try {
      const res = await fetch(`/api/lesson?mod=${mod}&aula=${aula}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.titulo || "");
        setContent(data.conteudo || "");
      }
    } catch {}
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mod: selected.mod,
          aula: parseInt(selected.file),
          titulo: title,
          conteudo: content,
        }),
      });
    } catch {}
    setSaving(false);
  };

  const modules = Array.from(new Set(materials.map((m) => m.modulo)));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-page text-gray-900 dark:text-gray-100">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto flex-shrink-0">
        <h1 className="text-lg font-extrabold mb-4">Editor</h1>
        {modules.map((mod) => (
          <div key={mod} className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{mod}</h2>
            {materials
              .filter((m) => m.modulo === mod)
              .map((m) => (
                <button
                  key={m.aula}
                  onClick={() => loadLesson(mod, m.aula)}
                  className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                    selected?.mod === mod && selected?.file === `0${m.aula}`
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

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-800">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-sm font-bold bg-transparent border-none outline-none"
            placeholder="Título da aula"
          />
          <button
            onClick={handleSave}
            disabled={saving || !selected}
            className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>

        <div className="flex-1 flex">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-4 text-xs font-mono bg-transparent border-r border-gray-200 dark:border-gray-800 resize-none outline-none"
            placeholder="Conteúdo em markdown..."
          />
          <div
            className="flex-1 p-4 overflow-y-auto lesson-material"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  );
}
