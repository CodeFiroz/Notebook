'use client';

import { motion } from 'motion/react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  FireIcon,
  GridViewIcon,
  Idea01Icon,
  Moon02Icon,
  Notebook01Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons';
import { RoundButton } from './MotionPrimitives';
import { SPRING_SNAPPY, TABS } from '@/lib/constants';
import type { TabKey } from '@/lib/types';

const TAB_ICONS: Record<TabKey, IconSvgElement> = {
  habit: CheckmarkCircle02Icon,
  journal: Notebook01Icon,
  ideas: Idea01Icon,
  more: GridViewIcon,
};

interface DesktopHeaderProps {
  tab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  streak: number;
  isDark: boolean;
  onFlipTheme: () => void;
}

export function DesktopHeader({
  tab,
  onSelectTab,
  streak,
  isDark,
  onFlipTheme,
}: DesktopHeaderProps) {
  return (
    <header
      className="hidden md:block sticky top-0 z-30 border-b border-[var(--line)] backdrop-blur-md"
      style={{ background: 'color-mix(in srgb, var(--bg) 86%, transparent)' }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('habit')}
          className="text-[17px] font-bold tracking-tight whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--acc)] rounded-md"
        >
          How I remember today
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav aria-label="Primary navigation" className="flex items-center gap-1.5">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onSelectTab(t.key)}
                aria-current={active ? 'page' : undefined}
                className="relative inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium rounded-full whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{ color: active ? 'var(--ink)' : 'var(--mute)' }}
              >
                {active && (
                  <motion.span
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 rounded-full border border-[var(--line)]"
                    style={{ background: 'var(--card)', boxShadow: 'var(--sh)' }}
                    transition={SPRING_SNAPPY}
                  />
                )}
                <span className="relative z-10 flex">
                  <HugeiconsIcon
                    icon={TAB_ICONS[t.key]}
                    size={17}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </span>
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Streak + Theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 text-[14px] font-bold tabular-nums"
            aria-label={`${streak} day streak`}
          >
            <HugeiconsIcon
              icon={FireIcon}
              size={18}
              strokeWidth={2.2}
              color="var(--acc)"
            />
            <span>{streak}</span>
          </span>
          <RoundButton
            size={38}
            onClick={onFlipTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <HugeiconsIcon
              icon={isDark ? Sun03Icon : Moon02Icon}
              size={17}
              strokeWidth={2}
            />
          </RoundButton>
        </div>
      </div>
    </header>
  );
}

interface MobileTopRowProps {
  dateLabel: string;
  streak: number;
  isDark: boolean;
  onFlipTheme: () => void;
}

export function MobileTopRow({
  dateLabel,
  streak,
  isDark,
  onFlipTheme,
}: MobileTopRowProps) {
  return (
    <div className="flex md:hidden items-center justify-between gap-2">
      <span
        className="text-[14px] font-medium truncate"
        style={{ color: 'var(--mute)' }}
      >
        {dateLabel}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <div
          className="inline-flex items-center gap-1.5 px-3 h-10 rounded-full text-[14px] font-bold border border-[var(--line)] tabular-nums"
          style={{ background: 'var(--card)', boxShadow: 'var(--sh)' }}
          aria-label={`${streak} day streak`}
        >
          <HugeiconsIcon
            icon={FireIcon}
            size={16}
            strokeWidth={2.2}
            color="var(--acc)"
          />
          <span>{streak}</span>
        </div>

        <RoundButton
          size={40}
          onClick={onFlipTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <HugeiconsIcon
            icon={isDark ? Sun03Icon : Moon02Icon}
            size={18}
            strokeWidth={2}
          />
        </RoundButton>
      </div>
    </div>
  );
}

interface MobileBottomNavProps {
  tab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export function MobileBottomNav({ tab, onSelectTab }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] px-4 pt-3 pointer-events-none"
      style={{
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(transparent, var(--bg) 55%)',
      }}
    >
      <div
        className="pointer-events-auto flex items-center justify-around p-1.5 rounded-full border border-white/10"
        style={{
          background: '#0d0d0d',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <motion.button
              key={t.key}
              type="button"
              layout
              transition={SPRING_SNAPPY}
              onClick={() => onSelectTab(t.key)}
              aria-label={t.label}
              aria-current={active ? 'page' : undefined}
              className="relative flex items-center justify-center gap-2 h-11 min-w-[44px] rounded-full text-white cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
              style={{
                padding: active ? '0 16px 0 13px' : '0 12px',
              }}
            >
              {active && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: '#2b2b2b' }}
                  transition={SPRING_SNAPPY}
                />
              )}
              <span
                className="relative z-10 flex"
                style={{ opacity: active ? 1 : 0.78 }}
              >
                <HugeiconsIcon
                  icon={TAB_ICONS[t.key]}
                  size={20}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </span>
              {active && (
                <motion.span
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="relative z-10 text-[13px] font-medium"
                >
                  {t.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
