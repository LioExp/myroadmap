"use client";
import { useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { fetchMaterialsIndex } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LearningPlan from "@/components/LearningPlan";
import MainContent from "@/components/MainContent";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  const { dark, setMaterials, mobileView } = useRoadmapStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Load materials index
  useEffect(() => {
    fetchMaterialsIndex().then(setMaterials);
  }, [setMaterials]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F9FAFB] dark:bg-[#0a0a0a] text-[#111827] dark:text-[#F3F4F6]">
      <Navbar />
      {/* Desktop: flex row. Mobile: tabs control visibility */}
      <div className="flex-1 min-h-0 flex overflow-hidden max-md:flex-col max-md:overflow-auto max-md:pb-16 max-md:px-2.5">
        {/* Timeline sidebar */}
        <div className={`h-full min-h-0 ${mobileView === "timeline" ? "max-md:block" : "max-md:hidden"}`}>
          <LearningPlan />
        </div>
        {/* Main + notes */}
        <div className={`flex-1 min-h-0 flex overflow-hidden max-md:flex-col ${mobileView !== "timeline" ? "max-md:flex" : "max-md:hidden"}`}>
          <MainContent />
        </div>
      </div>
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
