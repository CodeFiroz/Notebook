'use client';

import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  FireIcon,
  Moon02Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import { Card, SectionLabel } from './MotionPrimitives';
import { SPRING_SNAPPY } from '@/lib/constants';
import type { AppStats, ThemePreference } from '@/lib/types';

interface MoreTabProps {
  theme: ThemePreference;
  stats: AppStats;
  onPickTheme: (theme: ThemePreference) => void;
  onManageHabits: () => void;
}

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: null, label: 'System' },
];

export function MoreTab({
  theme,
  stats,
  onPickTheme,
  onManageHabits,
}: MoreTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 items-start"
    >
      <Card index={0}>
        <SectionLabel icon={theme === 'dark' ? Moon02Icon : Sun03Icon}>
          Appearance
        </SectionLabel>
        <div
          className="grid grid-cols-3 mt-3.5 p-1.5 rounded-[16px]"
          style={{ background: 'var(--card2)' }}
          role="radiogroup"
          aria-label="Theme preference"
        >
          {THEME_OPTIONS.map((opt) => {
            const active = (theme ?? null) === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onPickTheme(opt.value)}
                className="relative py-2.5 text-[14px] font-semibold rounded-[12px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              >
                {active && (
                  <motion.span
                    layoutId="theme-pill"
                    className="absolute inset-0 rounded-[12px]"
                    style={{ background: 'var(--card)', boxShadow: 'var(--sh)' }}
                    transition={SPRING_SNAPPY}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card index={1}>
          <SectionLabel icon={FireIcon}>Streak</SectionLabel>
          <p className="text-[32px] font-bold mt-2.5 tabular-nums leading-none">
            {stats.streak}{' '}
            <span
              className="text-[14px] font-medium"
              style={{ color: 'var(--mute)' }}
            >
              {stats.streak === 1 ? 'day' : 'days'}
            </span>
          </p>
        </Card>

        <Card index={1}>
          <SectionLabel icon={Calendar03Icon}>Days logged</SectionLabel>
          <p className="text-[32px] font-bold mt-2.5 tabular-nums leading-none">
            {stats.days}
          </p>
        </Card>
      </div>

      <Card index={2} className="md:col-span-2 p-0 overflow-hidden">
        <button
          type="button"
          onClick={onManageHabits}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer transition-colors hover:bg-[var(--card2)]/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--acc)]"
        >
          <span className="inline-flex items-center gap-3 text-[16px] font-medium">
            <span
              className="w-9 h-9 rounded-xl grid place-items-center"
              style={{ background: 'var(--card2)', color: 'var(--acc)' }}
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={2} />
            </span>
            <span>Manage habits</span>
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[14px] font-medium tabular-nums"
            style={{ color: 'var(--mute)' }}
          >
            <span>
              {stats.habits} {stats.habits === 1 ? 'habit' : 'habits'}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.2} />
          </span>
        </button>
      </Card>

      <p
        className="md:col-span-2 text-center text-[12px] mt-1"
        style={{ color: 'var(--mute)' }}
      >
        Everything is saved on this device only.
      </p>
    </motion.div>
  );
}
