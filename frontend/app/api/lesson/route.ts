import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MATERIAIS_DIR = path.resolve(process.cwd(), "..", "materiais");

export async function GET(req: NextRequest) {
  const mod = req.nextUrl.searchParams.get("mod");
  const aula = req.nextUrl.searchParams.get("aula");

  if (!mod || !aula) {
    return NextResponse.json({ error: "mod and aula required" }, { status: 400 });
  }

  const dir = path.join(MATERIAIS_DIR, mod);
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: "module not found" }, { status: 404 });
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const prefix = String(aula).padStart(2, "0");

  const file = files.find((f) => f.startsWith(prefix));
  if (!file) {
    return NextResponse.json({ error: "lesson not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const frontMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  let titulo = "";
  let conteudo = raw;

  if (frontMatch) {
    const front = frontMatch[1];
    const titleMatch = front.match(/^titulo:\s*(.+)$/m);
    if (titleMatch) titulo = titleMatch[1].replace(/^["']|["']$/g, "");
    conteudo = raw.slice(frontMatch[0].length);
  }

  return NextResponse.json({ titulo, conteudo, raw });
}
