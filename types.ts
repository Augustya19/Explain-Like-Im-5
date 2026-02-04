
export enum ExplanationLevel {
  ELI5 = 'ELI5',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE'
}

export interface ExplanationData {
  id: string;
  definition: string;
  analogy: string;
  example: string;
  takeaway: string;
  topic: string;
  level: ExplanationLevel;
  timestamp: number;
  isFavorite?: boolean;
}

export interface AppState {
  topic: string;
  level: ExplanationLevel;
  loading: boolean;
  error: string | null;
  result: ExplanationData | null;
  history: ExplanationData[];
  darkMode: boolean;
  sidebarOpen: boolean;
  isAudioPlaying: boolean;
}
