export type MoodId = 0 | 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  id: MoodId;
  name: string;
  color: string;
  bgTint: string;
  src: string;
}

export interface Habit {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface HabitDraft {
  id: string | null;
  emoji: string;
  label: string;
  color: string;
}

export interface DayEntry {
  mood?: MoodId | null;
  wake?: string;
  bed?: string;
  steps?: string;
  screen?: string;
  note?: string;
  pic?: string | null;
  [habitId: string]: boolean | string | number | null | undefined;
}

export type DayMap = Record<string, DayEntry>;

export interface IdeaItem {
  id: string;
  text: string;
  color: string;
  createdAt: number;
  done: boolean;
}

export type TabKey = 'habit' | 'journal' | 'ideas' | 'more';

export type ThemePreference = 'light' | 'dark' | null;

export interface AppStats {
  streak: number;
  days: number;
  habits: number;
}
