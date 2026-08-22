import fs from "fs";
import path from "path";
import { parseFrontmatter, buildFrontmatter } from "./frontmatter";

const MATERIAIS_DIR = path.resolve(process.cwd(), "..", "materiais");
const INDEX_PATH = path.resolve(process.cwd(), "public", "materiais-index.json");

export const MOD_SAFE = /^\d+$/;
const FILE_SAFE = /^[\w-]+\.md$/;
export const AULA_SAFE = /^\d+$/;

export function validateMod(mod: string | null): mod is string {
  return typeof mod === "string" && MOD_SAFE.test(mod);
}

export function validateFile(file: string | null): file is string {
  return typeof file === "string" && FILE_SAFE.test(file);
}

export function validateAula(aula: string | null): aula is string {
  return typeof aula === "string" && AULA_SAFE.test(aula);
}

function moduleDir(mod: string): string {
  return path.join(MATERIAIS_DIR, mod);
}

function lessonFiles(mod: string): string[] {
  const dir = moduleDir(mod);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function listModules(): string[] {
  if (!fs.existsSync(MATERIAIS_DIR)) return [];
  return fs
    .readdirSync(MATERIAIS_DIR)
    .filter((d) => fs.statSync(path.join(MATERIAIS_DIR, d)).isDirectory());
}

export function listLessons(mod: string): { file: string; title: string }[] {
  if (!validateMod(mod)) return [];
  return lessonFiles(mod).map((file) => ({
    file,
    title: file.replace(/\.md$/, "").replace(/^\d+-/, "").replace(/-/g, " "),
  }));
}

function readFile(mod: string, file: string): { frontmatter: Record<string, string>; content: string; raw: string } | null {
  const p = path.join(moduleDir(mod), file);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  const { frontmatter, content } = parseFrontmatter(raw);
  return { frontmatter, content, raw };
}

export function readLessonByAula(
  mod: string,
  aula: number
): { frontmatter: Record<string, string>; content: string; raw: string } | null {
  const prefix = String(aula).padStart(2, "0");
  const file = lessonFiles(mod).find((f) => f.startsWith(prefix));
  return file ? readFile(mod, file) : null;
}

export function saveLessonByAula(
  mod: string,
  aula: number,
  titulo: string,
  conteudo: string
): string {
  const dir = moduleDir(mod);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const prefix = String(aula).padStart(2, "0");
  const existing = lessonFiles(mod).find((f) => f.startsWith(prefix));
  const filename = existing || `${prefix}-aula.md`;

  const frontmatter = buildFrontmatter({ modulo: mod, aula, titulo });
  fs.writeFileSync(path.join(dir, filename), `---\n${frontmatter}\n---\n\n${conteudo}`, "utf-8");
  return filename;
}

/** Regenerates public/materiais-index.json from the markdown files. */
export function writeIndex(): void {
  const index: Array<{ modulo: string; aula: number; titulo: string; conteudo: string }> = [];

  for (const mod of listModules()) {
    for (const file of lessonFiles(mod)) {
      const lesson = readFile(mod, file);
      if (!lesson) continue;
      index.push({
        modulo: mod,
        aula: Number(lesson.frontmatter.aula) || 0,
        titulo: lesson.frontmatter.titulo ?? "",
        conteudo: lesson.content,
      });
    }
  }

  const tmp = `${INDEX_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(index, null, 2), "utf-8");
  fs.renameSync(tmp, INDEX_PATH);
}
