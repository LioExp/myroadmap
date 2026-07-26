"use client";

import { useState } from "react";
import { Plus, Trash2, Globe } from "lucide-react";
import Modal from "./Modal";

interface LinkItem {
  title: string;
  url: string;
}

interface LinkGroupModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (links: LinkItem[]) => void;
}

export default function LinkGroupModal({ open, onClose, onInsert }: LinkGroupModalProps) {
  const [links, setLinks] = useState<LinkItem[]>([{ title: "", url: "" }]);

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    setLinks((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addLink = () => setLinks((prev) => [...prev, { title: "", url: "" }]);

  const removeLink = (index: number) => {
    setLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleInsert = () => {
    const valid = links.filter((l) => l.title.trim() && l.url.trim());
    if (valid.length === 0) return;
    onInsert(valid);
    setLinks([{ title: "", url: "" }]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Grupo de links">
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={link.title}
                onChange={(e) => updateLink(i, "title", e.target.value)}
                placeholder="Título do link"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-purple-500 dark:border-gray-700"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://exemplo.com"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-purple-500 dark:border-gray-700"
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-500 hover:border-purple-400 hover:text-purple-600 dark:border-gray-600 dark:hover:border-purple-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar link
        </button>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={links.every((l) => !l.title.trim() || !l.url.trim())}
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-40"
          >
            <Globe className="h-3.5 w-3.5" />
            Inserir grupo
          </button>
        </div>
      </div>
    </Modal>
  );
}
