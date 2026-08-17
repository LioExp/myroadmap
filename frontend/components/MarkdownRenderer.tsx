"use client";
import { useEffect, useMemo, useRef } from "react";
import { parseBlocks, blockToHtml, renderMarkdown, wrapCodeCopyButtons } from "@/lib/markdown";
import type { Block } from "@/lib/markdown";
import WidgetRenderer from "./widgets";
import { AudioBlock, ImagemBlock, AnimacaoBlock, PraticaSection } from "./blocks";
import type { PraticaBlockData } from "./blocks";
import AnimatedSection from "./AnimatedSection";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = useMemo(() => parseBlocks(content), [content]);
  const pratica = useMemo<PraticaBlockData[]>(
    () => blocks.filter((b): b is PraticaBlockData => b.type === "pergunta" || b.type === "terminal" || b.type === "exercicio"),
    [blocks]
  );
  const contentBlocks = useMemo(
    () =>
      blocks.filter(
        (b) => b.type !== "pergunta" && b.type !== "terminal" && b.type !== "exercicio"
      ),
    [blocks]
  );
  const copiedTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    },
    []
  );

  // Delegated click handler: buttons are rendered inside dangerouslySetInnerHTML,
  // so the click bubbles up to this React-rendered container.
  function handleCopyClick(e: React.MouseEvent<HTMLDivElement>) {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-copy-code]");
    if (!btn) return;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(btn.dataset.copyCode ?? "").catch(() => {});
    }
    btn.classList.add("copied");
    if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => btn.classList.remove("copied"), 1500);
  }

  function renderBlock(block: Block, i: number) {
    if (block.type === "image") {
      return (
        <div className="md-image">
          <img src={block.url} alt="" />
        </div>
      );
    }
    if (block.type === "widget") {
      return <WidgetRenderer name={block.name} query={block.query} />;
    }
    if (block.type === "imagem") {
      return (
        <ImagemBlock url={block.url} titulo={block.titulo} legenda={block.legenda} />
      );
    }
    if (block.type === "audio") {
      return <AudioBlock url={block.url} title={block.title} />;
    }
    if (block.type === "animacao") {
      return <AnimacaoBlock titulo={block.titulo} passos={block.passos} />;
    }
    if (block.type === "html") {
      const html = wrapCodeCopyButtons(renderMarkdown(block.content));
      if (!html) return null;
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: blockToHtml(block) }} />;
  }

  const rendered: React.ReactNode[] = [];
  for (let i = 0; i < contentBlocks.length; i++) {
    const block = contentBlocks[i];
    const next = contentBlocks[i + 1];
    if (block.type === "image" && next && next.type === "widget") {
      rendered.push(
        <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
          <div className="md-side-by-side">
            {renderBlock(block, i)}
            {renderBlock(next, i + 1)}
          </div>
        </AnimatedSection>
      );
      i++;
      continue;
    }
    rendered.push(
      <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
        {renderBlock(block, i)}
      </AnimatedSection>
    );
  }

  return (
    <div className="lesson-material" onClick={handleCopyClick}>
      {rendered}
      {pratica.length > 0 ? <PraticaSection blocos={pratica} /> : null}
    </div>
  );
}
