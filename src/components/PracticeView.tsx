import React, { useState, useEffect } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { FractionInput } from './FractionInput';
import { Mascot } from './Mascot';
import {
  generatePracticeProblem,
  checkFractionAnswer,
  GeneratedPracticeProblem,
  AnswerCheckResult,
} from '../utils/math';
import { Language, UserProgress, MascotMood } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { fireSuccessConfetti } from '../utils/confetti';
import { Lightbulb, RotateCcw, CheckCircle2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface PracticeViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  progress,
  onUpdateProgress,
  language,
}) => {
  const t = getT(language);
  const [topic, setTopic] = useState<'mixedByNatural' | 'fractionMultiplication'>('mixedByNatural');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isStepByStep, setIsStepByStep] = useState<boolean>(true);

  const [problem, setProblem] = useState<GeneratedPracticeProblem | null>(null);

  // Student answer
  const [answer, setAnswer] = useState<{ whole?: number; num: number; den: number }>({
    whole: undefined,
    num: 0,
    den: 1,
  });

  // Step-by-step intermediate inputs
  const [step1Val, setStep1Val] = useState<{ num: number; den: number }>({ num: 0, den: 1 });
  const [step2Val, setStep2Val] = useState<{ num: number; den: number }>({ num: 0, den: 1 });

  const [feedback, setFeedback] = useState<AnswerCheckResult | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [streak, setStreak] = useState<number>(0);

  // Generate new problem
  const loadNewProblem = () => {
    const p = generatePracticeProblem(topic, difficulty);
    setProblem(p);
    setAnswer({ whole: undefined, num: 0, den: 1 });
    setStep1Val({ num: 0, den: 1 });
    setStep2Val({ num: 0, den: 1 });
    setFeedback(null);
    setSubmitted(false);
    setShowSolution(false);
    setShowHint(false);
    setMascotMood('thinking');
  };

  useEffect(() => {
    loadNewProblem();
  }, [topic, difficulty]);

  const handleCheck = () => {
    if (!problem) return;

    sounds.playClick();
    setSubmitted(true);

    const context = {
      type: problem.topic,
      origWhole: problem.whole1,
      origNum1: problem.num1,
      origDen1: problem.den1,
      origNum2: problem.num2,
      origDen2: problem.den2,
      origNatural: problem.natural,
    };

    const res = checkFractionAnswer(answer, problem.expectedAnswer, context);
    setFeedback(res);

    if (res.isCorrect && res.type === 'CORRECT') {
      sounds.playSuccess();
      fireSuccessConfetti();
      setMascotMood('cheering');
      setStreak((prev) => prev + 1);

      // Award stars and update progress
      const newPracticeCount = progress.practiceCount + 1;
      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 2,
        practiceCount: newPracticeCount,
        unlockedStations: {
          ...progress.unlockedStations,
          games: true,
        },
      };
      onUpdateProgress(updated);
    } else if (res.isCorrect) {
      // Partial credit for unsimplified
      sounds.playSuccess();
      setMascotMood('explaining');
      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 1,
        practiceCount: progress.practiceCount + 1,
      };
      onUpdateProgress(updated);
    } else {
      sounds.playError();
      setMascotMood('confused');
      setStreak(0);
    }
  };

  const handleUseHint = () => {
    if (showHint) return;
    if (progress.stars >= 1) {
      sounds.playStar();
      const updated = {
        ...progress,
        stars: progress.stars - 1,
      };
      onUpdateProgress(updated);
    }
    setShowHint(true);
    setMascotMood('explaining');
  };

  if (!problem) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Topic tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-2xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTopic('mixedByNatural');
            }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              topic === 'mixedByNatural'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'uz' && "Aralash son × Natural son"}
            {language === 'ru' && "Смешанное × Натуральное"}
            {language === 'en' && "Mixed × Natural"}
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTopic('fractionMultiplication');
            }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              topic === 'fractionMultiplication'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'uz' && "Kasr × Kasr"}
            {language === 'ru' && "Дробь × Дробь"}
            {language === 'en' && "Fraction × Fraction"}
          </button>
        </div>

        {/* Difficulty buttons */}
        <div className="flex items-center gap-1.5">
          {(['easy', 'medium', 'hard'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                sounds.playClick();
                setDifficulty(lvl);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                difficulty === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {lvl === 'easy' && t.practice.level_easy}
              {lvl === 'medium' && t.practice.level_medium}
              {lvl === 'hard' && t.practice.level_hard}
            </button>
          ))}
        </div>
      </div>

      {/* Main Practice Problem Stage */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-800/95 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Streak & Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.practice.title}
            </span>
            {streak > 1 && (
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black rounded-full flex items-center gap-1">
                🔥 {streak} {language === 'uz' ? "ketma-ket!" : language === 'ru' ? "подряд!" : "streak!"}
              </span>
            )}
          </div>

          {/* Hint button */}
          <button
            type="button"
            onClick={handleUseHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{showHint ? "Maslahat ochiq" : t.feedback.hint_cost}</span>
          </button>
        </div>

        {/* Math Equation Presentation */}
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-indigo-50/50 to-slate-50 dark:from-slate-750 dark:to-slate-800 rounded-3xl border border-indigo-100 dark:border-slate-700">
          <div className="flex items-center gap-5 text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 select-none">
            {problem.topic === 'mixedByNatural' ? (
              <>
                <FractionDisplay
                  whole={problem.whole1}
                  num={problem.num1}
                  den={problem.den1}
                  size="xl"
                />
                <span className="text-indigo-600 dark:text-indigo-400">×</span>
                <span className="tabular-nums font-mono">{problem.natural}</span>
                <span className="text-slate-400 font-normal">=</span>
                <span className="text-indigo-500 font-mono text-4xl">?</span>
              </>
            ) : (
              <>
                <FractionDisplay num={problem.num1} den={problem.den1} size="xl" />
                <span className="text-indigo-600 dark:text-indigo-400">×</span>
                <FractionDisplay num={problem.num2} den={problem.den2} size="xl" />
                <span className="text-slate-400 font-normal">=</span>
                <span className="text-indigo-500 font-mono text-4xl">?</span>
              </>
            )}
          </div>
        </div>

        {/* Mascot Hint Card if activated */}
        {showHint && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-start gap-3 animate-fadeIn">
            <Mascot language={language} mood="explaining" size="sm" className="shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-xs uppercase tracking-wide">
                Kasrboy maslahati:
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                {problem.hint[language]}
              </p>
            </div>
          </div>
        )}

        {/* Step-by-step guidance toggle */}
        <div className="flex items-center justify-end">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
            <input
              type="checkbox"
              checked={isStepByStep}
              onChange={(e) => setIsStepByStep(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
            />
            <span>{t.practice.step_by_step_mode}</span>
          </label>
        </div>

        {/* Step-by-step walkthrough fields */}
        {isStepByStep && (
          <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'uz' ? "Yordamchi oraliq qadamlar:" : language === 'ru' ? "Промежуточные шаги:" : "Guided intermediate steps:"}
            </div>

            {problem.topic === 'mixedByNatural' ? (
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span>1) Noto'g'ri kasr:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      placeholder="surat"
                      value={step1Val.num || ''}
                      onChange={(e) => setStep1Val({ ...step1Val, num: parseInt(e.target.value, 10) || 0 })}
                      className="w-14 h-8 text-center bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                    <div className="w-14 h-[2px] bg-slate-400 my-0.5" />
                    <span className="w-14 text-center font-mono">{problem.den1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span>2) Ko'paytma:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      placeholder="surat"
                      value={step2Val.num || ''}
                      onChange={(e) => setStep2Val({ ...step2Val, num: parseInt(e.target.value, 10) || 0 })}
                      className="w-16 h-8 text-center bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                    <div className="w-16 h-[2px] bg-slate-400 my-0.5" />
                    <span className="w-16 text-center font-mono">{problem.den1}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span>Oraliq ko'paytma:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      placeholder="surat"
                      value={step1Val.num || ''}
                      onChange={(e) => setStep1Val({ ...step1Val, num: parseInt(e.target.value, 10) || 0 })}
                      className="w-16 h-8 text-center bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                    <div className="w-16 h-[2px] bg-slate-400 my-0.5" />
                    <input
                      type="number"
                      placeholder="maxraj"
                      value={step1Val.den || ''}
                      onChange={(e) => setStep1Val({ ...step1Val, den: parseInt(e.target.value, 10) || 1 })}
                      className="w-16 h-8 text-center bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Student Answer Input Box */}
        <div className="flex flex-col items-center space-y-4">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {language === 'uz' ? "Yakuniy javobingizni kiriting:" : language === 'ru' ? "Введи окончательный ответ:" : "Enter your final answer:"}
          </span>

          <FractionInput
            value={answer}
            onChange={setAnswer}
            allowWhole={true}
            showKeypad={true}
            disabled={submitted && feedback?.isCorrect}
          />
        </div>

        {/* Action Buttons: Check vs Next Problem */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          {!submitted || !feedback?.isCorrect ? (
            <button
              type="button"
              onClick={handleCheck}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t.practice.check_btn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={loadNewProblem}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.practice.next_problem} (+2 ⭐)</span>
            </button>
          )}

          {submitted && !feedback?.isCorrect && (
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showSolution ? "Yechimni berkitish" : t.practice.show_solution}</span>
            </button>
          )}
        </div>

        {/* Diagnostic Feedback Alert */}
        {submitted && feedback && (
          <div
            className={`p-4 rounded-2xl border text-sm font-semibold flex items-start gap-3 transition-all ${
              feedback.isCorrect && feedback.type === 'CORRECT'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900'
                : feedback.isCorrect
                ? 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900'
                : 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="leading-relaxed">
                {t.feedback[feedback.messageKey as keyof typeof t.feedback] || t.feedback.mistake_general}
              </p>
              {feedback.type === 'CORRECT_NEEDS_SIMPLIFY' && (
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span>To'liq qisqartirilgan ko'rinishi:</span>
                  <FractionDisplay
                    whole={feedback.expected.whole}
                    num={feedback.expected.num}
                    den={feedback.expected.den}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Step-by-Step Solution Card */}
        {showSolution && (
          <div className="p-5 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              {language === 'uz' ? "Bosqichma-bosqich to'g'ri yechim:" : language === 'ru' ? "Пошаговое верное решение:" : "Step-by-step correct solution:"}
            </h4>
            <div className="space-y-2">
              {problem.steps.map((st, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-mono">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                    {st.title[language]}
                  </div>
                  <div className="text-slate-800 dark:text-slate-200">{st.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
