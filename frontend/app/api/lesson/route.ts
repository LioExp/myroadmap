import { NextRequest, NextResponse } from "next/server";
import { readLessonByAula, validateMod, validateAula } from "@/lib/materiais";

export async function GET(req: NextRequest) {
  const mod = req.nextUrl.searchParams.get("mod");
  const aula = req.nextUrl.searchParams.get("aula");

  if (!validateMod(mod) || !validateAula(aula)) {
    return NextResponse.json({ error: "mod and aula required" }, { status: 400 });
  }

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
