import { getVideoId } from "@/lib/utils";

interface VideoEmbedProps {
  url: string;
  title: string;
  description?: string;
}

export default function VideoEmbed({ url, title, description }: VideoEmbedProps) {
  const videoId = getVideoId(url);

  if (!videoId) return null;

  return (
    <div className="mb-2">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-2">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <p className="text-[12px] font-bold text-[#111827] dark:text-[#F3F4F6] leading-snug">
        {title}
      </p>
      {description && (
        <details className="mt-2">
          <summary className="text-[11px] font-bold text-purple-600 dark:text-purple-400 cursor-pointer select-none hover:text-purple-800 dark:hover:text-purple-300">
            Descrição
          </summary>
          <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mt-1.5 p-2.5 bg-[#F9FAFB] dark:bg-[#1a1a1a] rounded-lg border border-[#F3F4F6] dark:border-[#374151]">
            {description}
          </p>
        </details>
      )}
    </div>
  );
}
