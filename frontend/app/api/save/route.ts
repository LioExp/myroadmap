import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MATERIAIS_DIR = path.resolve(process.cwd(), "..", "materiais");
const INDEX_PATH = path.resolve(process.cwd(), "public", "materiais-index.json");

export async function POST(req: NextRequest) {
  try {
    const { mod, aula, titulo, conteudo } = await req.json();
    if (!mod || !aula || titulo === undefined || conteudo === undefined) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const dir = path.join(MATERIAIS_DIR, mod);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const prefix = String(aula).padStart(2, "0");
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
    const existing = files.find((f) => f.startsWith(prefix));
    const filename = existing || `${prefix}-aula.md`;

    const frontmatter = `---\nmodulo: ${mod}\naula: ${aula}\ntitulo: "${titulo}"\n---\n\n`;
    fs.writeFileSync(path.join(dir, filename), frontmatter + conteudo, "utf-8");

    // Regenerate materiais-index.json
    const allModules = fs.readdirSync(MATERIAIS_DIR).filter((d) =>
      fs.statSync(path.join(MATERIAIS_DIR, d)).isDirectory()
    );

    const index: Array<{ modulo: string; aula: number; titulo: string; conteudo: string }> = [];

    for (const m of allModules) {
      const lessonFiles = fs.readdirSync(path.join(MATERIAIS_DIR, m)).filter((f) => f.endsWith(".md"));
      for (const f of lessonFiles) {
        const raw = fs.readFileSync(path.join(MATERIAIS_DIR, m, f), "utf-8");
        const frontMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
        let aulaNum = 0;
        let tituloVal = "";
        let conteudoVal = raw;

        if (frontMatch) {
          const front = frontMatch[1];
          const aMatch = front.match(/^aula:\s*(\d+)$/m);
          if (aMatch) aulaNum = parseInt(aMatch[1]);
          const tMatch = front.match(/^titulo:\s*(.+)$/m);
          if (tMatch) tituloVal = tMatch[1].replace(/^["']|["']$/g, "");
          conteudoVal = raw.slice(frontMatch[0].length);
        }

        index.push({ modulo: m, aula: aulaNum, titulo: tituloVal, conteudo: conteudoVal });
      }
    }

    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), "utf-8");

    return NextResponse.json({ ok: true, filename });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
