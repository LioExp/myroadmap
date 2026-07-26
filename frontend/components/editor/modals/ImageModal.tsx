"use client";

import { useState } from "react";
import { Image } from "lucide-react";
import Modal from "./Modal";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}

export default function ImageModal({ open, onClose, onInsert }: ImageModalProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const handleInsert = () => {
    if (!url.trim()) return;
    onInsert(url.trim(), alt.trim());
    setUrl("");
    setAlt("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Inserir imagem">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">URL da imagem</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.png"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Texto alternativo</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Descrição da imagem"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700"
          />
        </div>
        {url && (
          <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
            <img src={url} alt={alt || "preview"} className="max-h-32 rounded object-contain" />
          </div>
        )}
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
            disabled={!url.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-40"
          >
            <Image className="h-3.5 w-3.5" />
            Inserir
          </button>
        </div>
      </div>
    </Modal>
  );
}
