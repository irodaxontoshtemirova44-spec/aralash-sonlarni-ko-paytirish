import React, { useState, useEffect } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { FractionInput } from './FractionInput';
import { Mascot } from './Mascot';
import { questionBank } from '../data/questionBank';
import { TestQuestion, Language, UserProgress, TestResult } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { fireGrandCelebration, fireSuccessConfetti } from '../utils/confetti';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface FinalTestViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
  onNavigateToCertificate: () => void;
}

export const FinalTestView: React.FC<FinalTestViewProps> = ({
  progress,
  onUpdateProgress,
  language,
  onNavigateToCertificate,
}) => {
  const t = getT(language);

  const [testActive, setTestActive] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Current question answer state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fractionInputVal, setFractionInputVal] = useState<{ whole?: number; num: number; den: number }>({
    whole: undefined,
    num: 0,
    den: 1,
  });

  // Recorded answers for final analysis
  const [userAnswers, setUserAnswers] = useState<{
    [qId: string]: {
      isCorrect: boolean;
      studentAnswerStr: string;
      correctAnswerStr: string;
    };
  }>({});

  // Optional timer (e.g. 25 minutes = 1500 seconds)
  const [hasTimer, setHasTimer] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(1500);

  // Result object
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Start new test
  const startTest = () => {
    sounds.playClick();
    // Pick 20 balanced questions: 7 from mixedByNatural, 7 from fractionMultiplication, 6 from wordProblems
    const mixedPool = questionBank.filter((q) => q.topic === 'mixedByNatural').sort(() => Math.random() - 0.5);
    const fracPool = questionBank.filter((q) => q.topic === 'fractionMultiplication').sort(() => Math.random() - 0.5);
    const wordPool = questionBank.filter((q) => q.topic === 'wordProblems').sort(() => Math.random() - 0.5);

    const chosen: TestQuestion[] = [
      ...mixedPool.slice(0, 7),
      ...fracPool.slice(0, 7),
      ...wordPool.slice(0, 6),
    ].sort(() => Math.random() - 0.5);

    setSelectedQuestions(chosen);
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setFractionInputVal({ whole: undefined, num: 0, den: 1 });
    setTimeLeft(1500);
    setTestActive(true);
    setTestFinished(false);
    setTestResult(null);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testActive && hasTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testActive, hasTimer, timeLeft]);

  const currentQ = selectedQuestions[currentIndex];

  const handleNextQuestion = () => {
    if (!currentQ) return;
    sounds.playClick();

    // Evaluate answer
    let isCorrect = false;
    let studentStr = '';
    let correctStr = '';

    if (currentQ.type === 'multipleChoice' || currentQ.type === 'trueFalse') {
      isCorrect = selectedOption === currentQ.correctAnswer.optionIndex;
      studentStr =
        selectedOption !== null && currentQ.options
          ? currentQ.options[language][selectedOption]
          : '—';
      correctStr =
        currentQ.correctAnswer.optionIndex !== undefined && currentQ.options
          ? currentQ.options[language][currentQ.correctAnswer.optionIndex]
          : '';
    } else {
      // Fraction input
      const sW = fractionInputVal.whole || 0;
      const sN = fractionInputVal.num || 0;
      const sD = fractionInputVal.den || 1;

      const cW = currentQ.correctAnswer.whole || 0;
      const cN = currentQ.correctAnswer.num || 0;
      const cD = currentQ.correctAnswer.den || 1;

      const sVal = sW + (sD !== 0 ? sN / sD : 0);
      const cVal = cW + (cD !== 0 ? cN / cD : 0);

      isCorrect = Math.abs(sVal - cVal) < 0.001;
      studentStr = sW > 0 && sN > 0 ? `${sW} ${sN}/${sD}` : sW > 0 ? `${sW}` : `${sN}/${sD}`;
      correctStr = cW > 0 && cN > 0 ? `${cW} ${cN}/${cD}` : cW > 0 ? `${cW}` : `${cN}/${cD}`;
    }

    const updatedAnswers = {
      ...userAnswers,
      [currentQ.id]: {
        isCorrect,
        studentAnswerStr: studentStr,
        correctAnswerStr: correctStr,
      },
    };
    setUserAnswers(updatedAnswers);

    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFractionInputVal({ whole: undefined, num: 0, den: 1 });
    } else {
      // Finished all 20 questions!
      finishTest(updatedAnswers);
    }
  };

  const finishTest = (finalAnswers = userAnswers) => {
    setTestActive(false);
    setTestFinished(true);

    let correctTotal = 0;
    const topicScores = {
      mixedByNatural: { correct: 0, total: 0 },
      fractionMultiplication: { correct: 0, total: 0 },
      wordProblems: { correct: 0, total: 0 },
    };

    const details = selectedQuestions.map((q) => {
      const ans = finalAnswers[q.id];
      const correct = !!ans?.isCorrect;
      if (correct) correctTotal += 1;

      topicScores[q.topic].total += 1;
      if (correct) topicScores[q.topic].correct += 1;

      return {
        questionId: q.id,
        topic: q.topic,
        questionText: q.prompt[language],
        studentAnswer: ans?.studentAnswerStr || '—',
        correctAnswer: ans?.correctAnswerStr || '',
        isCorrect: correct,
        explanation: q.explanation[language],
      };
    });

    const percent = Math.round((correctTotal / selectedQuestions.length) * 100);

    // Uzbek 5-point scale
    let grade = 2;
    if (percent >= 86) grade = 5;
    else if (percent >= 71) grade = 4;
    else if (percent >= 56) grade = 3;

    const result: TestResult = {
      id: `test_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      scorePercent: percent,
      correctCount: correctTotal,
      totalQuestions: selectedQuestions.length,
      grade,
      topicScores,
      details,
    };

    setTestResult(result);

    if (grade >= 4) {
      sounds.playCelebration();
      fireGrandCelebration();
    } else if (grade === 3) {
      sounds.playSuccess();
      fireSuccessConfetti();
    } else {
      sounds.playError();
    }

    // Save test result and unlock certificate
    const updated: UserProgress = {
      ...progress,
      stars: progress.stars + (grade === 5 ? 15 : grade === 4 ? 10 : 5),
      testHistory: [result, ...progress.testHistory],
      unlockedStations: {
        ...progress.unlockedStations,
        certificate: true,
      },
    };
    onUpdateProgress(updated);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* ========================================================
          SCREEN 1: TEST WELCOME & SETTINGS
          ======================================================== */}
      {!testActive && !testFinished && (
        <div className="p-6 md:p-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-3xl shadow-sm">
            📝
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
              {t.test.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-xl mx-auto">
              {t.test.subtitle}
            </p>
          </div>

          <div className="p-5 bg-indigo-50/70 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-slate-700 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm">
              {language === 'uz' ? "Qoidalar va baholash:" : language === 'ru' ? "Правила и критерии:" : "Rules & Grading:"}
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>{language === 'uz' ? "Jami 20 ta savol (3 ta mavzuni to'liq qamrab oladi)" : language === 'ru' ? "20 вопросов (по всем 3 темам)" : "20 questions total covering all 3 topics"}</li>
              <li>{language === 'uz' ? "86% – 100%: 5 (A'lo) 🌟" : language === 'ru' ? "86% – 100%: 5 (Отлично) 🌟" : "86% – 100%: Grade 5 (Excellent) 🌟"}</li>
              <li>{language === 'uz' ? "71% – 85%: 4 (Yaxshi) 👍" : language === 'ru' ? "71% – 85%: 4 (Хорошо) 👍" : "71% – 85%: Grade 4 (Good) 👍"}</li>
              <li>{language === 'uz' ? "56% – 70%: 3 (Qoniqarli) 📚" : language === 'ru' ? "56% – 70%: 3 (Удовлетворительно) 📚" : "56% – 70%: Grade 3 (Satisfactory) 📚"}</li>
              <li>{language === 'uz' ? "56% dan past: 2 (Qayta topshirish) 🔄" : language === 'ru' ? "Ниже 56%: 2 (Пересдача) 🔄" : "Below 56%: Grade 2 (Needs practice) 🔄"}</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasTimer}
                onChange={(e) => setHasTimer(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <span>{language === 'uz' ? "Vaqt hisoblagich (25 daqiqa)" : language === 'ru' ? "Таймер (25 минут)" : "Timer (25 mins)"}</span>
            </label>
          </div>

          <button
            type="button"
            onClick={startTest}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            {language === 'uz' ? "Testni boshlash 🚀" : language === 'ru' ? "Начать тест 🚀" : "Start Test 🚀"}
          </button>
        </div>
      )}

      {/* ========================================================
          SCREEN 2: TEST IN PROGRESS (ONE QUESTION AT A TIME)
          ======================================================== */}
      {testActive && currentQ && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          {/* Progress & Timer HUD */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.test.question_counter} {currentIndex + 1} / {selectedQuestions.length}
            </span>

            {hasTimer && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-xl font-mono text-xs font-bold">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / selectedQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-6 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              {currentQ.topic === 'mixedByNatural' && t.test.topic_mixed}
              {currentQ.topic === 'fractionMultiplication' && t.test.topic_fractions}
              {currentQ.topic === 'wordProblems' && t.test.topic_word}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.prompt[language]}
            </h3>
          </div>

          {/* Answers choices or Fraction Input */}
          {currentQ.type === 'multipleChoice' || currentQ.type === 'trueFalse' ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {currentQ.options?.[language].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedOption(i);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
                    selectedOption === i
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-sm ring-2 ring-indigo-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 py-4">
              <span className="text-xs font-bold text-slate-500">
                {language === 'uz' ? "Javobingizni kasr yoki butun son shaklida kiriting:" : language === 'ru' ? "Введи ответ в виде дроби или целого числа:" : "Enter answer as fraction or whole number:"}
              </span>
              <FractionInput
                value={fractionInputVal}
                onChange={setFractionInputVal}
                allowWhole={true}
                showKeypad={true}
              />
            </div>
          )}

          {/* Submit question button */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              disabled={
                (currentQ.type === 'multipleChoice' || currentQ.type === 'trueFalse') &&
                selectedOption === null
              }
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>{currentIndex === selectedQuestions.length - 1 ? t.test.submit_test : "Keyingi savol"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 3: TEST RESULTS, GRADE & STEP-BY-STEP REVIEWS
          ======================================================== */}
      {testFinished && testResult && (
        <div className="space-y-6">
          {/* Results Scoreboard */}
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-4">
            <div className="text-5xl">
              {testResult.grade === 5 ? '🌟' : testResult.grade === 4 ? '👍' : testResult.grade === 3 ? '📚' : '🔄'}
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {t.test.results_title}
            </h2>

            <div className="inline-flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <span className="text-xs text-slate-400 block">Natija:</span>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {testResult.scorePercent}%
                </span>
              </div>
              <div className="w-[1px] h-10 bg-slate-300 dark:bg-slate-600" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block">To'g'ri javoblar:</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {testResult.correctCount} / {testResult.totalQuestions}
                </span>
              </div>
              <div className="w-[1px] h-10 bg-slate-300 dark:bg-slate-600" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block">Baho:</span>
                <span className="text-2xl font-black text-amber-500">
                  {testResult.grade === 5
                    ? t.test.grade_5
                    : testResult.grade === 4
                    ? t.test.grade_4
                    : testResult.grade === 3
                    ? t.test.grade_3
                    : t.test.grade_2}
                </span>
              </div>
            </div>

            {/* Topic Breakdown bars */}
            <div className="max-w-md mx-auto pt-4 space-y-3 text-left">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                {t.test.topic_breakdown}
              </h4>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{t.test.topic_mixed}</span>
                  <span className="font-mono">
                    {testResult.topicScores.mixedByNatural.correct} / {testResult.topicScores.mixedByNatural.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        (testResult.topicScores.mixedByNatural.correct /
                          (testResult.topicScores.mixedByNatural.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{t.test.topic_fractions}</span>
                  <span className="font-mono">
                    {testResult.topicScores.fractionMultiplication.correct} / {testResult.topicScores.fractionMultiplication.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${
                        (testResult.topicScores.fractionMultiplication.correct /
                          (testResult.topicScores.fractionMultiplication.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{t.test.topic_word}</span>
                  <span className="font-mono">
                    {testResult.topicScores.wordProblems.correct} / {testResult.topicScores.wordProblems.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${
                        (testResult.topicScores.wordProblems.correct /
                          (testResult.topicScores.wordProblems.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Personalized Mascot Recommendation */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 max-w-lg mx-auto flex items-center gap-3 text-left">
              <Mascot language={language} mood="explaining" size="sm" className="shrink-0" />
              <div>
                <h5 className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                  {t.test.recommendation_title}
                </h5>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  {testResult.topicScores.mixedByNatural.correct < testResult.topicScores.mixedByNatural.total / 2
                    ? "3-darsni yana bir bor takrorlang va taqsimot qonunini mashq qiling!"
                    : testResult.topicScores.fractionMultiplication.correct < testResult.topicScores.fractionMultiplication.total / 2
                    ? "2-darsdagi 'Ko'paytirishdan oldin qisqartirish' qoidasini mustahkamlang!"
                    : "Ajoyib natija! Endi Faxriy Diplomingizni ko'rishingiz mumkin!"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={startTest}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.test.retake_btn}</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToCertificate}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>{t.test.view_cert_btn} 🎓</span>
              </button>
            </div>
          </div>

          {/* Detailed Question-by-Question Review with Explanations */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>{t.test.review_title}</span>
            </h3>

            <div className="space-y-3">
              {testResult.details.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'
                      : 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {idx + 1}-savol: {item.questionText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 pt-1 font-mono">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400">Sizning javobingiz:</span>{' '}
                      <span className={item.isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {item.studentAnswer}
                      </span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400">To'g'ri javob:</span>{' '}
                      <span className="text-emerald-600 font-bold">{item.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    <strong className="text-indigo-600 dark:text-indigo-400">Yechim:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
