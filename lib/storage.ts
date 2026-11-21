import { DEFAULT_HABITS } from './constants';
import type { DayMap, Habit, IdeaItem, ThemePreference } from './types';

const KEYS = {
  entries: 'hd4',
  habits: 'hd4h',
  ideas: 'hd4i',
  theme: 'hd-theme',
} as const;

interface LegacyHabit {
  id: string;
  e?: string;
  l?: string;
  c?: string;
  emoji?: string;
  label?: string;
  color?: string;
}

interface LegacyIdea {
  id: string;
  t?: string;
  c?: string;
  at?: number;
  text?: string;
  color?: string;
  createdAt?: number;
  done?: boolean;
}

export function loadEntries(): DayMap {
  try {
    const raw = localStorage.getItem(KEYS.entries);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as DayMap) : {};
  } catch {
    return {};
  }
}

export function saveEntries(entries: DayMap): boolean {
  try {
    localStorage.setItem(KEYS.entries, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEYS.habits);
    if (!raw) return DEFAULT_HABITS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_HABITS;
    return parsed
      .map((item: LegacyHabit): Habit | null => {
        if (!item || typeof item.id !== 'string') return null;
        return {
          id: item.id,
          emoji: item.emoji ?? item.e ?? '✨',
          label: item.label ?? item.l ?? 'Habit',
          color: item.color ?? item.c ?? '#ff7eb6',
        };
      })
      .filter((h): h is Habit => h !== null);
  } catch {
    return DEFAULT_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(KEYS.habits, JSON.stringify(habits));
  } catch {
    // Ignore quota errors on habit list
  }
}

export function loadIdeas(): IdeaItem[] {
  try {
    const raw = localStorage.getItem(KEYS.ideas);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item: LegacyIdea): IdeaItem | null => {
        if (!item || typeof item.id !== 'string') return null;
        return {
          id: item.id,
          text: item.text ?? item.t ?? '',
          color: item.color ?? item.c ?? '#fbe98a',
          createdAt: item.createdAt ?? item.at ?? Date.now(),
          done: Boolean(item.done),
        };
      })
      .filter((i): i is IdeaItem => i !== null && i.text.length > 0);
  } catch {
    return [];
  }
}

export function saveIdeas(ideas: IdeaItem[]): void {
  try {
    localStorage.setItem(KEYS.ideas, JSON.stringify(ideas));
  } catch {
    // Ignore storage error
  }
}

export function loadTheme(): ThemePreference {
  try {
    const val = localStorage.getItem(KEYS.theme);
    if (val === 'light' || val === 'dark') return val;
    return null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: ThemePreference): void {
  try {
    if (theme) {
      localStorage.setItem(KEYS.theme, theme);
    } else {
      localStorage.removeItem(KEYS.theme);
    }
  } catch {
    // Ignore storage error
  }
}

// React 19 useSyncExternalStore-compatible client store (SSR-safe, cached snapshots)
export interface TrackerSnapshot {
  entries: DayMap;
  habits: Habit[];
  ideas: IdeaItem[];
  theme: ThemePreference;
  storageWarning: boolean;
}

const SERVER_SNAPSHOT: TrackerSnapshot = {
  entries: {},
  habits: DEFAULT_HABITS,
  ideas: [],
  theme: null,
  storageWarning: false,
};

let clientSnapshot: TrackerSnapshot | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function initClientSnapshot(): TrackerSnapshot {
  if (!clientSnapshot) {
    clientSnapshot = {
      entries: loadEntries(),
      habits: loadHabits(),
      ideas: loadIdeas(),
      theme: loadTheme(),
      storageWarning: false,
    };
  }
  return clientSnapshot;
}

export const trackerStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    const onStorage = () => {
      clientSnapshot = {
        entries: loadEntries(),
        habits: loadHabits(),
        ideas: loadIdeas(),
        theme: loadTheme(),
        storageWarning: false,
      };
      emitChange();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },

  getSnapshot(): TrackerSnapshot {
    return initClientSnapshot();
  },

  getServerSnapshot(): TrackerSnapshot {
    return SERVER_SNAPSHOT;
  },

  setEntries(updater: (prev: DayMap) => DayMap) {
    const curr = initClientSnapshot();
    const nextEntries = updater(curr.entries);
    const ok = saveEntries(nextEntries);
    clientSnapshot = {
      ...curr,
      entries: nextEntries,
      storageWarning: !ok,
    };
    emitChange();
  },

  setHabits(updater: (prev: Habit[]) => Habit[]) {
    const curr = initClientSnapshot();
    const nextHabits = updater(curr.habits);
    saveHabits(nextHabits);
    clientSnapshot = {
      ...curr,
      habits: nextHabits,
    };
    emitChange();
  },

  setIdeas(updater: (prev: IdeaItem[]) => IdeaItem[]) {
    const curr = initClientSnapshot();
    const nextIdeas = updater(curr.ideas);
    saveIdeas(nextIdeas);
    clientSnapshot = {
      ...curr,
      ideas: nextIdeas,
    };
    emitChange();
  },

  setTheme(nextTheme: ThemePreference) {
    const curr = initClientSnapshot();
    saveTheme(nextTheme);
    clientSnapshot = {
      ...curr,
      theme: nextTheme,
    };
    emitChange();
  },
};

export function shrinkImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.74));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
