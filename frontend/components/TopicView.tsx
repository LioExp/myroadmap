"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Clock, BookOpen, CheckCircle, ChevronRight, Play, Wrench, Flame, Lightbulb } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { hasMaterial } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icons";
import ResourceCard from "@/components/ResourceCard";
import VideoEmbed from "@/components/VideoEmbed";

function SectionTitle({ icon, label, orange = false }: { icon: React.ReactNode; label: string; orange?: boolean }) {
  return (
    <h2 className={cn(
      "text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 flex-shrink-0",
      orange ? "text-[#9CA3AF] dark:text-[#6B7280]" : "text-[#9CA3AF] dark:text-[#6B7280]"
    )}>
      <span className={cn("w-3 h-3", orange && "text-orange-400")}>{icon}</span>
      {label}
    </h2>
  );
}

export default function TopicView() {
  const { getSelectedTopic, selectedLessonId, selectLesson, selectTopic, materials } = useRoadmapStore();
  const topic = getSelectedTopic();
  if (!topic) return null;

  const completedLessons = topic.lessons.filter((l) => hasMaterial(materials, topic.slug, l.id)).length;
  const progressPct = Math.round((completedLessons / topic.lessons.length) * 100);
  const topicStatus = progressPct === 100 ? "completed" : progressPct > 0 ? "in-progress" : "upcoming";

  const statusColors = {
    completed: { bg: "bg-[#DCFCE7] dark:bg-green-900/30", fg: "text-green-700 dark:text-green-400", label: "Concluído" },
    "in-progress": { bg: "bg-[#F3E8FF] dark:bg-purple-900/30", fg: "text-purple-700 dark:text-purple-400", label: "Em progresso" },
    upcoming: { bg: "bg-[#F3F4F6] dark:bg-[#111827]", fg: "text-[#6B7280]", label: "A seguir" },
  }[topicStatus];

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase tracking-widest mb-2">
          <span
            className="text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            onClick={() => selectTopic(null)}
          >
            {topic.module}
          </span>
          <ChevronRight className="w-3 h-3 text-[#D1D5DB] dark:text-[#4B5563]" />
          <span className="text-purple-600 dark:text-purple-400">Intro</span>
          {/* Status badge */}
          <span className={cn("ml-1 text-[9px] font-bold px-2 py-0.5 rounded-full", statusColors.bg, statusColors.fg)}>
            {statusColors.label}
          </span>
        </div>

        <h1 className="text-lg font-black leading-tight flex items-center gap-2 text-[#111827] dark:text-[#F3F4F6]">
          <Icon name={topic.emoji} size={22} />
          {topic.title}
        </h1>
        <p className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 leading-relaxed max-w-xl">
          {topic.longDesc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            ~{topic.estimatedHours}h estimadas
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
            <BookOpen className="w-3.5 h-3.5" />
            {topic.lessons.length} aulas
          </div>
          {completedLessons > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-600 dark:text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              {completedLessons}/{topic.lessons.length} concluídas
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progressPct > 0 && (
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 bg-[#F3F4F6] dark:bg-[#1F2937] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 flex-shrink-0">
              {progressPct}%
            </span>
          </div>
        )}
      </div>

      {/* Main video */}
      <div>
        <SectionTitle icon={<Play className="w-3 h-3" />} label="Vídeo Principal" />
        <VideoEmbed
          url={topic.mainVideo.url}
          title={topic.mainVideo.title}
          description={topic.mainVideo.description}
        />
      </div>

      {/* Lesson list */}
      <div>
        <SectionTitle icon={<BookOpen className="w-3 h-3" />} label="Aulas do Módulo" />
        <div className="flex flex-col gap-1.5">
          {topic.lessons.map((lesson, i) => {
            const sel = selectedLessonId === lesson.id;
            const isCompleted = hasMaterial(materials, topic.slug, lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => selectLesson(lesson.id)}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl border cursor-pointer transition-all",
                  sel
                    ? "bg-[#FAF5FF] dark:bg-purple-900/20 border-purple-300 dark:border-purple-600 shadow-sm"
                    : isCompleted
                    ? "bg-green-50/60 dark:bg-green-900/20 border-[#DCFCE7] dark:border-green-900/50"
                    : "bg-white dark:bg-[#1a1a1a] border-[#F3F4F6] dark:border-[#374151] hover:border-[#E5E7EB] dark:hover:border-[#4B5563] hover:shadow-sm"
                )}
              >
                {/* Check icon */}
                <span
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    isCompleted
                      ? "text-green-500"
                      : sel
                      ? "text-purple-500"
                      : "text-[#D1D5DB] dark:text-[#4B5563]"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-current block" />
                  )}
                </span>

                {/* Title */}
                <div
                  className={cn(
                    "flex-1 min-w-0 text-[11px] font-semibold leading-snug",
                    isCompleted
                      ? "text-[#6B7280] line-through"
                      : sel
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-[#1F2937] dark:text-[#E5E7EB]"
                  )}
                >
                  {i + 1}. {lesson.title}
                  {lesson.practice && (
                    <Wrench className="inline w-2.5 h-2.5 ml-1 text-orange-400 dark:text-orange-300" />
                  )}
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF] flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {lesson.duration}
                </div>

                {/* Play icon */}
                {!isCompleted && (
                  <Play
                    className={cn(
                      "w-3 h-3 flex-shrink-0",
                      sel ? "text-purple-500" : "text-[#D1D5DB] dark:text-[#4B5563]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resources */}
      <div>
        <SectionTitle icon={<Wrench className="w-3 h-3" />} label="Recursos Recomendados" />
        <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
          {topic.resources.map((r, i) => (
            <ResourceCard key={i} resource={r} />
          ))}
        </div>
      </div>

      {/* Deep dive */}
      <div>
        <SectionTitle icon={<Flame className="w-3 h-3 text-orange-400" />} label="Para Aprofundar" orange />
        <div className="flex flex-col gap-2 mb-3">
          {topic.deepDive.map((r, i) => (
            <ResourceCard key={i} resource={r} />
          ))}
        </div>

        {/* Tip mascot with popup */}
        <TipBox />
      </div>
    </div>
  );
}

function TipBox() {
  const [showTip, setShowTip] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowTip(true);
          setHasTriggered(true);
          setTimeout(() => setShowTip(false), 6000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasTriggered]);

  return (
    <div ref={ref} className="mt-14 mb-4 flex items-center justify-center gap-3 min-h-[80px]">
      {showTip && (
        <div className="z-20 animate-fade-in">
          <div
            className="bg-gradient-to-br from-[#111827] to-[#1F2937] dark:from-black dark:to-[#111827] rounded-xl px-4 py-3 shadow-lg max-w-[260px] relative"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#D1D5DB] dark:text-[#9CA3AF] leading-relaxed">
                Termina as matérias antes de avançar para o aprofundamento. A base sólida acelera tudo que vem a seguir.
              </p>
            </div>
            <div className="w-2.5 h-2.5 bg-[#1F2937] absolute -right-1 top-1/2 -translate-y-1/2 rotate-45" />
          </div>
        </div>
      )}

      <Image
        src="/mascote-tip.png"
        alt=""
        width={80}
        height={80}
        className="flex-shrink-0 animate-float pointer-events-auto cursor-pointer"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      />
    </div>
  );
}
