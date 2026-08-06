"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Clock, BookOpen, CheckCircle, Play, Wrench, Flame, Lightbulb } from "lucide-react";
import { useRoadmapStore, selectSelectedTopic } from "@/store/useRoadmapStore";
import { hasMaterial } from "@/lib/api";
import { useMaterialsMap } from "@/hooks/useMaterialsMap";
import { STATUS_BADGE, STATUS_LABEL, getTopicStatus, topicProgress } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icons";
import ResourceCard from "@/components/ResourceCard";
import VideoEmbed from "@/components/VideoEmbed";
import Breadcrumb from "@/components/Breadcrumb";

function SectionTitle({ icon, label, orange = false }: { icon: React.ReactNode; label: string; orange?: boolean }) {
  return (
    <h2 className={cn(
      "text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 flex-shrink-0",
      orange ? "text-faint" : "text-faint"
    )}>
      <span className={cn("w-3 h-3", orange && "text-orange-400")}>{icon}</span>
      {label}
    </h2>
  );
}

export default function TopicView() {
  const topic = useRoadmapStore(selectSelectedTopic);
  const selectedLessonId = useRoadmapStore((s) => s.selectedLessonId);
  const selectLesson = useRoadmapStore((s) => s.selectLesson);
  const selectTopic = useRoadmapStore((s) => s.selectTopic);
  const materialsMap = useMaterialsMap();
  if (!topic) return null;

  const { completed: completedLessons, total: totalLessons, pct: progressPct } = topicProgress(topic, materialsMap);
  const topicStatus = getTopicStatus(completedLessons, totalLessons);
  const statusBadge = STATUS_BADGE[topicStatus];

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb + header */}
      <div>
        <Breadcrumb
          className="mb-2"
          crumbs={[
            { label: topic.phase, onClick: () => selectTopic(null) },
            ...(topic.block ? [{ label: topic.block }] : []),
            { label: topic.module, onClick: () => selectTopic(null), active: true },
            { label: "Intro", active: true },
          ]}
          trailing={
            <span className={cn("ml-1 text-[9px] font-bold px-2 py-0.5 rounded-full", statusBadge.bg, statusBadge.fg)}>
              {STATUS_LABEL[topicStatus]}
            </span>
          }
        />

        <h1 className="text-lg font-black leading-tight flex items-center gap-2 text-main">
          <Icon name={topic.emoji} size={22} />
          {topic.title}
        </h1>
        <p className="text-[12px] text-muted mt-1.5 leading-relaxed max-w-xl">
          {topic.longDesc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <Clock className="w-3.5 h-3.5" />
            ~{topic.estimatedHours}h estimadas
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
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
            <div className="flex-1 h-1.5 bg-surface-2 dark:bg-line-strong rounded-full overflow-hidden">
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
            const isCompleted = hasMaterial(materialsMap, topic.slug, lesson.id);
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
                    : "bg-surface border-line-strong dark:border-line hover:border-line dark:hover:border-ghost hover:shadow-sm"
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
                      : "text-ghost"
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
                      ? "text-muted line-through"
                      : sel
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-strong"
                  )}
                >
                  {i + 1}. {lesson.title}
                  {lesson.practice && (
                    <Wrench className="inline w-2.5 h-2.5 ml-1 text-orange-400 dark:text-orange-300" />
                  )}
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1 text-[10px] text-faint flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {lesson.duration}
                </div>

                {/* Play icon */}
                {!isCompleted && (
                  <Play
                    className={cn(
                      "w-3 h-3 flex-shrink-0",
                      sel ? "text-purple-500" : "text-ghost"
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
  const triggeredRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || triggeredRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          setShowTip(true);
          if (!isMobile) {
            setTimeout(() => setShowTip(false), 6000);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div ref={ref} className="mt-14 mb-4 flex items-center justify-center min-h-[80px] transition-all duration-500 ease-in-out">
      <Image
        src="/mascote-tip.png"
        alt=""
        width={80}
        height={80}
        className="flex-shrink-0 animate-float pointer-events-auto cursor-pointer"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      />

      <div className={`relative transition-all duration-500 ease-in-out ${showTip ? "opacity-100 ml-3" : "opacity-0 ml-0 pointer-events-none"}`}>
        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] dark:from-black dark:to-[#111827] rounded-xl px-4 py-3 shadow-lg max-w-[260px] relative">
          <div
            className="flex items-start gap-2"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-ghost dark:text-muted leading-relaxed">
              Termina as matérias antes de avançar para o aprofundamento. A base sólida acelera tudo que vem a seguir.
            </p>
          </div>
          <div className="w-2.5 h-2.5 bg-[#1F2937] absolute -left-1 top-1/2 -translate-y-1/2 rotate-45" />
        </div>
      </div>
    </div>
  );
}
