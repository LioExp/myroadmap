"use client";

interface Props {
  url: string;
  title?: string;
}

export default function AudioBlock({ url, title }: Props) {
  return (
    <div className="md-audio">
      {title ? <div className="md-media-title">{title}</div> : null}
      <audio controls preload="metadata" src={url}></audio>
    </div>
  );
}
