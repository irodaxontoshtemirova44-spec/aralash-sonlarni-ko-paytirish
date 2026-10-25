import React, { useState } from 'react';
import { UserProgress, Language, Theme, FontSize } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { questionBank } from '../data/questionBank';
import { X, Lock, Key, Check, Volume2, VolumeX, Eye, RotateCcw, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  language,
  onResetProgress,
}) => {
  const t = getT(language);
  const [pin, setPin] = useState<string>('');
  const [isTeacherVerified, setIsTeacherVerified] = useState<boolean>(progress.teacherUnlocked);
  const [pinError, setPinError] = useState<boolean>(false);
  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyPin = () => {
    sounds.playClick();
    if (pin === '1234') {
      sounds.playSuccess();
      setIsTeacherVerified(true);
      setPinError(false);
    } else {
      sounds.playError();
      setPinError(true);
    }
  };

  const handleToggleUnlockAll = () => {
    sounds.playClick();
    const updated: UserProgress = {
      ...progress,
      teacherUnlocked: !progress.teacherUnlocked,
      unlockedStations: {
        learn: true,
        practice: true,
        games: true,
        cases: true,
        test: true,
        certificate: true,
      },
    };
    onUpdateProgress(updated);
  };

  const handleToggleSound = () => {
    const next = !progress.profile.soundEnabled;
    sounds.setMuted(!next);
    sounds.playClick();
    onUpdateProgress({
      ...progress,
      profile: {
        ...progress.profile,
        soundEnabled: next,
      },
    });
  };

  const handleToggleFontSize = (size: FontSize) => {
    sounds.playClick();
    onUpdateProgress({
      ...progress,
      profile: {
        ...progress.profile,
        fontSize: size,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t.settings.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Settings */}
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-750 rounded-2xl">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {progress.profile.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <span>{t.settings.sound_label}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                progress.profile.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  progress.profile.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-750 rounded-2xl">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.settings.font_size}
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={() => handleToggleFontSize('normal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  progress.profile.fontSize === 'normal'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.settings.font_normal}
              </button>
              <button
                type="button"
                onClick={() => handleToggleFontSize('large')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  progress.profile.fontSize === 'large'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.settings.font_large}
              </button>
            </div>
          </div>
        </div>

        {/* Teacher Mode Section */}
        <div className="p-5 bg-amber-50/70 dark:bg-slate-750 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>{t.settings.teacher_section}</span>
          </div>

          {!isTeacherVerified ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.settings.pin_label}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-mono font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Tasdiqlash
                </button>
              </div>
              {pinError && (
                <span className="text-xs font-bold text-rose-600 block">
                  {t.settings.pin_error}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-amber-200 dark:border-slate-600">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> O'qituvchi rejimi faol
              </span>

              {/* Unlock all button */}
              <button
                type="button"
                onClick={handleToggleUnlockAll}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                {progress.teacherUnlocked
                  ? "Barcha bekatlar ochildi ✓"
                  : t.settings.unlock_all_stations}
              </button>

              {/* View answer keys */}
              <button
                type="button"
                onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showAnswerKeys ? "Javoblar kalitini yopish" : "Test javoblar kalitini ko'rish (60 ta)"}</span>
              </button>

              {/* Reset student progress */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t.settings.reset_confirm)) {
                    onResetProgress();
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.settings.reset_progress}</span>
              </button>
            </div>
          )}
        </div>

        {/* Answer keys modal view */}
        {showAnswerKeys && (
          <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 max-h-60 overflow-y-auto text-xs font-mono">
            <h5 className="font-bold text-slate-700 dark:text-slate-300 uppercase">
              Barcha 60 ta savol kalitlari:
            </h5>
            {questionBank.map((q, idx) => (
              <div key={q.id} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  #{idx + 1} ({q.topic}):
                </span>{' '}
                {q.prompt[language]} ⟹{' '}
                <strong className="text-emerald-600">
                  {q.correctAnswer.whole ? `${q.correctAnswer.whole} ` : ''}
                  {q.correctAnswer.num}/{q.correctAnswer.den}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
