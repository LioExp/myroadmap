import type { StateCreator } from "zustand";
import type { RoadmapState, UiSlice } from "../types";

export const createUiSlice: StateCreator<RoadmapState, [], [], UiSlice> = (
  set
) => ({
  notesOpen: true,
  sidebarWidth: 300,
  practiceOpen: false,
  subLesson: null,
  mobileView: "content",

  toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
  setSidebarWidth: (w) => set({ sidebarWidth: w }),
  togglePractice: () => set((s) => ({ practiceOpen: !s.practiceOpen })),
  setPracticeOpen: (v) => set({ practiceOpen: v }),
  setSubLesson: (id) => set({ subLesson: id }),
  setMobileView: (v) => set({ mobileView: v }),
});
