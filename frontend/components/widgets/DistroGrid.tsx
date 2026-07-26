"use client";
import { useState } from "react";

const CARDS = [
  { name: "Debian/Ubuntu", desc: "Estabilidade e facilidade de uso", cmd: "apt install python", badge: "iniciante", badgeCls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", border: "#2563EB", extra: "Escolhe quando queres um sistema que simplesmente funciona sem configuração extra. Ideal para servidores e desktop." },
  { name: "RedHat/Fedora", desc: "Padrão corporativo", cmd: "dnf install python", badge: "servidor", badgeCls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", border: "#DC2626", extra: "Escolhe quando trabalhas em ambiente enterprise. Muito usado em servidores de empresas." },
  { name: "Arch Linux", desc: "Rolling release, do zero", cmd: "pacman -S python", badge: "avançado", badgeCls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", border: "#7C3AED", extra: "Escolhe quando queres controlo total e aprendizagem profunda. Cada pacote é por tua conta." },
  { name: "Kali Linux", desc: "Ferramentas de segurança pré-instaladas", cmd: "apt install nmap", badge: "⚠️ segurança", badgeCls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", border: "#D97706", extra: "Não recomendado para uso diário. Usa como ferramenta específica para pentest, não como sistema principal." },
];

export default function DistroGrid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[640px]">
      {CARDS.map((c, i) => (
        <div
          key={i}
          onClick={() => setActive(active === i ? null : i)}
          className="border-2 rounded-xl px-3.5 py-3.5 cursor-pointer transition-all duration-200 bg-transparent hover:-translate-y-0.5"
          style={{ borderColor: active === i ? c.border : "var(--border, #E5E7EB)" }}
        >
          <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${c.badgeCls}`}>{c.badge}</span>
          <div className="text-[13px] font-extrabold text-gray-900 dark:text-gray-100 mb-0.5">{c.name}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed mb-2">{c.desc}</div>
          <code className="block text-[10px] px-2 py-1.5 rounded-md border font-mono text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 bg-transparent">{c.cmd}</code>
          <div className={`overflow-hidden transition-all duration-250 text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed ${active === i ? "max-h-20 mt-2" : "max-h-0 mt-0"}`}>{c.extra}</div>
        </div>
      ))}
    </div>
  );
}
