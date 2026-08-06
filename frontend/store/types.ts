import type { Material, MobileView, NoteFields } from "@/types";

export interface SelectionSlice {
  selectedTopicId: number | null;
  selectedLessonId: number | null;
  selectTopic: (id: number | null) => void;
  selectLesson: (id: number | null) => void;
}

export interface UiSlice {
  notesOpen: boolean;
  sidebarWidth: number;
  practiceOpen: boolean;
  subLesson: string | null;
  mobileView: MobileView;
  toggleNotes: () => void;
  setSidebarWidth: (w: number) => void;
  togglePractice: () => void;
  setPracticeOpen: (v: boolean) => void;
  setSubLesson: (id: string | null) => void;
  setMobileView: (v: MobileView) => void;
}

export interface ThemeSlice {
  dark: boolean;
  toggleTheme: () => void;
}

export interface MaterialsSlice {
  materials: Material[];
  loaded: boolean;
  setMaterials: (m: Material[]) => void;
}

export interface NotesSlice {
  notes: Record<number, NoteFields>;
  updateNote: (topicId: number, key: keyof NoteFields, val: string) => void;
}

export type RoadmapState = SelectionSlice &
  UiSlice &
  ThemeSlice &
  MaterialsSlice &
  NotesSlice;
