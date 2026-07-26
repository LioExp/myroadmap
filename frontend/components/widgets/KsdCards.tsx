"use client";
import { useState } from "react";

const CARDS = [
  { id: "distro", icon: "📦", name: "Distribuição", brief: "O pacote completo", detail: "Kernel + shell + programas + gestor de pacotes, tudo empacotado e testado para funcionar junto.", analogy: "A loja que vende o carro completo (motor, volante, bancos).", border: "#8B4513" },
  { id: "shell", icon: "📞", name: "Shell", brief: "A &quot;casca&quot;", detail: "Interpreta comandos do terminal (bash, zsh). Pega o comando e pede para o kernel executar.", analogy: "O telefone que usas para falar com o gerente.", border: "#483D8B" },
  { id: "kernel", icon: "⚙️", name: "Kernel", brief: "O &quot;motor&quot;", detail: "Núcleo do sistema. Conversa diretamente com o hardware (CPU, RAM, discos).", analogy: "O gerente da fábrica.", border: "#006400" },
];

export default function KsdCards() {
  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => setActive(active === id ? null : id);

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col items-center gap-1.5">
      <div className="flex gap-2 w-full">
        {CARDS.map((c) => {
          const isActive = active === c.id;
          return (
            <div
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`flex-1 border-2 rounded-xl px-3.5 py-3.5 cursor-pointer transition-all duration-250 text-center bg-transparent ${
                isActive ? "flex-[2]" : ""
              }`}
              style={{ borderColor: isActive ? c.border : "var(--border, #E5E7EB)" }}
            >
              <div className="text-[28px] mb-1.5">{c.icon}</div>
              <div className="text-xs font-extrabold text-gray-900 dark:text-gray-100">{c.name}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{c.brief}</div>
              <div
                className={`overflow-hidden transition-all duration-300 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed ${isActive ? "max-h-[120px] mt-2.5" : "max-h-0 mt-0"}`}
              >
                <strong className="text-gray-900 dark:text-gray-100">{c.detail.split(".")[0]}.</strong>
                <br />
                {c.analogy}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-0 w-full justify-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">Distro</span>
        <span className="text-lg text-gray-300 dark:text-gray-600 animate-pulse">→</span>
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">Shell</span>
        <span className="text-lg text-gray-300 dark:text-gray-600 animate-pulse">→</span>
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">Kernel</span>
      </div>
    </div>
  );
}
