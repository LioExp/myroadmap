"use client";
import { useEffect, useState } from "react";
import { Github, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff, ExternalLink, Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { verifyGithubRepo, githubFileExists, pushNoteToGithub, type GithubConfig } from "@/lib/github";

type PushStatus =
  | { state: "idle" }
  | { state: "working"; label: string }
  | { state: "ok"; message: string; url?: string }
  | { state: "error"; message: string; url?: string };

const PAT_HELP_URL = "https://github.com/settings/personal-access-tokens/new";

export default function GithubPush({ content, filePath }: { content: string; filePath: string }) {
  const [config, setConfig] = useState<GithubConfig | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [form, setForm] = useState<GithubConfig>({ username: "", repo: "roadmap-notas", pat: "" });
  const [showPat, setShowPat] = useState(false);
  const [status, setStatus] = useState<PushStatus>({ state: "idle" });
  const [message, setMessage] = useState("");

  function updateField<K extends keyof GithubConfig>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus({ state: "idle" });
  }

  // Sugere a mensagem do commit com base em adicionar/atualizar o ficheiro.
  async function suggestMessage(cfg: GithubConfig) {
    try {
      const exists = await githubFileExists(cfg, filePath);
      setMessage(`docs: ${exists ? "atualizar" : "adicionar"} ${filePath}`);
    } catch {
      setMessage(`docs: ${filePath}`);
    }
  }

  // Bloqueia scroll e interação do fundo enquanto o modal (mobile) estiver aberto
  useEffect(() => {
    if (!showSetup) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSetup(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [showSetup]);

  async function handleVerify() {
    if (!form.username.trim() || !form.repo.trim()) {
      setStatus({ state: "error", message: "Preenche o username e o nome do repo." });
      return;
    }
    if (form.pat && !form.pat.startsWith("github_pat_")) {
      setStatus({
        state: "error",
        message: "Só aceitamos PAT fine-grained (começa por github_pat_). Tokens classic (ghp_) dão acesso à conta toda — não os uses aqui.",
      });
      return;
    }
    setStatus({ state: "working", label: "A verificar repo..." });
    try {
      const result = await verifyGithubRepo(form);
      if (result.exists) {
        setConfig(form);
        setShowSetup(false);
        suggestMessage(form);
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
    if (!config.pat.startsWith("github_pat_")) {
      setShowSetup(true);
      setStatus({
        state: "error",
        message: "Só aceitamos PAT fine-grained (começa por github_pat_). Tokens classic (ghp_) dão acesso à conta toda — não os uses aqui.",
      });
      return;
    }
    setStatus({ state: "working", label: "A fazer push..." });
    try {
      const result = await pushNoteToGithub(config, content, filePath, message);
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
    setConfig(null);
    setForm({ username: "", repo: "roadmap-notas", pat: "" });
    setMessage("");
    setShowSetup(true);
    setStatus({ state: "idle" });
  }

  const busy = status.state === "working";

  const formFields = (
    <>
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
          Permissão <b>Contents: Read/Write</b> num único repo. O site não guarda nada — o token fica só na memória desta sessão e desaparece ao fechar a página.
        </span>
        <details className="text-[9px] text-faint leading-relaxed mt-0.5">
          <summary className="cursor-pointer hover:text-main underline decoration-dotted underline-offset-2">
            Como criar o PAT certo
          </summary>
          <ol className="list-decimal pl-4 mt-1 space-y-0.5">
            <li>Repository access → <b>Only select repositories</b> → escolhe {form.repo || "o teu repo"}</li>
            <li>Permissions → <b>Contents</b> → <b>Read and write</b></li>
            <li>Expiration → 90 dias (máx. 1 ano)</li>
            <li>Gera e cola o token (começa por <b>github_pat_</b>)</li>
          </ol>
          <p className="mt-1">
            Se criaste o token antes de o repo existir, <b>edita o token</b> e adiciona o repo em Repository access.
          </p>
        </details>
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
    </>
  );

  return (
    <div className="flex-shrink-0 flex flex-col gap-1.5">
      {config && !showSetup && (
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black uppercase tracking-wide text-faint">Mensagem do commit</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`ex: docs: atualizar ${filePath}`}
            className="rounded-lg bg-surface border border-line px-2.5 py-1.5 text-xs outline-none focus:border-purple-500 transition-colors"
          />
        </label>
      )}
      <button
        onClick={config && !showSetup ? handlePush : () => setShowSetup(true)}
        disabled={busy}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all duration-150 font-sans",
          busy
            ? "bg-surface-2 dark:bg-line-strong text-faint dark:text-ghost cursor-wait"
            : "bg-[#24292f] text-white hover:bg-[#161b22] active:scale-[0.98] shadow-sm dark:bg-white dark:text-[#161b22] dark:hover:bg-[#e6e6e6]"
        )}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
        {busy ? status.label : config && !showSetup ? "Push para o GitHub" : "Ligar conta GitHub"}
      </button>

      {showSetup && (
        <>
          {/* Desktop: inline card */}
          <div className="hidden md:flex rounded-xl border border-line bg-surface-2/60 p-3 flex-col gap-2">
            {formFields}
          </div>

          {/* Mobile: floating modal */}
          <div className="fixed inset-0 z-[60] md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSetup(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-sm max-h-[80dvh] overflow-y-auto overscroll-contain rounded-2xl bg-surface dark:bg-surface-2 border border-line dark:border-line-strong shadow-2xl p-4 flex flex-col gap-2 pointer-events-auto">
                <div className="flex items-center justify-between flex-shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-widest text-faint flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    Ligar conta GitHub
                  </span>
                  <button
                    onClick={() => setShowSetup(false)}
                    title="Fechar"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-main dark:hover:text-white hover:bg-surface-2 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {formFields}
                </div>
              </div>
            </div>
          </div>
        </>
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
