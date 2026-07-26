"use client";
import { renderMarkdown } from "@/lib/markdown";
import { useRoadmapStore } from "@/store/useRoadmapStore";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const dark = useRoadmapStore((s) => s.dark);
  const html = renderMarkdown(content, dark);
  return (
    <div
      className="lesson-material"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
