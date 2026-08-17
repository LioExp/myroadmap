"use client";
import { useMemo, useState } from "react";
import { dslToFields, fieldsToDsl, blankFields } from "@/lib/dslEditor";
import type { BlockFields } from "@/lib/dslEditor";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "lines";
  placeholder?: string;
  mono?: boolean;
}

const F = (key: string, label: string, type: FieldDef["type"] = "text", extra: Partial<FieldDef> = {}): FieldDef => ({
  key,
  label,
  type,
  ...extra,
});

const FORM_CONFIG: Record<string, { title: string; fields: FieldDef[] }> = {
  pergunta: {
    title: "Pergunta",
    fields: [
      F("pergunta", "Pergunta", "textarea"),
      F("resposta", "Resposta"),
      F("dica", "Dica", "textarea"),
      F("limite", "Limite de caracteres", "number"),
    ],
  },
  terminal: {
    title: "Terminal",
    fields: [
      F("pergunta", "Pergunta", "textarea"),
      F("resposta", "Comando certo"),
      F("dica", "Dica", "textarea"),
      F("limite", "Limite de caracteres", "number"),
    ],
  },
  exercicio: {
    title: "Exercício de código",
    fields: [
      F("titulo", "Título"),
      F("instrucoes", "Instruções (uma por linha)", "lines"),
      F("arquivo", "Nome do ficheiro"),
      F("dica", "Dica", "textarea"),
      F("inicio", "Código inicial", "textarea", { mono: true }),
      F("esperado", "Código esperado", "textarea", { mono: true }),
    ],
  },
  audio: {
    title: "Áudio",
    fields: [F("url", "URL do áudio"), F("titulo", "Título")],
  },
  imagem: {
    title: "Imagem",
    fields: [F("url", "URL da imagem"), F("titulo", "Título"), F("legenda", "Legenda")],
  },
  animacao: {
    title: "Animação",
    fields: [F("titulo", "Título"), F("passos", "Passos (um por linha)", "lines")],
  },
  alert: {
    title: "Alert",
    fields: [F("text", "Texto", "textarea")],
  },
  widget: {
    title: "Widget",
    fields: [F("name", "Nome do widget"), F("query", "Query (ex: tool=git)")],
  },
  image: {
    title: "Imagem",
    fields: [F("url", "URL")],
  },
  video: {
    title: "Vídeo",
    fields: [F("url", "URL (YouTube ou ficheiro)")],
  },
  icon: {
    title: "Ícone",
    fields: [F("name", "Nome do ícone (ex: ubuntu)")],
  },
};

export function formConfigFor(type: string): { title: string; fields: FieldDef[] } {
  return (
    FORM_CONFIG[type] ?? {
      title: type,
      fields: [],
    }
  );
}

interface Props {
  type: string;
  dsl: string;
  onApply: (dsl: string) => void;
  onClose: () => void;
}

export default function BlockFormModal({ type, dsl, onApply, onClose }: Props) {
  const config = useMemo(() => formConfigFor(type), [type]);
  const [fields, setFields] = useState<BlockFields>(() => ({
    ...blankFields(type),
    ...dslToFields(type, dsl),
  }));

  const set = (key: string, value: string) => setFields((f) => ({ ...f, [key]: value }));

  const apply = () => {
    if (type === "icon") {
      const name = String(fields.name ?? "").trim().replace(/\.svg$/, "");
      if (name) onApply(`/icons/${name}.svg`);
      return;
    }
    onApply(fieldsToDsl(type, fields));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-surface border border-line p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-main">{config.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-muted hover:text-main text-xs"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {config.fields.map((field) => (
            <label key={field.key} className="block">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-faint mb-1">
                {field.label}
              </span>
              {field.type === "textarea" || field.type === "lines" ? (
                <textarea
                  value={String(fields[field.key] ?? "")}
                  onChange={(e) => set(field.key, e.target.value)}
                  rows={field.type === "lines" ? 4 : 3}
                  placeholder={field.placeholder}
                  className={`w-full text-xs px-2.5 py-1.5 rounded-lg border border-line bg-surface-2 text-main outline-none focus:border-purple-500 resize-y ${
                    field.mono ? "font-mono" : ""
                  }`}
                />
              ) : (
                <input
                  value={String(fields[field.key] ?? "")}
                  onChange={(e) => set(field.key, e.target.value)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-line bg-surface-2 text-main outline-none focus:border-purple-500"
                />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-line text-muted hover:text-main"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={apply}
            className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}