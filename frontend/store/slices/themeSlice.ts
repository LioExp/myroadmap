import type { StateCreator } from "zustand";
import type { RoadmapState, ThemeSlice } from "../types";

export const createThemeSlice: StateCreator<RoadmapState, [], [], ThemeSlice> = (
  set
) => ({
  dark: true,

  toggleTheme: () =>
    set((s) => {
      const next = !s.dark;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return { dark: next };
    }),
});
