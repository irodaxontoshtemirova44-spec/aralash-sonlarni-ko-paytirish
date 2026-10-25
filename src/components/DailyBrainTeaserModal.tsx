import React, { useState } from 'react';
import { UserProgress, Language } from '../types';
import { getT } from '../i18n';
import { FractionInput } from './FractionInput';
import { sounds } from '../utils/sound';
import { fireSuccessConfetti } from '../utils/confetti';
import { X, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';

interface DailyBrainTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
}

export const DailyBrainTeaserModal: React.FC<DailyBrainTeaserModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  language,
}) => {
  const t = getT(language);
  const todayKey = new Date().toISOString().slice(0, 10);
  const alreadySolved = progress.dailySolved.includes(todayKey);

  // Today's riddle:
  // "Men bir sonman. Meni 4 ga ko'paytirib, 2 ⅓ ga qo'shsangiz, 10 ⅓ hosil bo'ladi. Men qaysi sonman?"
  // 4x + 7/3 = 31/3 => 4x = 24/3 = 8 => x = 2
  // Or simpler 5th grade riddle:
  // "Qovunning ⅖ qismi 4 kg kelsa, butun qovun necha kg bo'ladi?" (or multiplication: 2 1/2 kg oshqovoqning 3 tasi necha kg?)
  // Let's use:
  // "Bir qutida 1 ½ kg pashmak bor. Agar shunday 6 ta quti pashmak xarid qilinsa, jami necha kg bo'ladi?"
  // Answer: 1 1/2 * 6 = 9 kg
  const [answer, setAnswer] = useState<{ whole?: number; num: number; den: number }>({
    whole: undefined,
    num: 0,
    den: 1,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheck = () => {
    sounds.playClick();
    const val = (answer.whole || 0) + ((answer.num || 0) / (answer.den || 1));
    if (Math.abs(val - 9) < 0.001) {
      sounds.playCelebration();
      fireSuccessConfetti();
      setFeedback("Tabriklaymiz! Kun boshqotirmasi to'g'ri yechildi va +5 ⭐ berildi!");
      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 5,
        dailySolved: [...progress.dailySolved, todayKey],
      };
      onUpdateProgress(updated);
    } else {
      sounds.playError();
      setFeedback("Javob noto'g'ri. Qayta hisoblab ko'ring: 1 ½ × 6 = ?");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-base">
            <Lightbulb className="w-5 h-5 fill-amber-500" />
            <span>{t.daily.title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-3">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
            Bugungi topishmoq:
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {language === 'uz' && "Bir qutida 1 ½ kg shirin pashmak bor. Agar bayram dasturxoni uchun shunday 6 ta quti pashmak xarid qilinsa, umumiy og'irlik necha kilogramm bo'ladi?"}
            {language === 'ru' && "В одной коробке 1 ½ кг сладостей. Если к празднику купить 6 таких коробок, сколько всего килограммов сладостей получится?"}
            {language === 'en' && "A box contains 1 ½ kg of traditional sweets. If 6 such boxes are bought for a celebration, what is the total weight in kilograms?"}
          </p>
        </div>

        {alreadySolved ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              {t.daily.completed_today}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <FractionInput
              value={answer}
              onChange={setAnswer}
              allowWhole={true}
              showKeypad={false}
            />

            <button
              type="button"
              onClick={handleCheck}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {t.daily.solve_btn}
            </button>
          </div>
        )}

        {feedback && (
          <div className="p-3 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-center">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};
