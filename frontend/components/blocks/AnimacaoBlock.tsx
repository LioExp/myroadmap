"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  titulo?: string;
  passos: string[];
}

export default function AnimacaoBlock({ titulo, passos }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="md-animacao">
      {titulo ? <div className="md-animacao-title">{titulo}</div> : null}
      <ol>
        {passos.map((passo, i) => (
          <li
            key={i}
            className={visible ? "in" : undefined}
            style={{ transitionDelay: `${i * 350}ms` }}
          >
            <span className="md-animacao-numero">{i + 1}</span>
            <span>{passo}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
