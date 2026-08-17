"use client";
import { useState } from "react";
import { Check, CheckCircle2, Lightbulb, Terminal } from "lucide-react";

interface Props {
  pergunta: string;
  resposta: string;
  dica?: string;
  limite?: number;
  index?: number;
  onAnswered: () => void;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function TerminalBlock({
  pergunta,
  resposta,
  dica,
  limite = 64,
  index,
  onAnswered,
}: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showDica, setShowDica] = useState(false);

  const done = status === "correct";
  const isWrong = status === "wrong";

  function check() {
    if (!value.trim() || done) return;
    const ok = normalize(value) === normalize(resposta);
    setStatus(ok ? "correct" : "wrong");
    if (ok) onAnswered();
  }

  return (
    <div
      className={`bg-surface dark:bg-surface-2 border rounded-2xl p-4 transition-colors ${
        done
          ? "border-[#DCFCE7] dark:border-green-900/50 bg-green-50/60 dark:bg-green-900/20"
          : isWrong
            ? "border-red-300 dark:border-red-900"
            : "border-line-strong dark:border-line"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {done ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : index != null ? (
            <span className="w-5 h-5 rounded-full border border-line flex items-center justify-center text-[10px] font-mono text-faint">
              {index}
            </span>
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-main mb-3 whitespace-pre-line">{pergunta}</p>

          {done ? (
            <div className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Comando correto!
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-[#0d1117] border border-[#30363d] px-3 py-2.5">
                <Terminal className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-green-400 font-mono text-sm shrink-0">$</span>
                <input
                  type="text"
                  value={value}
                  maxLength={limite}
                  spellCheck={false}
                  placeholder="ex.: ls -la"
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") check();
                  }}
                  className="flex-1 bg-transparent font-mono text-sm text-gray-100 outline-none placeholder:text-gray-600"
                />
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={check}
                  disabled={!value.trim()}
                  title="Checar comando"
                  className="w-10 h-10 shrink-0 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                {dica ? (
                  <button
                    type="button"
                    onClick={() => setShowDica((v) => !v)}
                    title={showDica ? "Ocultar dica" : "Mostrar dica"}
                    className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                      showDica
                        ? "border-amber-500/50 text-amber-500 bg-amber-500/10"
                        : "border-line bg-surface dark:bg-surface-2 text-muted hover:text-amber-500 hover:border-amber-500/50"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {showDica && dica ? (
                <div className="mt-3 flex items-start gap-2 text-xs bg-[#FEF3C7] dark:bg-amber-500/10 border border-[#FEF3C7] dark:border-amber-500/30 rounded-xl px-3 py-2 text-amber-800 dark:text-amber-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{dica}</span>
                </div>
              ) : null}

              {isWrong ? (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-semibold">
                  Comando incorreto. Tente novamente ou use a dica.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}