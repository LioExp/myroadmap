"use client";
import { useCallback, useRef, useState } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";

const SNAP_THRESHOLD = 80;
const MIN_WIDTH = 44;
const MAX_WIDTH = 500;
const COLLAPSED_WIDTH = 44;

export function useSidebarDrag() {
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(300);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    startX.current = e.clientX;
    startWidth.current = useRoadmapStore.getState().sidebarWidth;

    const handleMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX.current;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      useRoadmapStore.getState().setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setDragging(false);
      const finalWidth = useRoadmapStore.getState().sidebarWidth;
      if (finalWidth > MIN_WIDTH && finalWidth < SNAP_THRESHOLD) {
        useRoadmapStore.getState().setSidebarWidth(COLLAPSED_WIDTH);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  return { dragging, onMouseDown };
}
