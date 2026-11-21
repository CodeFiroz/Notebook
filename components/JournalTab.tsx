'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CameraAdd01Icon,
  Delete02Icon,
  ImageAdd01Icon,
} from '@hugeicons/core-free-icons';
import { Card, SectionLabel } from './MotionPrimitives';
import { SPRING_BOUNCY, SPRING_SMOOTH } from '@/lib/constants';
import { shrinkImageFile } from '@/lib/storage';
import type { DayEntry } from '@/lib/types';

interface JournalTabProps {
  dayKey: string;
  selectedDate: Date;
  isToday: boolean;
  entry: DayEntry;
  storageWarning: boolean;
  onUpdateEntry: (patch: Partial<DayEntry>) => void;
}

export function JournalTab({
  dayKey,
  selectedDate,
  isToday,
  entry,
  storageWarning,
  onUpdateEntry,
}: JournalTabProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [picError, setPicError] = useState<string | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(210, el.scrollHeight)}px`;
  }, [entry.note, dayKey]);

  const handlePickPic = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    try {
      setPicError(null);
      const compressed = await shrinkImageFile(file);
      onUpdateEntry({ pic: compressed });
    } catch {
      setPicError('Could not load that image. Please try another file.');
    }
  };

  return (
    <motion.div
      key={dayKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      {/* Handwritten ruled sticky note */}
      <motion.section
        aria-label="Daily journal note"
        className="relative lg:col-span-7 pt-2"
        initial={{ opacity: 0, y: 16, rotate: -1.6 }}
        animate={{ opacity: 1, y: 0, rotate: -0.5 }}
        transition={SPRING_SMOOTH}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 top-2 rounded-[6px]"
          style={{
            background: '#f4b8cd',
            transform: 'rotate(2deg) translate(5px, 6px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
          }}
        />
        <div
          className="relative rounded-[6px] px-5 sm:px-6 pt-6 pb-5"
          style={{
            background: '#fbe98a',
            color: '#2a2410',
            boxShadow:
              '0 2px 4px rgba(0, 0, 0, 0.08), 0 18px 34px rgba(60, 40, 0, 0.18)',
          }}
        >
          {/* Translucent paper tape strip */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -top-2.5 w-16 h-5 -ml-8"
            style={{
              background: 'rgba(255, 255, 255, 0.56)',
              transform: 'rotate(-2.5deg)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
            }}
          />

          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.1em]"
              style={{ opacity: 0.62 }}
            >
              How I remember {isToday ? 'today' : 'that day'}
            </span>
            <span
              className="text-[12px] font-medium tabular-nums"
              style={{ opacity: 0.58 }}
            >
              {selectedDate.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>

          <textarea
            ref={textareaRef}
            className="ruled-paper w-full bg-transparent outline-none resize-none block pt-[2px]"
            rows={7}
            value={entry.note || ''}
            placeholder="Write a few lines…"
            aria-label="How I remember today note"
            onChange={(ev) => onUpdateEntry({ note: ev.target.value })}
            style={{ minHeight: 210, color: '#2a2410' }}
          />
        </div>
      </motion.section>

      {/* Today's Polaroid photo card */}
      <div className="lg:col-span-5">
        <Card index={1}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <SectionLabel icon={CameraAdd01Icon}>Today pic</SectionLabel>
            {entry.pic && (
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-semibold rounded-full cursor-pointer whitespace-nowrap"
                  style={{ background: 'var(--card2)', color: 'var(--ink)' }}
                >
                  <HugeiconsIcon icon={ImageAdd01Icon} size={13} strokeWidth={2.2} />
                  <span>Replace</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onUpdateEntry({ pic: null })}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-semibold rounded-full cursor-pointer whitespace-nowrap"
                  style={{ background: 'var(--card2)', color: 'var(--acc)' }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={13} strokeWidth={2.2} />
                  <span>Remove</span>
                </motion.button>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePickPic}
            className="hidden"
            aria-label="Upload today's picture"
          />

          <AnimatePresence mode="wait" initial={false}>
            {entry.pic ? (
              <motion.figure
                key="polaroid"
                className="mx-auto my-2 w-[88%] max-w-[300px] bg-white p-3 pb-2 rounded-[4px]"
                style={{
                  boxShadow:
                    '0 2px 5px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(0, 0, 0, 0.2)',
                }}
                initial={{ opacity: 0, y: -28, rotate: -7, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={SPRING_BOUNCY}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.pic}
                  alt={`Memory from ${selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-square object-cover block bg-neutral-200 rounded-[2px]"
                />
                <figcaption className="font-handwriting text-center text-[25px] text-[#2a2a2a] leading-tight pt-3.5 pb-3">
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </figcaption>
              </motion.figure>
            ) : (
              <motion.button
                key="upload"
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileRef.current?.click()}
                className="w-full h-44 flex flex-col items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed cursor-pointer transition-colors hover:border-[var(--acc)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]"
                style={{
                  borderColor: 'var(--line)',
                  color: 'var(--mute)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HugeiconsIcon icon={CameraAdd01Icon} size={28} strokeWidth={1.8} />
                <span className="text-[14px] font-medium">Add today&apos;s pic</span>
              </motion.button>
            )}
          </AnimatePresence>

          {picError && (
            <p className="text-[12px] mt-3 font-medium" style={{ color: 'var(--acc)' }}>
              {picError}
            </p>
          )}
          {storageWarning && (
            <p className="text-[12px] mt-3 font-medium" style={{ color: 'var(--acc)' }}>
              Storage is full, so recent changes may not be saved.
            </p>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
