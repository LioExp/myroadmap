"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LinkItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface LinkGroupProps {
  items: LinkItem[];
  className?: string;
  lift?: number;
  scale?: number;
  falloff?: number;
  duration?: number;
}

export function LinkGroup({
  items,
  className,
  lift = -4,
  scale = 1.05,
  falloff = 0.45,
  duration = 320,
}: LinkGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getShift = (index: number) => {
    if (hoveredIndex === null) return 0;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return lift;
    return lift * Math.pow(falloff, distance);
  };

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    return index === hoveredIndex ? scale : 1;
  };

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900",
            "hover:bg-gray-100 hover:text-gray-900 shadow-sm transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
            "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          )}
          style={{
            transform: `translateY(${getShift(index)}px) scale(${getScale(index)})`,
            transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            willChange: "transform",
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {item.icon && <span className="text-gray-400 dark:text-gray-500">{item.icon}</span>}
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
