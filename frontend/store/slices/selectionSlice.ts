import type { StateCreator } from "zustand";
import { selectSelectedTopic } from "../selectors";
import type { RoadmapState, SelectionSlice } from "../types";

const COLLAPSED_WIDTH = 44;
const COLLAPSE_THRESHOLD = 80;

export const createSelectionSlice: StateCreator<
  RoadmapState,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedTopicId: null,
  selectedLessonId: null,

  selectTopic: (id) =>
    set((s) => ({
      selectedTopicId: s.selectedTopicId === id ? null : id,
      selectedLessonId: null,
    })),

  selectLesson: (id) => {
    const state = get();
    const topic = selectSelectedTopic(state);
    const lesson = topic?.lessons.find((l) => l.id === id);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const shouldCollapse =
      !isMobile && id !== null && lesson?.practice && state.sidebarWidth > COLLAPSE_THRESHOLD;
    if (typeof window !== "undefined") window.location.hash = "";
    set((s) => ({
      selectedLessonId: s.selectedLessonId === id ? null : id,
      subLesson: null,
      ...(shouldCollapse ? { sidebarWidth: COLLAPSED_WIDTH } : {}),
    }));
  },
});
