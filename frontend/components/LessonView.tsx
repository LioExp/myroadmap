"use client";
import Image from "next/image";
import { Clock, ChevronRight, Terminal, ChevronLeft, ArrowRight } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { getMaterial, hasMaterial } from "@/lib/api";
import { abbreviate, cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Icon } from "@/components/Icons";
import type { Topic } from "@/types";

export default function LessonView() {
  const { getSelectedTopic, selectedLessonId, selectLesson, materials, practiceOpen, togglePractice } = useRoadmapStore();
  const topic = getSelectedTopic();
  if (!topic) return null;
  const lesson = topic.lessons.find((l) => l.id === selectedLessonId);
  if (!lesson) return null;

  const hasContent = hasMaterial(materials, topic.slug, lesson.id);
  const material = getMaterial(materials, topic.slug, lesson.id);

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
          onClick={() => selectLesson(null)}
        >
          {topic.module}
        </span>
        <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
        <span
          className="text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          onClick={() => selectLesson(null)}
        >
          Intro
        </span>
        <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
        <span className="text-purple-600 dark:text-purple-400">
          {abbreviate(lesson.title, 30)}
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-lg font-black leading-tight flex items-center gap-2 text-[#111827] dark:text-[#F3F4F6]">
          <Icon name={topic.emoji} size={22} />
          {lesson.title}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5" />
          {lesson.duration}
        </div>
      </div>

      {/* Topics index */}
      {lesson.topics && lesson.topics.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#374151] rounded-xl p-4">
          <h3 className="text-[12px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2.5">
            Índice da Aula
          </h3>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {lesson.topics.map((t, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-[12px] text-[#374151] dark:text-[#D1D5DB] leading-relaxed py-1.5 border-b border-[#F3F4F6] dark:border-[#1F2937] last:border-none"
              >
                <span className="w-5 h-5 rounded-full bg-[#F3E8FF] dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      {hasContent && material ? (
        <MarkdownRenderer content={material.conteudo} />
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
          <Image src="/lio_mascote_run_up.PNG" alt="Próxima" width={40} height={40} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
