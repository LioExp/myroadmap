"use client";
import { useEffect, useRef } from "react";
import { renderMarkdown } from "@/lib/markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const html = renderMarkdown(content);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLDivElement>(".md-widget[data-widget]").forEach(
      async (div) => {
        const name = div.dataset.widget || "";
        const qs = div.dataset.widgetQs || "";
        const url = `/widgets/${name}.html${qs ? "?" + qs : ""}`;
        try {
          const res = await fetch(url);
          const text = await res.text();
          const temp = document.createElement("div");
          temp.innerHTML = text;
          const styles = temp.querySelectorAll("style");
          const body =
            temp.querySelector("body") || temp.querySelector("template") || temp;
          const frag = document.createDocumentFragment();
          styles.forEach((s) => frag.appendChild(s.cloneNode(true)));
          Array.from(body.childNodes).forEach((n) =>
            frag.appendChild(n.cloneNode(true))
          );
          div.innerHTML = "";
          div.appendChild(frag);
          Array.from(div.querySelectorAll("script")).forEach(
            (oldScript: HTMLScriptElement) => {
              const ns = document.createElement("script");
              ns.textContent = oldScript.textContent;
              if (oldScript.src) ns.src = oldScript.src;
              oldScript.replaceWith(ns);
            }
          );
        } catch (e) {
          div.textContent = "[widget error]";
        }
      }
    );
  }, [html]);

  return (
    <div
      ref={ref}
      className="lesson-material"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
