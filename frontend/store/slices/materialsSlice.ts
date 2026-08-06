import type { StateCreator } from "zustand";
import type { MaterialsSlice, RoadmapState } from "../types";

export const createMaterialsSlice: StateCreator<
  RoadmapState,
  [],
  [],
  MaterialsSlice
> = (set) => ({
  materials: [],
  loaded: false,

  setMaterials: (m) => set({ materials: m, loaded: true }),
});
