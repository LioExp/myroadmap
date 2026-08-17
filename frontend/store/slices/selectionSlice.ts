import type { StateCreator } from "zustand";
import { selectSelectedTopic } from "../selectors";
import type { RoadmapState, SelectionSlice } from "../types";

export const createSelectionSlice: StateCreator<
  RoadmapState,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedTopicId: null,
  selectedLessonId: null,

  selectTopic: (id) =>
    set((s) => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      return {
        selectedTopicId: s.selectedTopicId === id ? null : id,
        selectedLessonId: null,
        ...(s.practiceOpen ? { practiceOpen: false } : {}),
        ...(isMobile ? { mobileView: "content" } : {}),
      };
    }),

  selectLesson: (id) => {
    const state = get();
    const topic = selectSelectedTopic(state);
    const lesson = topic?.lessons.find((l) => l.id === id);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const shouldCollapse = !isMobile && id !== null && lesson?.practice && state.roadmapOpen;
    if (typeof window !== "undefined") window.location.hash = "";
    set((s) => {
      const nextLesson = s.selectedLessonId === id ? null : id;
      return {
        selectedLessonId: nextLesson,
        subLesson: null,
        ...(shouldCollapse ? { roadmapOpen: false } : {}),
        ...(nextLesson !== s.selectedLessonId && s.practiceOpen ? { practiceOpen: false } : {}),
      };
    });
  },
});
