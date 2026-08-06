import type { Material } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── Materials ──────────────────────────────────────────────────────────────

export async function fetchMaterialsIndex(): Promise<Material[]> {
  // Try FastAPI backend first, fall back to local JSON
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/materiais`, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch {
      // fall through to local
    }
  }
  // Local fallback (Next.js serves /public/materiais-index.json)
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
