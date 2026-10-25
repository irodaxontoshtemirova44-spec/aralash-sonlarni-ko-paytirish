import React, { useState } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { Mascot } from './Mascot';
import { FractionInput } from './FractionInput';
import { Language, UserProgress } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { fireSuccessConfetti } from '../utils/confetti';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, BookOpen, Pizza, Grid } from 'lucide-react';

interface LessonsViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  progress,
  onUpdateProgress,
  language,
}) => {
  const t = getT(language);
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [revealedStep, setRevealedStep] = useState<number>(1);

  // Lesson 1 interactive state: pizza slices
  const [pizzaSlices, setPizzaSlices] = useState<number>(7); // 7/4 = 1 whole + 3/4

  // Lesson 2 interactive state: area model dimensions
  const [areaRows, setAreaRows] = useState<number>(3); // 2/3
  const [areaCols, setAreaCols] = useState<number>(4); // 3/4
  const [highlightedRow, setHighlightedRow] = useState<number>(2);
  const [highlightedCol, setHighlightedCol] = useState<number>(3);

  // Lesson 3 interactive state: method tab
  const [selectedMethod, setSelectedMethod] = useState<'A' | 'B'>('A');

  // Mini quiz state for each lesson
  const [miniAnswer, setMiniAnswer] = useState<{ whole?: number; num: number; den: number }>({
    whole: undefined,
    num: 0,
    den: 1,
  });
  const [miniQuizSubmitted, setMiniQuizSubmitted] = useState<boolean>(false);
  const [miniQuizSuccess, setMiniQuizSuccess] = useState<boolean>(false);

  const isCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);

  const markLessonComplete = (lessonNum: number) => {
    const lessonKey = `lesson_${lessonNum}`;
    if (!progress.completedLessons.includes(lessonKey)) {
      sounds.playCelebration();
      fireSuccessConfetti();
      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 5,
        completedLessons: [...progress.completedLessons, lessonKey],
        unlockedStations: {
          ...progress.unlockedStations,
          practice: true,
        },
      };
      onUpdateProgress(updated);
    } else {
      sounds.playSuccess();
    }
  };

  const handleNextSlide = () => {
    sounds.playClick();
    setCurrentSlide((prev) => Math.min(prev + 1, 3));
    setRevealedStep(1);
    setMiniQuizSubmitted(false);
  };

  const handlePrevSlide = () => {
    sounds.playClick();
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setRevealedStep(1);
    setMiniQuizSubmitted(false);
  };

  // Switch lesson tab
  const selectLessonTab = (num: number) => {
    sounds.playClick();
    setSelectedLesson(num);
    setCurrentSlide(0);
    setRevealedStep(1);
    setMiniQuizSubmitted(false);
    setMiniAnswer({ whole: undefined, num: 0, den: 1 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Lesson Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{t.lessons.title}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {selectedLesson === 1 && t.lessons.lesson1_title}
            {selectedLesson === 2 && t.lessons.lesson2_title}
            {selectedLesson === 3 && t.lessons.lesson3_title}
            {selectedLesson === 4 && t.lessons.lesson4_title}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">{t.lessons.subtitle}</p>
        </div>

        {/* Mascot cheering */}
        <Mascot
          language={language}
          mood="explaining"
          size="sm"
          className="shrink-0"
        />
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[1, 2, 3, 4].map((num) => {
          const completed = isCompleted(`lesson_${num}`);
          const isActive = selectedLesson === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => selectLessonTab(num)}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-md border-b-2 border-indigo-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>{num}-Dars</span>
              {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Main Lesson Slides Content */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm space-y-6">
        {/* Slide Tracker */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-750">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((slideIdx) => (
              <div
                key={slideIdx}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === slideIdx
                    ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                    : slideIdx < currentSlide
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400">
            {currentSlide + 1} / 4
          </span>
        </div>

        {/* ========================================================
            LESSON 1: PROPER / IMPROPER FRACTIONS & MIXED NUMBERS
            ======================================================== */}
        {selectedLesson === 1 && (
          <div className="space-y-6">
            {currentSlide === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "To'g'ri va noto'g'ri kasrlar nima?"}
                  {language === 'ru' && "Что такое правильные и неправильные дроби?"}
                  {language === 'en' && "What are Proper and Improper Fractions?"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Proper fraction card */}
                  <div className="p-5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900">
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                      {t.terms.proper_fraction}
                    </div>
                    <div className="flex items-center justify-between my-2">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {language === 'uz' && "Surati maxrajidan KICHIK bo'lgan kasr (surat < maxraj). Butundan kam!"}
                        {language === 'ru' && "Числитель МЕНЬШЕ знаменателя (числитель < знаменатель). Меньше единицы!"}
                        {language === 'en' && "Numerator is LESS than denominator. Less than 1 whole!"}
                      </p>
                      <FractionDisplay num={3} den={4} size="lg" className="text-blue-700 dark:text-blue-300 ml-3" />
                    </div>
                    <div className="text-xs text-blue-800 dark:text-blue-300 font-semibold mt-2">
                      {language === 'uz' ? "Misollar: 1/2, 3/4, 5/8" : language === 'ru' ? "Примеры: 1/2, 3/4, 5/8" : "Examples: 1/2, 3/4, 5/8"}
                    </div>
                  </div>

                  {/* Improper fraction card */}
                  <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                      {t.terms.improper_fraction}
                    </div>
                    <div className="flex items-center justify-between my-2">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {language === 'uz' && "Surati maxrajiga TENG yoki KATTA bo'lgan kasr (surat ≥ maxraj). 1 yoki undan ko'p!"}
                        {language === 'ru' && "Числитель БОЛЬШЕ или РАВЕН знаменателю (числитель ≥ знаменатель). 1 или больше!"}
                        {language === 'en' && "Numerator is GREATER or EQUAL to denominator. 1 or greater!"}
                      </p>
                      <FractionDisplay num={7} den={4} size="lg" className="text-amber-700 dark:text-amber-300 ml-3" />
                    </div>
                    <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-2">
                      {language === 'uz' ? "Misollar: 4/4, 7/4, 11/3" : language === 'ru' ? "Примеры: 4/4, 7/4, 11/3" : "Examples: 4/4, 7/4, 11/3"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Pizza className="w-5 h-5 text-amber-500" />
                  {language === 'uz' && "Interaktiv Pizza modeli: Noto'g'ri kasr ↔ Aralash son"}
                  {language === 'ru' && "Интерактивная модель пиццы: Неправильная дробь ↔ Смешанное число"}
                  {language === 'en' && "Interactive Pizza Model: Improper Fraction ↔ Mixed Number"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'uz' && "Har bir pizza 4 ta teng bo'lakka bo'lingan. Bo'laklar sonini o'zgartiring va ko'ring:"}
                  {language === 'ru' && "Каждая пицца разделена на 4 равные части. Изменяй число кусочков:"}
                  {language === 'en' && "Each pizza is sliced into 4 equal quarters. Change the slice count to observe:"}
                </p>

                <div className="flex flex-col items-center justify-center p-6 bg-amber-50/60 dark:bg-slate-750 rounded-2xl border border-amber-200 dark:border-slate-700 gap-4">
                  {/* Visual Pizzas */}
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {/* Pizza 1 (first 4 slices) */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-28 h-28 rounded-full border-4 border-amber-400 bg-amber-100 overflow-hidden shadow-inner">
                        <div
                          className={`absolute top-0 left-0 w-1/2 h-1/2 border-r-2 border-b-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 1 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute top-0 right-0 w-1/2 h-1/2 border-b-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 2 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-1/2 h-1/2 border-amber-400 transition-colors ${
                            pizzaSlices >= 3 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute bottom-0 left-0 w-1/2 h-1/2 border-r-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 4 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-2">1-Pizza (4/4)</span>
                    </div>

                    {/* Pizza 2 (next slices) */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-28 h-28 rounded-full border-4 border-amber-400 bg-amber-100 overflow-hidden shadow-inner">
                        <div
                          className={`absolute top-0 left-0 w-1/2 h-1/2 border-r-2 border-b-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 5 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute top-0 right-0 w-1/2 h-1/2 border-b-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 6 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-1/2 h-1/2 border-amber-400 transition-colors ${
                            pizzaSlices >= 7 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`absolute bottom-0 left-0 w-1/2 h-1/2 border-r-2 border-amber-400 transition-colors ${
                            pizzaSlices >= 8 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-2">2-Pizza</span>
                    </div>
                  </div>

                  {/* Controller Slider */}
                  <div className="w-full max-w-xs flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPizzaSlices((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1 bg-white dark:bg-slate-700 rounded-lg font-bold border border-slate-300 dark:border-slate-600 shadow-sm"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={pizzaSlices}
                      onChange={(e) => setPizzaSlices(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setPizzaSlices((prev) => Math.min(8, prev + 1))}
                      className="px-3 py-1 bg-white dark:bg-slate-700 rounded-lg font-bold border border-slate-300 dark:border-slate-600 shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Math Equivalence banner */}
                  <div className="flex items-center gap-4 text-xl font-bold bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-300 dark:border-amber-800 shadow-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1">{t.terms.improper_fraction}:</span>
                      <FractionDisplay num={pizzaSlices} den={4} size="lg" />
                    </div>
                    <span className="text-2xl text-amber-500 font-black">=</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1">{t.terms.mixed_number}:</span>
                      <FractionDisplay
                        whole={Math.floor(pizzaSlices / 4)}
                        num={pizzaSlices % 4}
                        den={4}
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Aylantirish algoritmi (Qoidalar)"}
                  {language === 'ru' && "Алгоритм перевода (Правила)"}
                  {language === 'en' && "Conversion Algorithm (Rules)"}
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      {language === 'uz' && "1. Aralash son → Noto'g'ri kasr:"}
                      {language === 'ru' && "1. Смешанное число → Неправильная дробь:"}
                      {language === 'en' && "1. Mixed Number → Improper Fraction:"}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {language === 'uz' && "Butun qismini maxrajga ko'paytiramiz va suratni qo'shamiz: yangi surat = (butun × maxraj) + surat. Maxraj o'zgarmaydi!"}
                      {language === 'ru' && "Целую часть умножаем на знаменатель и прибавляем числитель: новый числитель = (целая × знам.) + числитель. Знаменатель не меняется!"}
                      {language === 'en' && "Multiply the whole number by denominator and add numerator: new numerator = (whole × den) + num. Denominator stays same!"}
                    </p>
                    <div className="mt-2 text-indigo-700 dark:text-indigo-300 font-bold font-mono">
                      2 ⅓ = (2 × 3 + 1)/3 = 7/3
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {language === 'uz' && "2. Noto'g'ri kasr → Aralash son:"}
                      {language === 'ru' && "2. Неправильная дробь → Смешанное число:"}
                      {language === 'en' && "2. Improper Fraction → Mixed Number:"}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {language === 'uz' && "Suratni maxrajga qoldiqli bo'lamiz: to'liqsiz bo'linma — butun qism, qoldiq — surat, bo'luvchi — maxraj!"}
                      {language === 'ru' && "Делим числитель на знаменатель с остатком: неполное частное — целая часть, остаток — числитель, делитель — знаменатель!"}
                      {language === 'en' && "Divide numerator by denominator with remainder: quotient is the whole part, remainder is numerator, divisor is denominator!"}
                    </p>
                    <div className="mt-2 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                      11/4: 11 ÷ 4 = 2 (qoldiq 3) ⟹ 2 ¾
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                      {t.lessons.common_mistakes_title}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      {language === 'uz' && "Aralash sonni noto'g'ri kasrga aylantirganda maxrajni o'zgartirib yubormang! Masalan, 3 ½ da maxraj albatta 2 bo'lib qoladi, 5 yoki 6 emas."}
                      {language === 'ru' && "При переводе смешанного числа в неправильную дробь знаменатель НЕ меняется! Например, в 3 ½ знаменатель всегда остаётся 2."}
                      {language === 'en' && "When converting a mixed number, the denominator NEVER changes! In 3 ½, denominator strictly remains 2."}
                    </p>
                  </div>
                </div>

                {/* Try it yourself mini-quiz */}
                <div className="p-5 bg-indigo-50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>{t.lessons.try_yourself}:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {language === 'uz' && "Aralash sonni noto'g'ri kasrga aylantiring: 3 ⅖ = ?"}
                    {language === 'ru' && "Переведи смешанное число в неправильную дробь: 3 ⅖ = ?"}
                    {language === 'en' && "Convert mixed number to improper fraction: 3 ⅖ = ?"}
                  </p>

                  <div className="flex items-center gap-3">
                    <FractionInput
                      value={miniAnswer}
                      onChange={setMiniAnswer}
                      allowWhole={false}
                      showKeypad={false}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMiniQuizSubmitted(true);
                        // 3 2/5 = 17/5
                        if (miniAnswer.num === 17 && miniAnswer.den === 5) {
                          sounds.playSuccess();
                          setMiniQuizSuccess(true);
                        } else {
                          sounds.playError();
                          setMiniQuizSuccess(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                    >
                      {t.practice.check_btn}
                    </button>
                  </div>

                  {miniQuizSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        miniQuizSuccess
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      }`}
                    >
                      {miniQuizSuccess
                        ? (language === 'uz' ? "Barakalla! 3 × 5 + 2 = 17, natija: 17/5" : language === 'ru' ? "Правильно! 3 × 5 + 2 = 17, ответ: 17/5" : "Correct! 3 × 5 + 2 = 17, answer: 17/5")
                        : (language === 'uz' ? "Xato. Formula: (3 × 5 + 2) / 5 = 17/5" : language === 'ru' ? "Неверно. Формула: (3 × 5 + 2) / 5 = 17/5" : "Try again: (3 × 5 + 2) / 5 = 17/5")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            LESSON 2: MULTIPLYING FRACTIONS & AREA MODEL
            ======================================================== */}
        {selectedLesson === 2 && (
          <div className="space-y-6">
            {currentSlide === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Asosiy qoida: Kasrni kasrga ko'paytirish"}
                  {language === 'ru' && "Основное правило: Умножение дроби на дробь"}
                  {language === 'en' && "Core Rule: Multiplying Fractions"}
                </h3>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-750 dark:to-slate-750 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 text-center space-y-3">
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'uz' && "Ikki kasrni ko'paytirish uchun ularning suratlarini suratga, maxrajlarini esa maxrajga ko'paytirish kerak:"}
                    {language === 'ru' && "Чтобы умножить дробь на дробь, нужно числитель умножить на числитель, а знаменатель — на знаменатель:"}
                    {language === 'en' && "To multiply two fractions, multiply their numerators together and denominators together:"}
                  </p>
                  <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900">
                    <FractionDisplay num={1} den={2} size="lg" />
                    <span className="text-2xl font-black text-indigo-600">×</span>
                    <FractionDisplay num={3} den={4} size="lg" />
                    <span className="text-2xl font-black text-slate-500">=</span>
                    <span className="text-sm font-bold font-mono px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      (1 × 3) / (2 × 4)
                    </span>
                    <span className="text-2xl font-black text-slate-500">=</span>
                    <FractionDisplay num={3} den={8} size="lg" />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-1">
                    {language === 'uz' && "Kasrni natural songa ko'paytirish:"}
                    {language === 'ru' && "Умножение дроби на натуральное число:"}
                    {language === 'en' && "Multiplying a fraction by a natural number:"}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {language === 'uz' && "Har qanday natural son n = n/1 kasr ko'rinishida yozilishi mumkin. Shuning uchun faqat surat natural songa ko'paytiriladi, maxraj esa o'zgarmaydi!"}
                    {language === 'ru' && "Любое натуральное число n можно записать как n/1. Поэтому на натуральное число умножается только числитель!"}
                    {language === 'en' && "Any whole number n is n/1. Therefore, only the numerator is multiplied; denominator stays unchanged!"}
                  </p>
                  <div className="mt-2 font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    2/7 × 3 = (2 × 3)/7 = 6/7
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-indigo-500" />
                  {language === 'uz' && "Vizual Yuzasi Modeli (Area Model): 2/3 × 3/4"}
                  {language === 'ru' && "Визуальная модель площади (Area Model): 2/3 × 3/4"}
                  {language === 'en' && "Visual Area Model: 2/3 × 3/4"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'uz' && "To'rtburchakni gorizontaliga 3 qismga, vertikaliga 4 qismga bo'lamiz (jami 12 ta katak). Ikkala rang ustma-ust tushgan kataklar — ko'paytma!"}
                  {language === 'ru' && "Делим квадрат по горизонтали на 3 полосы, по вертикали на 4 полосы (всего 12 клеток). Пересечение цветов — это результат!"}
                  {language === 'en' && "Divide square horizontally into 3 rows and vertically into 4 columns (12 total cells). Overlapping area is the product!"}
                </p>

                {/* Interactive 2D Grid */}
                <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4">
                  <div className="grid grid-cols-4 w-64 h-48 border-2 border-slate-800 dark:border-slate-300 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-md">
                    {[0, 1, 2].map((r) =>
                      [0, 1, 2, 3].map((c) => {
                        const inRow = r < 2; // 2/3 shaded horizontally
                        const inCol = c < 3; // 3/4 shaded vertically
                        const isOverlap = inRow && inCol; // 2*3 = 6 cells overlap

                        return (
                          <div
                            key={`${r}-${c}`}
                            className={`border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors ${
                              isOverlap
                                ? 'bg-indigo-500 text-white font-bold text-xs'
                                : inRow
                                ? 'bg-blue-200 dark:bg-blue-900/50'
                                : inCol
                                ? 'bg-amber-200 dark:bg-amber-900/50'
                                : 'bg-transparent'
                            }`}
                          >
                            {isOverlap ? '★' : ''}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-blue-300 rounded" />
                      <span>2/3 (qatorlar)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-amber-300 rounded" />
                      <span>3/4 (ustunlar)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-indigo-500 text-white text-[9px] rounded flex items-center justify-center">
                        ★
                      </div>
                      <span>Ustma-ust: 6 / 12 = 1/2</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Eng muhim mahorat: Ko'paytirishdan oldin Qisqartirish!"}
                  {language === 'ru' && "Главный навык: Сокращение ДО умножения!"}
                  {language === 'en' && "Crucial Skill: Cross-Cancellation BEFORE Multiplying!"}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === 'uz' && "Katta sonlarni hisoblashga vaqt sarflamaslik uchun, bir kasrning surati bilan ikkinchi kasrning maxrajini umumiy bo'luvchiga qisqartiring!"}
                  {language === 'ru' && "Чтобы не считать громоздкие числа, числитель одной дроби и знаменатель другой сокращайте на их общий делитель!"}
                  {language === 'en' && "Avoid giant numbers by simplifying diagonally: divide the numerator of one fraction and denominator of the other by their GCD!"}
                </p>

                {/* Animated cross-cancellation demo */}
                <div className="p-6 bg-indigo-50/60 dark:bg-slate-750 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 flex flex-col items-center gap-4">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    Misol: 3/4 × 8/9
                  </div>

                  <div className="flex items-center gap-4 text-2xl font-bold">
                    {/* 3 and 9 cross cancel by 3 */}
                    <div className="flex flex-col items-center">
                      <span className="relative text-rose-600 line-through decoration-rose-500 decoration-2">
                        3
                        <span className="absolute -top-3 -right-3 text-xs text-emerald-600 font-extrabold not-italic">
                          1
                        </span>
                      </span>
                      <div className="w-8 h-[2px] bg-slate-400 my-1" />
                      <span className="relative text-blue-600 line-through decoration-blue-500 decoration-2">
                        4
                        <span className="absolute -bottom-3 -right-3 text-xs text-emerald-600 font-extrabold not-italic">
                          1
                        </span>
                      </span>
                    </div>

                    <span className="text-indigo-600">×</span>

                    {/* 8 and 4 cross cancel by 4 */}
                    <div className="flex flex-col items-center">
                      <span className="relative text-blue-600 line-through decoration-blue-500 decoration-2">
                        8
                        <span className="absolute -top-3 -right-3 text-xs text-emerald-600 font-extrabold not-italic">
                          2
                        </span>
                      </span>
                      <div className="w-8 h-[2px] bg-slate-400 my-1" />
                      <span className="relative text-rose-600 line-through decoration-rose-500 decoration-2">
                        9
                        <span className="absolute -bottom-3 -right-3 text-xs text-emerald-600 font-extrabold not-italic">
                          3
                        </span>
                      </span>
                    </div>

                    <span className="text-slate-400">=</span>

                    {/* Final clean fraction */}
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-600 font-black">1 × 2 = 2</span>
                      <div className="w-14 h-[2px] bg-slate-400 my-1" />
                      <span className="text-emerald-600 font-black">1 × 3 = 3</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {language === 'uz' && "Ko'rdingizmi? 24/36 ni hisoblab qisqartirgandan ko'ra, darhol 2/3 chiqdi!"}
                    {language === 'ru' && "Видите? Вместо громоздких 24/36 мы сразу получили 2/3!"}
                    {language === 'en' && "Notice how we instantly arrived at 2/3 without calculating 24/36!"}
                  </p>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                      {t.lessons.common_mistakes_title}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      {language === 'uz' && "Qo'shish va ko'paytirishni adashtirmang! 1/3 × 1/4 = 1/12 (maxrajlar qo'shilmaydi, ko'paytiriladi: 3 × 4 = 12)."}
                      {language === 'ru' && "Не путай сложение и умножение! 1/3 × 1/4 = 1/12 (знаменатели перемножаются, а не складываются)."}
                      {language === 'en' && "Do not confuse addition with multiplication! 1/3 × 1/4 = 1/12 (denominators are multiplied, never added)."}
                    </p>
                  </div>
                </div>

                {/* Try it yourself */}
                <div className="p-5 bg-indigo-50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>{t.lessons.try_yourself}:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {language === 'uz' && "Ko'paytiring va eng sodda shaklga keltiring: 3/5 × 10/9 = ?"}
                    {language === 'ru' && "Умножь и сократи: 3/5 × 10/9 = ?"}
                    {language === 'en' && "Multiply and simplify: 3/5 × 10/9 = ?"}
                  </p>

                  <div className="flex items-center gap-3">
                    <FractionInput
                      value={miniAnswer}
                      onChange={setMiniAnswer}
                      allowWhole={false}
                      showKeypad={false}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMiniQuizSubmitted(true);
                        // 3/5 * 10/9 = 30/45 = 2/3
                        if (miniAnswer.num === 2 && miniAnswer.den === 3) {
                          sounds.playSuccess();
                          setMiniQuizSuccess(true);
                        } else {
                          sounds.playError();
                          setMiniQuizSuccess(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                    >
                      {t.practice.check_btn}
                    </button>
                  </div>

                  {miniQuizSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        miniQuizSuccess
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      }`}
                    >
                      {miniQuizSuccess
                        ? (language === 'uz' ? "Mukammal! 3 va 9 qisqarib 1 va 3, 5 va 10 qisqarib 1 va 2 bo'ladi. Javob: 2/3" : language === 'ru' ? "Отлично! Сокращаем 3 и 9 (на 3), 5 и 10 (на 5). Ответ: 2/3" : "Brilliant! Cross cancel 3 and 9 by 3, 5 and 10 by 5. Answer: 2/3")
                        : (language === 'uz' ? "Qaytadan o'ylab ko'ring: (3 × 10) / (5 × 9) = 30 / 45 = 2/3" : language === 'ru' ? "Попробуй ещё: (3 × 10)/(5 × 9) = 30/45 = 2/3" : "Check again: (3 × 10)/(5 × 9) = 30/45 = 2/3")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            LESSON 3: MULTIPLYING MIXED NUMBER BY NATURAL NUMBER
            ======================================================== */}
        {selectedLesson === 3 && (
          <div className="space-y-6">
            {currentSlide === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Aralash sonni natural songa ko'paytirish (2 ta ajoyib usul!)"}
                  {language === 'ru' && "Умножение смешанного числа на натуральное (2 отличных способа!)"}
                  {language === 'en' && "Multiplying a Mixed Number by a Natural Number (2 Great Methods!)"}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {language === 'uz' && "Masala: 2 ⅓ × 4 ifodasini hisoblash kerak. Matematikada buni 2 xil yo'l bilan yechish mumkin. Keling, taqqoslaymiz!"}
                  {language === 'ru' && "Пример: вычислить 2 ⅓ × 4. В математике есть 2 способа решения. Давай сравним их!"}
                  {language === 'en' && "Problem: calculate 2 ⅓ × 4. In mathematics, we can solve this in 2 distinct ways. Let's compare!"}
                </p>

                {/* Method Switcher Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('A');
                    }}
                    className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedMethod === 'A'
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-slate-750 shadow-md ring-2 ring-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {language === 'uz' ? "A-usul: Noto'g'ri kasr orqali" : language === 'ru' ? "Способ А: Через неправильную дробь" : "Method A: Via improper fraction"}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1">
                      2 ⅓ × 4 = 7/3 × 4 = 28/3 = 9 ⅓
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('B');
                    }}
                    className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedMethod === 'B'
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-slate-750 shadow-md ring-2 ring-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {language === 'uz' ? "B-usul: Taqsimot qonuni bo'yicha" : language === 'ru' ? "Способ Б: Распределительное свойство" : "Method B: Distributive property"}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1">
                      (2 + ⅓) × 4 = 8 + 4/3 = 9 ⅓
                    </div>
                  </button>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' ? "A-Usul: Noto'g'ri kasrga aylantirish" : language === 'ru' ? "Способ А: Перевод в неправильную дробь" : "Method A: Convert to Improper Fraction"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      1
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {language === 'uz' && "Aralash sonni noto'g'ri kasrga aylantiramiz: 2 ⅓ = 7/3"}
                      {language === 'ru' && "Переводим смешанное число в неправильную дробь: 2 ⅓ = 7/3"}
                      {language === 'en' && "Convert mixed number to improper fraction: 2 ⅓ = 7/3"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      2
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {language === 'uz' && "Suratni natural songa ko'paytiramiz: (7 × 4)/3 = 28/3"}
                      {language === 'ru' && "Умножаем числитель на число: (7 × 4)/3 = 28/3"}
                      {language === 'en' && "Multiply numerator by natural number: (7 × 4)/3 = 28/3"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      3
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {language === 'uz' && "Butun qismini ajratamiz: 28 ÷ 3 = 9 (qoldiq 1) ⟹ 9 ⅓"}
                      {language === 'ru' && "Выделяем целую часть: 28 ÷ 3 = 9 (остаток 1) ⟹ 9 ⅓"}
                      {language === 'en' && "Extract whole part: 28 ÷ 3 = 9 (rem 1) ⟹ 9 ⅓"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' ? "B-Usul: Taqsimot qonuni (Alohida ko'paytirish)" : language === 'ru' ? "Способ Б: По отдельности (распределительное)" : "Method B: Distributive (Separately)"}
                </h3>
                <div className="p-5 bg-emerald-50/60 dark:bg-slate-750 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {language === 'uz' && "Aralash son bu butun va kasr qism yig'indisidir: 2 ⅓ = 2 + ⅓. Shuning uchun butun qismini ham, kasr qismini ham alohida ko'paytiramiz:"}
                    {language === 'ru' && "Смешанное число — это сумма целой и дробной части: 2 ⅓ = 2 + ⅓. Поэтому умножаем отдельно целую и дробную часть:"}
                    {language === 'en' && "A mixed number is the sum of whole and fractional parts: 2 ⅓ = 2 + ⅓. So we multiply both parts separately:"}
                  </p>
                  <div className="font-mono text-base font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    2 ⅓ × 4 = (2 × 4) + (⅓ × 4) = 8 + 4/3 = 8 + 1 ⅓ = 9 ⅓
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    {language === 'uz' && "Ikkala usul ham aynan bir xil to'g'ri natijaga olib keladi!"}
                    {language === 'ru' && "Оба способа дают совершенно одинаковый правильный результат!"}
                    {language === 'en' && "Both methods lead to the exact same correct answer!"}
                  </p>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                      {t.lessons.common_mistakes_title}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      {language === 'uz' && "Eng ko'p qilinadigan xato: faqat butun sonni ko'paytirib, kasr qismini unutish (masalan: 2 ⅓ × 4 ≠ 8 ⅓)! Kasr qismi ham ko'payishi shart."}
                      {language === 'ru' && "Самая частая ошибка: умножить только целую часть и забыть про дробную (2 ⅓ × 4 ≠ 8 ⅓)! Дробная часть тоже должна быть умножена."}
                      {language === 'en' && "Most common blunder: multiplying only the whole part and ignoring the fraction (2 ⅓ × 4 ≠ 8 ⅓)! Fraction part MUST be multiplied."}
                    </p>
                  </div>
                </div>

                {/* Try it yourself */}
                <div className="p-5 bg-indigo-50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>{t.lessons.try_yourself}:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {language === 'uz' && "Hisoblang: 1 ¼ × 3 = ? (Javobni aralash son ko'rinishida yozing)"}
                    {language === 'ru' && "Вычисли: 1 ¼ × 3 = ? (Запиши в виде смешанного числа)"}
                    {language === 'en' && "Calculate: 1 ¼ × 3 = ? (Write as a mixed number)"}
                  </p>

                  <div className="flex items-center gap-3">
                    <FractionInput
                      value={miniAnswer}
                      onChange={setMiniAnswer}
                      allowWhole={true}
                      showKeypad={false}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMiniQuizSubmitted(true);
                        // 1 1/4 * 3 = 5/4 * 3 = 15/4 = 3 3/4
                        if (miniAnswer.whole === 3 && miniAnswer.num === 3 && miniAnswer.den === 4) {
                          sounds.playSuccess();
                          setMiniQuizSuccess(true);
                        } else {
                          sounds.playError();
                          setMiniQuizSuccess(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                    >
                      {t.practice.check_btn}
                    </button>
                  </div>

                  {miniQuizSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        miniQuizSuccess
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      }`}
                    >
                      {miniQuizSuccess
                        ? (language === 'uz' ? "Ofarin! 5/4 × 3 = 15/4 = 3 ¾" : language === 'ru' ? "Браво! 5/4 × 3 = 15/4 = 3 ¾" : "Well done! 5/4 × 3 = 15/4 = 3 ¾")
                        : (language === 'uz' ? "Noto'g'ri. 1 ¼ = 5/4, 5/4 × 3 = 15/4 = 3 ¾" : language === 'ru' ? "Неверно. 1 ¼ = 5/4, 5/4 × 3 = 15/4 = 3 ¾" : "Incorrect. 1 ¼ = 5/4, 5/4 × 3 = 15/4 = 3 ¾")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            LESSON 4: WORD PROBLEMS & 4-STEP FRAMEWORK
            ======================================================== */}
        {selectedLesson === 4 && (
          <div className="space-y-6">
            {currentSlide === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Sonning berilgan kasr qismini topish qoidasi"}
                  {language === 'ru' && "Нахождение дроби от числа"}
                  {language === 'en' && "Finding a Fraction of a Number"}
                </h3>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-750 dark:to-slate-750 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900 text-center space-y-2">
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'uz' && "Sonning kasr qismini topish uchun, shu sonni kasrga ko'paytirish kerak!"}
                    {language === 'ru' && "Чтобы найти дробь от числа, нужно это число умножить на эту дробь!"}
                    {language === 'en' && "To find a fraction of a number, multiply the number by that fraction!"}
                  </p>
                  <div className="inline-flex items-center gap-2 font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-sm">
                    {language === 'uz' && "24 ning ⅜ qismi = 24 × ⅜ = (24 × 3) / 8 = 3 × 3 = 9"}
                    {language === 'ru' && "⅜ от числа 24 = 24 × ⅜ = (24 × 3) / 8 = 3 × 3 = 9"}
                    {language === 'en' && "⅜ of 24 = 24 × ⅜ = (24 × 3) / 8 = 3 × 3 = 9"}
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "4 bosqichli masalalarni yechish rejasi"}
                  {language === 'ru' && "4-шаговый план решения задач"}
                  {language === 'en' && "The 4-Step Word Problem Strategy"}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50 dark:bg-slate-750 rounded-xl border border-blue-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1-QADAM</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      {language === 'uz' ? "Diqqat bilan o'qish" : language === 'ru' ? "Внимательно прочитать" : "Read carefully"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {language === 'uz' ? "Masala nima haqida? Savol nimani so'rayapti?" : language === 'ru' ? "О чём задача? Какой главный вопрос?" : "What is the story about? What is the question?"}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-slate-750 rounded-xl border border-amber-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2-QADAM</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      {language === 'uz' ? "Ma'lumotlarni ajratish" : language === 'ru' ? "Выписать данные" : "Find the data"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {language === 'uz' ? "Sonlar, birliklar va kalit so'zlarni belgilang." : language === 'ru' ? "Числа, единицы измерения и ключевые слова." : "Numbers, units, and signal words."}
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-slate-750 rounded-xl border border-indigo-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">3-QADAM</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      {language === 'uz' ? "Amalni tanlash va hisoblash" : language === 'ru' ? "Выбрать действие и решить" : "Choose operation & solve"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {language === 'uz' ? "Formula tuzing, qisqartiring va hisoblang." : language === 'ru' ? "Составь формулу, сократи и вычисли." : "Formulate equation, cross-cancel, and compute."}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-slate-750 rounded-xl border border-emerald-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">4-QADAM</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      {language === 'uz' ? "Javobni mantiqan tekshirish" : language === 'ru' ? "Проверить логику ответа" : "Check & verify answer"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {language === 'uz' ? "Natija hayotiy ma'noga egami? Birlik to'g'rimi?" : language === 'ru' ? "Имеет ли ответ физический смысл?" : "Does the answer make sense in real life?"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'uz' && "Misol tahlili: Samarqand noni"}
                  {language === 'ru' && "Разбор задачи: Самаркандские лепёшки"}
                  {language === 'en' && "Worked Example: Samarkand Flatbreads"}
                </h3>
                <div className="p-5 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {language === 'uz' && "Nonvoy bir patir nonga 1 ½ kg un ishlatadi. 6 ta shunday non yopish uchun necha kg un kerak bo'ladi?"}
                    {language === 'ru' && "Пекарь на одну лепёшку расходует 1 ½ кг муки. Сколько кг муки нужно на 6 таких лепёшек?"}
                    {language === 'en' && "A baker uses 1 ½ kg of flour for one flatbread. How many kg of flour are needed for 6 flatbreads?"}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 font-mono text-xs">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                      1. Un miqdori: 1 ½ kg, nonlar soni: 6 dona.
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                      2. Ifoda: 1 ½ × 6
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold">
                      3. Yechish: 3/2 × 6 = (3 × 6)/2 = 18/2 = 9 kg un!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="space-y-4">
                {/* Try it yourself */}
                <div className="p-5 bg-indigo-50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>{t.lessons.try_yourself}:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {language === 'uz' && "Sinfda 30 nafar o'quvchi bor. Ularning ⅗ qismi matematika to'garagiga qatnashadi. Necha nafar o'quvchi to'garakka boradi?"}
                    {language === 'ru' && "В классе 30 учеников. ⅗ из них ходят в математический кружок. Сколько учеников посещают кружок?"}
                    {language === 'en' && "There are 30 students in class. ⅗ of them attend the math club. How many students attend the club?"}
                  </p>

                  <div className="flex items-center gap-3">
                    <FractionInput
                      value={miniAnswer}
                      onChange={setMiniAnswer}
                      allowWhole={true}
                      showKeypad={false}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMiniQuizSubmitted(true);
                        // 30 * 3/5 = 18
                        if ((miniAnswer.whole === 18 && (!miniAnswer.num || miniAnswer.num === 0)) || (miniAnswer.num === 18 && miniAnswer.den === 1)) {
                          sounds.playSuccess();
                          setMiniQuizSuccess(true);
                        } else {
                          sounds.playError();
                          setMiniQuizSuccess(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                    >
                      {t.practice.check_btn}
                    </button>
                  </div>

                  {miniQuizSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        miniQuizSuccess
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      }`}
                    >
                      {miniQuizSuccess
                        ? (language === 'uz' ? "A'lo darajada! 30 × ⅗ = (30 × 3) / 5 = 6 × 3 = 18 nafar o'quvchi!" : language === 'ru' ? "Превосходно! 30 × ⅗ = (30 × 3) / 5 = 18 учеников!" : "Excellent! 30 × ⅗ = (30 × 3) / 5 = 18 students!")
                        : (language === 'uz' ? "Xatolik. 30 ni 5 ga bo'lib, 3 ga ko'paytiring: 30 × 3/5 = 18" : language === 'ru' ? "Неверно. 30 делим на 5 и умножаем на 3: 30 × 3/5 = 18" : "Try again: 30 × 3/5 = 18")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Slide Controls (Prev / Next & Finish Button) */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-750">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={handlePrevSlide}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.lessons.prev_step}</span>
          </button>

          {currentSlide < 3 ? (
            <button
              type="button"
              onClick={handleNextSlide}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <span>{t.lessons.next_step}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => markLessonComplete(selectedLesson)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.lessons.complete_lesson_btn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
