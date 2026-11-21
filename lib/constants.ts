import type { Habit, MoodOption, TabKey } from './types';

export const JOURNAL_PROMPT =
  'Pause for a few seconds to notice what you are doing, saying, or seeing instead of running on autopilot.';

export const MOODS: readonly MoodOption[] = [
  {
    id: 0,
    name: 'Great',
    color: '#f4c430',
    bgTint: 'rgba(244, 196, 48, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081706_0000_6110dc18.png',
  },
  {
    id: 1,
    name: 'Good',
    color: '#3ec6a0',
    bgTint: 'rgba(62, 198, 160, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081706_0001_b0f4f76d.png',
  },
  {
    id: 2,
    name: 'Okay',
    color: '#6bb8f7',
    bgTint: 'rgba(107, 184, 247, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081707_0002_10a4f31c.png',
  },
  {
    id: 3,
    name: 'Stressed',
    color: '#b695f8',
    bgTint: 'rgba(182, 149, 248, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081707_0005_2307cbf7.png',
  },
  {
    id: 4,
    name: 'Sad',
    color: '#f58ca0',
    bgTint: 'rgba(245, 140, 160, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081707_0004_3a899bf0.png',
  },
  {
    id: 5,
    name: 'Angry',
    color: '#7d78eb',
    bgTint: 'rgba(125, 120, 235, 0.18)',
    src: '/assets/aistudio/mood-icon_20261121_081707_0003_39c7b623.png',
  },
] as const;

export const HABIT_COLORS = [
  '#ff7eb6',
  '#5fcf86',
  '#ff8a5c',
  '#62c8f2',
  '#b79bff',
  '#ffc83d',
  '#38d6b5',
  '#f06a6a',
  '#c6d84a',
  '#7f95ff',
] as const;

export const QUICK_EMOJIS = [
  '🧴',
  '📿',
  '🥯',
  '♟️',
  '🧑🏻‍💻',
  '💧',
  '📖',
  '🏃🏻',
  '🧘🏻',
  '💊',
  '🥗',
  '🛌🏻',
  '🎧',
  '✍🏻',
  '🌿',
] as const;

export const DEFAULT_HABITS: Habit[] = [
  { id: 'skin', emoji: '🧴', label: 'Skin care', color: HABIT_COLORS[0] },
  { id: 'allah', emoji: '📿', label: 'Remember Allah', color: HABIT_COLORS[1] },
  { id: 'junk', emoji: '🥯', label: 'No Junk Food', color: HABIT_COLORS[2] },
  { id: 'chess', emoji: '♟️', label: 'Chess Game', color: HABIT_COLORS[3] },
  { id: 'work', emoji: '🧑🏻‍💻', label: 'Work', color: HABIT_COLORS[4] },
];

export const IDEA_COLORS = [
  '#fbe98a',
  '#ffc2d6',
  '#bfe3f5',
  '#c9ecb8',
  '#e1d2ff',
] as const;

export const TABS: readonly { key: TabKey; label: string }[] = [
  { key: 'habit', label: 'Habit' },
  { key: 'journal', label: 'Journal' },
  { key: 'ideas', label: 'Ideas' },
  { key: 'more', label: 'More' },
] as const;

export const STEP_GOAL = 10000;

export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.85,
};

export const SPRING_BOUNCY = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 22,
};

export const SPRING_SMOOTH = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
};
