import React from 'react';
import { MascotMood, Language } from '../types';

interface MascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  language?: Language;
  onSpeechClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  speech,
  size = 'md',
  className = '',
  language = 'uz',
  onSpeechClick,
}) => {
  const mascotNames: Record<Language, string> = {
    uz: 'Kasrboy',
    ru: 'Дробик',
    en: 'Fracty',
  };

  const name = mascotNames[language] || 'Kasrboy';

  const sizeDimensions = {
    sm: { width: 70, height: 75, text: 'text-xs' },
    md: { width: 100, height: 110, text: 'text-sm' },
    lg: { width: 140, height: 155, text: 'text-base' },
  }[size];

  // Dynamic eye / beak variations based on mood
  const getEyeExpression = () => {
    switch (mood) {
      case 'cheering':
      case 'happy':
        return (
          <>
            {/* Happy arched curved eyes */}
            <path d="M35 48 Q42 40 49 48" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M57 48 Q64 40 71 48" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Rosy cheeks */}
            <ellipse cx="33" cy="56" rx="5" ry="3" fill="#FB7185" opacity="0.6" />
            <ellipse cx="73" cy="56" rx="5" ry="3" fill="#FB7185" opacity="0.6" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* One eye wide, one squinting */}
            <circle cx="42" cy="46" r="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="44" cy="43" r="3.5" fill="#1E293B" />
            <circle cx="45" cy="42" r="1.2" fill="#FFFFFF" />
            
            <path d="M58 48 Q65 42 72 46" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case 'explaining':
      case 'proud':
        return (
          <>
            {/* Sparkly confident eyes */}
            <circle cx="41" cy="46" r="8.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="42" cy="46" r="4.5" fill="#1E293B" />
            <circle cx="40" cy="44" r="1.5" fill="#FFFFFF" />

            <circle cx="65" cy="46" r="8.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="64" cy="46" r="4.5" fill="#1E293B" />
            <circle cx="62" cy="44" r="1.5" fill="#FFFFFF" />
            {/* Glasses rim for scholastic look */}
            <circle cx="41" cy="46" r="10.5" fill="none" stroke="#D97706" strokeWidth="2" />
            <circle cx="65" cy="46" r="10.5" fill="none" stroke="#D97706" strokeWidth="2" />
            <line x1="51.5" y1="46" x2="54.5" y2="46" stroke="#D97706" strokeWidth="2" />
          </>
        );
      case 'confused':
        return (
          <>
            <circle cx="40" cy="47" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="40" cy="47" r="3" fill="#1E293B" />
            <circle cx="66" cy="45" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="66" cy="44" r="4" fill="#1E293B" />
          </>
        );
      default:
        return (
          <>
            <circle cx="41" cy="47" r="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="42" cy="47" r="4" fill="#1E293B" />
            <circle cx="40" cy="45" r="1.5" fill="#FFFFFF" />

            <circle cx="65" cy="47" r="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="64" cy="47" r="4" fill="#1E293B" />
            <circle cx="62" cy="45" r="1.5" fill="#FFFFFF" />
          </>
        );
    }
  };

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Animated SVG Owl */}
      <div className="relative group shrink-0">
        <svg
          width={sizeDimensions.width}
          height={sizeDimensions.height}
          viewBox="0 0 106 115"
          className="filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        >
          {/* Owl Body */}
          <ellipse cx="53" cy="65" rx="34" ry="36" fill="#3B82F6" />
          {/* Belly Feather Pattern */}
          <ellipse cx="53" cy="72" rx="22" ry="24" fill="#EFF6FF" />
          {/* Little feather tufts on belly */}
          <path d="M47 66 Q53 71 59 66" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M44 75 Q53 80 62 75" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M48 83 Q53 87 58 83" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Left Wing */}
          {mood === 'cheering' ? (
            <path
              d="M20 55 C10 40 5 25 15 28 C25 32 25 50 22 62 Z"
              fill="#2563EB"
              className="animate-pulse"
            />
          ) : (
            <path d="M22 55 C14 62 14 78 22 86 C27 80 28 65 22 55 Z" fill="#2563EB" />
          )}

          {/* Right Wing */}
          {mood === 'cheering' ? (
            <path
              d="M86 55 C96 40 101 25 91 28 C81 32 81 50 84 62 Z"
              fill="#2563EB"
              className="animate-pulse"
            />
          ) : (
            <path d="M84 55 C92 62 92 78 84 86 C79 80 78 65 84 55 Z" fill="#2563EB" />
          )}

          {/* Cute Feathery Ears */}
          <polygon points="30,35 24,18 40,28" fill="#1D4ED8" />
          <polygon points="76,35 82,18 66,28" fill="#1D4ED8" />

          {/* Eyes layer */}
          {getEyeExpression()}

          {/* Golden Beak */}
          <polygon points="53,53 47,60 59,60" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />

          {/* Orange Talons */}
          <ellipse cx="43" cy="100" rx="6" ry="3.5" fill="#F59E0B" />
          <ellipse cx="63" cy="100" rx="6" ry="3.5" fill="#F59E0B" />

          {/* Graduation Cap (Scholar Owl) */}
          <polygon points="53,8 86,20 53,30 20,20" fill="#1E293B" />
          <rect x="42" y="25" width="22" height="7" rx="3" fill="#0F172A" />
          {/* Cap Tassel */}
          <path d="M53 18 Q75 18 78 36" stroke="#F59E0B" strokeWidth="2" fill="none" />
          <circle cx="78" cy="37" r="2.5" fill="#F59E0B" />
          <circle cx="53" cy="19" r="2.5" fill="#F59E0B" />
        </svg>

        {/* Mascot badge name pill */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm whitespace-nowrap">
          {name}
        </div>
      </div>

      {/* Comic Speech Bubble */}
      {speech && (
        <div
          onClick={onSpeechClick}
          className={`relative max-w-sm p-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-md border-2 border-indigo-200 dark:border-indigo-900 ${
            sizeDimensions.text
          } ${onSpeechClick ? 'cursor-pointer hover:border-indigo-400 transition-colors' : ''}`}
        >
          {/* Arrow pointing to mascot */}
          <div className="absolute -left-2.5 top-5 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-indigo-200 dark:border-r-indigo-900" />
          <div className="absolute -left-2 top-5 w-0 h-0 border-y-7 border-y-transparent border-r-7 border-r-white dark:border-r-slate-800" />
          <p className="font-medium leading-relaxed">{speech}</p>
        </div>
      )}
    </div>
  );
};
