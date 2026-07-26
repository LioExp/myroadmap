"use client";
import { useState } from "react";

const REGIONS = [
  { icon: "🖥️", title: "Servidores", stat: "~90% da internet roda em Linux", extra: "Google, Facebook, AWS, Netflix — todos dependem de Linux nos servidores.", border: "#2563EB" },
  { icon: "📦", title: "Containers", stat: "Docker e Kubernetes são fatias do Linux", extra: "Sem kernel Linux, containers simplesmente não existem. É a base de toda a cloud moderna.", border: "#7C3AED" },
  { icon: "📡", title: "IoT", stat: "Raspberry Pi, TVs, routers, tudo Linux", extra: "Dispositivos do dia a dia — do smart TV ao roteador Wi-Fi — rodam Linux embarcado.", border: "#059669" },
  { icon: "🛡️", title: "Ferramentas de Segurança", stat: "A casa do profissional de segurança", extra: "Nmap, Metasploit, Burp Suite — quase tudo em segurança é construído para Linux primeiro.", border: "#DC2626" },
];

export default function LinuxWhere() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const s = new Set(expanded);
    if (s.has(i)) s.delete(i);
    else s.add(i);
    setExpanded(s);
  };

  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-[520px]">
      {REGIONS.map((r, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          className="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 bg-transparent hover:-translate-y-0.5"
          style={{ borderColor: r.border }}
        >
          <div className="text-[28px] mb-1.5">{r.icon}</div>
          <div className="text-xs font-extrabold mb-0.5" style={{ color: r.border }}>{r.title}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">{r.stat}</div>
          <div className={`overflow-hidden transition-all duration-250 text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed ${expanded.has(i) ? "max-h-16 mt-2" : "max-h-0 mt-0"}`}>{r.extra}</div>
        </div>
      ))}
    </div>
  );
}
