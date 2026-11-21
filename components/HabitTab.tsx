'use client';

import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlarmClockIcon,
  CheckmarkCircle02Icon,
  FootprintsIcon,
  HappyIcon,
  MinusSignIcon,
  PencilEdit02Icon,
  PlusSignIcon,
  SleepingIcon,
  SmartPhone01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { Card, SectionLabel } from './MotionPrimitives';
import { MoodFace } from './MoodFace';
import {
  MOODS,
  SPRING_BOUNCY,
  SPRING_SNAPPY,
  STEP_GOAL,
} from '@/lib/constants';
import {
  getMoodById,
  getStepsProgressPct,
  sanitizeScreenTime,
  sanitizeSteps,
  stepScreenTime,
} from '@/lib/tracker';
import type { DayEntry, Habit, MoodId } from '@/lib/types';

interface HabitTabProps {
  dayKey: string;
  entry: DayEntry;
  habits: Habit[];
  editing: boolean;
  onToggleEditing: () => void;
  onUpdateEntry: (patch: Partial<DayEntry>) => void;
  onNewHabit: () => void;
  onEditHabit: (habit: Habit) => void;
}

export function HabitTab({
  dayKey,
  entry,
  habits,
  editing,
  onToggleEditing,
  onUpdateEntry,
  onNewHabit,
  onEditHabit,
}: HabitTabProps) {
  const activeMood = getMoodById(entry.mood);
  const completedHabits = habits.filter((h) => Boolean(entry[h.id])).length;
  const stepsPct = getStepsProgressPct(entry.steps);

  return (
    <motion.div
      key={dayKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
    >
      {/* Left primary column: Mood & Habits */}
      <div className="lg:col-span-7 grid gap-4">
        <Card index={0}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <SectionLabel icon={HappyIcon}>Mood</SectionLabel>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeMood ? activeMood.name : 'empty'}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.16 }}
                className="text-[13px] font-semibold"
                style={{ color: activeMood ? 'var(--ink)' : 'var(--mute)' }}
              >
                {activeMood ? activeMood.name : 'Pick one'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div
            className="grid grid-cols-3 sm:grid-cols-6 gap-2.5"
            role="radiogroup"
            aria-label="Mood selector"
          >
            {MOODS.map((mood) => {
              const isSelected = entry.mood === mood.id;
              const isDimmed = entry.mood != null && !isSelected;

              return (
                <motion.button
                  key={mood.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={mood.name}
                  whileHover={{ y: -3, scale: 1.04 }}
                  whileTap={{ scale: 0.92 }}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                    opacity: isDimmed ? 0.44 : 1,
                  }}
                  transition={SPRING_BOUNCY}
                  onClick={() =>
                    onUpdateEntry({
                      mood: isSelected ? null : (mood.id as MoodId),
                    })
                  }
                  className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-[18px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                  style={{
                    background: isSelected ? mood.bgTint : 'transparent',
                    boxShadow: isSelected
                      ? `inset 0 0 0 1.5px ${mood.color}`
                      : 'none',
                  }}
                >
                  <MoodFace
                    moodId={mood.id}
                    size={54}
                    selected={isSelected}
                    priority
                  />
                  <span
                    className="text-[12px] font-medium leading-none"
                    style={{
                      color: isSelected ? 'var(--ink)' : 'var(--mute)',
                    }}
                  >
                    {mood.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Card>

        <Card index={1} className="pt-4 pb-2">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <SectionLabel icon={CheckmarkCircle02Icon}>Habits</SectionLabel>
              <span className="text-[13px] font-semibold tabular-nums">
                {completedHabits}/{habits.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={onNewHabit}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[12px] font-semibold rounded-full whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{ background: 'var(--card2)', color: 'var(--ink)' }}
              >
                <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2.4} />
                <span>Add</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={onToggleEditing}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[12px] font-semibold rounded-full whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{
                  background: editing ? 'var(--ink)' : 'var(--card2)',
                  color: editing ? 'var(--card)' : 'var(--ink)',
                }}
              >
                {!editing && (
                  <HugeiconsIcon icon={PencilEdit02Icon} size={13} strokeWidth={2.2} />
                )}
                <span>{editing ? 'Done' : 'Edit'}</span>
              </motion.button>
            </div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            <AnimatePresence initial={false}>
              {habits.map((habit) => {
                const checked = Boolean(entry[habit.id]);
                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={SPRING_SNAPPY}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        editing
                          ? onEditHabit(habit)
                          : onUpdateEntry({ [habit.id]: !checked })
                      }
                      aria-label={
                        editing
                          ? `Edit habit ${habit.label}`
                          : `${habit.label}, ${checked ? 'completed' : 'not completed'}`
                      }
                      aria-pressed={!editing ? checked : undefined}
                      className="w-full flex items-center gap-3.5 py-3.5 px-2 -mx-2 min-h-[56px] text-left cursor-pointer group hover:bg-[var(--card2)]/45 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--acc)] rounded-2xl"
                    >
                      <span
                        className="text-[22px] w-9 h-9 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ background: 'var(--card2)' }}
                        aria-hidden="true"
                      >
                        {habit.emoji}
                      </span>

                      <span className="flex-1 text-[16px] font-medium truncate">
                        {habit.label}
                      </span>

                      {editing ? (
                        <span
                          className="inline-flex items-center gap-2.5 shrink-0"
                          style={{ color: 'var(--mute)' }}
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ background: habit.color }}
                          />
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={16}
                            strokeWidth={2}
                          />
                        </span>
                      ) : (
                        <span
                          className="relative grid place-items-center rounded-full shrink-0"
                          style={{
                            width: 30,
                            height: 30,
                            border: `2px solid ${habit.color}aa`,
                          }}
                        >
                          <motion.span
                            className="absolute rounded-full"
                            style={{ inset: -2, background: habit.color }}
                            initial={false}
                            animate={{
                              scale: checked ? 1 : 0,
                              opacity: checked ? 1 : 0,
                            }}
                            transition={SPRING_BOUNCY}
                          />
                          <motion.span
                            className="relative z-10 text-[#141414]"
                            initial={false}
                            animate={{
                              scale: checked ? 1 : 0.4,
                              opacity: checked ? 1 : 0,
                            }}
                            transition={SPRING_BOUNCY}
                          >
                            <HugeiconsIcon
                              icon={Tick02Icon}
                              size={16}
                              strokeWidth={3}
                            />
                          </motion.span>
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {habits.length === 0 && (
              <p
                className="text-[14px] py-6 text-center"
                style={{ color: 'var(--mute)' }}
              >
                No habits yet. Tap Add to create one.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Right secondary column: Sleep, Steps, Screen Time */}
      <div className="lg:col-span-5 grid gap-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card index={2}>
            <SectionLabel icon={AlarmClockIcon}>Wake up</SectionLabel>
            <input
              type="time"
              value={entry.wake || ''}
              onChange={(ev) => onUpdateEntry({ wake: ev.target.value })}
              aria-label="Wake up time"
              className="w-full text-[19px] sm:text-[24px] font-bold mt-2.5 bg-transparent outline-none tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-[var(--acc)] rounded-lg"
              style={{ color: entry.wake ? 'var(--ink)' : 'var(--mute)' }}
            />
          </Card>

          <Card index={2}>
            <SectionLabel icon={SleepingIcon}>Bed time</SectionLabel>
            <input
              type="time"
              value={entry.bed || ''}
              onChange={(ev) => onUpdateEntry({ bed: ev.target.value })}
              aria-label="Bed time"
              className="w-full text-[19px] sm:text-[24px] font-bold mt-2.5 bg-transparent outline-none tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-[var(--acc)] rounded-lg"
              style={{ color: entry.bed ? 'var(--ink)' : 'var(--mute)' }}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <Card index={3}>
            <div className="flex items-center justify-between gap-2">
              <SectionLabel icon={FootprintsIcon}>Steps</SectionLabel>
              <span
                className="text-[12px] font-medium tabular-nums"
                style={{ color: 'var(--mute)' }}
              >
                {Math.round(stepsPct)}% of {(STEP_GOAL / 1000).toFixed(0)}k
              </span>
            </div>
            <input
              inputMode="numeric"
              placeholder="0"
              value={entry.steps || ''}
              onChange={(ev) =>
                onUpdateEntry({ steps: sanitizeSteps(ev.target.value) })
              }
              aria-label="Steps"
              className="w-full text-[30px] font-bold mt-2 bg-transparent outline-none tabular-nums placeholder:opacity-35 focus-visible:ring-2 focus-visible:ring-[var(--acc)] rounded-lg"
            />
            <div
              className="h-2 mt-3 overflow-hidden rounded-full"
              style={{ background: 'var(--card2)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--acc)' }}
                initial={false}
                animate={{ width: `${stepsPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </Card>

          <Card index={4}>
            <SectionLabel icon={SmartPhone01Icon}>Screen time</SectionLabel>
            <div className="flex items-baseline gap-1.5 mt-2">
              <input
                inputMode="decimal"
                placeholder="0"
                value={entry.screen || ''}
                onChange={(ev) =>
                  onUpdateEntry({
                    screen: sanitizeScreenTime(ev.target.value),
                  })
                }
                aria-label="Screen time in hours"
                className="w-24 text-[30px] font-bold bg-transparent outline-none tabular-nums placeholder:opacity-35 focus-visible:ring-2 focus-visible:ring-[var(--acc)] rounded-lg"
              />
              <span
                className="text-[14px] font-medium"
                style={{ color: 'var(--mute)' }}
              >
                hrs
              </span>
            </div>
            <div className="flex gap-2.5 mt-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                transition={SPRING_SNAPPY}
                onClick={() =>
                  onUpdateEntry({
                    screen: stepScreenTime(entry.screen, -0.5),
                  })
                }
                aria-label="Decrease screen time by 0.5 hours"
                className="flex-1 h-10 grid place-items-center rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{ background: 'var(--card2)' }}
              >
                <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={2.4} />
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                transition={SPRING_SNAPPY}
                onClick={() =>
                  onUpdateEntry({
                    screen: stepScreenTime(entry.screen, 0.5),
                  })
                }
                aria-label="Increase screen time by 0.5 hours"
                className="flex-1 h-10 grid place-items-center rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{ background: 'var(--card2)' }}
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2.4} />
              </motion.button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
