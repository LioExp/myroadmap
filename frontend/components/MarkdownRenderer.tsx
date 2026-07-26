"use client";
import { renderMarkdown } from "@/lib/markdown";
import WidgetRenderer from "./widgets";

interface MarkdownRendererProps {
  content: string;
}

type Segment =
  | { type: "html"; html: string }
  | { type: "widget"; name: string; query: string };

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const segments = splitContent(content);

  return (
    <div className="lesson-material">
      {segments.map((seg, i) => {
        if (seg.type === "widget") {
          return <WidgetRenderer key={i} name={seg.name} query={seg.query} />;
        }
        const html = renderMarkdown(seg.html);
        if (!html) return null;
        return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

function splitContent(content: string): Segment[] {
  const regex = /\{\{widget:\s*([^}]+)\}\}/;
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
    const raw = match[1].trim();
    const qIdx = raw.indexOf("?");
    const name = qIdx >= 0 ? raw.slice(0, qIdx).trim() : raw;
    const query = qIdx >= 0 ? raw.slice(qIdx + 1) : "";
    result.push({ type: "widget", name, query });
    remaining = remaining.slice(match.index + match[0].length);
  }

  return result;
}
