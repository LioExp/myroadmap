import type { StateCreator } from "zustand";
import type { MaterialsSlice, RoadmapState } from "../types";

export const createMaterialsSlice: StateCreator<
  RoadmapState,
  [],
  [],
  MaterialsSlice
> = (set) => ({
  materials: [],
  topics: [],
  loaded: false,

  setMaterials: (m) => set({ materials: m, loaded: true }),
  setTopics: (t) => set({ topics: t }),
});
