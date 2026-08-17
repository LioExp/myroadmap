"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import PerguntaBlock from "./PerguntaBlock";
import TerminalBlock from "./TerminalBlock";
import ExercicioBlock from "./ExercicioBlock";
import type { Block } from "@/lib/markdown";

export type PraticaBlockData = Extract<Block, { type: "pergunta" | "terminal" | "exercicio" }>;

interface Props {
  blocos: PraticaBlockData[];
}

export default function PraticaSection({ blocos }: Props) {
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const hasExercicios = blocos.some((b) => b.type === "exercicio");

  return (
    <div className="mt-16 pt-8 border-t border-line">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-faint flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          {hasExercicios
            ? "Responde às perguntas e exercícios abaixo:"
            : "Responde às perguntas abaixo:"}
        </h3>
        <span className="text-xs text-muted font-mono">
          {answered.size}/{blocos.length} concluídos
        </span>
      </div>
      <p className="text-sm text-muted mb-6">
        Responde corretamente para completar a aula.
      </p>

      <div className="space-y-4">
        {blocos.map((b, i) => (
          <div key={i}>
            {b.type === "pergunta" ? (
              <PerguntaBlock
                pergunta={b.pergunta}
                resposta={b.resposta}
                dica={b.dica}
                index={i + 1}
                onAnswered={() => setAnswered((prev) => new Set(prev).add(i))}
              />
            ) : null}
            {b.type === "terminal" ? (
              <TerminalBlock
                pergunta={b.pergunta}
                resposta={b.resposta}
                dica={b.dica}
                limite={b.limite}
                index={i + 1}
                onAnswered={() => setAnswered((prev) => new Set(prev).add(i))}
              />
            ) : null}
            {b.type === "exercicio" ? (
              <ExercicioBlock
                titulo={b.titulo}
                instrucoes={b.instrucoes}
                arquivo={b.arquivo}
                dica={b.dica}
                inicio={b.inicio}
                esperado={b.esperado}
                index={i + 1}
                onAnswered={() => setAnswered((prev) => new Set(prev).add(i))}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}