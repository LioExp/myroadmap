"use client";
import { useMemo, useState } from "react";
import { Check, CheckCircle2, Lightbulb } from "lucide-react";

interface Props {
  titulo: string;
  instrucoes: string[];
  arquivo?: string;
  dica?: string;
  inicio: string;
  esperado: string;
  index?: number;
  onAnswered: () => void;
}

// Comparação sem espaços/indentação/maiúsculas (não executa código).
function normalizeCode(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export default function ExercicioBlock({
  titulo,
  instrucoes,
  arquivo = "script.py",
  dica,
  inicio,
  esperado,
  index,
  onAnswered,
}: Props) {
  const [code, setCode] = useState(inicio);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showDica, setShowDica] = useState(false);

  const done = status === "correct";
  const isWrong = status === "wrong";
  const lines = useMemo(() => code.split("\n"), [code]);

  function check() {
    if (!code.trim() || done) return;
    const ok = normalizeCode(code) === normalizeCode(esperado);
    setStatus(ok ? "correct" : "wrong");
    if (ok) onAnswered();
  }

  return (
    <div
      className={`bg-surface dark:bg-surface-2 border rounded-2xl overflow-hidden transition-colors ${
        done
          ? "border-[#DCFCE7] dark:border-green-900/50 bg-green-50/60 dark:bg-green-900/20"
          : isWrong
            ? "border-red-300 dark:border-red-900"
            : "border-line-strong dark:border-line"
      }`}
    >
      <div className="p-4 flex items-start gap-3">
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
          <p className="text-sm font-semibold text-main whitespace-pre-line">{titulo}</p>
          {instrucoes.length > 0 ? (
            <ol className="mt-2 list-decimal pl-4 text-xs text-muted space-y-1">
              {instrucoes.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>

      {!done ? (
        <>
          <div className="border-t border-line">
            <div className="px-4 py-1.5 bg-surface-2 dark:bg-line-strong border-b border-line flex items-center justify-between">
              <span className="text-xs font-mono text-muted">{arquivo}</span>
              {dica ? (
                <button
                  type="button"
                  onClick={() => setShowDica((v) => !v)}
                  title={showDica ? "Ocultar dica" : "Mostrar dica"}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                    showDica
                      ? "border-amber-500/50 text-amber-500 bg-amber-500/10"
                      : "border-line bg-surface dark:bg-surface-2 text-muted hover:text-amber-500 hover:border-amber-500/50"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
            <div className="flex">
              <div
                aria-hidden
                className="select-none shrink-0 bg-surface-2 dark:bg-line-strong border-r border-line text-right pr-2 pl-3 py-4 font-mono text-[13px] leading-6 text-faint/60"
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                spellCheck={false}
                className="flex-1 bg-page dark:bg-surface font-mono text-[13px] leading-6 p-4 outline-none resize-y min-h-[180px] whitespace-pre overflow-x-auto text-main placeholder:text-faint"
                placeholder="Escreve o teu código aqui..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2.5 border-t border-line bg-surface-2 dark:bg-line-strong">
              <button
                type="button"
                onClick={check}
                disabled={!code.trim()}
                title="Checar exercício"
                className="w-10 h-10 shrink-0 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showDica && dica ? (
            <div className="mx-4 mb-3 mt-3 flex items-start gap-2 text-xs bg-[#FEF3C7] dark:bg-amber-500/10 border border-[#FEF3C7] dark:border-amber-500/30 rounded-xl px-3 py-2 text-amber-800 dark:text-amber-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{dica}</span>
            </div>
          ) : null}

          {isWrong ? (
            <p className="px-4 pb-3 text-xs text-red-600 dark:text-red-400 font-semibold">
              Não confere. Completa o que falta seguindo as instruções e tenta de novo.
            </p>
          ) : null}
        </>
      ) : (
        <div className="px-4 pb-4 -mt-1 flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Correta!
        </div>
      )}
    </div>
  );
}