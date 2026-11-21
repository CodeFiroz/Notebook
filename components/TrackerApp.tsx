'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { JOURNAL_PROMPT } from '@/lib/constants';
import { trackerStore } from '@/lib/storage';
import {
  addDays,
  calculateStats,
  countDailyCompletion,
  getNextHabitColor,
  getWeekDays,
  normalizeNoon,
  toYmd,
} from '@/lib/tracker';
import type {
  DayEntry,
  HabitDraft,
  TabKey,
  ThemePreference,
} from '@/lib/types';
import { DesktopHeader, MobileBottomNav, MobileTopRow } from './Navigation';
import { WeekStrip } from './WeekStrip';
import { ProgressRing } from './MotionPrimitives';
import { HabitTab } from './HabitTab';
import { JournalTab } from './JournalTab';
import { IdeasTab } from './IdeasTab';
import { MoreTab } from './MoreTab';
import { HabitSheet } from './HabitSheet';

function subscribeSystemDark(callback: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSystemDarkSnapshot(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSystemDarkServerSnapshot(): boolean {
  return false;
}

export function TrackerApp() {
  const [today] = useState<Date>(() => normalizeNoon(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    normalizeNoon(new Date())
  );

  const { entries, habits, ideas, theme, storageWarning } = useSyncExternalStore(
    trackerStore.subscribe,
    trackerStore.getSnapshot,
    trackerStore.getServerSnapshot
  );

  const sysDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDarkSnapshot,
    getSystemDarkServerSnapshot
  );

  const [tab, setTab] = useState<TabKey>('habit');
  const [editingHabits, setEditingHabits] = useState(false);
  const [sheetHabit, setSheetHabit] = useState<HabitDraft | null>(null);

  const isDark = theme ? theme === 'dark' : sysDark;

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }
    root.classList.toggle('dark', isDark);
  }, [theme, isDark]);

  const handleFlipTheme = () => {
    const next: ThemePreference = isDark ? 'light' : 'dark';
    trackerStore.setTheme(next);
  };

  const handlePickTheme = (next: ThemePreference) => {
    trackerStore.setTheme(next);
  };

  const dayKey = toYmd(selectedDate);
  const todayKey = toYmd(today);
  const isToday = dayKey === todayKey;

  const currentEntry: DayEntry = useMemo(
    () => entries[dayKey] ?? {},
    [entries, dayKey]
  );

  const handleUpdateEntry = (patch: Partial<DayEntry>) => {
    trackerStore.setEntries((prev) => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] ?? {}), ...patch },
    }));
  };

  const completion = useMemo(
    () => countDailyCompletion(currentEntry, habits),
    [currentEntry, habits]
  );

  const stats = useMemo(
    () => calculateStats(entries, today, habits),
    [entries, today, habits]
  );

  const week = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const handleOpenNewHabit = () => {
    setSheetHabit({
      id: null,
      emoji: '✨',
      label: '',
      color: getNextHabitColor(habits),
    });
  };

  const handleSaveHabit = (draft: HabitDraft) => {
    trackerStore.setHabits((prev) =>
      draft.id
        ? prev.map((h) =>
            h.id === draft.id
              ? {
                  id: draft.id,
                  emoji: draft.emoji,
                  label: draft.label,
                  color: draft.color,
                }
              : h
          )
        : [
            ...prev,
            {
              id: `h${Date.now()}`,
              emoji: draft.emoji,
              label: draft.label,
              color: draft.color,
            },
          ]
    );
    setSheetHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    trackerStore.setHabits((prev) => prev.filter((h) => h.id !== id));
    setSheetHabit(null);
  };

  const handleAddIdea = (text: string, color: string) => {
    trackerStore.setIdeas((prev) => [
      {
        id: `i${Date.now()}`,
        text,
        color,
        createdAt: Date.now(),
        done: false,
      },
      ...prev,
    ]);
  };

  const handleToggleIdea = (id: string) => {
    trackerStore.setIdeas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDeleteIdea = (id: string) => {
    trackerStore.setIdeas((prev) => prev.filter((item) => item.id !== id));
  };

  const dateLabel = selectedDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const pageTitle =
    tab === 'journal'
      ? `How I remember ${isToday ? 'today' : 'that day'}`
      : tab === 'habit'
        ? 'Daily habits'
        : tab === 'ideas'
          ? 'Ideas'
          : 'More';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh flex flex-col">
        <DesktopHeader
          tab={tab}
          onSelectTab={(nextTab) => {
            setTab(nextTab);
            if (nextTab !== 'habit') setEditingHabits(false);
          }}
          streak={stats.streak}
          isDark={isDark}
          onFlipTheme={handleFlipTheme}
        />

        <main
          className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex-1"
          style={{
            paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))',
            paddingBottom: 'calc(104px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <MobileTopRow
            dateLabel={dateLabel}
            streak={stats.streak}
            isDark={isDark}
            onFlipTheme={handleFlipTheme}
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mt-4 md:mt-2">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="hidden md:block text-[13px] font-medium mb-1"
                style={{ color: 'var(--mute)' }}
              >
                {dateLabel}
              </p>
              <h1 className="text-[32px] sm:text-[38px] leading-[1.06] font-bold tracking-tight text-balance">
                {pageTitle}
              </h1>
              {tab === 'journal' && (
                <p
                  className="text-[14px] sm:text-[15px] leading-snug mt-2 max-w-xl"
                  style={{ color: 'var(--mute)' }}
                >
                  {JOURNAL_PROMPT}
                </p>
              )}
            </motion.div>
          </div>

          {(tab === 'habit' || tab === 'journal') && (
            <>
              <WeekStrip
                week={week}
                selectedDate={selectedDate}
                today={today}
                entries={entries}
                onSelectDate={setSelectedDate}
                onPrevWeek={() => setSelectedDate((d) => addDays(d, -7))}
                onNextWeek={() => setSelectedDate((d) => addDays(d, 7))}
                onJumpToday={() => setSelectedDate(today)}
              />

              <div className="flex items-center gap-3 mt-6 mb-3.5">
                <h2 className="text-[20px] font-bold tracking-tight">Daily log</h2>
                <ProgressRing
                  pct={completion.pct}
                  done={completion.done}
                  total={completion.total}
                />
                <span
                  className="text-[13px] font-medium tabular-nums"
                  style={{ color: 'var(--mute)' }}
                >
                  {completion.done} of {completion.total} logged
                </span>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {tab === 'habit' && (
              <HabitTab
                key="tab-habit"
                dayKey={dayKey}
                entry={currentEntry}
                habits={habits}
                editing={editingHabits}
                onToggleEditing={() => setEditingHabits((v) => !v)}
                onUpdateEntry={handleUpdateEntry}
                onNewHabit={handleOpenNewHabit}
                onEditHabit={(h) => setSheetHabit({ ...h })}
              />
            )}

            {tab === 'journal' && (
              <JournalTab
                key="tab-journal"
                dayKey={dayKey}
                selectedDate={selectedDate}
                isToday={isToday}
                entry={currentEntry}
                storageWarning={storageWarning}
                onUpdateEntry={handleUpdateEntry}
              />
            )}

            {tab === 'ideas' && (
              <IdeasTab
                key="tab-ideas"
                items={ideas}
                onAddIdea={handleAddIdea}
                onToggleIdea={handleToggleIdea}
                onDeleteIdea={handleDeleteIdea}
              />
            )}

            {tab === 'more' && (
              <MoreTab
                key="tab-more"
                theme={theme}
                stats={stats}
                onPickTheme={handlePickTheme}
                onManageHabits={() => {
                  setTab('habit');
                  setEditingHabits(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {sheetHabit && (
            <HabitSheet
              key={sheetHabit.id ?? 'new-habit'}
              habit={sheetHabit}
              onSave={handleSaveHabit}
              onDelete={handleDeleteHabit}
              onClose={() => setSheetHabit(null)}
            />
          )}
        </AnimatePresence>

        <MobileBottomNav
          tab={tab}
          onSelectTab={(nextTab) => {
            setTab(nextTab);
            if (nextTab !== 'habit') setEditingHabits(false);
          }}
        />
      </div>
    </MotionConfig>
  );
}
