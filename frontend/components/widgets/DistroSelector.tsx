"use client";
import { useState, useEffect } from "react";

const TABS = [
  { id: "debian", label: "Ubuntu/Debian", title: "Ubuntu / Debian", desc: "Foco em estabilidade e facilidade de uso. Ideal para iniciantes e servidores.", cmd: "sudo apt install &lt;pacote&gt;" },
  { id: "fedora", label: "Fedora", title: "Fedora / RedHat", desc: "Comum no mundo corporativo. Usa dnf como gestor de pacotes.", cmd: "sudo dnf install &lt;pacote&gt;" },
  { id: "arch", label: "Arch", title: "Arch Linux", desc: "Rolling release, sempre atualizado. Customizável, constróis o sistema do zero.", cmd: "sudo pacman -S &lt;pacote&gt;" },
];

export default function DistroSelector() {
  const [active, setActive] = useState("debian");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("distro");
      if (saved && TABS.some((t) => t.id === saved)) setActive(saved);
    } catch {}
  }, []);

  const select = (id: string) => {
    setActive(id);
    try { localStorage.setItem("distro", id); } catch {}
  };

  const tab = TABS.find((t) => t.id === active) || TABS[0];

  return (
    <div className="w-full max-w-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-transparent">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => select(t.id)}
            className={`flex-1 py-3 text-xs font-bold text-center cursor-pointer border-none transition-colors duration-200 bg-transparent border-b-2 ${
              active === t.id
                ? "text-purple-700 dark:text-purple-400 border-b-purple-600 dark:border-b-purple-400 bg-purple-50 dark:bg-purple-900/20"
                : "text-gray-400 dark:text-gray-500 border-b-transparent hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1.5">{tab.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tab.desc}</p>
        <code className="block mt-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-600 dark:border-purple-400">
          {tab.cmd}
        </code>
      </div>
    </div>
  );
}
