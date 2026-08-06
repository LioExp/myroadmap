import type { StateCreator } from "zustand";
import type { NoteFields } from "@/types";
import type { NotesSlice, RoadmapState } from "../types";

export const DEFAULT_NOTES: NoteFields = {
  learned: "",
  difficulty: "",
  nextStep: "",
};

export const createNotesSlice: StateCreator<RoadmapState, [], [], NotesSlice> = (
  set
) => ({
  notes: {},

  updateNote: (topicId, key, val) =>
    set((s) => ({
      notes: {
        ...s.notes,
        [topicId]: { ...(s.notes[topicId] ?? DEFAULT_NOTES), [key]: val },
      },
    })),
});
