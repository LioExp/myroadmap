"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onClose();
    el.addEventListener("close", handler);
    return () => el.removeEventListener("close", handler);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 m-0 h-full w-full bg-transparent p-0 backdrop:bg-black/60",
        "open:flex open:items-center open:justify-center"
      )}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl",
          "dark:border-gray-700 dark:bg-gray-900",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
