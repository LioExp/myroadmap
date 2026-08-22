import { hasMaterial } from "@/lib/api";
import type { Material, Topic, TopicStatus } from "@/types";

export const STATUS_LABEL: Record<TopicStatus, string> = {
  completed: "Concluído",
  "in-progress": "Em progresso",
  upcoming: "A seguir",
};

export const STATUS_BADGE: Record<TopicStatus, { bg: string; fg: string }> = {
  completed: { bg: "bg-[#DCFCE7] dark:bg-green-900/30", fg: "text-green-700 dark:text-green-400" },
  "in-progress": { bg: "bg-[#F3E8FF] dark:bg-purple-900/30", fg: "text-purple-700 dark:text-purple-400" },
  upcoming: { bg: "bg-surface-2", fg: "text-muted" },
};

export function getTopicStatus(completed: number, total: number): TopicStatus {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return pct >= 100 ? "completed" : pct > 0 ? "in-progress" : "upcoming";
}

export function topicProgress(
  topic: Topic,
  materialsMap: Map<string, Material>
): { completed: number; total: number; pct: number } {
  const completed = topic.lessons.filter((l) =>
    hasMaterial(materialsMap, String(topic.id), l.id)
  ).length;
  return {
    completed,
    total: topic.lessons.length,
    pct: Math.round((completed / topic.lessons.length) * 100),
  };
}
