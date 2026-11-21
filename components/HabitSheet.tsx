'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { HABIT_COLORS, QUICK_EMOJIS, SPRING_SNAPPY } from '@/lib/constants';
import { clipLastGrapheme } from '@/lib/tracker';
import type { HabitDraft } from '@/lib/types';

interface HabitSheetProps {
  habit: HabitDraft;
  onSave: (habit: HabitDraft) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function HabitSheet({
  habit,
  onSave,
  onDelete,
  onClose,
}: HabitSheetProps) {
  const [emoji, setEmoji] = useState(habit.emoji);
  const [label, setLabel] = useState(habit.label);
  const [color, setColor] = useState(habit.color);

  const isValid = label.trim().length > 0 && emoji.trim().length > 0;

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!isValid) return;
    onSave({
      id: habit.id,
      emoji: emoji.trim(),
      label: label.trim(),
      color,
    });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-sheet-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      style={{ background: 'rgba(15, 12, 8, 0.52)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-[460px] p-5 sm:p-6 rounded-t-[28px] md:rounded-[28px] border border-[var(--line)]"
        style={{
          background: 'var(--card)',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
        initial={{ y: 80, opacity: 0.7, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.98 }}
        transition={SPRING_SNAPPY}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div
          className="mx-auto mb-4 md:hidden rounded-full"
          style={{ width: 40, height: 5, background: 'var(--line)' }}
        />

        <div className="flex items-center justify-between mb-4">
          <h2 id="habit-sheet-title" className="text-[22px] font-bold tracking-tight">
            {habit.id ? 'Edit habit' : 'New habit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full grid place-items-center cursor-pointer"
            style={{ background: 'var(--card2)', color: 'var(--mute)' }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <input
            value={emoji}
            onChange={(ev) => setEmoji(clipLastGrapheme(ev.target.value))}
            aria-label="Habit emoji"
            className="text-center text-[28px] shrink-0 rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]"
            style={{ width: 60, height: 60, background: color }}
          />
          <input
            value={label}
            onChange={(ev) => setLabel(ev.target.value.slice(0, 26))}
            placeholder="Habit name"
            aria-label="Habit name"
            autoFocus
            className="flex-1 h-[60px] px-4 text-[17px] font-medium rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)]"
            style={{ background: 'var(--card2)' }}
          />
        </div>

        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_EMOJIS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setEmoji(q)}
              aria-label={`Choose emoji ${q}`}
              className="text-[22px] shrink-0 w-11 h-11 rounded-xl grid place-items-center cursor-pointer transition-colors"
              style={{ background: emoji === q ? 'var(--card2)' : 'transparent' }}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {HABIT_COLORS.map((swatch) => {
            const active = color === swatch;
            return (
              <motion.button
                key={swatch}
                type="button"
                whileTap={{ scale: 0.86 }}
                onClick={() => setColor(swatch)}
                aria-label={`Colour ${swatch}`}
                aria-pressed={active}
                className="w-9 h-9 rounded-full cursor-pointer"
                style={{
                  background: swatch,
                  boxShadow: active
                    ? '0 0 0 3px var(--card), 0 0 0 5px var(--ink)'
                    : 'none',
                }}
              />
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          {habit.id && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onDelete(habit.id!)}
              className="inline-flex items-center justify-center gap-1.5 px-5 h-[52px] text-[15px] font-semibold rounded-full cursor-pointer"
              style={{ background: 'var(--card2)', color: 'var(--acc)' }}
            >
              <HugeiconsIcon icon={Delete02Icon} size={17} strokeWidth={2.2} />
              <span>Delete</span>
            </motion.button>
          )}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={!isValid}
            className="flex-1 h-[52px] text-[16px] font-semibold rounded-full cursor-pointer disabled:cursor-not-allowed transition-opacity"
            style={{
              background: 'var(--ink)',
              color: 'var(--card)',
              opacity: isValid ? 1 : 0.35,
            }}
          >
            {habit.id ? 'Update habit' : 'Add habit'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
