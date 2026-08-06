import type { RoadmapState } from "./types";

export function selectSelectedTopic(state: RoadmapState) {
  return state.selectedTopicId !== null
    ? state.topics.find((t) => t.id === state.selectedTopicId) ?? null
    : null;
}
