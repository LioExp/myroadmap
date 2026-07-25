"use client";
import { renderMarkdown } from "@/lib/markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = renderMarkdown(content);
  return (
    <div
      className="lesson-material"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
