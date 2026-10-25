import React from 'react';

interface FractionDisplayProps {
  whole?: number;
  num?: number;
  den?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  highlight?: 'whole' | 'num' | 'den' | 'all' | 'none';
  showZeroWhole?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  whole,
  num,
  den,
  size = 'md',
  className = '',
  highlight = 'none',
  showZeroWhole = false,
}) => {
  // If whole number only
  const hasWhole = whole !== undefined && (whole !== 0 || showZeroWhole);
  const hasFraction = num !== undefined && den !== undefined && den !== 0 && (num !== 0 || !hasWhole);

  const sizeClasses = {
    sm: {
      whole: 'text-lg',
      fraction: 'text-xs',
      bar: 'h-[1.5px]',
      gap: 'gap-0.5',
      pad: 'px-0.5',
    },
    md: {
      whole: 'text-2xl',
      fraction: 'text-sm font-semibold',
      bar: 'h-[2px]',
      gap: 'gap-1',
      pad: 'px-1',
    },
    lg: {
      whole: 'text-4xl font-bold',
      fraction: 'text-lg font-bold',
      bar: 'h-[2.5px]',
      gap: 'gap-1.5',
      pad: 'px-1.5',
    },
    xl: {
      whole: 'text-5xl font-extrabold',
      fraction: 'text-2xl font-bold',
      bar: 'h-[3px]',
      gap: 'gap-2',
      pad: 'px-2',
    },
    '2xl': {
      whole: 'text-6xl font-black',
      fraction: 'text-3xl font-extrabold',
      bar: 'h-[3.5px]',
      gap: 'gap-2.5',
      pad: 'px-2.5',
    },
  }[size];

  // Pure integer case
  if (hasWhole && (!num || num === 0)) {
    return (
      <span
        className={`inline-flex items-center font-bold tabular-nums ${sizeClasses.whole} ${
          highlight === 'whole' || highlight === 'all'
            ? 'text-amber-500 underline decoration-amber-400 decoration-wavy'
            : ''
        } ${className}`}
        aria-label={`${whole}`}
      >
        {whole}
      </span>
    );
  }

  // Pure zero case
  if (!hasWhole && (!hasFraction || num === 0)) {
    return (
      <span className={`inline-flex items-center font-bold tabular-nums ${sizeClasses.whole} ${className}`}>
        0
      </span>
    );
  }

  const ariaLabel = hasWhole
    ? `${whole} and ${num} over ${den}`
    : `${num} over ${den}`;

  return (
    <span
      className={`inline-flex items-center align-middle font-sans tabular-nums select-none ${sizeClasses.gap} ${className}`}
      aria-label={ariaLabel}
    >
      {hasWhole && (
        <span
          className={`font-bold leading-none ${sizeClasses.whole} ${
            highlight === 'whole' || highlight === 'all' ? 'text-amber-500 font-extrabold' : ''
          }`}
        >
          {whole}
        </span>
      )}

      {hasFraction && (
        <span className={`inline-flex flex-col items-center justify-center leading-none ${sizeClasses.pad}`}>
          <span
            className={`${sizeClasses.fraction} text-center py-0.5 ${
              highlight === 'num' || highlight === 'all' ? 'text-indigo-600 dark:text-indigo-400 font-black' : ''
            }`}
          >
            {num}
          </span>
          <span
            className={`w-full ${sizeClasses.bar} bg-current rounded-full opacity-85 my-0.5 min-w-[14px]`}
          />
          <span
            className={`${sizeClasses.fraction} text-center py-0.5 ${
              highlight === 'den' || highlight === 'all' ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''
            }`}
          >
            {den}
          </span>
        </span>
      )}
    </span>
  );
};
