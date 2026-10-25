import React from 'react';
import { Language, Theme, UserProgress } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { Sun, Moon, Volume2, VolumeX, Settings, Sparkles, Map } from 'lucide-react';

interface HeaderProps {
  currentStation: 'map' | 'learn' | 'practice' | 'games' | 'cases' | 'test' | 'certificate';
  onNavigate: (station: 'map' | 'learn' | 'practice' | 'games' | 'cases' | 'test' | 'certificate') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onOpenSettings: () => void;
  progress: UserProgress;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onNavigate,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  soundEnabled,
  onSoundToggle,
  onOpenSettings,
  progress,
}) => {
  const t = getT(language);

  const navLinks = [
    { id: 'map' as const, label: t.nav.map },
    { id: 'learn' as const, label: t.nav.learn },
    { id: 'practice' as const, label: t.nav.practice },
    { id: 'games' as const, label: t.nav.games },
    { id: 'cases' as const, label: t.nav.cases },
    { id: 'test' as const, label: t.nav.test },
    { id: 'certificate' as const, label: t.nav.certificate },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title & Mascot icon */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigate('map');
          }}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🦉
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {t.app_title}
            </span>
            {progress.profile.name && (
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[140px]">
                {progress.profile.name} ({progress.profile.className || '5-A'})
              </span>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (single line, desktop scrollable/wrap-free) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((item) => {
            const isActive = currentStation === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onNavigate(item.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Controls (Stars, Language switcher, Dark mode, Sound, Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Stars Counter */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-xs font-extrabold shadow-sm tabular-nums">
            <span className="text-amber-500">⭐</span>
            <span>{progress.stars}</span>
          </div>

          {/* Language Switcher Dropdown/Segmented */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onLanguageChange('uz')}
              title="O'zbek tili"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'uz'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ru')}
              title="Русский язык"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'ru'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              title="English language"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              EN
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onThemeToggle}
            title={theme === 'dark' ? "Yorug' rejim" : "Tungi rejim"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onSoundToggle}
            title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Settings / Teacher Mode */}
          <button
            type="button"
            onClick={onOpenSettings}
            title={t.settings.title}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Station Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850">
        {navLinks.map((item) => {
          const isActive = currentStation === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                onNavigate(item.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
