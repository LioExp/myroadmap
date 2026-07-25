"use client";
import Image from "next/image";
import { Sun, Moon, Github, Globe } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";

export default function Navbar() {
  const { dark, toggleTheme } = useRoadmapStore();

  return (
    <header className="h-12 px-4 flex items-center justify-between flex-shrink-0 bg-[#141414] dark:bg-white border-b border-[#1F2937] dark:border-[#E5E7EB]">
      {/* Left */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Image src="/logo.png" alt="MyRoadmap" width={28} height={28} className="rounded object-contain dark:hidden" />
        <Image src="/logo-dark.png" alt="MyRoadmap" width={28} height={28} className="rounded object-contain hidden dark:block" />
        <span className="text-sm font-black text-white dark:text-[#111827] tracking-tight">
          Roadmap Vivo
        </span>
        <div className="w-px h-4 bg-white/10 dark:bg-[#D1D5DB]" />
        <div className="flex items-center gap-1.5 bg-[#2a2a2a] dark:bg-[#F3F4F6] hover:bg-[#333] dark:hover:bg-[#E5E7EB] px-3 py-1.5 rounded-full cursor-pointer transition-colors">
          <span className="text-xs font-semibold text-white dark:text-[#374151] tracking-wide">
            AI Security
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href="https://github.com/LioExp/myroadmap"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="w-8 h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://lioexp.github.io/mypage"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfólio"
          className="w-8 h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
        </a>
        <div className="w-px h-4 bg-white/10 dark:bg-[#D1D5DB]" />
        <button
          onClick={toggleTheme}
          title="Trocar tema"
          className="w-8 h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors border-none cursor-pointer"
        >
          {dark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
        </button>
      </div>
    </header>
  );
}
