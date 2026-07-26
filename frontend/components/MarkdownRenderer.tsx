"use client";
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderMarkdown } from "@/lib/markdown";
import WidgetRenderer from "./widgets";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const html = renderMarkdown(content);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const roots = new Map<Element, Root>();

    el.querySelectorAll<HTMLDivElement>(".md-widget[data-widget]").forEach(
      (div) => {
        const name = div.dataset.widget || "";
        const qs = div.dataset.widgetQs || "";
        const root = createRoot(div);
        roots.set(div, root);
        root.render(<WidgetRenderer name={name} query={qs} />);
      }
    );

    return () => {
      roots.forEach((root) => root.unmount());
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="lesson-material"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
