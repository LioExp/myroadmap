"use client";
import { useState, useEffect } from "react";

const CMD: Record<string, Record<string, string>> = {
  git: { debian: "sudo apt install git", fedora: "sudo dnf install git", arch: "sudo pacman -S git" },
  ansible: { debian: "sudo apt install ansible", fedora: "sudo dnf install ansible", arch: "sudo pacman -S ansible" },
};

const CMD_MULTI: Record<string, Record<string, string>> = {
  vagrant: {
    debian:
      "wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg\necho \"deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main\" | sudo tee /etc/apt/sources.list.d/hashicorp.list\nsudo apt update && sudo apt install vagrant",
    fedora:
      "wget -O- https://rpm.releases.hashicorp.com/fedora/hashicorp.repo | sudo tee /etc/yum.repos.d/hashicorp.repo\nsudo dnf -y install vagrant",
    arch: "yay -S vagrant",
  },
};

const LABELS: Record<string, string> = { debian: "Ubuntu/Debian", fedora: "Fedora", arch: "Arch Linux" };

interface Props {
  tool?: string;
}

export default function DistroCmd({ tool = "git" }: Props) {
  const cmdMap = CMD[tool] || CMD_MULTI[tool] || CMD.git;
  const [distro, setDistro] = useState("debian");

  useEffect(() => {
    try { setDistro(localStorage.getItem("distro") || "debian"); } catch {}
    const id = setInterval(() => {
      try {
        const d = localStorage.getItem("distro") || "debian";
        setDistro((prev) => (prev !== d ? d : prev));
      } catch {}
    }, 500);
    return () => clearInterval(id);
  }, []);

  const cmd = cmdMap[distro] || cmdMap.debian;

  return (
    <div className="w-full max-w-[600px] border border-gray-200 dark:border-gray-700 rounded-xl p-[18px] bg-transparent">
      <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
        {LABELS[distro] || distro}
      </span>
      <div className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-[13px] leading-relaxed text-gray-900 dark:text-gray-100 bg-transparent whitespace-pre-wrap break-all">
        <span className="text-purple-700 dark:text-purple-400 font-bold">$ </span>
        {cmd}
      </div>
    </div>
  );
}
