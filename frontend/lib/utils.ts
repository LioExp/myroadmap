import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NoteFields, Topic } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "...";
}

export function getVideoId(url: string): string {
  const m = url.match(/[?&]v=([^&]+)/);
  return m ? m[1] : "";
}

export function buildMarkdown(topic: Topic, fields: NoteFields): string {
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const lines = [`## ${topic.phase} › ${topic.module} — ${topic.title}`, `**Data:** ${date}`, ``];
  if (fields.learned.trim()) lines.push(`### O que aprendi`, fields.learned.trim(), ``);
  if (fields.difficulty.trim()) lines.push(`### Dificuldades`, fields.difficulty.trim(), ``);
  if (fields.nextStep.trim()) lines.push(`### Proximo passo`, fields.nextStep.trim(), ``);
  lines.push(`---`, `> Gerado pelo Roadmap Vivo`);
  return lines.join("\n");
}

export function isNotesEmpty(fields: NoteFields): boolean {
  return !fields.learned.trim() && !fields.difficulty.trim() && !fields.nextStep.trim();
}
