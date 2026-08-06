import { topics } from "@/lib/data";
import type { RoadmapState } from "./types";

export function selectSelectedTopic(state: RoadmapState) {
  return state.selectedTopicId !== null
    ? topics.find((t) => t.id === state.selectedTopicId) ?? null
    : null;
}
