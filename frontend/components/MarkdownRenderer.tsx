"use client";
import { useEffect, useMemo, useRef } from "react";
import { parseBlocks, blockToHtml, renderMarkdown, wrapCodeCopyButtons } from "@/lib/markdown";
import type { Block } from "@/lib/markdown";
import WidgetRenderer from "./widgets";
import AnimatedSection from "./AnimatedSection";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = useMemo(() => parseBlocks(content), [content]);
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
    if (block.type === "html") {
      const html = wrapCodeCopyButtons(renderMarkdown(block.content));
      if (!html) return null;
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: blockToHtml(block) }} />;
  }

  const rendered: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
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
    </div>
  );
}
