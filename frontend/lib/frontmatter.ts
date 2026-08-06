export type Frontmatter = Record<string, string>;

/**
 * Parses YAML-ish frontmatter (`---\nkey: value\n---`). Kept deliberately
 * simple: values are strings, quotes stripped. Shared by the markdown
 * renderer and the API layer so parsing lives in one place.
 */
export function parseFrontmatter(raw: string): {
  frontmatter: Frontmatter;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, content: raw };
  const frontmatter: Frontmatter = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) frontmatter[key] = value;
  });
  return { frontmatter, content: raw.slice(match[0].length) };
}

export function buildFrontmatter(fm: Record<string, string | number>): string {
  return Object.entries(fm)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
