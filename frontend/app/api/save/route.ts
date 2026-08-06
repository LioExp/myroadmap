import { NextRequest, NextResponse } from "next/server";
import { saveLessonByAula, validateMod, writeIndex } from "@/lib/materiais";

export async function POST(req: NextRequest) {
  try {
    const { mod, aula, titulo, conteudo } = await req.json();
    if (
      !validateMod(mod) ||
      typeof aula !== "number" ||
      !Number.isFinite(aula) ||
      titulo === undefined ||
      conteudo === undefined
    ) {
      return NextResponse.json({ error: "missing or invalid fields" }, { status: 400 });
    }

    const filename = saveLessonByAula(mod, aula, titulo, conteudo);
    writeIndex();

    return NextResponse.json({ ok: true, filename });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 }
    );
  }
}
