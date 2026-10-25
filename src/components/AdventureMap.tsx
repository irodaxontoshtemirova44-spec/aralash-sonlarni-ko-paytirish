import React from 'react';
import { UserProgress, Language } from '../types';
import { getT } from '../i18n';
import { Mascot } from './Mascot';
import { sounds } from '../utils/sound';
import {
  BookOpen,
  PenTool,
  Gamepad2,
  Puzzle,
  FileCheck2,
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

interface AdventureMapProps {
  progress: UserProgress;
  language: Language;
  onSelectStation: (stationId: 'learn' | 'practice' | 'games' | 'cases' | 'test' | 'certificate') => void;
  onOpenDailyTeaser: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  progress,
  language,
  onSelectStation,
  onOpenDailyTeaser,
}) => {
  const t = getT(language);

  // Compute overall progress percentage based on completed milestones
  const milestonesTotal = 8; // 4 lessons + practice + games + cases + test
  let milestonesDone = 0;
  milestonesDone += Math.min(4, progress.completedLessons.length);
  if (progress.practiceCount >= 3) milestonesDone += 1;
  if (progress.gameHighScores.race > 0 || progress.gameHighScores.memory > 0) milestonesDone += 1;
  if (Object.keys(progress.caseReflections).length > 0) milestonesDone += 1;
  if (progress.testHistory.length > 0) milestonesDone += 1;

  const overallPercent = Math.min(100, Math.round((milestonesDone / milestonesTotal) * 100));

  interface StationConfig {
    id: 'learn' | 'practice' | 'games' | 'cases' | 'test' | 'certificate';
    num: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    isUnlocked: boolean;
    isCompleted: boolean;
  }

  const stations: StationConfig[] = [
    {
      id: 'learn',
      num: 1,
      title: t.nav.learn,
      desc: t.map.station_learn_desc,
      icon: <BookOpen className="w-7 h-7" />,
      color: 'from-blue-500 to-indigo-600',
      isUnlocked: true,
      isCompleted: progress.completedLessons.length >= 4,
    },
    {
      id: 'practice',
      num: 2,
      title: t.nav.practice,
      desc: t.map.station_practice_desc,
      icon: <PenTool className="w-7 h-7" />,
      color: 'from-indigo-500 to-violet-600',
      isUnlocked: progress.teacherUnlocked || progress.unlockedStations.practice || progress.completedLessons.length > 0,
      isCompleted: progress.practiceCount >= 5,
    },
    {
      id: 'games',
      num: 3,
      title: t.nav.games,
      desc: t.map.station_games_desc,
      icon: <Gamepad2 className="w-7 h-7" />,
      color: 'from-purple-500 to-pink-600',
      isUnlocked: progress.teacherUnlocked || progress.unlockedStations.games || progress.practiceCount > 0,
      isCompleted: progress.gameHighScores.race > 0 && progress.gameHighScores.memory > 0,
    },
    {
      id: 'cases',
      num: 4,
      title: t.nav.cases,
      desc: t.map.station_cases_desc,
      icon: <Puzzle className="w-7 h-7" />,
      color: 'from-teal-500 to-emerald-600',
      isUnlocked: progress.teacherUnlocked || progress.unlockedStations.cases || progress.gameHighScores.race > 0,
      isCompleted: Object.keys(progress.caseReflections).length >= 2,
    },
    {
      id: 'test',
      num: 5,
      title: t.nav.test,
      desc: t.map.station_test_desc,
      icon: <FileCheck2 className="w-7 h-7" />,
      color: 'from-amber-500 to-orange-600',
      isUnlocked: progress.teacherUnlocked || progress.unlockedStations.test || Object.keys(progress.caseReflections).length > 0,
      isCompleted: progress.testHistory.length > 0,
    },
    {
      id: 'certificate',
      num: 6,
      title: t.nav.certificate,
      desc: t.map.station_certificate_desc,
      icon: <Award className="w-7 h-7" />,
      color: 'from-amber-600 to-yellow-500',
      isUnlocked: progress.teacherUnlocked || progress.unlockedStations.certificate || progress.testHistory.length > 0,
      isCompleted: progress.testHistory.some((th) => th.grade >= 4),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Hero & Mascot Cheering */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5-Sinf Matematika Sarguzashti</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {language === 'uz' && `Xush kelibsiz, ${progress.profile.name || "Do'stim"}!`}
            {language === 'ru' && `Добро пожаловать, ${progress.profile.name || "Друг"}!`}
            {language === 'en' && `Welcome, ${progress.profile.name || "Friend"}!`}
          </h1>

          <p className="text-indigo-100 text-sm max-w-lg leading-relaxed">
            {language === 'uz' && "Sarguzasht xaritasi bo'ylab harakatlaning: darslarni o'rganing, mashq qiling, o'yinlarda g'alaba qozoning va Faxriy Diplomga ega bo'ling!"}
            {language === 'ru' && "Путешествуй по карте знаний: проходи уроки, тренируйся, побеждай в играх и получи почётный диплом!"}
            {language === 'en' && "Travel along the learning adventure map: master lessons, practice with diagnostics, triumph in arcade games, and earn your honors diploma!"}
          </p>

          {/* Daily Brain Teaser trigger */}
          <button
            type="button"
            onClick={onOpenDailyTeaser}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <Lightbulb className="w-4 h-4 fill-amber-950" />
            <span>{t.daily.title}</span>
          </button>
        </div>

        <Mascot
          language={language}
          mood={overallPercent > 60 ? 'proud' : 'happy'}
          size="md"
          speech={
            overallPercent === 0
              ? language === 'uz'
                ? "Birinchi bekat — 1-Darsdan boshlaymiz!"
                : language === 'ru'
                ? "Начнём с первой станции — Урок 1!"
                : "Let's begin at Station 1 — Lesson 1!"
              : language === 'uz'
              ? `Barakalla! O'zlashtirish: ${overallPercent}%!`
              : language === 'ru'
              ? `Отлично! Пройдено: ${overallPercent}%!`
              : `Great work! Progress: ${overallPercent}%!`
          }
        />
      </div>

      {/* Progress Strip */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-2/3 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{t.map.progress_title}</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{overallPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300">
            <span>⭐</span>
            <span>{progress.stars} {t.nav.stars}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300">
            <span>🏅</span>
            <span>{progress.badges.length} nishon</span>
          </div>
        </div>
      </div>

      {/* The 6 Adventure Map Stations Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((station) => {
          const locked = !station.isUnlocked;

          return (
            <div
              key={station.id}
              onClick={() => {
                if (!locked) {
                  sounds.playClick();
                  onSelectStation(station.id);
                } else {
                  sounds.playError();
                }
              }}
              className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between ${
                locked
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-400 cursor-pointer group hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${station.color} text-white flex items-center justify-center shadow-md ${
                      !locked ? 'group-hover:scale-110 transition-transform' : ''
                    }`}
                  >
                    {station.icon}
                  </div>

                  {locked ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-full text-[11px] font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Qulflangan</span>
                    </div>
                  ) : station.isCompleted ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.map.completed_status}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full text-[11px] font-bold">
                      <span>{t.map.unlocked_status}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Bekat {station.num}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1">
                  {station.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {station.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-xs">
                {locked ? (
                  <span className="text-[11px] text-slate-400">
                    {t.map.locked_tooltip}
                  </span>
                ) : (
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Kirish →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
