'use client';

import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { MoodFace } from './MoodFace';
import { RoundButton } from './MotionPrimitives';
import { SPRING_SNAPPY } from '@/lib/constants';
import { formatWeekRange, toYmd } from '@/lib/tracker';
import type { DayMap } from '@/lib/types';

interface WeekStripProps {
  week: Date[];
  selectedDate: Date;
  today: Date;
  entries: DayMap;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onJumpToday: () => void;
}

export function WeekStrip({
  week,
  selectedDate,
  today,
  entries,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onJumpToday,
}: WeekStripProps) {
  const selectedKey = toYmd(selectedDate);
  const todayKey = toYmd(today);
  const isToday = selectedKey === todayKey;
  const rangeLabel = formatWeekRange(week);

  return (
    <section aria-label="Week calendar" className="mt-5">
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <span className="text-[14px] font-semibold tracking-tight tabular-nums">
          {rangeLabel}
        </span>
        <div className="flex items-center gap-2">
          {!isToday && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onJumpToday}
              className="h-9 px-3.5 text-[12px] font-semibold rounded-full whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              style={{ background: 'var(--ink)', color: 'var(--card)' }}
            >
              Today
            </motion.button>
          )}
          <RoundButton
            size={36}
            onClick={onPrevWeek}
            aria-label="Previous week"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.3} />
          </RoundButton>
          <RoundButton
            size={36}
            onClick={onNextWeek}
            aria-label="Next week"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.3} />
          </RoundButton>
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-[22px] border border-[var(--line)]"
        style={{ background: 'var(--card)', boxShadow: 'var(--sh)' }}
      >
        {week.map((day) => {
          const key = toYmd(day);
          const isSelected = key === selectedKey;
          const isDayToday = key === todayKey;
          const dayMood = entries[key]?.mood ?? null;
          const weekdayLabel = day.toLocaleDateString('en-IN', {
            weekday: 'short',
          });
          const fullLabel = day.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          });

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_SNAPPY}
              onClick={() => onSelectDate(day)}
              aria-label={fullLabel}
              aria-pressed={isSelected}
              className="relative flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-[16px] min-h-[82px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
            >
              {isSelected && (
                <motion.div
                  layoutId="wk-pill"
                  className="absolute inset-0 rounded-[16px]"
                  style={{ background: 'var(--card2)' }}
                  transition={SPRING_SNAPPY}
                />
              )}
              <span className="relative z-10">
                <MoodFace moodId={dayMood} size={36} selected={isSelected && dayMood != null} />
              </span>
              <span
                className="relative z-10 text-[11px] font-medium leading-none mt-0.5"
                style={{ color: 'var(--mute)' }}
              >
                {weekdayLabel}
              </span>
              <span
                className="relative z-10 text-[15px] font-bold leading-none tabular-nums"
                style={{ color: isDayToday ? 'var(--acc)' : 'var(--ink)' }}
              >
                {day.getDate()}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
