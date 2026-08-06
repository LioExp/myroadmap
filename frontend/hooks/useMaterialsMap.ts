"use client";
import { useMemo } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { buildMaterialsMap } from "@/lib/api";
import type { Material } from "@/types";

export function useMaterialsMap(): Map<string, Material> {
  const materials = useRoadmapStore((s) => s.materials);
  return useMemo(() => buildMaterialsMap(materials), [materials]);
}
