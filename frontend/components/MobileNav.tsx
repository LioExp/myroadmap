"use client";
import { BookOpen, FileText, List } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { cn } from "@/lib/utils";
import type { MobileView } from "@/types";

const tabs: { view: MobileView; icon: React.ReactNode; label: string }[] = [
  { view: "timeline", icon: <List className="w-[18px] h-[18px]" strokeWidth={1.75} />, label: "Roadmap" },
  { view: "content", icon: <BookOpen className="w-[18px] h-[18px]" strokeWidth={1.75} />, label: "Conteúdo" },
  { view: "notes", icon: <FileText className="w-[18px] h-[18px]" strokeWidth={1.75} />, label: "Notas" },
];

export default function MobileNav() {
  const mobileView = useRoadmapStore((s) => s.mobileView);
  const setMobileView = useRoadmapStore((s) => s.setMobileView);

  return (
    <nav className="hidden max-md:flex fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-white/65 dark:bg-surface-2/75 backdrop-blur-xl border border-white/50 dark:border-white/8 rounded-full px-4 py-1.5 gap-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]">
      {tabs.map(({ view, icon, label }) => (
        <button
          key={view}
          onClick={() => setMobileView(view)}
          className={cn(
            "flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-3 py-1.5 text-[9px] font-semibold tracking-wide font-sans rounded-full transition-all duration-200",
            mobileView === view
              ? "text-white bg-gradient-to-br from-purple-600 to-purple-800 shadow-[0_2px_12px_rgba(147,51,234,0.4),0_0_0_1px_rgba(147,51,234,0.2)]"
              : "text-faint hover:text-muted dark:hover:text-ghost"
          )}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
