"use client";
import { renderMarkdown } from "@/lib/markdown";
import WidgetRenderer from "./widgets";
import AnimatedSection from "./AnimatedSection";

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
          return (
            <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
              <WidgetRenderer name={seg.name} query={seg.query} />
            </AnimatedSection>
          );
        }
        const html = renderMarkdown(seg.html);
        if (!html) return null;
        return (
          <AnimatedSection key={i} delay={Math.min(i * 40, 200)}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </AnimatedSection>
        );
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
