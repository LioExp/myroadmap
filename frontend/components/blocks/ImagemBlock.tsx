"use client";

interface Props {
  url: string;
  titulo?: string;
  legenda?: string;
}

export default function ImagemBlock({ url, titulo, legenda }: Props) {
  return (
    <figure className="md-figure">
      {titulo ? <figcaption className="md-figure-title">{titulo}</figcaption> : null}
      <img src={url} alt={titulo ?? ""} />
      {legenda ? <figcaption className="md-figure-caption">{legenda}</figcaption> : null}
    </figure>
  );
}
