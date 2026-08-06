"use client";
import Image from "next/image";
import { useRoadmapStore, selectSelectedTopic } from "@/store/useRoadmapStore";
import { cn } from "@/lib/utils";
import TopicView from "@/components/TopicView";
import LessonView from "@/components/LessonView";
import PracticePanel from "@/components/PracticePanel";

export default function MainContent() {
  const topic = useRoadmapStore(selectSelectedTopic);
  const selectedLessonId = useRoadmapStore((s) => s.selectedLessonId);
  const practiceOpen = useRoadmapStore((s) => s.practiceOpen);

  return (
    <div className="h-full min-h-0 flex min-w-0 overflow-hidden bg-surface dark:bg-surface-2 border border-line-strong dark:border-line rounded-2xl shadow-sm max-md:h-auto max-md:overflow-visible">
      {/* Content */}
      <div
        className={cn(
          "min-h-0 overflow-y-auto py-5 px-6 pr-1 max-md:px-1 max-md:py-4 max-md:overflow-visible transition-all duration-300 ease-in-out min-w-0",
          practiceOpen ? "flex-[3]" : "flex-1"
        )}
      >
        {!topic ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 p-10 h-full">
            <Image src="/mascote.png" alt="Mascote" width={160} height={160} priority style={{ width: 160, height: "auto" }} />
            <h2 className="text-xl font-bold text-strong dark:text-main">
              Escolhe um módulo
            </h2>
            <p className="text-sm text-muted max-w-xs">
              Clica num dos módulos ao lado para veres o conteúdo, aulas e recursos.
            </p>
          </div>
        ) : selectedLessonId !== null ? (
          <LessonView />
        ) : (
          <TopicView />
        )}
      </div>

      {/* Practice panel — side slide on desktop */}
      <div
        className={`min-w-0 overflow-hidden border-l transition-all duration-300 ease-in-out max-md:hidden ${
          practiceOpen ? "flex-[2] opacity-100 border-[#30363d]" : "flex-[0] opacity-0 border-transparent"
        }`}
      >
        <div className="min-w-[300px] h-full">
          <PracticePanel />
        </div>
      </div>

      {/* Mobile practice panel — slides up from bottom */}
      <div
        className={`hidden max-md:block max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:transition-transform max-md:duration-300 max-md:ease-in-out ${
          practiceOpen ? "max-md:translate-y-0" : "max-md:translate-y-full"
        }`}
        style={{ top: "48px" }}
      >
        <div className="h-full">
          <PracticePanel />
        </div>
      </div>
    </div>
  );
}
