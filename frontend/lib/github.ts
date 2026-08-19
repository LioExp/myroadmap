export interface GithubConfig {
  username: string;
  repo: string;
  pat: string;
}

export const GITHUB_CONFIG_KEY = "myroadmap.github";

export function loadGithubConfig(): GithubConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!raw) return null;
    const cfg = JSON.parse(raw) as GithubConfig;
    return cfg.username && cfg.repo ? cfg : null;
  } catch {
    return null;
  }
}

export function saveGithubConfig(cfg: GithubConfig) {
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
}

export function clearGithubConfig() {
  localStorage.removeItem(GITHUB_CONFIG_KEY);
}

export interface VerifyResult {
  exists: boolean;
  hasAccess: boolean;
  defaultBranch: string | null;
  url: string;
}

function apiHeaders(pat?: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (pat) headers.Authorization = `Bearer ${pat}`;
  return headers;
}

/** Verifica se o repo existe e se o user tem acesso.
 *  Sem PAT: verifica repos públicos (sem autenticação).
 *  Com PAT: confirma também a permissão de escrita. */
export async function verifyGithubRepo(cfg: GithubConfig): Promise<VerifyResult> {
  const url = `https://api.github.com/repos/${encodeURIComponent(cfg.username)}/${encodeURIComponent(cfg.repo)}`;
  const res = await fetch(url, { headers: apiHeaders(cfg.pat) });

  if (res.status === 200) {
    const data = await res.json();
    return {
      exists: true,
      hasAccess: true,
      defaultBranch: data.default_branch ?? "main",
      url: data.html_url,
    };
  }
  if (res.status === 401) throw new Error("Token inválido ou expirado.");
  if (res.status === 403)
    throw new Error(
      "Sem permissão — verifica no token: Repository access = Only select repositories → escolhe o teu repo, e Contents = Read and write."
    );
  if (res.status === 404) {
    return {
      exists: false,
      hasAccess: false,
      defaultBranch: null,
      url: `https://github.com/new?name=${encodeURIComponent(cfg.repo)}`,
    };
  }
  throw new Error(`Erro ao verificar o repo (${res.status}).`);
}

const b64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

/** Verifica se um ficheiro já existe no repo (para sugerir o tipo de commit). */
export async function githubFileExists(cfg: GithubConfig, path: string): Promise<boolean> {
  const base = `https://api.github.com/repos/${encodeURIComponent(cfg.username)}/${encodeURIComponent(cfg.repo)}`;
  const res = await fetch(`${base}/contents/${encodeURIComponent(path)}`, { headers: apiHeaders(cfg.pat) });
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  throw new Error(`Erro ao consultar o ficheiro (${res.status}).`);
}

/** Faz push (cria ou atualiza) de um ficheiro no repo via API do GitHub. */
export async function pushNoteToGithub(
  cfg: GithubConfig,
  content: string,
  path: string,
  message?: string
): Promise<{ url: string; updated: boolean }> {
  const base = `https://api.github.com/repos/${encodeURIComponent(cfg.username)}/${encodeURIComponent(cfg.repo)}`;
  const headers = apiHeaders(cfg.pat);

  const get = await fetch(`${base}/contents/${encodeURIComponent(path)}`, { headers });
  let sha: string | undefined;
  if (get.status === 200) {
    const data = await get.json();
    sha = data.sha;
  } else if (get.status !== 404) {
    throw new Error(`Erro ao consultar o ficheiro (${get.status}).`);
  }

  const put = await fetch(`${base}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message:
        message?.trim() || (sha ? `Atualizar ${path}` : `Adicionar ${path}`),
      content: b64(content),
      ...(sha ? { sha } : {}),
    }),
  });

  if (put.status === 200 || put.status === 201) {
    const data = await put.json();
    return { url: data.content?.html_url ?? "", updated: !!sha };
  }
  if (put.status === 401) throw new Error("Token inválido ou expirado.");
  if (put.status === 403)
    throw new Error(
      "O token lê mas não escreve. No token (github.com/settings/personal-access-tokens): Repository access = Only select repositories → escolhe o repo; Contents = Read and write. Se criaste o token antes do repo, edita o token e adiciona o repo."
    );
  if (put.status === 404) throw new Error("Repo não encontrado — confirma o nome e se o token tem acesso.");
  const err = await put.json().catch(() => null);
  throw new Error(err?.message ?? `Erro no push (${put.status}).`);
}
