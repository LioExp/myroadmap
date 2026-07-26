"use client";

import { useState } from "react";
import { Plus, Trash2, Globe } from "lucide-react";
import Modal from "./Modal";

interface LinkItem {
  label: string;
  href: string;
  icon: string;
}

interface LinkGroupModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (links: { label: string; href: string; icon?: string }[]) => void;
}

export default function LinkGroupModal({ open, onClose, onInsert }: LinkGroupModalProps) {
  const [items, setItems] = useState<LinkItem[]>([{ label: "", href: "", icon: "" }]);

  const addItem = () => setItems((prev) => [...prev, { label: "", href: "", icon: "" }]);

  const removeItem = (index: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const updateItem = (index: number, field: keyof LinkItem, value: string) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const handleInsert = () => {
    const valid = items.filter((item) => item.label.trim() && item.href.trim());
    if (valid.length === 0) return;
    onInsert(valid);
    setItems([{ label: "", href: "", icon: "" }]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Inserir grupo de links" className="max-w-lg">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(i, "label", e.target.value)}
                placeholder="Label (ex: Documentação)"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-purple-500 dark:border-gray-700"
              />
              <input
                type="url"
                value={item.href}
                onChange={(e) => updateItem(i, "href", e.target.value)}
                placeholder="URL (ex: https://docs.example.com)"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-purple-500 dark:border-gray-700"
              />
              <input
                type="text"
                value={item.icon}
                onChange={(e) => updateItem(i, "icon", e.target.value)}
                placeholder="Ícone (ex: 📄 ou Link)"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-purple-500 dark:border-gray-700"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
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
            disabled={items.every((item) => !item.label.trim() || !item.href.trim())}
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
