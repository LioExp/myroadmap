export type TopicStatus = "completed" | "in-progress" | "upcoming";
export type ResourceType = "video" | "article" | "book" | "platform" | "tool" | "cert";

export interface SubLesson {
  title: string;
  def: string;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  topics: string[];
  practice?: boolean;
  subLessons?: Record<string, SubLesson>;
}

export interface Resource {
  type: ResourceType;
  title: string;
  author?: string;
  free?: boolean;
  url?: string;
}

export interface MainVideo {
  title: string;
  duration: string;
  url: string;
  description?: string;
}

export interface Topic {
  id: number;
  slug: string;
  module: string;
  phase: string;
  block: string;
  title: string;
  emoji: string;
  desc: string;
  longDesc: string;
  estimatedHours: number;
  mainVideo: MainVideo;
  lessons: Lesson[];
  resources: Resource[];
  deepDive: Resource[];
}

export interface Material {
  modulo: string;
  aula: number;
  titulo: string;
  conteudo: string;
}

export interface NoteFields {
  learned: string;
  difficulty: string;
  nextStep: string;
}

export type MobileView = "timeline" | "content" | "notes";
