import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readLessonByAula, AULA_SAFE, MOD_SAFE } from "@/lib/materiais";

const LessonQuery = z.object({
  mod: z.string().regex(MOD_SAFE),
  aula: z.string().regex(AULA_SAFE),
});

export async function GET(req: NextRequest) {
  const parsed = LessonQuery.safeParse({
    mod: req.nextUrl.searchParams.get("mod"),
    aula: req.nextUrl.searchParams.get("aula"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "mod and aula required" }, { status: 400 });
  }

  const { mod, aula } = parsed.data;
  const lesson = readLessonByAula(mod, Number(aula));
  if (!lesson) {
    return NextResponse.json({ error: "lesson not found" }, { status: 404 });
  }

  return NextResponse.json({
    titulo: lesson.frontmatter.titulo ?? "",
    conteudo: lesson.content,
    raw: lesson.raw,
  });
}
