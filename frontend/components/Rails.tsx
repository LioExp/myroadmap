"use client";
import { FileText, PanelLeft, PanelRight, PencilLine } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { useMaterialsMap } from "@/hooks/useMaterialsMap";
import { getTopicStatus, topicProgress } from "@/lib/status";
import { TimelineDot } from "@/components/LearningPlan";

function RailCard({ children }: { children: React.ReactNode }) {
  return (
    <aside className="h-full min-h-0 flex flex-col items-center pt-3 gap-3 bg-surface dark:bg-surface-2 border border-line-strong dark:border-line rounded-2xl overflow-y-auto overflow-x-hidden shadow-sm">
      {children}
    </aside>
  );
}

export default function RoadmapRail() {
  const setRoadmapOpen = useRoadmapStore((s) => s.setRoadmapOpen);
  const selectTopic = useRoadmapStore((s) => s.selectTopic);
  const selectedTopicId = useRoadmapStore((s) => s.selectedTopicId);
  const topics = useRoadmapStore((s) => s.topics);
  const materialsMap = useMaterialsMap();

  return (
    <RailCard>
      <button
        onClick={() => setRoadmapOpen(true)}
        title="Expandir roadmap"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors"
      >
        <PanelRight className="w-4 h-4" />
      </button>
      <div className="flex flex-col items-center gap-3 py-2">
        {topics.map((topic, i) => {
          const progress = topicProgress(topic, materialsMap);
          const status = getTopicStatus(progress.completed, progress.total);
          const sel = topic.id === selectedTopicId;

          return (
            <button
              key={topic.id}
              onClick={() => selectTopic(topic.id)}
              title={topic.title}
              className="relative z-10 cursor-pointer"
            >
              {i < topics.length - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-3 border-l-2 border-dashed border-line z-0" />
              )}
              <TimelineDot index={i} status={status} selected={sel} />
            </button>
          );
        })}
      </div>
    </RailCard>
  );
}

export function NotesRail() {
  const toggleNotes = useRoadmapStore((s) => s.toggleNotes);

  return (
    <RailCard>
      <button
        onClick={toggleNotes}
        title="Abrir notas"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
      <button
        onClick={toggleNotes}
        title="Notas"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors"
      >
        <FileText className="w-4 h-4" />
      </button>
      <div className="w-full h-px bg-line dark:bg-line-strong my-1" />
      <button
        onClick={toggleNotes}
        title="Escrever nota"
        className="w-8 h-8 rounded-full flex items-center justify-center bg-main dark:bg-white text-white dark:text-main cursor-pointer transition-transform hover:scale-105"
      >
        <PencilLine className="w-4 h-4" />
      </button>
    </RailCard>
  );
}
