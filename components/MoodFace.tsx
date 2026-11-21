'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { getMoodById } from '@/lib/tracker';
import { SPRING_BOUNCY } from '@/lib/constants';
import type { MoodId } from '@/lib/types';

interface MoodFaceProps {
  moodId: MoodId | number | null | undefined;
  size?: number;
  selected?: boolean;
  priority?: boolean;
  className?: string;
}

export function MoodFace({
  moodId,
  size = 44,
  selected = false,
  priority = false,
  className = '',
}: MoodFaceProps) {
  const mood = getMoodById(moodId);

  if (!mood) {
    return (
      <span
        aria-hidden="true"
        className={`relative inline-flex items-center justify-center rounded-[30%] select-none transition-colors ${className}`}
        style={{
          width: size,
          height: size,
          background: 'var(--line)',
        }}
      >
        <span className="flex items-center gap-[18%]" style={{ width: '48%' }}>
          <span
            className="block rounded-full flex-1 aspect-square"
            style={{ background: 'var(--mute)', opacity: 0.45 }}
          />
          <span
            className="block rounded-full flex-1 aspect-square"
            style={{ background: 'var(--mute)', opacity: 0.45 }}
          />
        </span>
      </span>
    );
  }

  return (
    <motion.span
      className={`relative inline-block shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        scale: selected ? 1.06 : 1,
      }}
      transition={SPRING_BOUNCY}
    >
      <Image
        src={mood.src}
        alt={mood.name}
        width={size}
        height={size}
        sizes={`${Math.max(size, 64)}px`}
        priority={priority}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(20,20,20,0.08)] pointer-events-none"
      />
    </motion.span>
  );
}
