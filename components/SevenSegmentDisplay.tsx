import React from 'react';
import { cn } from '@/lib/utils';

interface SevenSegmentDisplayProps {
  value: string;
  label?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function SevenSegmentDisplay({ 
  value, 
  label, 
  color = 'default',
  size = 'md'
}: SevenSegmentDisplayProps) {
  
  const colorClasses = {
    default: 'text-emerald-400 bg-black border-emerald-900/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]',
    success: 'text-green-400 bg-black border-green-900/30 shadow-[0_0_15px_rgba(74,222,128,0.4)]',
    warning: 'text-amber-400 bg-black border-amber-900/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
    danger: 'text-red-500 bg-black border-red-900/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  };

  const sizeClasses = {
    sm: 'text-xl px-3 py-1',
    md: 'text-4xl px-6 py-3 tracking-[0.15em]',
    lg: 'text-6xl px-8 py-4 tracking-[0.15em]',
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "font-mono font-bold rounded-lg shadow-inner border border-stone-300/10 tracking-widest",
          colorClasses[color],
          sizeClasses[size]
        )}
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {value}
      </div>
      {label && (
        <span className="text-xs uppercase tracking-wider text-stone-500 mt-1 font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
