"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Clock, Terminal, ChevronLeft, ArrowRight } from "lucide-react";
import { useRoadmapStore, selectSelectedTopic } from "@/store/useRoadmapStore";
import { getMaterial, hasMaterial } from "@/lib/api";
import { useMaterialsMap } from "@/hooks/useMaterialsMap";
import { abbreviate, cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Breadcrumb from "@/components/Breadcrumb";
import { Icon } from "@/components/Icons";
import type { Topic } from "@/types";

export default function LessonView() {
  const topic = useRoadmapStore(selectSelectedTopic);
  const selectedLessonId = useRoadmapStore((s) => s.selectedLessonId);
  const selectLesson = useRoadmapStore((s) => s.selectLesson);
  const materialsMap = useMaterialsMap();
  const practiceOpen = useRoadmapStore((s) => s.practiceOpen);
  const togglePractice = useRoadmapStore((s) => s.togglePractice);
  const subLesson = useRoadmapStore((s) => s.subLesson);
  const setSubLesson = useRoadmapStore((s) => s.setSubLesson);
  const lesson = topic?.lessons.find((l) => l.id === selectedLessonId);
  const subLessons = lesson?.subLessons;

  // Abre sub-aulas a partir do hash (#sub-...) — no mount, em clicks em
  // .sub-lesson-link e em hashchange. Um único handler para os três casos.
  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#sub-")) return;
      const id = hash.replace("#sub-", "");
      if (subLessons?.[id]) setSubLesson(id);
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.(".sub-lesson-link") as HTMLAnchorElement | null;
      if (link) {
        e.preventDefault();
        setSubLesson(link.hash.replace("#sub-", ""));
      }
    };
    openFromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", openFromHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, [setSubLesson, subLessons]);

  if (!topic) return null;
  if (!lesson) return null;

  const hasContent = hasMaterial(materialsMap, topic.slug, lesson.id);
  const material = getMaterial(materialsMap, topic.slug, lesson.id);
  const activeSub = subLesson ? lesson.subLessons?.[subLesson] : undefined;
  const subLessonTitle = activeSub?.title;

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
              : "bg-main dark:bg-white text-white dark:text-main hover:scale-105"
          )}
          title={practiceOpen ? "Fechar terminal" : "Abrir terminal de prática"}
        >
          <Terminal className="w-5 h-5" />
        </button>
      )}

      {/* Breadcrumb: Fase > Módulo > Aula > Sub-aula */}
      <Breadcrumb
        crumbs={[
          { label: topic.phase, onClick: () => selectLesson(null) },
          { label: topic.module, onClick: () => selectLesson(null) },
          {
            label: abbreviate(`Aula ${lesson.id} — ${lesson.title}`, 36),
            onClick: subLessonTitle ? () => setSubLesson(null) : undefined,
            active: !subLessonTitle,
          },
          ...(subLessonTitle
            ? [{ label: abbreviate(subLessonTitle, 30), active: true }]
            : []),
        ]}
      />

      {/* Title */}
      <div>
        <h1 className="text-lg font-black leading-tight flex items-center gap-2 text-main">
          <Icon name={topic.emoji} size={22} />
          {lesson.title}
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-muted">
          <Clock className="w-3.5 h-3.5" />
          {lesson.duration}
        </div>
      </div>

      {/* Content or Sub-lesson */}
      {activeSub ? (
        <div className="rounded-lg border border-line bg-surface p-4">
          <h3 className="text-sm font-bold text-main">{activeSub.title}</h3>
          <p className="mt-1 text-[13px] text-muted leading-relaxed">{activeSub.def}</p>
        </div>
      ) : (
        <>
          {lesson.topics && lesson.topics.length > 0 && (
            <div className="rounded-lg border border-line bg-surface p-3">
              <ul className="flex flex-col gap-1.5">
                {lesson.topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-muted leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasContent && material ? (
            <MarkdownRenderer content={material.conteudo} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
              <Image src="/mascote.png" alt="Mascote" width={120} height={120} className="opacity-80" style={{ width: 120, height: "auto" }} />
              <h3 className="text-base font-bold text-muted">
                Vazio por enquanto
              </h3>
            </div>
          )}
        </>
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
    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-line">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.id)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-muted hover:text-main dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="truncate max-w-[160px]">{prev.title}</span>
        </button>
      ) : (
        <div />
      )}
      <span className="text-[10px] font-semibold text-faint">
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
