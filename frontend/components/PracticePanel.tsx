"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Code, X, ChevronRight } from "lucide-react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { cn } from "@/lib/utils";

type PanelView = "terminal" | "editor";

const TERMINAL_HISTORY: { type: string; text?: string }[] = [
  { type: "fastfetch" },
];

function TerminalView() {
  const router = useRouter();
  const [history, setHistory] = useState(TERMINAL_HISTORY);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleCommand(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim().toLowerCase();
    if (cmd === "edit" || cmd === "editor") {
      router.push("/editor");
      setInput("");
      return;
    }
    setHistory((prev) => [
      ...prev,
      { type: "input", text: `user@roadmap:~$ ${input}` },
      { type: "output", text: `bash: ${input.split(" ")[0]}: comando não encontrado (simulado)` },
    ]);
    setInput("");
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1b26]">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 cursor-text"
      >
        {history.map((line, i) => (
          line.type === "fastfetch" ? (
            <div key={i} className="text-[12px] leading-[1.4] font-mono whitespace-pre mb-2">
              <div className="flex gap-6">
                <div className="text-[#7aa2f7] shrink-0">{`    ___       
   /   \\     
  / ()  \\    
 /   __  \\   
/___/  \\___\\ `}</div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <div><span className="text-[#7aa2f7] font-bold">user</span><span className="text-[#565f89]">@</span><span className="text-[#7aa2f7] font-bold">myroadmap</span></div>
                  <div className="text-[#565f89]">──────────────</div>
                  <div><span className="text-[#7aa2f7]">OS</span><span className="text-[#565f89]">: </span><span className="text-[#c0caf5]">Roadmap Vivo v2.0</span></div>
                  <div><span className="text-[#7aa2f7]">Host</span><span className="text-[#565f89]">: </span><span className="text-[#c0caf5]">myroadmap.vercel.app</span></div>
                  <div><span className="text-[#7aa2f7]">GitHub</span><span className="text-[#565f89]">: </span><span className="text-[#9ece6a]">github.com/LioExp/myroadmap</span></div>
                  <div><span className="text-[#7aa2f7]">Kernel</span><span className="text-[#565f89]">: </span><span className="text-[#c0caf5]">Next.js 14 / React 18</span></div>
                  <div><span className="text-[#7aa2f7]">Shell</span><span className="text-[#565f89]">: </span><span className="text-[#c0caf5]">myroadmap-terminal 1.0</span></div>
                  <div><span className="text-[#7aa2f7]">Creator</span><span className="text-[#565f89]">: </span><span className="text-[#bb9af7]">Lio</span></div>
                  <div><span className="text-[#7aa2f7]">Terminal</span><span className="text-[#565f89]">: </span><span className="text-[#c0caf5]">AI Security Engineer Roadmap</span></div>
                  <div className="mt-1 flex gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#f7768e]" />
                    <span className="w-3 h-3 rounded-sm bg-[#ff9e64]" />
                    <span className="w-3 h-3 rounded-sm bg-[#e0af68]" />
                    <span className="w-3 h-3 rounded-sm bg-[#9ece6a]" />
                    <span className="w-3 h-3 rounded-sm bg-[#7aa2f7]" />
                    <span className="w-3 h-3 rounded-sm bg-[#bb9af7]" />
                  </div>
                </div>
              </div>
            </div>
          ) : line.type === "input" ? (
            <div key={i} className="text-[12px] leading-[1.6] font-mono whitespace-pre">
              <span className="text-[#7aa2f7]">user@roadmap</span>
              <span className="text-[#565f89]">:</span>
              <span className="text-[#9ece6a]">~</span>
              <span className="text-[#565f89]">$ </span>
              <span className="text-[#c0caf5]">{line.text?.replace("user@roadmap:~$ ", "")}</span>
            </div>
          ) : (
            <div key={i} className="text-[12px] leading-[1.6] font-mono whitespace-pre">
              <span className="text-[#a9b1d6]">{line.text ?? ""}</span>
            </div>
          )
        ))}
        {/* Current input line */}
        <div className="text-[12px] leading-[1.6] font-mono whitespace-pre flex">
          <span className="text-[#7aa2f7]">user@roadmap</span>
          <span className="text-[#565f89]">:</span>
          <span className="text-[#9ece6a]">~</span>
          <span className="text-[#565f89]">$ </span>
          <span className="text-[#c0caf5]">{input}</span>
          <span className="inline-block w-[7px] h-[14px] bg-[#c0caf5] ml-px animate-pulse" />
        </div>
      </div>
      <form onSubmit={handleCommand} className="absolute opacity-0 h-0 overflow-hidden">
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
      </form>
    </div>
  );
}

function EditorView() {
  const [code, setCode] = useState("# Escreve o teu código aqui...\n");

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#313244] bg-[#181825] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#89b4fa] bg-[#89b4fa]/10 px-2 py-0.5 rounded">Python</span>
          <span className="text-[10px] text-[#6c7086]">•</span>
          <span className="text-[10px] text-[#6c7086]">main.py</span>
        </div>
        <span className="text-[10px] text-[#6c7086]">UTF-8</span>
      </div>
      {/* Editor with line numbers */}
      <div className="flex-1 min-h-0 flex overflow-auto">
        <div className="py-4 pl-3 pr-2 text-right select-none flex-shrink-0">
          {code.split("\n").map((_, i) => (
            <div key={i} className="text-[11px] leading-relaxed text-[#585b70] font-mono">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[12px] text-[#cdd6f4] py-4 px-1 outline-none resize-none font-mono leading-relaxed"
          spellCheck={false}
          placeholder="# Escreve o teu código aqui..."
        />
      </div>
    </div>
  );
}

const TABS: { id: PanelView; label: string; icon: React.ReactNode }[] = [
  { id: "terminal", label: "Terminal", icon: <Terminal className="w-3 h-3" /> },
  { id: "editor", label: "Editor", icon: <Code className="w-3 h-3" /> },
];

export default function PracticePanel() {
  const { togglePractice } = useRoadmapStore();
  const [activeView, setActiveView] = useState<PanelView>("terminal");

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#30363d] bg-[#161b22] flex-shrink-0">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold transition-colors",
                activeView === tab.id
                  ? "bg-[#30363d] text-[#c9d1d9]"
                  : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={togglePractice}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active view */}
      <div className="flex-1 min-h-0">
        {activeView === "terminal" && <TerminalView />}
        {activeView === "editor" && <EditorView />}
      </div>
    </div>
  );
}
