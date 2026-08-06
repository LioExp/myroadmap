import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveLessonByAula, writeIndex, MOD_SAFE } from "@/lib/materiais";

const SaveBody = z.object({
  mod: z.string().regex(MOD_SAFE),
  aula: z.number().int().positive(),
  titulo: z.string(),
  conteudo: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = SaveBody.safeParse(await req.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "missing or invalid fields" },
        { status: 400 }
      );
    }

    const { mod, aula, titulo, conteudo } = body.data;
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
