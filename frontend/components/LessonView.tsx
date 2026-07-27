"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Clock, ChevronRight, Terminal, ChevronLeft, ArrowRight } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { getMaterial, hasMaterial } from "@/lib/api";
import { abbreviate, cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Icon } from "@/components/Icons";
import type { Topic } from "@/types";

export default function LessonView() {
  const { getSelectedTopic, selectedLessonId, selectLesson, materials, practiceOpen, togglePractice, glossaryOpen, toggleGlossary, setGlossaryOpen } = useRoadmapStore();
  const topic = getSelectedTopic();
  if (!topic) return null;
  const lesson = topic.lessons.find((l) => l.id === selectedLessonId);
  if (!lesson) return null;

  const hasContent = hasMaterial(materials, topic.slug, lesson.id);
  const material = getMaterial(materials, topic.slug, lesson.id);

  // Open glossary when URL hash points to a glossary term
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.startsWith("#glossario-") && lesson.glossary) {
        setGlossaryOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [lesson.glossary]);

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Practice floating button */}
      {lesson.practice && (
        <button
          onClick={togglePractice}
          className={cn(
            "fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
            practiceOpen
              ? "bg-purple-600 text-white shadow-purple-500/30"
              : "bg-[#111827] dark:bg-white text-white dark:text-[#111827] hover:scale-105"
          )}
          title={practiceOpen ? "Fechar terminal" : "Abrir terminal de prática"}
        >
          <Terminal className="w-5 h-5" />
        </button>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase tracking-widest">
        <span
          className="text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          onClick={() => { setGlossaryOpen(false); selectLesson(null) }}
        >
          {topic.module}
        </span>
        <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
        <span
          className="text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          onClick={() => { setGlossaryOpen(false); selectLesson(null) }}
        >
          Intro
        </span>
        <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
        <span
          className={cn("cursor-pointer transition-colors", glossaryOpen ? "text-[#9CA3AF] dark:text-[#6B7280] hover:text-purple-600 dark:hover:text-purple-400" : "text-purple-600 dark:text-purple-400")}
          onClick={() => setGlossaryOpen(false)}
        >
          {abbreviate(lesson.title, 30)}
        </span>
        {glossaryOpen && (
          <>
            <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
            <span className="text-purple-600 dark:text-purple-400">
              Glossário
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-lg font-black leading-tight flex items-center gap-2 text-[#111827] dark:text-[#F3F4F6]">
          <Icon name={topic.emoji} size={22} />
          {glossaryOpen ? "Glossário" : lesson.title}
        </h1>
        {!glossaryOpen && (
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration}
          </div>
        )}
      </div>

      {/* Content or Glossary */}
      {glossaryOpen && lesson.glossary ? (
        <div className="flex flex-col gap-4">
          {lesson.glossary.map((entry, i) => (
            <div key={i} id={`glossario-${entry.term}`} className="scroll-mt-4 rounded-lg border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1a1a1a] p-4">
              <h3 className="text-sm font-bold text-[#111827] dark:text-[#F3F4F6]">{entry.term}</h3>
              <p className="mt-1 text-[13px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">{entry.def}</p>
            </div>
          ))}
          <button
            onClick={() => setGlossaryOpen(false)}
            className="self-start text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-none mt-2"
          >
            ← Voltar à aula
          </button>
        </div>
      ) : hasContent && material ? (
        <>
          <MarkdownRenderer content={material.conteudo} />
          {lesson.glossary && lesson.glossary.length > 0 && (
            <button
              onClick={() => setGlossaryOpen(true)}
              className="self-start text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-none mt-4"
            >
              Ver Glossário da aula →
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
          <Image src="/mascote.png" alt="Mascote" width={120} height={120} className="opacity-80" style={{ width: 120, height: "auto" }} />
          <h3 className="text-base font-bold text-[#6B7280] dark:text-[#9CA3AF]">
            Vazio por enquanto
          </h3>
        </div>
      )}

      {/* Prev / Next navigation */}
      <LessonNav topic={topic} currentLessonId={lesson.id} onNavigate={selectLesson} />
    </div>
  );
}

function LessonNav({ topic, currentLessonId, onNavigate }: { topic: Topic; currentLessonId: number; onNavigate: (id: number | null) => void }) {
  const sorted = [...topic.lessons].sort((a, b) => a.id - b.id);
  const idx = sorted.findIndex((l) => l.id === currentLessonId);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#374151]">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.id)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="truncate max-w-[160px]">{prev.title}</span>
        </button>
      ) : (
        <div />
      )}
      <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#6B7280]">
        {idx + 1} / {sorted.length}
      </span>
      {next ? (
        <button
          onClick={() => onNavigate(next.id)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-none group"
        >
          <span className="truncate max-w-[140px]">{next.title}</span>
          <Image src="/lio_mascote_run_up.PNG" alt="Próxima" width={40} height={40} className="animate-shake group-hover:scale-110 transition-transform" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
