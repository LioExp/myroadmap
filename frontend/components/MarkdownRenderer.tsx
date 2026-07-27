"use client";
import { useEffect, useRef } from "react";
import { renderMarkdown } from "@/lib/markdown";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const segments = splitContent(content);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const codes = el.querySelectorAll<HTMLElement>("code");
    const controllers = new Set<AbortController>();

    codes.forEach((code) => {
      if (code.dataset.copySetup) return;
      code.dataset.copySetup = "1";

      const parent = code.parentElement;
      if (!parent || parent.tagName === "PRE") return;

      const wrapper = document.createElement("span");
      wrapper.className = "cmd-copy-wrapper";
      code.parentNode!.insertBefore(wrapper, code);
      wrapper.appendChild(code);

      const btn = document.createElement("button");
      btn.className = "cmd-copy-btn";
      btn.setAttribute("aria-label", "Copiar comando");
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      wrapper.appendChild(btn);

      const ac = new AbortController();
      controllers.add(ac);

      btn.addEventListener(
        "click",
        async () => {
          const text = code.textContent || "";
          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add("copied");
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
            setTimeout(() => {
              btn.classList.remove("copied");
              btn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            }, 1500);
          } catch {}
        },
        { signal: ac.signal }
      );
    });

    return () => controllers.forEach((ac) => ac.abort());
  }, [content]);

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
    const html = renderMarkdown(seg.html);
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

  return <div ref={rootRef} className="lesson-material">{rendered}</div>;
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

  return result.filter(
    (s) => s.type !== "html" || s.html.trim().length > 0
  );
}
