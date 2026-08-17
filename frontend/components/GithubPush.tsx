"use client";
import { useState } from "react";
import { Github, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff, ExternalLink, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loadGithubConfig,
  saveGithubConfig,
  clearGithubConfig,
  verifyGithubRepo,
  pushNoteToGithub,
  type GithubConfig,
} from "@/lib/github";

type PushStatus =
  | { state: "idle" }
  | { state: "working"; label: string }
  | { state: "ok"; message: string; url?: string }
  | { state: "error"; message: string; url?: string };

const PAT_HELP_URL = "https://github.com/settings/personal-access-tokens/new";

export default function GithubPush({ content, filePath }: { content: string; filePath: string }) {
  const [config, setConfig] = useState<GithubConfig | null>(() => loadGithubConfig());
  const [showSetup, setShowSetup] = useState(!config);
  const [form, setForm] = useState<GithubConfig>(() => config ?? { username: "", repo: "roadmap-notas", pat: "" });
  const [showPat, setShowPat] = useState(false);
  const [status, setStatus] = useState<PushStatus>({ state: "idle" });

  function updateField<K extends keyof GithubConfig>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus({ state: "idle" });
  }

  async function handleVerify() {
    if (!form.username.trim() || !form.repo.trim()) {
      setStatus({ state: "error", message: "Preenche o username e o nome do repo." });
      return;
    }
    setStatus({ state: "working", label: "A verificar repo..." });
    try {
      const result = await verifyGithubRepo(form);
      if (result.exists) {
        saveGithubConfig(form);
        setConfig(form);
        setShowSetup(false);
        setStatus({
          state: "ok",
          message: form.pat ? "Repo verificado e ligado." : "Repo existe. Cola o PAT para poderes fazer push.",
        });
      } else {
        setStatus({
          state: "error",
          message: "Ainda não existe.",
          url: result.url,
        });
      }
    } catch (e) {
      setStatus({ state: "error", message: e instanceof Error ? e.message : "Erro ao verificar." });
    }
  }

  async function handlePush() {
    if (!config) {
      setShowSetup(true);
      return;
    }
    if (!config.pat) {
      setShowSetup(true);
      setStatus({ state: "error", message: "Falta o PAT — cola o token para fazer push." });
      return;
    }
    setStatus({ state: "working", label: "A fazer push..." });
    try {
      const result = await pushNoteToGithub(config, content, filePath);
      setStatus({
        state: "ok",
        message: result.updated ? "Nota atualizada no GitHub." : "Nota enviada para o GitHub.",
        url: result.url,
      });
    } catch (e) {
      setStatus({ state: "error", message: e instanceof Error ? e.message : "Erro no push." });
    }
  }

  function handleReset() {
    clearGithubConfig();
    setConfig(null);
    setForm({ username: "", repo: "roadmap-notas", pat: "" });
    setShowSetup(true);
    setStatus({ state: "idle" });
  }

  const busy = status.state === "working";

  return (
    <div className="flex-shrink-0 flex flex-col gap-1.5">
      <button
        onClick={config && !showSetup ? handlePush : () => setShowSetup(true)}
        disabled={busy}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all duration-150 font-sans",
          busy
            ? "bg-surface-2 dark:bg-line-strong text-faint dark:text-ghost cursor-wait"
            : "bg-[#24292f] text-white hover:bg-[#161b22] active:scale-[0.98] shadow-sm dark:bg-white dark:text-main dark:hover:bg-[#e6e6e6]"
        )}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
        {busy ? status.label : config && !showSetup ? "Push para o GitHub" : "Ligar conta GitHub"}
      </button>

      {showSetup && (
        <div className="rounded-xl border border-line bg-surface-2/60 p-3 flex flex-col gap-2">
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-wide text-faint">Username GitHub</span>
            <input
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="ex: lioexp"
              className="rounded-lg bg-surface border border-line px-2.5 py-1.5 text-xs outline-none focus:border-purple-500 transition-colors"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-wide text-faint">Nome do repo</span>
            <input
              value={form.repo}
              onChange={(e) => updateField("repo", e.target.value)}
              placeholder="ex: roadmap-notas"
              className="rounded-lg bg-surface border border-line px-2.5 py-1.5 text-xs outline-none focus:border-purple-500 transition-colors"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black uppercase tracking-wide text-faint">
              PAT (fine-grained){" "}
              <a
                href={PAT_HELP_URL}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 dark:text-purple-400 underline decoration-dotted underline-offset-2"
              >
                criar
              </a>
            </span>
            <div className="relative">
              <input
                type={showPat ? "text" : "password"}
                value={form.pat}
                onChange={(e) => updateField("pat", e.target.value)}
                placeholder="github_pat_..."
                className="w-full rounded-lg bg-surface border border-line px-2.5 py-1.5 pr-8 text-xs outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPat((v) => !v)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-faint hover:text-main cursor-pointer"
                title={showPat ? "Ocultar" : "Mostrar"}
              >
                {showPat ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[9px] text-faint leading-snug">
              Permissão <b>Contents: Read/Write</b> num único repo. Fica só no teu browser.
            </span>
          </label>
          <button
            onClick={handleVerify}
            disabled={busy}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 cursor-pointer transition-colors disabled:opacity-60"
          >
            {busy ? "A verificar..." : "Verificar repo"}
          </button>
          {config && (
            <button
              onClick={handleReset}
              className="text-[10px] text-faint hover:text-main underline decoration-dotted underline-offset-2 cursor-pointer bg-transparent border-none"
            >
              Trocar de conta / repo
            </button>
          )}
        </div>
      )}

      {config && !showSetup && (
        <button
          onClick={() => setShowSetup(true)}
          className="flex items-center justify-center gap-1 text-[9px] text-faint hover:text-main cursor-pointer bg-transparent border-none"
        >
          <Settings2 className="w-3 h-3" />
          {config.username}/{config.repo}
        </button>
      )}

      {status.state === "ok" && (
        <div className="flex items-start gap-1.5 rounded-lg bg-green-500/10 border border-green-500/30 px-2.5 py-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 leading-snug">{status.message}</span>
            {status.url && (
              <a
                href={status.url}
                target="_blank"
                rel="noreferrer"
                className="text-[9px] text-green-700 dark:text-green-400 underline underline-offset-2 flex items-center gap-0.5"
              >
                Ver no GitHub <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {status.state === "error" && (
        <div className="flex items-start gap-1.5 rounded-lg bg-red-500/10 border border-red-500/30 px-2.5 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-semibold text-red-700 dark:text-red-400 leading-snug">{status.message}</span>
            {status.url && (
              <a
                href={status.url}
                target="_blank"
                rel="noreferrer"
                className="text-[9px] text-red-700 dark:text-red-400 underline underline-offset-2 flex items-center gap-0.5"
              >
                Criar repo agora <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
