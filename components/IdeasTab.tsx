'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Idea01Icon,
  PlusSignIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { Card } from './MotionPrimitives';
import { IDEA_COLORS, SPRING_BOUNCY } from '@/lib/constants';
import type { IdeaItem } from '@/lib/types';

interface IdeasTabProps {
  items: IdeaItem[];
  onAddIdea: (text: string, color: string) => void;
  onToggleIdea: (id: string) => void;
  onDeleteIdea: (id: string) => void;
}

export function IdeasTab({
  items,
  onAddIdea,
  onToggleIdea,
  onDeleteIdea,
}: IdeasTabProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    const cleaned = draft.trim();
    if (!cleaned) return;
    const color = IDEA_COLORS[items.length % IDEA_COLORS.length];
    onAddIdea(cleaned, color);
    setDraft('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-4 mt-5"
    >
      <Card index={0} className="p-2 sm:p-2.5">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span
            className="w-10 h-10 rounded-full grid place-items-center shrink-0"
            style={{ color: 'var(--mute)' }}
            aria-hidden="true"
          >
            <HugeiconsIcon icon={Idea01Icon} size={20} strokeWidth={2} />
          </span>
          <input
            value={draft}
            onChange={(ev) => setDraft(ev.target.value)}
            placeholder="Jot down an idea…"
            aria-label="New idea"
            className="flex-1 h-11 px-1 text-[16px] bg-transparent outline-none min-w-0 placeholder:opacity-55"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.94 }}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-1.5 h-11 px-5 text-[14px] font-semibold rounded-full whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed transition-opacity"
            style={{
              background: 'var(--ink)',
              color: 'var(--card)',
              opacity: draft.trim() ? 1 : 0.35,
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={15} strokeWidth={2.4} />
            <span>Add</span>
          </motion.button>
        </form>
      </Card>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={SPRING_BOUNCY}
                className="flex items-start gap-3 rounded-[20px] p-4 shadow-sm"
                style={{ background: item.color, color: '#2a2410' }}
              >
                <button
                  type="button"
                  onClick={() => onToggleIdea(item.id)}
                  aria-label={`Mark "${item.text}" as ${item.done ? 'not done' : 'done'}`}
                  aria-pressed={item.done}
                  className="mt-0.5 shrink-0 w-7 h-7 grid place-items-center rounded-full cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2410]"
                  style={{
                    border: '2px solid #2a2410',
                    background: item.done ? '#2a2410' : 'transparent',
                    color: '#fff',
                  }}
                >
                  {item.done && (
                    <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={3.2} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-[16px] font-medium leading-snug break-words transition-opacity"
                    style={{
                      textDecoration: item.done ? 'line-through' : 'none',
                      opacity: item.done ? 0.52 : 1,
                    }}
                  >
                    {item.text}
                  </p>
                  <p
                    className="text-[11px] font-medium mt-1.5 tabular-nums"
                    style={{ opacity: 0.58 }}
                  >
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteIdea(item.id)}
                  aria-label={`Delete idea "${item.text}"`}
                  className="w-8 h-8 -mt-1 -mr-1 rounded-full grid place-items-center cursor-pointer transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#2a2410]"
                  style={{ opacity: 0.55 }}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2.3} />
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div
          className="rounded-[24px] border border-dashed py-14 px-6 text-center"
          style={{ borderColor: 'var(--line)', color: 'var(--mute)' }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ background: 'var(--card2)' }}>
            <HugeiconsIcon icon={Idea01Icon} size={22} strokeWidth={1.8} />
          </div>
          <p className="text-[15px] font-medium">No ideas yet. Anything goes.</p>
          <p className="text-[13px] mt-1 opacity-80">
            Capture fleeting thoughts, sparks, or reminders above.
          </p>
        </div>
      )}
    </motion.div>
  );
}
