"use client";
import { useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { fetchMaterialsIndex, fetchTopics } from "@/lib/api";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import LearningPlan from "@/components/LearningPlan";
import MainContent from "@/components/MainContent";
import NotesPanel from "@/components/NotesPanel";
import MobileNav from "@/components/MobileNav";
import RoadmapRail, { NotesRail } from "@/components/Rails";

export default function Home() {
  const dark = useRoadmapStore((s) => s.dark);
  const roadmapOpen = useRoadmapStore((s) => s.roadmapOpen);
  const notesOpen = useRoadmapStore((s) => s.notesOpen);
  const mobileView = useRoadmapStore((s) => s.mobileView);
  const setMaterials = useRoadmapStore((s) => s.setMaterials);
  const setTopics = useRoadmapStore((s) => s.setTopics);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Load roadmap data + materials index
  useEffect(() => {
    Promise.all([fetchMaterialsIndex(), fetchTopics()]).then(
      ([materials, topics]) => {
        setMaterials(materials);
        setTopics(topics);
      }
    );
  }, [setMaterials, setTopics]);

  const cols = roadmapOpen ? "318px" : "64px";
  const rightCols = notesOpen ? "318px" : "64px";

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden max-md:h-auto max-md:min-h-screen bg-page text-main">
      <Navbar />
      {/* Desktop: 3-column workspace grid. Mobile: single column driven by tabs */}
      <div className="flex-1 min-h-0 max-md:min-h-0 max-md:overflow-visible max-md:pb-16">
        <div
          className="grid gap-3 p-3 h-full min-h-0 max-md:grid-cols-1 max-md:gap-2 max-md:p-2.5 md:[grid-template-columns:var(--shell-cols)] transition-[grid-template-columns] duration-300 ease-in-out"
          style={{ "--shell-cols": `${cols} minmax(0, 1fr) ${rightCols}` } as React.CSSProperties}
        >
          {/* Roadmap / rail */}
          <div className={cn("min-h-0", mobileView === "timeline" ? "max-md:flex" : "max-md:hidden")}>
            {roadmapOpen || mobileView === "timeline" ? <LearningPlan /> : <RoadmapRail />}
          </div>

          {/* Content */}
          <div className={cn("min-h-0", mobileView === "content" ? "max-md:flex" : "max-md:hidden")}>
            <MainContent />
          </div>

          {/* Notes / rail */}
          <div className={cn("min-h-0", mobileView === "notes" ? "max-md:flex" : "max-md:hidden")}>
            {notesOpen || mobileView === "notes" ? <NotesPanel /> : <NotesRail />}
          </div>
        </div>
      </div>
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
