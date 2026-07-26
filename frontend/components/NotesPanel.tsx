"use client";
import Image from "next/image";
import { ChevronRight, ChevronLeft, FileText, MessageSquare, CheckSquare, AlertTriangle, ArrowRight, Copy, Check } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { buildMarkdown, isNotesEmpty, cn } from "@/lib/utils";
import TiptapEditor from "@/components/TiptapEditor";
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
        <span className="inline-flex items-center justify-center w-3 h-3 text-[#1F2937] dark:text-[#E5E7EB]">
          {icon}
        </span>
        <span className="text-[10px] font-black text-[#1F2937] dark:text-[#E5E7EB]">{label}</span>
      </div>
      <p className="text-[8px] text-[#9CA3AF] leading-relaxed max-md:hidden">{hint}</p>
      <TiptapEditor value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

export default function NotesPanel() {
  const { notesOpen, toggleNotes, getSelectedTopic, getNotes, updateNote, mobileView } = useRoadmapStore();
  const [copied, setCopied] = useState(false);

  const topic = getSelectedTopic();
  const notes: NoteFields = topic ? getNotes(topic.id) : { learned: "", difficulty: "", nextStep: "" };
  const empty = !topic || isNotesEmpty(notes);

  function handleCopy() {
    if (!topic || empty) return;
    navigator.clipboard.writeText(buildMarkdown(topic, notes)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // Mobile notes view is always full-width expanded
  const isMobileNotes = mobileView === "notes";

  return (
    <aside
      className={cn(
        "relative flex-shrink-0 min-h-0 flex flex-col border-l border-[#E5E7EB] dark:border-[#374151]/80 transition-all duration-300 ease-in-out",
        isMobileNotes ? "w-full border-l-0 border-t border-[#F3F4F6] dark:border-[#374151] mt-4 max-md:rounded-2xl max-md:bg-white dark:max-md:bg-[#1a1a1a] max-md:border max-md:shadow-sm" : notesOpen ? "w-[300px]" : "w-11"
      )}
    >
      {/* Toggle button (hidden on mobile notes view) */}
      {!isMobileNotes && (
        <button
          onClick={toggleNotes}
          title={notesOpen ? "Fechar notas" : "Abrir notas"}
          className="absolute -left-3.5 top-5 z-20 w-7 h-7 rounded-full bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#4B5563] shadow-md flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] cursor-pointer transition-all hover:shadow-lg hover:text-[#111827] dark:hover:text-white"
        >
          {notesOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Collapsed state */}
      {!notesOpen && !isMobileNotes && (
        <div className="flex-1 flex flex-col items-center pt-14 gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F3F4F6] dark:bg-[#1a1a1a] dark:border dark:border-[#374151] text-[#9CA3AF]">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#111827] dark:bg-white text-white dark:text-[#111827]">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Open state */}
      {(notesOpen || isMobileNotes) && (
        <div className={cn(
          "flex-1 min-h-0 flex flex-col px-3 py-4 gap-3",
          isMobileNotes ? "overflow-y-auto" : "overflow-hidden"
        )}>
          {/* Header */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest">
                Notas
              </span>
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-1 leading-relaxed">
              Preenche depois de estudar. Salvo automaticamente por módulo.
            </p>
          </div>

          {/* Note fields */}
          <div className={cn(
            "flex-1 flex flex-col gap-3 pr-0.5",
            isMobileNotes ? "overflow-visible max-md:gap-2" : "min-h-0 overflow-y-auto"
          )}>
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
                  ? "bg-[#F3F4F6] dark:bg-[#1F2937] text-[#9CA3AF] dark:text-[#4B5563] cursor-not-allowed"
                  : copied
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-green-500 text-white hover:bg-green-600 active:scale-[0.98] shadow-sm"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar Markdown"}
            </button>
            <p className="text-[10px] text-[#9CA3AF] text-center leading-relaxed">
              Cola no teu editor → git push
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
