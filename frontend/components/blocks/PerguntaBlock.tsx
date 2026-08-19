"use client";
import { useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, Lightbulb } from "lucide-react";

interface Props {
  pergunta: string;
  resposta: string;
  dica?: string;
  index?: number;
  onAnswered: () => void;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// PRNG determinístico: mesma resposta → mesma ordem de tiles no servidor e
// no cliente (evita mismatch de hidratação).
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function PerguntaBlock({
  pergunta,
  resposta,
  dica,
  index,
  onAnswered,
}: Props) {
  const tokens = useMemo(() => resposta.trim().split(/\s+/), [resposta]);
  const bank = useMemo(() => shuffle(tokens, hashSeed(resposta)), [tokens, resposta]);

  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showDica, setShowDica] = useState(false);
  const [shaking, setShaking] = useState(false);
  const wrongTimerRef = useRef<number | null>(null);

  const isWrong = status === "wrong";
  const done = status === "correct";

  const remaining = bank.filter(
    (t) => selected.filter((s) => s === t).length < bank.filter((b) => b === t).length
  );

  function cancelWrongTimer() {
    if (wrongTimerRef.current !== null) {
      window.clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
  }

  function pick(tile: string) {
    if (done || remaining.filter((r) => r === tile).length === 0) return;
    cancelWrongTimer();
    setSelected((prev) => [...prev, tile]);
    setStatus("idle");
  }

  function unpick(i: number) {
    if (done) return;
    cancelWrongTimer();
    setSelected((prev) => prev.filter((_, idx) => idx !== i));
    setStatus("idle");
  }

  function clear() {
    if (done) return;
    cancelWrongTimer();
    setSelected([]);
    setStatus("idle");
  }

  function check() {
    if (selected.length === 0 || done) return;
    const ok = normalize(selected.join(" ")) === normalize(resposta);
    if (ok) {
      cancelWrongTimer();
      setStatus("correct");
      onAnswered();
    } else {
      // Erro: shake curto e, se o utilizador não fizer nada, limpa a seleção
      // automaticamente para tentar de novo do zero (estilo Duolingo).
      cancelWrongTimer();
      setStatus("wrong");
      setShaking(true);
      wrongTimerRef.current = window.setTimeout(() => {
        wrongTimerRef.current = null;
        setShaking(false);
        setStatus((prev) => (prev === "wrong" ? "idle" : prev));
        setSelected((prev) => (prev.length ? [] : prev));
      }, 700);
    }
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
          <p className="text-sm font-semibold text-main mb-3 whitespace-pre-line">
            {pergunta}
          </p>

          {done ? (
            <div className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Correta!
            </div>
          ) : (
            <>
              <div
                className={`min-h-[46px] p-2 flex flex-wrap gap-2 rounded-xl border transition-colors ${
                  shaking ? "animate-shake" : ""
                } ${
                  isWrong
                    ? "border-red-300 dark:border-red-900 bg-red-500/5"
                    : "border-dashed border-line"
                }`}
                onAnimationEnd={() => setShaking(false)}
              >
                {selected.length === 0 ? (
                  <span className="text-xs text-faint px-1 py-1.5">
                    Toca nas palavras abaixo para montar a resposta…
                  </span>
                ) : (
                  selected.map((t, i) => (
                    <button
                      key={`${t}-${i}`}
                      type="button"
                      onClick={() => unpick(i)}
                      className="px-3 py-1.5 rounded-xl border border-purple-500/60 bg-purple-500/10 text-sm font-semibold text-purple-700 dark:text-purple-300 cursor-pointer transition-colors hover:bg-purple-500/20"
                    >
                      {t}
                    </button>
                  ))
                )}
              </div>

              {remaining.length > 0 ? (
                <div className="mt-2 p-2 flex flex-wrap gap-2 rounded-xl bg-page dark:bg-surface">
                  {remaining.map((t, i) => (
                    <button
                      key={`${t}-${i}`}
                      type="button"
                      onClick={() => pick(t)}
                      className="px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-2 text-sm font-semibold text-main cursor-pointer transition-colors hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={check}
                  disabled={selected.length === 0}
                  title="Checar resposta"
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
                {selected.length > 0 ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer px-2 py-1"
                  >
                    Limpar
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
                  Resposta incorreta. Tente novamente ou use a dica.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}