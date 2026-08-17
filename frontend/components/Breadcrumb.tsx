"use client";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export default function Breadcrumb({
  crumbs,
  className,
  trailing,
}: {
  crumbs: Crumb[];
  className?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 flex-wrap text-[12px] font-bold uppercase tracking-wide",
        className
      )}
    >
      {crumbs.map((crumb, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-ghost" />}
          <span
            onClick={crumb.onClick}
            className={cn(
              crumb.onClick && "cursor-pointer transition-colors",
              crumb.active
                ? "text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                : "text-faint",
              crumb.onClick && !crumb.active && "hover:text-purple-600 dark:hover:text-purple-400"
            )}
          >
            {crumb.label}
          </span>
        </Fragment>
      ))}
      {trailing}
    </div>
  );
}
