import React, { useState, useEffect } from 'react';
import { UserProgress, Language, Theme, FontSize } from './types';
import { loadUserProgress, saveUserProgress, DEFAULT_PROGRESS } from './utils/storage';
import { sounds } from './utils/sound';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AdventureMap } from './components/AdventureMap';
import { LessonsView } from './components/LessonsView';
import { PracticeView } from './components/PracticeView';
import { GamesView } from './components/GamesView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { FinalTestView } from './components/FinalTestView';
import { ResultsCertificateView } from './components/ResultsCertificateView';
import { SettingsModal } from './components/SettingsModal';
import { DailyBrainTeaserModal } from './components/DailyBrainTeaserModal';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [hasStarted, setHasStarted] = useState<boolean>(() => !!loadUserProgress().profile.name);
  const [currentStation, setCurrentStation] = useState<
    'map' | 'learn' | 'practice' | 'games' | 'cases' | 'test' | 'certificate'
  >('map');

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [dailyTeaserOpen, setDailyTeaserOpen] = useState<boolean>(false);

  // Sync sound manager with initial profile
  useEffect(() => {
    sounds.setMuted(!progress.profile.soundEnabled);
  }, [progress.profile.soundEnabled]);

  // Sync dark theme class on document element
  useEffect(() => {
    if (progress.profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.profile.theme]);

  // Save progress helper
  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveUserProgress(updated);
  };

  const handleLanguageChange = (lang: Language) => {
    const updated: UserProgress = {
      ...progress,
      profile: {
        ...progress.profile,
        language: lang,
      },
    };
    handleUpdateProgress(updated);
  };

  const handleThemeToggle = () => {
    sounds.playClick();
    const nextTheme: Theme = progress.profile.theme === 'dark' ? 'light' : 'dark';
    const updated: UserProgress = {
      ...progress,
      profile: {
        ...progress.profile,
        theme: nextTheme,
      },
    };
    handleUpdateProgress(updated);
  };

  const handleSoundToggle = () => {
    const nextSound = !progress.profile.soundEnabled;
    sounds.setMuted(!nextSound);
    sounds.playClick();
    const updated: UserProgress = {
      ...progress,
      profile: {
        ...progress.profile,
        soundEnabled: nextSound,
      },
    };
    handleUpdateProgress(updated);
  };

  const handleStartProfile = (name: string, className: string) => {
    const updated: UserProgress = {
      ...progress,
      profile: {
        ...progress.profile,
        name,
        className,
      },
    };
    handleUpdateProgress(updated);
    setHasStarted(true);
    setCurrentStation('map');
  };

  const handleContinueExisting = () => {
    setHasStarted(true);
    setCurrentStation('map');
  };

  const handleResetProgress = () => {
    const reset = { ...DEFAULT_PROGRESS };
    setProgress(reset);
    saveUserProgress(reset);
    setHasStarted(false);
    setCurrentStation('map');
  };

  const isLargeFont = progress.profile.fontSize === 'large';

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#0B1329] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans ${
        isLargeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {!hasStarted ? (
        <WelcomeScreen
          existingProfile={progress.profile}
          language={progress.profile.language}
          onLanguageChange={handleLanguageChange}
          onStart={handleStartProfile}
          onContinue={handleContinueExisting}
        />
      ) : (
        <>
          <Header
            currentStation={currentStation}
            onNavigate={(st) => setCurrentStation(st)}
            language={progress.profile.language}
            onLanguageChange={handleLanguageChange}
            theme={progress.profile.theme}
            onThemeToggle={handleThemeToggle}
            soundEnabled={progress.profile.soundEnabled}
            onSoundToggle={handleSoundToggle}
            onOpenSettings={() => {
              sounds.playClick();
              setSettingsOpen(true);
            }}
            progress={progress}
          />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {currentStation === 'map' && (
              <AdventureMap
                progress={progress}
                language={progress.profile.language}
                onSelectStation={(st) => setCurrentStation(st)}
                onOpenDailyTeaser={() => {
                  sounds.playClick();
                  setDailyTeaserOpen(true);
                }}
              />
            )}

            {currentStation === 'learn' && (
              <LessonsView
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                language={progress.profile.language}
              />
            )}

            {currentStation === 'practice' && (
              <PracticeView
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                language={progress.profile.language}
              />
            )}

            {currentStation === 'games' && (
              <GamesView
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                language={progress.profile.language}
              />
            )}

            {currentStation === 'cases' && (
              <CaseStudiesView
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                language={progress.profile.language}
              />
            )}

            {currentStation === 'test' && (
              <FinalTestView
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                language={progress.profile.language}
                onNavigateToCertificate={() => setCurrentStation('certificate')}
              />
            )}

            {currentStation === 'certificate' && (
              <ResultsCertificateView
                progress={progress}
                language={progress.profile.language}
              />
            )}
          </main>
        </>
      )}

      {/* Settings & Teacher Mode Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        language={progress.profile.language}
        onResetProgress={handleResetProgress}
      />

      {/* Daily Brain Teaser Modal */}
      <DailyBrainTeaserModal
        isOpen={dailyTeaserOpen}
        onClose={() => setDailyTeaserOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        language={progress.profile.language}
      />
    </div>
  );
}
