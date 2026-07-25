"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Material, MobileView, NoteFields } from "@/types";
import { topics } from "@/lib/data";

interface RoadmapState {
  // Selection
  selectedTopicId: number | null;
  selectedLessonId: number | null;
  // UI
  notesOpen: boolean;
  sidebarWidth: number;
  practiceOpen: boolean;
  copied: boolean;
  mobileView: MobileView;
  // Theme
  dark: boolean;
  // Materials (loaded from API/local JSON)
  materials: Material[];
  // Notes per topic (key = topicId)
  notes: Record<number, NoteFields>;

  // Computed helpers (not stored)
  getSelectedTopic: () => (typeof topics)[0] | null;

  // Actions
  selectTopic: (id: number | null) => void;
  selectLesson: (id: number | null) => void;
  toggleNotes: () => void;
  setSidebarWidth: (w: number) => void;
  togglePractice: () => void;
  setPracticeOpen: (v: boolean) => void;
  setCopied: (v: boolean) => void;
  setMobileView: (v: MobileView) => void;
  toggleTheme: () => void;
  setMaterials: (m: Material[]) => void;
  updateNote: (topicId: number, key: keyof NoteFields, val: string) => void;
  getNotes: (topicId: number) => NoteFields;
}

const DEFAULT_NOTES: NoteFields = { learned: "", difficulty: "", nextStep: "" };

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      selectedTopicId: null,
      selectedLessonId: null,
      notesOpen: true,
      sidebarWidth: 300,
      practiceOpen: false,
      copied: false,
      mobileView: "content",
      dark: true,
      materials: [],
      notes: {},

      getSelectedTopic: () => {
        const id = get().selectedTopicId;
        return id !== null ? topics.find((t) => t.id === id) ?? null : null;
      },

      selectTopic: (id) =>
        set((s) => ({
          selectedTopicId: s.selectedTopicId === id ? null : id,
          selectedLessonId: null,
        })),

      selectLesson: (id) => {
        const state = get();
        const topic = state.getSelectedTopic();
        const lesson = topic?.lessons.find((l) => l.id === id);
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const shouldCollapse = !isMobile && id !== null && lesson?.practice && state.sidebarWidth > 80;
        set((s) => ({
          selectedLessonId: s.selectedLessonId === id ? null : id,
          ...(shouldCollapse ? { sidebarWidth: 44 } : {}),
        }));
      },

      toggleNotes: () => set((s) => ({ notesOpen: !s.notesOpen })),
      setSidebarWidth: (w) => set({ sidebarWidth: w }),
      togglePractice: () => set((s) => ({ practiceOpen: !s.practiceOpen })),
      setPracticeOpen: (v) => set({ practiceOpen: v }),
      setCopied: (v) => set({ copied: v }),
      setMobileView: (v) => set({ mobileView: v }),
      toggleTheme: () =>
        set((s) => {
          const next = !s.dark;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next);
          }
          return { dark: next };
        }),
      setMaterials: (m) => set({ materials: m }),

      updateNote: (topicId, key, val) =>
        set((s) => ({
          notes: {
            ...s.notes,
            [topicId]: { ...(s.notes[topicId] ?? DEFAULT_NOTES), [key]: val },
          },
        })),

      getNotes: (topicId) => get().notes[topicId] ?? { ...DEFAULT_NOTES },
    }),
    {
      name: "roadmap-store-v1",
      partialize: (s) => ({ dark: s.dark, notes: s.notes, notesOpen: s.notesOpen, sidebarWidth: s.sidebarWidth }),
    }
  )
);
