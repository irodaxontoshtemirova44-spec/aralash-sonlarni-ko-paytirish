import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { getT } from '../i18n';
import { Mascot } from './Mascot';
import { sounds } from '../utils/sound';
import { ArrowRight, UserPlus, Play, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  existingProfile: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStart: (name: string, className: string) => void;
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  existingProfile,
  language,
  onLanguageChange,
  onStart,
  onContinue,
}) => {
  const t = getT(language);
  const [name, setName] = useState<string>(existingProfile.name || '');
  const [className, setClassName] = useState<string>(existingProfile.className || '5-A');
  const [showNewForm, setShowNewForm] = useState<boolean>(!existingProfile.name);
  const [error, setError] = useState<string>('');

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 20) {
      setError(t.welcome.error_name_short);
      sounds.playError();
      return;
    }
    setError('');
    sounds.playSuccess();
    onStart(cleanName, className.trim() || '5-A');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-800/95 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-10 space-y-8 text-center animate-fadeIn">
        {/* Language switcher bar on top of card */}
        <div className="flex justify-center items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-750 rounded-2xl w-fit mx-auto">
          {[
            { id: 'uz' as const, label: "O'zbekcha 🇺🇿" },
            { id: 'ru' as const, label: "Русский 🇷🇺" },
            { id: 'en' as const, label: "English 🇬🇧" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                onLanguageChange(lang.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === lang.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Mascot Centerpiece */}
        <div className="flex flex-col items-center justify-center">
          <Mascot
            language={language}
            mood="happy"
            size="lg"
            speech={t.welcome.greeting}
          />
        </div>

        {/* Titles */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {t.welcome.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.app_subtitle}
          </p>
        </div>

        {/* Existing Profile option */}
        {existingProfile.name && !showNewForm ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="p-4 bg-indigo-50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">
                {language === 'uz' ? "Oxirgi faol o'quvchi:" : language === 'ru' ? "Сохранённый профиль:" : "Saved profile:"}
              </span>
              <div className="text-xl font-black text-indigo-900 dark:text-indigo-200">
                {existingProfile.name}
              </div>
              <div className="text-xs font-bold text-slate-500">
                Sinfi: {existingProfile.className || '5-A'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onContinue();
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.welcome.continue_btn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setName('');
                setShowNewForm(true);
              }}
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.welcome.new_profile}</span>
            </button>
          </div>
        ) : (
          /* Profile Input Form */
          <form onSubmit={handleStartSubmit} className="space-y-4 max-w-sm mx-auto text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.welcome.name_label}
              </label>
              <input
                type="text"
                required
                maxLength={20}
                placeholder={t.welcome.name_placeholder}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.welcome.class_label}
              </label>
              <input
                type="text"
                maxLength={10}
                placeholder={t.welcome.class_placeholder}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-500 text-center animate-shake">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{t.welcome.start_btn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {existingProfile.name && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowNewForm(false);
                }}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-center"
              >
                ← {t.welcome.continue_btn} ({existingProfile.name})
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
