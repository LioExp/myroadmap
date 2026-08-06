"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectionSlice } from "./slices/selectionSlice";
import { createUiSlice } from "./slices/uiSlice";
import { createThemeSlice } from "./slices/themeSlice";
import { createMaterialsSlice } from "./slices/materialsSlice";
import { createNotesSlice } from "./slices/notesSlice";
import type { RoadmapState } from "./types";

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (...args) => ({
      ...createSelectionSlice(...args),
      ...createUiSlice(...args),
      ...createThemeSlice(...args),
      ...createMaterialsSlice(...args),
      ...createNotesSlice(...args),
    }),
    {
      name: "roadmap-store-v1",
      partialize: (s) => ({
        dark: s.dark,
        notes: s.notes,
        notesOpen: s.notesOpen,
        roadmapOpen: s.roadmapOpen,
      }),
    }
  )
);

export { DEFAULT_NOTES } from "./slices/notesSlice";
export { selectSelectedTopic } from "./selectors";
export type {
  RoadmapState,
  SelectionSlice,
  UiSlice,
  ThemeSlice,
  MaterialsSlice,
  NotesSlice,
} from "./types";
