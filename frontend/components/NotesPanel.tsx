"use client";
import Image from "next/image";
import { FileText, PanelLeft, CheckSquare, AlertTriangle, ArrowRight, Copy, Check } from "lucide-react";
import { useRoadmapStore, selectSelectedTopic, DEFAULT_NOTES } from "@/store/useRoadmapStore";
import { buildMarkdown, isNotesEmpty, cn } from "@/lib/utils";
import TiptapEditor from "@/components/TiptapEditor";
import GithubPush from "@/components/GithubPush";
import type { NoteFields } from "@/types";
import { useState } from "react";

function NoteField({
  icon,
  label,
  hint,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-shrink-0 flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <span className="inline-flex items-center justify-center w-3 h-3 text-strong">
          {icon}
        </span>
        <span className="text-[10px] font-black text-strong">{label}</span>
      </div>
      <p className="text-[8px] text-faint leading-relaxed max-md:hidden">{hint}</p>
      <TiptapEditor value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

export default function NotesPanel() {
  const topic = useRoadmapStore(selectSelectedTopic);
  const toggleNotes = useRoadmapStore((s) => s.toggleNotes);
  const setMobileView = useRoadmapStore((s) => s.setMobileView);
  const notesMap = useRoadmapStore((s) => s.notes);
  const updateNote = useRoadmapStore((s) => s.updateNote);
  const [copied, setCopied] = useState(false);

  const notes: NoteFields = topic ? notesMap[topic.id] ?? DEFAULT_NOTES : DEFAULT_NOTES;
  const empty = !topic || isNotesEmpty(notes);

  function handleCopy() {
    if (!topic || empty) return;
    navigator.clipboard.writeText(buildMarkdown(topic, notes)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <aside className="h-full min-h-0 flex flex-col bg-surface dark:bg-surface-2 border border-line-strong dark:border-line rounded-2xl overflow-hidden shadow-sm max-md:h-auto max-md:w-full max-md:overflow-visible max-md:border-0 max-md:rounded-none max-md:shadow-none">
      {/* Header */}
      <div className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-line dark:border-line-strong">
        <span className="text-[11px] font-black uppercase tracking-widest text-faint flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Notas
        </span>
        <button
          onClick={() => {
            toggleNotes();
            setMobileView("content");
          }}
          title="Fechar notas"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors max-md:hidden"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-3 py-4 gap-3 overflow-y-auto max-md:overflow-visible max-md:pb-24">
        {/* Hint */}
        <div className="flex-shrink-0">
          <p className="text-[10px] text-faint leading-relaxed">
            Preenche depois de estudar. Salvo automaticamente por módulo.
          </p>
        </div>

        {/* Note fields */}
        <div className="flex-1 flex flex-col gap-3 pr-0.5">
          <NoteField
            icon={<CheckSquare className="w-3 h-3" />}
            label="O que aprendi"
            hint="Escreve como se explicasses a um amigo. 2-3 frases é o suficiente."
            placeholder="Ex: Aprendi como as permissões funcionam no Linux..."
            value={notes.learned}
            onChange={(v) => topic && updateNote(topic.id, "learned", v)}
          />
          <NoteField
            icon={<AlertTriangle className="w-3 h-3" />}
            label="Dificuldades"
            hint="Sem julgamento — identificar o obstáculo é o primeiro passo."
            placeholder="Ex: Ainda não ficou claro como o sudo funciona..."
            value={notes.difficulty}
            onChange={(v) => topic && updateNote(topic.id, "difficulty", v)}
          />
          <NoteField
            icon={<ArrowRight className="w-3 h-3" />}
            label="Próximo passo"
            hint="Uma ação concreta. Quanto mais específica, melhor."
            placeholder="Ex: Fazer o desafio Bandit do OverTheWire..."
            value={notes.nextStep}
            onChange={(v) => topic && updateNote(topic.id, "nextStep", v)}
          />
        </div>

        {/* Mascote */}
        <Image
          src="/lio_mascote_studing.PNG"
          alt=""
          width={80}
          height={80}
          className="block mx-auto flex-shrink-0 mt-1"
        />

        {/* Footer */}
        <div className="flex-shrink-0 flex flex-col gap-1.5">
          <button
            onClick={handleCopy}
            disabled={empty}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all duration-150 font-sans",
              empty
                ? "bg-surface-2 dark:bg-line-strong text-faint dark:text-ghost cursor-not-allowed"
                : copied
                ? "bg-green-500 text-white shadow-md"
                : "bg-green-500 text-white hover:bg-green-600 active:scale-[0.98] shadow-sm"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar Markdown"}
          </button>
          {topic && !empty && (
            <GithubPush content={buildMarkdown(topic, notes)} filePath={`notas/${topic.slug}.md`} />
          )}
          <p className="text-[10px] text-faint text-center leading-relaxed">
            Cola no teu editor → git push
          </p>
        </div>
      </div>
    </aside>
  );
}
