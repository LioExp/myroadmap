"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Github, Globe, MessageCircle } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

const DISCORD_URL = "https://discord.gg/5S5cXd7q4M";

export default function Navbar() {
  const dark = useRoadmapStore((s) => s.dark);
  const toggleTheme = useRoadmapStore((s) => s.toggleTheme);
  const [showCta, setShowCta] = useState(false);

  const showCtaTemporarily = useCallback(() => {
    setShowCta(true);
    setTimeout(() => setShowCta(false), 5000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(showCtaTemporarily, 3000);
    return () => clearTimeout(timer);
  }, [showCtaTemporarily]);

  return (
    <header className="h-12 px-3 md:px-4 flex items-center justify-between flex-shrink-0 bg-[#141414] dark:bg-white border-b border-[#1F2937] dark:border-[#E5E7EB]">
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 min-w-0">
        <Image src="/logo.png" alt="MyRoadmap" width={28} height={28} className="rounded object-contain dark:hidden" />
        <Image src="/logo-dark.png" alt="MyRoadmap" width={28} height={28} className="rounded object-contain hidden dark:block" />
        <span className="text-sm font-black text-white dark:text-[#111827] tracking-tight max-md:hidden">
          Roadmap Vivo
        </span>
        <div className="w-px h-4 bg-white/10 dark:bg-[#D1D5DB] max-md:hidden" />
        <div className="flex items-center gap-1.5 bg-[#2a2a2a] dark:bg-[#F3F4F6] hover:bg-[#333] dark:hover:bg-[#E5E7EB] px-2.5 md:px-3 py-1.5 rounded-full cursor-pointer transition-colors max-md:py-1">
          <span className="text-[10px] md:text-xs font-semibold text-white dark:text-[#374151] tracking-wide">
            AI Security
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 relative">
        <div className="relative">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Discord"
            onMouseEnter={() => setShowCta(true)}
            onMouseLeave={() => setShowCta(false)}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white hover:bg-[#4752C4] transition-colors"
          >
            <DiscordIcon className="w-3.5 h-3.5" />
          </a>

          {showCta && (
            <div className="absolute right-0 top-full mt-2 z-50 animate-fade-in" onMouseEnter={() => setShowCta(true)} onMouseLeave={() => setShowCta(false)}>
              <div className="bg-[#5865F2] text-white text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
                <MessageCircle className="w-3 h-3 flex-shrink-0" />
                Entra no Discord e acompanha a jornada
                <div className="w-2 h-2 bg-[#5865F2] absolute -top-1 right-4 rotate-45" />
              </div>
            </div>
          )}
        </div>

        <a
          href="https://github.com/LioExp/myroadmap"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://lioexp.github.io/mypage"
          target="_blank"
          rel="noopener noreferrer"
          title="Portfólio"
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
        </a>
        <div className="w-px h-4 bg-white/10 dark:bg-[#D1D5DB]" />
        <button
          onClick={toggleTheme}
          title="Trocar tema"
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2a2a2a] dark:bg-[#F3F4F6] flex items-center justify-center text-white dark:text-[#374151] hover:bg-[#333] dark:hover:bg-[#E5E7EB] transition-colors border-none cursor-pointer"
        >
          {dark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
        </button>
      </div>
    </header>
  );
}
