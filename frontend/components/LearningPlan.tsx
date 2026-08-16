"use client";
import { Compass, PanelRight } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icons";
import { SidebarSkeleton } from "@/components/Skeleton";
import { useMaterialsMap } from "@/hooks/useMaterialsMap";
import { STATUS_BADGE, STATUS_LABEL, getTopicStatus, topicProgress } from "@/lib/status";
import type { Topic, TopicStatus } from "@/types";

export function TimelineDot({
  index,
  status,
  selected,
}: {
  index: number;
  status: TopicStatus;
  selected: boolean;
}) {
  if (status === "completed") {
    return (
      <div
        className={cn(
          "w-7 h-7 rounded-full bg-green-500 text-white font-black text-[10px] flex items-center justify-center shadow-sm",
          selected ? "ring-2 ring-green-400 ring-offset-2 ring-offset-page" : "ring-4 ring-page"
        )}
      >
        {index + 1}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full",
        status === "in-progress" ? "bg-purple-400 animate-pulse-slow" : "bg-line dark:bg-ghost",
        selected ? "ring-2 ring-white ring-offset-2 ring-offset-page" : "ring-4 ring-page"
      )}
    />
  );
}

function TopicCard({
  topic,
  status,
  selected,
  onSelect,
}: {
  topic: Topic;
  status: TopicStatus;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      onClick={() => onSelect(topic.id)}
      className={cn(
        "flex-1 text-left rounded-2xl p-3.5 border shadow-sm cursor-pointer transition-all duration-150 font-sans",
        status === "completed" && selected
          ? "bg-green-50 border-green-300 dark:bg-[#1a2e1a] dark:border-green-800 shadow-md"
          : status === "completed"
          ? "bg-surface border-line-strong dark:border-line"
          : status === "in-progress" && selected
          ? "bg-[#EDE9F7] border-purple-400 dark:bg-[#2a1f3e] dark:border-purple-600 shadow-md"
          : status === "in-progress"
          ? "bg-[#F5F0FF] border-[#F3E8FF] dark:bg-[#1e1a2e] dark:border-purple-900"
          : selected
          ? "bg-page border-ghost dark:bg-[#2a2a2a] dark:border-faint"
          : "bg-surface border-line-strong dark:border-line opacity-70 hover:opacity-90"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black text-faint uppercase tracking-widest">
          {topic.module}
        </span>
        <span
          className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
            STATUS_BADGE[status].bg,
            STATUS_BADGE[status].fg
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      <h3
        className={cn(
          "text-[12px] font-bold leading-snug flex items-center gap-1.5",
          status === "in-progress" ? "text-purple-900 dark:text-purple-200" : "text-main"
        )}
      >
        <Icon name={topic.emoji} size={14} />
        {topic.title}
      </h3>

      <p
        className={cn(
          "text-[10px] mt-1 leading-relaxed line-clamp-2",
          status === "in-progress" ? "text-purple-800/60 dark:text-purple-300/60" : "text-faint"
        )}
      >
        {topic.desc}
      </p>

      <div className="flex items-center gap-2 mt-2">
        <div
          className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center",
            status === "completed"
              ? "bg-green-50 dark:bg-green-900/30"
              : status === "in-progress"
              ? "bg-[#F3E8FF] dark:bg-purple-900/30"
              : "bg-page dark:bg-surface-2"
          )}
        >
          {status === "completed" ? (
            <Icon name="checkBold" size={12} className="text-green-500" />
          ) : status === "in-progress" ? (
            <Icon name="play" size={10} className="text-purple-600 dark:text-purple-400" />
          ) : (
            <Icon name="lock" size={10} className="text-faint" />
          )}
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold",
            status === "in-progress" ? "text-purple-700 dark:text-purple-400" : "text-faint"
          )}
        >
          ~{topic.estimatedHours}h
        </span>
        {selected && (
          <span className="ml-auto text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
            ← Aberto
          </span>
        )}
      </div>
    </button>
  );
}

export default function LearningPlan() {
  const selectedTopicId = useRoadmapStore((s) => s.selectedTopicId);
  const selectTopic = useRoadmapStore((s) => s.selectTopic);
  const topics = useRoadmapStore((s) => s.topics);
  const loaded = useRoadmapStore((s) => s.loaded);
  const setRoadmapOpen = useRoadmapStore((s) => s.setRoadmapOpen);
  const materialsMap = useMaterialsMap();

  return (
    <aside className="h-full min-h-0 flex flex-col bg-surface dark:bg-surface-2 border border-line-strong dark:border-line rounded-2xl overflow-hidden shadow-sm max-md:h-auto max-md:overflow-visible max-md:border-0 max-md:rounded-none max-md:shadow-none">
      {!loaded ? (
        <SidebarSkeleton />
      ) : (
        <>
          {/* Header */}
          <div className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-line dark:border-line-strong">
            <h2 className="text-xs font-black uppercase tracking-widest text-faint flex items-center gap-1.5">
              Meu Roadmap{" "}
              <span className="inline-flex items-center justify-center w-4 h-4">
                <Compass className="w-3.5 h-3.5" />
              </span>
            </h2>
            <button
              onClick={() => setRoadmapOpen(false)}
              title="Recolher roadmap"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors max-md:hidden"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>

          {/* Expanded state */}
          <div className="flex flex-col h-full transition-opacity duration-300 ease-in-out">
            <div className="relative flex-1 min-h-0 flex flex-col gap-3 px-5 py-4 overflow-y-auto max-md:overflow-visible max-md:pb-24">
              {topics.map((topic, i) => {
                const progress = topicProgress(topic, materialsMap);
                const status = getTopicStatus(progress.completed, progress.total);
                const sel = topic.id === selectedTopicId;

                return (
                  <div key={topic.id} className="relative z-10 flex gap-3">
                    {i < topics.length - 1 && (
                      <div className="absolute left-[15px] top-[24px] bottom-[-12px] w-0 border-l-2 border-dashed border-line z-0" />
                    )}
                    <div
                      className={cn(
                        "w-8 flex-shrink-0 flex justify-center pt-3.5",
                        status !== "completed" && "mt-1"
                      )}
                    >
                      <TimelineDot index={i} status={status} selected={sel} />
                    </div>

                    <TopicCard
                      topic={topic}
                      status={status}
                      selected={sel}
                      onSelect={selectTopic}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
