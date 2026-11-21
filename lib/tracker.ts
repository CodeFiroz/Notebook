import { HABIT_COLORS, MOODS, STEP_GOAL } from './constants';
import type { AppStats, DayEntry, DayMap, Habit, MoodId, MoodOption } from './types';

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function toYmd(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function normalizeNoon(date: Date): Date {
  const copy = new Date(date.getTime());
  copy.setHours(12, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, delta: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + delta);
  return next;
}

export function getWeekDays(anchor: Date): Date[] {
  const mondayOffset = -((anchor.getDay() + 6) % 7);
  const start = addDays(anchor, mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatWeekRange(week: Date[], locale = 'en-IN'): string {
  if (week.length < 7) return '';
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return `${fmt(week[0])} – ${fmt(week[6])}`;
}

export function formatTime12(time24?: string): string {
  if (!time24 || !time24.includes(':')) return '';
  const [h, m] = time24.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return '';
  return `${pad2(h % 12 || 12)}:${pad2(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

export function clipLastGrapheme(text: string): string {
  if (!text) return '';
  try {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const parts = Array.from(segmenter.segment(text), (s) => s.segment);
      return parts.slice(-1).join('');
    }
  } catch {
    // Fallback below
  }
  return Array.from(text).slice(-2).join('');
}

export function getMoodById(moodId: MoodId | number | null | undefined): MoodOption | null {
  if (moodId == null) return null;
  return MOODS.find((m) => m.id === moodId) ?? null;
}

export function hasDayActivity(entry?: DayEntry | null): boolean {
  if (!entry) return false;
  if (entry.mood != null) return true;
  if (entry.wake || entry.bed || entry.steps || entry.screen || entry.pic) return true;
  if (typeof entry.note === 'string' && entry.note.trim().length > 0) return true;
  return Object.values(entry).some((v) => v === true);
}

export function countDailyCompletion(
  entry: DayEntry | undefined,
  habits: readonly Habit[]
): { done: number; total: number; pct: number; habitsDone: number } {
  const e = entry ?? {};
  const habitsDone = habits.filter((h) => Boolean(e[h.id])).length;
  const coreDone =
    Number(e.mood != null) +
    Number(Boolean(e.wake)) +
    Number(Boolean(e.bed)) +
    Number(Boolean(e.steps)) +
    Number(Boolean(e.screen)) +
    Number(Boolean(typeof e.note === 'string' && e.note.trim())) +
    Number(Boolean(e.pic));
  const done = coreDone + habitsDone;
  const total = 7 + habits.length;
  const pct = total > 0 ? Math.min(1, done / total) : 0;
  return { done, total, pct, habitsDone };
}

export function calculateStreak(entries: DayMap, today: Date): number {
  let streak = 0;
  let cursor = normalizeNoon(today);
  if (!hasDayActivity(entries[toYmd(cursor)])) {
    cursor = addDays(cursor, -1);
  }
  while (hasDayActivity(entries[toYmd(cursor)])) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function calculateStats(
  entries: DayMap,
  today: Date,
  habits: readonly Habit[]
): AppStats {
  const days = Object.keys(entries).filter((k) => hasDayActivity(entries[k])).length;
  return {
    streak: calculateStreak(entries, today),
    days,
    habits: habits.length,
  };
}

export function stepScreenTime(current: string | undefined, delta: number): string {
  const numeric = parseFloat(current || '0');
  const safe = Number.isNaN(numeric) ? 0 : numeric;
  const next = Math.max(0, Number((safe + delta).toFixed(1)));
  return String(next);
}

export function sanitizeSteps(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 6);
}

export function sanitizeScreenTime(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  const normalized =
    parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
  return normalized.slice(0, 4);
}

export function getStepsProgressPct(steps?: string): number {
  const count = Number(steps) || 0;
  return Math.min(100, Math.max(0, (count / STEP_GOAL) * 100));
}

export function getNextHabitColor(habits: readonly Habit[]): string {
  return (
    HABIT_COLORS.find((color) => !habits.some((h) => h.color === color)) ??
    HABIT_COLORS[0]
  );
}
