import type { StateCreator } from "zustand";
import type { RoadmapState, UiSlice } from "../types";

export const createUiSlice: StateCreator<RoadmapState, [], [], UiSlice> = (
  set
) => ({
  notesOpen: true,
  roadmapOpen: true,
  practiceOpen: false,
  subLesson: null,
  mobileView: "content",

  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
  setRoadmapOpen: (v) => set({ roadmapOpen: v }),
  togglePractice: () => set((s) => ({ practiceOpen: !s.practiceOpen })),
  setPracticeOpen: (v) => set({ practiceOpen: v }),
  setSubLesson: (id) => set({ subLesson: id }),
  setMobileView: (v) =>
    set((s) => ({
      mobileView: v,
      ...(v !== s.mobileView && s.practiceOpen ? { practiceOpen: false } : {}),
    })),
});
