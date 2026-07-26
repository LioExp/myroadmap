"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import NotesPanel from "@/components/NotesPanel";
import TopicView from "@/components/TopicView";
import LessonView from "@/components/LessonView";
import PracticePanel from "@/components/PracticePanel";
import { TopicViewSkeleton, LessonViewSkeleton } from "@/components/Skeleton";

export default function MainContent() {
  const { getSelectedTopic, selectedLessonId, mobileView, practiceOpen, setPracticeOpen } = useRoadmapStore();
  const topic = getSelectedTopic();

  const [loading, setLoading] = useState(false);
  const prevTopicId = useRef(topic?.id ?? null);
  const prevLessonId = useRef(selectedLessonId);

  useEffect(() => {
    const topicChanged = topic?.id !== prevTopicId.current;
    const lessonChanged = selectedLessonId !== prevLessonId.current;

    if (topicChanged || lessonChanged) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 250);
      prevTopicId.current = topic?.id ?? null;
      prevLessonId.current = selectedLessonId;
      if (selectedLessonId === null && practiceOpen) setPracticeOpen(false);
      return () => clearTimeout(t);
    }
  }, [topic?.id, selectedLessonId]);

  const showNotes = mobileView === "notes";
  const showContent = mobileView === "content";

  return (
    <>
      {/* Desktop: flex row. Mobile: only one visible at a time */}
      <div className="flex-1 min-h-0 flex min-w-0 overflow-hidden max-md:overflow-visible">
        {/* Content — hidden on mobile when notes tab is active */}
        <div
          className={`min-h-0 overflow-y-auto py-5 px-6 pr-1 max-md:px-1 max-md:py-4 transition-all duration-300 ease-in-out ${
            practiceOpen
              ? "flex-[3] min-w-0 max-md:hidden"
              : showContent || !showNotes
                ? "flex-1"
                : "max-md:hidden"
          }`}
        >
          {!topic ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 p-10 h-full">
              <Image src="/mascote.png" alt="Mascote" width={160} height={160} priority style={{ width: 160, height: "auto" }} />
              <h2 className="text-xl font-bold text-[#374151] dark:text-[#F3F4F6]">
                Escolhe um módulo
              </h2>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xs">
                Clica num dos módulos ao lado para veres o conteúdo, aulas e recursos.
              </p>
            </div>
          ) : loading ? (
            selectedLessonId !== null ? <LessonViewSkeleton /> : <TopicViewSkeleton />
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

      {/* Notes — full screen on mobile, side panel on desktop */}
      <div className={showNotes ? "max-md:flex-1 max-md:min-h-0" : "max-md:hidden"}>
        {topic && <NotesPanel />}
      </div>
    </>
  );
}
