import type { Material, NoteFields } from "@/types";

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

export function getMaterial(
  materials: Material[],
  slug: string,
  lessonId: number
): Material | undefined {
  return materials.find((m) => m.modulo === slug && m.aula === lessonId);
}

export function hasMaterial(
  materials: Material[],
  slug: string,
  lessonId: number
): boolean {
  return materials.some((m) => m.modulo === slug && m.aula === lessonId && m.conteudo);
}

// ── Notes (backend persistence, falls back to localStorage via store) ───────

export async function fetchNotes(topicId: number): Promise<NoteFields | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/notas/${topicId}`);
    if (res.ok) return res.json();
  } catch {
    // ignore
  }
  return null;
}

export async function saveNotesRemote(
  topicId: number,
  fields: NoteFields
): Promise<boolean> {
  if (!API_URL) return false;
  try {
    const res = await fetch(`${API_URL}/notas/${topicId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    return res.ok;
  } catch {
    return false;
  }
}
