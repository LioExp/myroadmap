"use client";
import { useCallback, useRef, useState } from "react";
import { Compass, PanelLeft } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { topics } from "@/lib/data";
import { hasMaterial } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icons";
import { SidebarSkeleton } from "@/components/Skeleton";
import type { Topic, Material } from "@/types";

const COLLAPSED_WIDTH = 44;
const SNAP_THRESHOLD = 80;
const MIN_WIDTH = 44;
const MAX_WIDTH = 500;

function topicProgress(topic: Topic, materials: Material[]) {
  const completed = topic.lessons.filter((l) => hasMaterial(materials, topic.slug, l.id)).length;
  return { completed, total: topic.lessons.length, pct: Math.round((completed / topic.lessons.length) * 100) };
}

export default function LearningPlan() {
  const { selectedTopicId, selectTopic, materials, loaded, sidebarWidth, setSidebarWidth } = useRoadmapStore();
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(300);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const collapsed = !isMobile && sidebarWidth <= COLLAPSED_WIDTH;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;

      const handleMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX.current;
        const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
        setSidebarWidth(newWidth);
      };

      const handleMouseUp = () => {
        setDragging(false);
        const finalWidth = useRoadmapStore.getState().sidebarWidth;
        if (finalWidth > MIN_WIDTH && finalWidth < SNAP_THRESHOLD) {
          setSidebarWidth(COLLAPSED_WIDTH);
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [sidebarWidth, setSidebarWidth]
  );

  return (
    <aside
      className={cn(
        "h-full flex-shrink-0 min-h-0 flex flex-col border-r border-[#E5E7EB] dark:border-[#1F2937] max-md:w-full max-md:border-r-0 max-md:overflow-visible",
        !dragging && "transition-[width] duration-300 ease-in-out"
      )}
      style={isMobile ? undefined : { width: sidebarWidth }}
    >
      {!loaded ? (
        <SidebarSkeleton />
      ) : (
      <>
      {/* Collapsed state */}
      <div className={cn(
        "flex-1 min-h-0 flex flex-col items-center pt-4 gap-3 overflow-y-auto max-md:overflow-visible transition-opacity duration-300 ease-in-out",
        collapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute inset-0"
      )}>
        <button
          onClick={() => setSidebarWidth(300)}
          title="Expandir roadmap"
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F3F4F6] dark:bg-[#1a1a1a] dark:border dark:border-[#374151] text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white cursor-pointer transition-colors"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>
        <div className="relative flex flex-col items-center gap-3">
          {topics.map((topic, i) => {
            const sel = topic.id === selectedTopicId;
            const { pct } = topicProgress(topic, materials);
            const effectiveStatus = pct === 100 ? "completed" : pct > 0 ? "in-progress" : topic.status;

            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic.id)}
                title={topic.title}
                className="relative z-10 cursor-pointer"
              >
                {i < topics.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-3 border-l-2 border-dashed border-[#E5E7EB] dark:border-[#374151] z-0" />
                )}
                {effectiveStatus === "completed" ? (
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full bg-green-500 text-white font-black text-[10px] flex items-center justify-center shadow-sm",
                      sel
                        ? "ring-2 ring-green-400 ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                        : "ring-4 ring-[#F9FAFB] dark:ring-[#0a0a0a]"
                    )}
                  >
                    {i + 1}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      effectiveStatus === "in-progress"
                        ? "bg-purple-400 animate-pulse-slow"
                        : "bg-[#E5E7EB] dark:bg-[#4B5563]",
                      sel && effectiveStatus === "in-progress"
                        ? "ring-2 ring-white dark:ring-white ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                        : sel
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                        : "ring-4 ring-[#F9FAFB] dark:ring-[#0a0a0a]"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded state */}
      <div className={cn(
        "flex flex-col h-full transition-opacity duration-300 ease-in-out",
        !collapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute inset-0"
      )}>
        <h2 className="text-sm font-bold mb-4 flex items-center gap-1.5 py-5 px-5 pb-3 border-b border-[#E5E7EB] dark:border-[#1F2937] flex-shrink-0 text-[#111827] dark:text-[#F3F4F6]">
          Meu Roadmap{" "}
          <span className="inline-flex items-center justify-center w-4 h-4">
            <Compass className="w-3.5 h-3.5" />
          </span>
        </h2>

        <div className="relative flex-1 min-h-0 flex flex-col gap-3 px-5 pb-5 overflow-y-auto max-md:overflow-visible">
          {topics.map((topic, i) => {
            const sel = topic.id === selectedTopicId;
            const { pct } = topicProgress(topic, materials);
            const effectiveStatus = pct === 100 ? "completed" : pct > 0 ? "in-progress" : topic.status;

            return (
              <div key={topic.id} className="relative z-10 flex gap-3">
                {i < topics.length - 1 && (
                  <div className="absolute left-[15px] top-[24px] bottom-[-12px] w-0 border-l-2 border-dashed border-[#E5E7EB] dark:border-[#374151] z-0" />
                )}
                <div className="w-8 flex-shrink-0 flex justify-center pt-3.5">
                  {effectiveStatus === "completed" ? (
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full bg-green-500 text-white font-black text-[10px] flex items-center justify-center shadow-sm",
                        sel
                          ? "ring-2 ring-green-400 ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                          : "ring-4 ring-[#F9FAFB] dark:ring-[#0a0a0a]"
                      )}
                    >
                      {i + 1}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full mt-1",
                        effectiveStatus === "in-progress"
                          ? "bg-purple-400 animate-pulse-slow"
                          : "bg-[#E5E7EB] dark:bg-[#4B5563]",
                        sel && effectiveStatus === "in-progress"
                          ? "ring-2 ring-white dark:ring-white ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                          : sel
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#F9FAFB] dark:ring-offset-[#0a0a0a]"
                          : "ring-4 ring-[#F9FAFB] dark:ring-[#0a0a0a]"
                      )}
                    />
                  )}
                </div>

                <button
                  onClick={() => selectTopic(topic.id)}
                  className={cn(
                    "flex-1 text-left rounded-2xl p-3.5 border shadow-sm cursor-pointer transition-all duration-150 font-sans",
                    effectiveStatus === "completed" && sel
                      ? "bg-green-50 border-green-300 dark:bg-[#1a2e1a] dark:border-green-800 shadow-md"
                      : effectiveStatus === "completed"
                      ? "bg-white border-[#F3F4F6] dark:bg-[#1a1a1a] dark:border-[#374151]"
                      : effectiveStatus === "in-progress" && sel
                      ? "bg-[#EDE9F7] border-purple-400 dark:bg-[#2a1f3e] dark:border-purple-600 shadow-md"
                      : effectiveStatus === "in-progress"
                      ? "bg-[#F5F0FF] border-[#F3E8FF] dark:bg-[#1e1a2e] dark:border-purple-900"
                      : sel
                      ? "bg-[#F9FAFB] border-[#D1D5DB] dark:bg-[#2a2a2a] dark:border-[#6B7280]"
                      : "bg-white border-[#F3F4F6] dark:bg-[#1a1a1a] dark:border-[#374151] opacity-70 hover:opacity-90"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">
                      {topic.module}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                        effectiveStatus === "completed"
                          ? "bg-[#DCFCE7] text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : effectiveStatus === "in-progress"
                          ? "bg-[#F3E8FF] text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#111827] dark:text-[#6B7280]"
                      )}
                    >
                      {effectiveStatus === "completed"
                        ? "Concluído"
                        : effectiveStatus === "in-progress"
                        ? "Em progresso"
                        : "A seguir"}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      "text-[12px] font-bold leading-snug flex items-center gap-1.5",
                      effectiveStatus === "in-progress"
                        ? "text-purple-900 dark:text-purple-200"
                        : "text-[#111827] dark:text-[#F3F4F6]"
                    )}
                  >
                    <Icon name={topic.emoji} size={14} />
                    {topic.title}
                  </h3>

                  <p
                    className={cn(
                      "text-[10px] mt-1 leading-relaxed line-clamp-2",
                      effectiveStatus === "in-progress"
                        ? "text-purple-800/60 dark:text-purple-300/60"
                        : "text-[#9CA3AF] dark:text-[#6B7280]"
                    )}
                  >
                    {topic.desc}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        effectiveStatus === "completed"
                          ? "bg-green-50 dark:bg-green-900/30"
                          : effectiveStatus === "in-progress"
                          ? "bg-[#F3E8FF] dark:bg-purple-900/30"
                          : "bg-[#F9FAFB] dark:bg-[#111827]"
                      )}
                    >
                      {effectiveStatus === "completed" ? (
                        <Icon name="checkBold" size={12} className="text-green-500" />
                      ) : effectiveStatus === "in-progress" ? (
                        <Icon name="play" size={10} className="text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Icon name="lock" size={10} className="text-[#9CA3AF]" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        effectiveStatus === "in-progress"
                          ? "text-purple-700 dark:text-purple-400"
                          : "text-[#9CA3AF] dark:text-[#6B7280]"
                      )}
                    >
                      ~{topic.estimatedHours}h
                    </span>
                    {sel && (
                      <span className="ml-auto text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                        ← Aberto
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "absolute top-0 right-0 h-full w-1 cursor-col-resize z-30 group",
          "hover:bg-purple-400/40 dark:hover:bg-purple-400/30",
          dragging && "bg-purple-400/60 dark:bg-purple-400/40"
        )}
      >
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 rounded-l-md flex items-center justify-center transition-opacity",
            "bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#374151] shadow-sm",
            "opacity-0 group-hover:opacity-100",
            dragging && "opacity-100"
          )}
        >
          <div className="w-0.5 h-3 rounded-full bg-[#9CA3AF]" />
        </div>
      </div>
      </>
      )}
    </aside>
  );
}
