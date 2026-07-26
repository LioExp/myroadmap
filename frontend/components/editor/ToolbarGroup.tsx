"use client";

import type React from "react";
import * as Separator from "@radix-ui/react-separator";

interface ToolbarGroupProps {
  children: React.ReactNode;
  showSeparator?: boolean;
}

export default function ToolbarGroup({ children, showSeparator = true }: ToolbarGroupProps) {
  return (
    <>
      <div className="flex items-center gap-0.5 px-1">{children}</div>
      {showSeparator && (
        <Separator.Root
          orientation="vertical"
          className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700"
        />
      )}
    </>
  );
}
