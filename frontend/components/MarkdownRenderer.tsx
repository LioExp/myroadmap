"use client";
import { useEffect, useMemo, useRef } from "react";
import { renderMarkdown, wrapCodeCopyButtons } from "@/lib/markdown";
import WidgetRenderer from "./widgets";
import AnimatedSection from "./AnimatedSection";

interface MarkdownRendererProps {
  content: string;
}

type Segment =
  | { type: "html"; html: string }
  | { type: "widget"; name: string; query: string }
  | { type: "image"; url: string };

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const segments = useMemo(() => splitContent(content), [content]);
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

  function renderSegment(seg: Segment, i: number) {
    if (seg.type === "image") {
      return (
        <div className="md-image">
          <img src={seg.url} alt="" />
        </div>
      );
    }
    if (seg.type === "widget") {
      return <WidgetRenderer name={seg.name} query={seg.query} />;
    }
    const html = wrapCodeCopyButtons(renderMarkdown(seg.html));
    if (!html) return null;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const rendered: React.ReactNode[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const next = segments[i + 1];
    if (seg.type === "image" && next && next.type === "widget") {
      rendered.push(
        <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
          <div className="md-side-by-side">
            {renderSegment(seg, i)}
            {renderSegment(next, i + 1)}
          </div>
        </AnimatedSection>
      );
      i++;
      continue;
    }
    rendered.push(
      <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
        {renderSegment(seg, i)}
      </AnimatedSection>
    );
  }

  return (
    <div className="lesson-material" onClick={handleCopyClick}>
      {rendered}
    </div>
  );
}

function splitContent(content: string): Segment[] {
  const regex = /\{\{(widget|image):\s*([^}]+)\}\}/;
  const result: Segment[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match || match.index == null) {
      result.push({ type: "html", html: remaining });
      break;
    }
    if (match.index > 0) {
      result.push({ type: "html", html: remaining.slice(0, match.index) });
    }
    const tag = match[1];
    const raw = match[2].trim();
    if (tag === "image") {
      result.push({ type: "image", url: raw });
    } else {
      const qIdx = raw.indexOf("?");
      const name = qIdx >= 0 ? raw.slice(0, qIdx).trim() : raw;
      const query = qIdx >= 0 ? raw.slice(qIdx + 1) : "";
      result.push({ type: "widget", name, query });
    }
    remaining = remaining.slice(match.index + match[0].length);
  }

  return result.filter((s) => s.type !== "html" || s.html.trim().length > 0);
}
