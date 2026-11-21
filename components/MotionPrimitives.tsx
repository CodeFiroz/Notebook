'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { SPRING_SNAPPY } from '@/lib/constants';

interface CardProps {
  index?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ index = 0, children, className = '', style }: CardProps) {
  return (
    <motion.section
      className={`rounded-[24px] p-4 sm:p-5 border border-[var(--line)] ${className}`}
      style={{
        background: 'var(--card)',
        boxShadow: 'var(--sh)',
        ...style,
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.03 + index * 0.045,
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.section>
  );
}

interface RoundButtonProps extends HTMLMotionProps<'button'> {
  size?: number;
  children: ReactNode;
}

export function RoundButton({
  size = 40,
  children,
  className = '',
  style,
  type = 'button',
  ...rest
}: RoundButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_SNAPPY}
      className={`grid place-items-center rounded-full shrink-0 border border-[var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)] cursor-pointer ${className}`}
      style={{
        width: size,
        height: size,
        background: 'var(--card)',
        boxShadow: 'var(--sh)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

interface SectionLabelProps {
  icon?: IconSvgElement;
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ icon, children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] uppercase ${className}`}
      style={{ color: 'var(--mute)' }}
    >
      {icon && <HugeiconsIcon icon={icon} size={15} strokeWidth={2} />}
      <span>{children}</span>
    </span>
  );
}

interface ProgressRingProps {
  pct: number;
  done: number;
  total: number;
}

export function ProgressRing({ pct, done, total }: ProgressRingProps) {
  const safePct = Math.max(0, Math.min(1, pct));

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: 40, height: 40 }}
      role="progressbar"
      aria-label="Daily log completion"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <svg
        viewBox="0 0 36 36"
        width="40"
        height="40"
        className="-rotate-90 block"
      >
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--line)"
          strokeWidth="4"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--acc)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={false}
          animate={{
            pathLength: safePct,
            opacity: safePct > 0 ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[12px] font-bold tabular-nums">
        {done}
      </span>
    </div>
  );
}
