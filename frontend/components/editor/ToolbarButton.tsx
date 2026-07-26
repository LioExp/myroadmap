"use client";

import React from "react";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ToolbarButton({
  onClick,
  icon: Icon,
  tooltip,
  active = false,
  disabled = false,
  className,
}: ToolbarButtonProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
              active
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              disabled && "opacity-40 pointer-events-none",
              className
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            sideOffset={4}
            className={cn(
              "z-50 rounded-md px-2 py-1 text-xs font-medium shadow-md",
              "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
              "animate-in fade-in duration-100"
            )}
          >
            {tooltip}
            <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-100" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
