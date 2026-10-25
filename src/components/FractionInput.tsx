import React, { useState, useRef } from 'react';
import { Delete, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { sounds } from '../utils/sound';

interface FractionInputProps {
  value: { whole?: number; num: number; den: number };
  onChange: (val: { whole?: number; num: number; den: number }) => void;
  showKeypad?: boolean;
  disabled?: boolean;
  allowWhole?: boolean;
  className?: string;
}

type ActiveField = 'whole' | 'num' | 'den';

export const FractionInput: React.FC<FractionInputProps> = ({
  value,
  onChange,
  showKeypad = true,
  disabled = false,
  allowWhole = true,
  className = '',
}) => {
  const [activeField, setActiveField] = useState<ActiveField>(allowWhole ? 'whole' : 'num');
  const [keypadOpen, setKeypadOpen] = useState(false);

  const wholeRef = useRef<HTMLInputElement>(null);
  const numRef = useRef<HTMLInputElement>(null);
  const denRef = useRef<HTMLInputElement>(null);

  const handleDigit = (digit: number) => {
    sounds.playClick();
    if (disabled) return;

    if (activeField === 'whole') {
      const cur = value.whole ? value.whole.toString() : '';
      const next = cur.length < 3 ? parseInt(cur + digit, 10) : value.whole;
      onChange({ ...value, whole: next });
    } else if (activeField === 'num') {
      const cur = value.num ? value.num.toString() : '';
      const next = cur.length < 3 ? parseInt(cur + digit, 10) : value.num;
      onChange({ ...value, num: next || 0 });
    } else if (activeField === 'den') {
      const cur = value.den ? value.den.toString() : '';
      const next = cur.length < 3 ? parseInt(cur + digit, 10) : value.den;
      onChange({ ...value, den: next || 1 });
    }
  };

  const handleBackspace = () => {
    sounds.playClick();
    if (disabled) return;

    if (activeField === 'whole') {
      const cur = value.whole ? value.whole.toString() : '';
      const next = cur.slice(0, -1);
      onChange({ ...value, whole: next ? parseInt(next, 10) : undefined });
    } else if (activeField === 'num') {
      const cur = value.num ? value.num.toString() : '';
      const next = cur.slice(0, -1);
      onChange({ ...value, num: next ? parseInt(next, 10) : 0 });
    } else if (activeField === 'den') {
      const cur = value.den ? value.den.toString() : '';
      const next = cur.slice(0, -1);
      onChange({ ...value, den: next ? parseInt(next, 10) : 1 });
    }
  };

  const handleClear = () => {
    sounds.playClick();
    if (disabled) return;
    onChange({ whole: undefined, num: 0, den: 1 });
  };

  const nextField = () => {
    sounds.playClick();
    if (activeField === 'whole') setActiveField('num');
    else if (activeField === 'num') setActiveField('den');
    else if (activeField === 'den' && allowWhole) setActiveField('whole');
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Visual input container */}
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/90 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 shadow-sm">
        {/* Whole Part Input */}
        {allowWhole && (
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
              Butun / Целая
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setActiveField('whole');
                setKeypadOpen(true);
                sounds.playClick();
              }}
              className={`w-14 h-16 rounded-xl text-3xl font-bold flex items-center justify-center transition-all ${
                activeField === 'whole'
                  ? 'bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-md ring-2 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              {value.whole !== undefined && value.whole > 0 ? value.whole : (
                <span className="text-slate-300 dark:text-slate-600 text-xl font-normal">—</span>
              )}
            </button>
          </div>
        )}

        {/* Fraction Part (Stacked: Numerator over Denominator) */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
            Kasr / Дробь
          </span>
          <div className="flex flex-col items-center gap-1.5 p-1 bg-indigo-50/50 dark:bg-slate-750 rounded-xl">
            {/* Numerator */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setActiveField('num');
                setKeypadOpen(true);
                sounds.playClick();
              }}
              className={`w-14 h-11 rounded-lg text-xl font-bold flex items-center justify-center transition-all ${
                activeField === 'num'
                  ? 'bg-indigo-100 text-indigo-900 border-2 border-indigo-500 shadow-md ring-2 ring-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              {value.num > 0 ? value.num : (
                <span className="text-slate-300 dark:text-slate-600 text-sm">surat</span>
              )}
            </button>

            {/* Fraction line */}
            <div className="w-14 h-[3px] bg-slate-400 dark:bg-slate-500 rounded-full" />

            {/* Denominator */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setActiveField('den');
                setKeypadOpen(true);
                sounds.playClick();
              }}
              className={`w-14 h-11 rounded-lg text-xl font-bold flex items-center justify-center transition-all ${
                activeField === 'den'
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              {value.den > 0 && value.den !== 1 ? value.den : (
                <span className="text-slate-300 dark:text-slate-600 text-sm">
                  {value.den === 1 ? '1' : 'maxraj'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Clear quick button */}
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            title="Tozalash / Очистить"
            className="p-2 ml-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Numeric Touch Keypad for smartboards, phones and tablets */}
      {showKeypad && (
        <div className="mt-3 w-full max-w-xs p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeField === 'whole'
                ? "Butun qismini kiriting"
                : activeField === 'num'
                ? "Suratni kiriting"
                : "Maxrajni kiriting"}
            </span>
            <button
              type="button"
              onClick={nextField}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              Keyingisi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={disabled}
                onClick={() => handleDigit(digit)}
                className="h-12 rounded-xl bg-white dark:bg-slate-700 font-bold text-xl text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600 active:scale-95 active:bg-indigo-50 dark:active:bg-indigo-900 transition-transform"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              className="h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-200 dark:border-rose-900 active:scale-95"
            >
              C
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleDigit(0)}
              className="h-12 rounded-xl bg-white dark:bg-slate-700 font-bold text-xl text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600 active:scale-95 active:bg-indigo-50 dark:active:bg-indigo-900 transition-transform"
            >
              0
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center border border-amber-200 dark:border-amber-900 active:scale-95"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
