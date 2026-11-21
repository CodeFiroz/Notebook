import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays,
  calculateStats,
  calculateStreak,
  clipLastGrapheme,
  countDailyCompletion,
  formatTime12,
  getMoodById,
  getNextHabitColor,
  getStepsProgressPct,
  getWeekDays,
  hasDayActivity,
  sanitizeScreenTime,
  sanitizeSteps,
  stepScreenTime,
  toYmd,
} from './tracker';
import { DEFAULT_HABITS, HABIT_COLORS } from './constants';
import type { DayMap } from './types';

test('date formatting and week calculation always start on Monday', () => {
  // 2026-11-20 is a Friday
  const friday = new Date(2026, 10, 20, 12, 0, 0);
  assert.equal(toYmd(friday), '2026-11-20');

  const week = getWeekDays(friday);
  assert.equal(week.length, 7);
  assert.equal(week[0].getDay(), 1); // Monday
  assert.equal(toYmd(week[0]), '2026-11-16');
  assert.equal(toYmd(week[6]), '2026-11-22');

  // Sunday should still belong to the same Monday-Sunday week
  const sunday = new Date(2026, 10, 22, 12, 0, 0);
  assert.equal(toYmd(getWeekDays(sunday)[0]), '2026-11-16');
});

test('hasDayActivity detects mood, metrics, trimmed notes, and habits', () => {
  assert.equal(hasDayActivity(undefined), false);
  assert.equal(hasDayActivity({}), false);
  assert.equal(hasDayActivity({ note: '   ' }), false);
  assert.equal(hasDayActivity({ mood: 0 }), true);
  assert.equal(hasDayActivity({ note: 'Quiet evening walk' }), true);
  assert.equal(hasDayActivity({ skin: true }), true);
  assert.equal(hasDayActivity({ steps: '4500' }), true);
});

test('calculateStreak counts consecutive active days ending today or yesterday', () => {
  const today = new Date(2026, 10, 20, 12, 0, 0);
  const d0 = toYmd(today);
  const d1 = toYmd(addDays(today, -1));
  const d2 = toYmd(addDays(today, -2));
  const d4 = toYmd(addDays(today, -4));

  const mapActiveToday: DayMap = {
    [d0]: { mood: 1 },
    [d1]: { skin: true },
    [d2]: { steps: '8000' },
    [d4]: { mood: 0 },
  };
  assert.equal(calculateStreak(mapActiveToday, today), 3);

  // If today is not yet logged, yesterday's streak still counts
  const mapActiveYesterday: DayMap = {
    [d1]: { wake: '07:00' },
    [d2]: { bed: '23:00' },
  };
  assert.equal(calculateStreak(mapActiveYesterday, today), 2);

  // Gap of 2 days breaks streak
  const mapBroken: DayMap = {
    [d2]: { mood: 2 },
  };
  assert.equal(calculateStreak(mapBroken, today), 0);
});

test('countDailyCompletion calculates done count, total, and progress ratio', () => {
  const result = countDailyCompletion(
    { mood: 0, wake: '07:00', steps: '5000', skin: true, work: true },
    DEFAULT_HABITS
  );
  assert.equal(result.habitsDone, 2);
  assert.equal(result.done, 5);
  assert.equal(result.total, 12);
  assert.equal(Number(result.pct.toFixed(4)), Number((5 / 12).toFixed(4)));
});

test('screen time stepping and numeric input sanitization', () => {
  assert.equal(stepScreenTime('', 0.5), '0.5');
  assert.equal(stepScreenTime('1.5', 0.5), '2');
  assert.equal(stepScreenTime('0.5', -1), '0');
  assert.equal(sanitizeSteps('12a34b5678'), '123456');
  assert.equal(sanitizeScreenTime('3.5.9abc'), '3.59');
  assert.equal(getStepsProgressPct('5000'), 50);
  assert.equal(getStepsProgressPct('15000'), 100);
});

test('mood lookup, time formatting, grapheme clipping, stats, and color picking', () => {
  assert.equal(getMoodById(0)?.name, 'Great');
  assert.equal(getMoodById(5)?.name, 'Angry');
  assert.equal(getMoodById(null), null);
  assert.equal(formatTime12('00:05'), '12:05 AM');
  assert.equal(formatTime12('14:30'), '02:30 PM');
  assert.equal(clipLastGrapheme('✨🌿'), '🌿');

  const today = new Date(2026, 10, 20, 12, 0, 0);
  const stats = calculateStats(
    { [toYmd(today)]: { mood: 1 }, '2026-11-10': { steps: '3000' } },
    today,
    DEFAULT_HABITS
  );
  assert.deepEqual(stats, { streak: 1, days: 2, habits: 5 });

  assert.equal(getNextHabitColor(DEFAULT_HABITS), HABIT_COLORS[5]);
});
