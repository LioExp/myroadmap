import type { Material, Topic } from "@/types";

// ── Roadmap data ────────────────────────────────────────────────────────────

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const res = await fetch("/roadmap-data.json", { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {
    // ignore
  }
  return [];
}

// ── Materials ──────────────────────────────────────────────────────────────

export async function fetchMaterialsIndex(): Promise<Material[]> {
  try {
    const res = await fetch("/materiais-index.json", { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {
    // ignore
  }
  return [];
}

export function buildMaterialsMap(materials: Material[]): Map<string, Material> {
  return new Map(materials.map((m) => [`${m.modulo}:${m.aula}`, m]));
}

export function getMaterial(
  map: Map<string, Material>,
  slug: string,
  lessonId: number
): Material | undefined {
  return map.get(`${slug}:${lessonId}`);
}

export function hasMaterial(
  map: Map<string, Material>,
  slug: string,
  lessonId: number
): boolean {
  return Boolean(getMaterial(map, slug, lessonId)?.conteudo);
}
