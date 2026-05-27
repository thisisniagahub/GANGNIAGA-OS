'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className,
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        'inline-block font-medium',
        !disabled && 'animate-shiny',
        className
      )}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
