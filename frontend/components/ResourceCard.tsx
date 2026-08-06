import { ExternalLink, Video, File, BookOpen, Globe, Wrench, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource, ResourceType } from "@/types";

const typeConfig: Record<ResourceType, { icon: React.ReactNode; label: string; cls: string }> = {
  video:    { icon: <Video className="w-3.5 h-3.5" />, label: "Vídeo", cls: "video" },
  article:  { icon: <File className="w-3.5 h-3.5" />, label: "Artigo", cls: "article" },
  book:     { icon: <BookOpen className="w-3.5 h-3.5" />, label: "Livro", cls: "book" },
  platform: { icon: <Globe className="w-3.5 h-3.5" />, label: "Plataforma", cls: "platform" },
  tool:     { icon: <Wrench className="w-3.5 h-3.5" />, label: "Ferramenta", cls: "tool" },
  cert:     { icon: <FileText className="w-3.5 h-3.5" />, label: "Certificação", cls: "cert" },
};

const iconBg: Record<string, string> = {
  video:    "bg-red-50 text-red-500 border-red-100 dark:bg-red-500/15 dark:border-red-500/30",
  article:  "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-600/15 dark:border-blue-600/30",
  book:     "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-600/15 dark:border-amber-600/30",
  platform: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-600/15 dark:border-purple-600/30",
  tool:     "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-600/15 dark:border-teal-600/30",
  cert:     "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-600/15 dark:border-amber-600/30",
};

const tagCls: Record<string, string> = {
  video:    "bg-red-50 text-red-500 border-red-100 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
  article:  "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-600/30",
  book:     "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-600/15 dark:text-amber-400 dark:border-amber-600/30",
  platform: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-600/15 dark:text-purple-400 dark:border-purple-600/30",
  tool:     "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-600/15 dark:text-teal-400 dark:border-teal-600/30",
  cert:     "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-600/15 dark:text-amber-400 dark:border-amber-600/30",
};

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const cfg = typeConfig[resource.type];
  const Tag = resource.url ? "a" : "div";
  const linkProps = resource.url
    ? { href: resource.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="flex items-start gap-2.5 bg-surface rounded-xl p-3 border border-line-strong dark:border-line shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-line dark:hover:border-ghost no-underline text-inherit group"
    >
      {/* Icon */}
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border",
          iconBg[resource.type]
        )}
      >
        {cfg.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold leading-snug text-main group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {resource.title}
        </p>
        {resource.author && (
          <p className="text-[10px] text-faint mt-0.5">{resource.author}</p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
              tagCls[resource.type]
            )}
          >
            {cfg.label}
          </span>
          {resource.free !== undefined && (
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                resource.free
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-surface-2 text-faint dark:bg-surface-2 dark:text-faint"
              )}
            >
              {resource.free ? "Grátis" : "Pago"}
            </span>
          )}
        </div>
      </div>

      {/* External link */}
      <ExternalLink className="w-3 h-3 text-ghost flex-shrink-0 mt-0.5 group-hover:text-green-500 transition-colors" />
    </Tag>
  );
}
