"use client";
import { useEffect, useState } from "react";

const BLOCKS = [
  { id: "b1", cls: "bg-[#8B4513]", title: "Programas", sub: "Navegador, jogos, scripts" },
  { id: "b2", cls: "bg-[#483D8B]", title: "Distro (GNU/Linux)", sub: "Ferramentas GNU, gestor de pacotes" },
  { id: "b3", cls: "bg-[#006400]", title: "Kernel Linux", sub: "Gerencia processos, memória, drivers", note: "fala direto com o hardware" },
  { id: "b4", cls: "bg-[#4F4F4F]", title: "Hardware", sub: "Processador, memória, disco" },
];

export default function LinuxArch() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ids = ["b1", "b2", "b3", "b4", "a1", "a2", "a3", "note"];
    ids.forEach((id, i) => {
      const delay = id.startsWith("a") ? 700 + (parseInt(id[1]) - 1) * 400 : id === "note" ? 2500 : 300 + parseInt(id[1] || "0") * 400;
      setTimeout(() => setVisible((v) => ({ ...v, [id]: true })), delay);
    });
  }, []);

  return (
    <div className="max-w-[480px] mx-auto flex flex-col gap-[2px] relative py-4">
      {BLOCKS.map((b, i) => (
        <div key={b.id}>
          {i > 0 && (
            <div className={`text-center text-sm text-gray-400 py-[2px] transition-opacity duration-400 ${visible["a" + i] ? "opacity-100" : "opacity-0"}`}>
              <span className="inline-block animate-pulse">⇅</span>
            </div>
          )}
          <div
            className={`rounded-xl px-5 py-4 transition-all duration-600 ${b.cls} text-white ${visible[b.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <div className="text-[15px] font-extrabold tracking-tight">{b.title}</div>
            <div className="text-[11px] text-white/75 font-medium mt-[2px]">{b.sub}</div>
          </div>
        </div>
      ))}
      <div
        className={`absolute right-[-140px] top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-semibold w-[130px] leading-normal transition-opacity duration-800 ${visible.note ? "opacity-100" : "opacity-0"} max-md:static max-md:translate-y-0 max-md:mt-2 max-md:w-auto`}
      >
        <span className="absolute left-[-20px] top-1/2 w-[15px] border-t border-dashed border-gray-400 animate-pulse max-md:hidden" />
        {BLOCKS[2].note}
      </div>
    </div>
  );
}
