import React, { useState, useEffect, useRef } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { Mascot } from './Mascot';
import { Language, UserProgress } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { fireSuccessConfetti, fireGrandCelebration } from '../utils/confetti';
import {
  Trophy,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface GamesViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
}

type ActiveGame = 'menu' | 'race' | 'memory' | 'chef' | 'detective';

export const GamesView: React.FC<GamesViewProps> = ({
  progress,
  onUpdateProgress,
  language,
}) => {
  const t = getT(language);
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');

  // ==========================================
  // GAME 1: FRACTION RACE 🏎️
  // ==========================================
  const [raceActive, setRaceActive] = useState<boolean>(false);
  const [raceTime, setRaceTime] = useState<number>(60);
  const [raceScore, setRaceScore] = useState<number>(0);
  const [raceQuestion, setRaceQuestion] = useState<{
    text: string;
    options: { text: string; isCorrect: boolean }[];
  } | null>(null);
  const [raceCombo, setRaceCombo] = useState<number>(0);
  const [carPosition, setCarPosition] = useState<number>(5); // percent on track

  // Helper to generate quick-fire race questions
  const generateRaceQ = () => {
    const types = ['mixedByNatural', 'fractions'] as const;
    const qType = types[Math.floor(Math.random() * types.length)];

    if (qType === 'mixedByNatural') {
      const whole = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const den = [2, 3, 4][Math.floor(Math.random() * 3)];
      const num = 1;
      const nat = [2, 3, 4][Math.floor(Math.random() * 3)];

      // (whole*den + num)*nat / den
      const rawNum = (whole * den + num) * nat;
      const ansWhole = Math.floor(rawNum / den);
      const ansNum = rawNum % den;

      const correctStr = ansNum === 0 ? `${ansWhole}` : `${ansWhole} ${ansNum}/${den}`;
      const wrong1 = `${ansWhole + 1}`;
      const wrong2 = ansNum === 0 ? `${ansWhole} 1/${den}` : `${ansWhole + 1} ${ansNum}/${den}`;
      const wrong3 = `${whole * nat} ${num}/${den}`; // common mistake: whole only

      const opts = [
        { text: correctStr, isCorrect: true },
        { text: wrong1, isCorrect: false },
        { text: wrong2, isCorrect: false },
        { text: wrong3, isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      return {
        text: `${whole} ${num}/${den} × ${nat} = ?`,
        options: opts,
      };
    } else {
      const n1 = 1;
      const d1 = [2, 3, 4][Math.floor(Math.random() * 3)];
      const n2 = [1, 2][Math.floor(Math.random() * 2)];
      const d2 = [3, 4, 5][Math.floor(Math.random() * 3)];

      const rawNum = n1 * n2;
      const rawDen = d1 * d2;
      // simplify gcd
      const g = (a: number, b: number): number => (!b ? a : g(b, a % b));
      const common = g(rawNum, rawDen);
      const cNum = rawNum / common;
      const cDen = rawDen / common;

      const correctStr = `${cNum}/${cDen}`;
      const wrong1 = `${rawNum + 1}/${rawDen}`;
      const wrong2 = `${n1 + n2}/${d1 + d2}`; // common mistake: added both
      const wrong3 = `${cDen}/${cNum}`; // inverted

      const opts = [
        { text: correctStr, isCorrect: true },
        { text: wrong1, isCorrect: false },
        { text: wrong2, isCorrect: false },
        { text: wrong3, isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      return {
        text: `${n1}/${d1} × ${n2}/${d2} = ?`,
        options: opts,
      };
    }
  };

  const startRace = () => {
    sounds.playClick();
    setRaceTime(60);
    setRaceScore(0);
    setRaceCombo(0);
    setCarPosition(5);
    setRaceActive(true);
    setRaceQuestion(generateRaceQ());
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (raceActive && raceTime > 0) {
      timer = setInterval(() => {
        setRaceTime((prev) => {
          if (prev <= 1) {
            setRaceActive(false);
            sounds.playCelebration();
            fireSuccessConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [raceActive, raceTime]);

  // Update best race score when race ends
  useEffect(() => {
    if (!raceActive && raceTime === 0 && raceScore > 0) {
      const best = Math.max(progress.gameHighScores.race, raceScore);
      const earnedStars = Math.floor(raceScore / 2);
      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + earnedStars,
        gameHighScores: {
          ...progress.gameHighScores,
          race: best,
        },
        unlockedStations: {
          ...progress.unlockedStations,
          cases: true,
        },
      };
      onUpdateProgress(updated);
    }
  }, [raceActive, raceTime]);

  const handleRaceAnswer = (isCorrect: boolean) => {
    if (!raceActive) return;

    if (isCorrect) {
      sounds.playSuccess();
      const points = 1 + Math.floor(raceCombo / 3);
      setRaceScore((prev) => prev + points);
      setRaceCombo((prev) => prev + 1);
      setCarPosition((prev) => Math.min(92, prev + 5));
    } else {
      sounds.playError();
      setRaceCombo(0);
    }
    setRaceQuestion(generateRaceQ());
  };

  // ==========================================
  // GAME 2: MEMORY MATCH 🃏
  // ==========================================
  interface MemoryCard {
    id: number;
    matchId: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const basePairs = [
    { expr: "¾ × ⅔", val: "½" },
    { expr: "1 ½ × 4", val: "6" },
    { expr: "⅖ × ⅚", val: "⅓" },
    { expr: "2 ⅓ × 3", val: "7" },
    { expr: "¼ × 8/9", val: "2/9" },
    { expr: "⅜ × 16", val: "6" },
  ];

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [memoryComplete, setMemoryComplete] = useState<boolean>(false);

  const initMemoryGame = () => {
    sounds.playClick();
    const deck: MemoryCard[] = [];
    basePairs.forEach((pair, idx) => {
      deck.push({
        id: idx * 2,
        matchId: idx,
        content: pair.expr,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idx * 2 + 1,
        matchId: idx,
        content: pair.val,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMemoryComplete(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    sounds.playClick();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].matchId === newCards[secondIdx].matchId) {
        // Match found!
        sounds.playSuccess();
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards(newCards);
          setFlippedCards([]);

          // Check if game completed
          if (newCards.every((c) => c.isMatched)) {
            setMemoryComplete(true);
            sounds.playCelebration();
            fireSuccessConfetti();
            const updated: UserProgress = {
              ...progress,
              stars: progress.stars + 8,
              gameHighScores: {
                ...progress.gameHighScores,
                memory: Math.max(progress.gameHighScores.memory, 100 - moves),
              },
            };
            onUpdateProgress(updated);
          }
        }, 500);
      } else {
        // No match, flip back
        sounds.playError();
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // ==========================================
  // GAME 3: PIZZA CHEF 🍕
  // ==========================================
  interface PizzaOrder {
    customerName: string;
    totalSlices: number;
    fractionText: string;
    targetSlices: number;
    explanation: string;
  }

  const pizzaOrders: PizzaOrder[] = [
    {
      customerName: "Bekzod",
      totalSlices: 8,
      fractionText: "¾",
      targetSlices: 6,
      explanation: "8 × ¾ = (8 × 3) / 4 = 6 bo'lak pizza!",
    },
    {
      customerName: "Nilufar",
      totalSlices: 6,
      fractionText: "⅔",
      targetSlices: 4,
      explanation: "6 × ⅔ = (6 × 2) / 3 = 4 bo'lak pizza!",
    },
    {
      customerName: "Jasur",
      totalSlices: 10,
      fractionText: "⅖",
      targetSlices: 4,
      explanation: "10 × ⅖ = (10 × 2) / 5 = 4 bo'lak pizza!",
    },
    {
      customerName: "Dilorom",
      totalSlices: 12,
      fractionText: "⅝ emas, 7/12",
      targetSlices: 7,
      explanation: "12 × 7/12 = 7 bo'lak!",
    },
  ];

  const [chefRound, setChefRound] = useState<number>(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [chefFeedback, setChefFeedback] = useState<string | null>(null);
  const [chefScore, setChefScore] = useState<number>(0);

  const toggleSlice = (idx: number) => {
    sounds.playClick();
    if (selectedSlices.includes(idx)) {
      setSelectedSlices(selectedSlices.filter((s) => s !== idx));
    } else {
      setSelectedSlices([...selectedSlices, idx]);
    }
  };

  const deliverPizza = () => {
    const cur = pizzaOrders[chefRound];
    if (selectedSlices.length === cur.targetSlices) {
      sounds.playSuccess();
      fireSuccessConfetti();
      setChefScore((prev) => prev + 10);
      setChefFeedback("Ajoyib! Buyurtma to'liq va to'g'ri yetkazildi! ⭐");

      setTimeout(() => {
        if (chefRound < pizzaOrders.length - 1) {
          setChefRound((prev) => prev + 1);
          setSelectedSlices([]);
          setChefFeedback(null);
        } else {
          setChefFeedback("Smena muvaffaqiyatli yakunlandi! Siz mohir Pizza Oshpazisiz! 🍕🏆");
          sounds.playCelebration();
          const updated: UserProgress = {
            ...progress,
            stars: progress.stars + 10,
            gameHighScores: {
              ...progress.gameHighScores,
              chef: 40,
            },
          };
          onUpdateProgress(updated);
        }
      }, 1500);
    } else {
      sounds.playError();
      setChefFeedback(`Xatolik! Siz ${selectedSlices.length} ta bo'lak tanladingiz, lekin buyurtmaga ko'ra ${cur.targetSlices} ta bo'lak kerak edi. ${cur.explanation}`);
    }
  };

  // ==========================================
  // GAME 4: FRACTION DETECTIVE 🔍
  // ==========================================
  interface DetectiveCase {
    id: number;
    title: string;
    studentName: string;
    problem: string;
    steps: { text: string; isWrong: boolean }[];
    correctionOptions: string[];
    correctIndex: number;
    explanation: string;
  }

  const detectiveCases: DetectiveCase[] = [
    {
      id: 1,
      title: "1-Ish: Aralash sonning sirli yo'qolgan kasri",
      studentName: "Nodir",
      problem: "2 ⅓ × 4 = ?",
      steps: [
        { text: "1-qadam: 2 ⅓ sonini (2 + ⅓) ko'rinishida yozamiz.", isWrong: false },
        { text: "2-qadam: Butun qismini 4 ga ko'paytiramiz: 2 × 4 = 8.", isWrong: false },
        { text: "3-qadam: Natijani yozamiz: 8 ⅓.", isWrong: true },
        { text: "4-qadam: Javob: 8 ⅓.", isWrong: false },
      ],
      correctionOptions: [
        "Kasr qismi ⅓ ham 4 ga ko'paytirilib (4/3 = 1 ⅓), 8 ga qo'shilishi kerak: 8 + 1 ⅓ = 9 ⅓",
        "Butun qismdan 4 ni ayirish kerak: 8 - 4 = 4",
        "Maxrajni 4 ga ko'paytirish kerak: 8 1/12",
      ],
      correctIndex: 0,
      explanation: "Nodir aralash sonning faqat butun qismini ko'paytirib, kasr qismini unutgan. To'g'ri javob: 9 ⅓!",
    },
    {
      id: 2,
      title: "2-Ish: Maxrajlarning g'alati qo'shilishi",
      studentName: "Kamron",
      problem: "2/3 × 4/5 = ?",
      steps: [
        { text: "1-qadam: Ko'paytirish formulasini tuzamiz.", isWrong: false },
        { text: "2-qadam: Suratlarini ko'paytiramiz: 2 × 4 = 8.", isWrong: false },
        { text: "3-qadam: Maxrajlarini qo'shamiz: 3 + 5 = 8.", isWrong: true },
        { text: "4-qadam: Javob: 8/8 = 1.", isWrong: false },
      ],
      correctionOptions: [
        "Maxrajlar qo'shilmaydi, balki ko'paytiriladi: 3 × 5 = 15. Natija: 8/15",
        "Suratlarni ham qo'shish kerak edi",
        "Kasrlarni teskari o'girish kerak edi",
      ],
      correctIndex: 0,
      explanation: "Kamron maxrajlarni ko'paytirish o'rniga qo'shib yuborgan. Kasrlarni ko'paytirishda maxrajlar o'zaro ko'paytiriladi: 3 × 5 = 15!",
    },
    {
      id: 3,
      title: "3-Ish: Natural son maxrajga hujum qilganda",
      studentName: "Doston",
      problem: "3/7 × 4 = ?",
      steps: [
        { text: "1-qadam: 4 natural sonini 4/1 deb qaraymiz.", isWrong: false },
        { text: "2-qadam: Suratni o'zgarishsiz qoldirib, maxrajni 4 ga ko'paytiramiz: 7 × 4 = 28.", isWrong: true },
        { text: "3-qadam: Natija: 3/28.", isWrong: false },
      ],
      correctionOptions: [
        "Natural songa maxraj emas, balki SURAT ko'paytiriladi: (3 × 4)/7 = 12/7 = 1 5/7",
        "Kasrni 0 ga tenglashtirish kerak",
        "Maxrajdan 4 ni ayirish kerak",
      ],
      correctIndex: 0,
      explanation: "Kasrni natural songa ko'paytirganda faqat surat ko'paytiriladi, maxraj o'zgarishsiz qoladi!",
    },
  ];

  const [detectiveIndex, setDetectiveIndex] = useState<number>(0);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number | null>(null);
  const [selectedCorrectionIdx, setSelectedCorrectionIdx] = useState<number | null>(null);
  const [detectiveSolved, setDetectiveSolved] = useState<boolean>(false);
  const [detectiveFeedback, setDetectiveFeedback] = useState<string | null>(null);

  const checkDetective = () => {
    const curCase = detectiveCases[detectiveIndex];
    if (selectedStepIdx === null || selectedCorrectionIdx === null) return;

    if (curCase.steps[selectedStepIdx].isWrong && selectedCorrectionIdx === curCase.correctIndex) {
      sounds.playSuccess();
      fireSuccessConfetti();
      setDetectiveSolved(true);
      setDetectiveFeedback(`Barakalla, Detektiv! Xato aniqlandi va to'g'rilandi: ${curCase.explanation}`);

      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 6,
        gameHighScores: {
          ...progress.gameHighScores,
          detective: progress.gameHighScores.detective + 1,
        },
      };
      onUpdateProgress(updated);
    } else {
      sounds.playError();
      setDetectiveFeedback("Xato boshqa qadamda yoki tuzatish noto'g'ri tanlandi. Yana bir bor diqqat bilan tekshiring!");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back to games hub button if inside a game */}
      {activeGame !== 'menu' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveGame('menu');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            ← Barcha o'yinlarga qaytish
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-500">
              Yulduzlar: {progress.stars} ⭐
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          GAMES MENU HUB
          ======================================================== */}
      {activeGame === 'menu' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{t.games.title}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {language === 'uz' && "Qiziqarli Matematik Arkada"}
                {language === 'ru' && "Увлекательная математическая аркада"}
                {language === 'en' && "Fun Math Arcade"}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">{t.games.subtitle}</p>
            </div>
            <Mascot language={language} mood="cheering" size="sm" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Game 1: Fraction Race */}
            <div
              onClick={() => {
                setActiveGame('race');
                startRace();
              }}
              className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-indigo-100 dark:border-indigo-950/60 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🏎️
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t.games.race_title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.games.race_desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">
                  {t.games.best_score}: {progress.gameHighScores.race} ball
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  {t.games.start_game} →
                </span>
              </div>
            </div>

            {/* Game 2: Memory Match */}
            <div
              onClick={() => {
                setActiveGame('memory');
                initMemoryGame();
              }}
              className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-emerald-100 dark:border-emerald-950/60 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🃏
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t.games.memory_title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.games.memory_desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">
                  {t.games.best_score}: {progress.gameHighScores.memory} ball
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  {t.games.start_game} →
                </span>
              </div>
            </div>

            {/* Game 3: Pizza Chef */}
            <div
              onClick={() => {
                sounds.playClick();
                setActiveGame('chef');
                setChefRound(0);
                setSelectedSlices([]);
                setChefFeedback(null);
                setChefScore(0);
              }}
              className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-amber-100 dark:border-amber-950/60 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🍕
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t.games.chef_title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.games.chef_desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">
                  {t.games.best_score}: {progress.gameHighScores.chef} ball
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  {t.games.start_game} →
                </span>
              </div>
            </div>

            {/* Game 4: Fraction Detective */}
            <div
              onClick={() => {
                sounds.playClick();
                setActiveGame('detective');
                setDetectiveIndex(0);
                setSelectedStepIdx(null);
                setSelectedCorrectionIdx(null);
                setDetectiveSolved(false);
                setDetectiveFeedback(null);
              }}
              className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-rose-100 dark:border-rose-950/60 shadow-sm hover:shadow-md hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t.games.detective_title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.games.detective_desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">
                  Hal qilingan: {progress.gameHighScores.detective} ta
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  {t.games.start_game} →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN: FRACTION RACE 🏎️
          ======================================================== */}
      {activeGame === 'race' && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          {/* Race Status HUD */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">
                {raceTime}s
              </span>
            </div>

            <div className="flex items-center gap-4">
              {raceCombo > 1 && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  x{raceCombo}
                </span>
              )}
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {raceScore} ball
              </div>
            </div>
          </div>

          {/* Racetrack Visual Animation */}
          <div className="relative w-full h-24 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-slate-800 flex items-center">
            {/* Road lines */}
            <div className="absolute w-full h-[2px] border-b-2 border-dashed border-yellow-400" />
            {/* Finish Line */}
            <div className="absolute right-4 top-0 bottom-0 w-6 bg-repeat-y bg-[linear-gradient(45deg,#fff_25%,transparent_25%),linear-gradient(-45deg,#fff_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[size:10px_10px]" />

            {/* Racecar */}
            <div
              className="absolute text-3xl transition-all duration-300 filter drop-shadow"
              style={{ left: `${carPosition}%` }}
            >
              🏎️
            </div>
          </div>

          {/* Race Question & 4 Rapid Choice Buttons */}
          {raceActive && raceQuestion && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 font-mono p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700">
                {raceQuestion.text}
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {raceQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRaceAnswer(opt.isCorrect)}
                    className="py-4 px-6 bg-indigo-50 hover:bg-indigo-600 text-indigo-900 hover:text-white dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-indigo-600 rounded-2xl font-black text-xl font-mono shadow-sm border border-indigo-200 dark:border-slate-600 active:scale-95 transition-all"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {!raceActive && raceTime === 0 && (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {t.games.game_over}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Siz 60 soniyada <strong>{raceScore}</strong> ball to'pladingiz va{' '}
                <strong>+{Math.floor(raceScore / 2)} ⭐</strong> yulduz qo'lga kiritdingiz!
              </p>
              <button
                type="button"
                onClick={startRace}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
              >
                {t.games.restart}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCREEN: MEMORY MATCH 🃏
          ======================================================== */}
      {activeGame === 'memory' && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-400">
              Urinishlar soni: {moves} ta
            </span>
            <button
              type="button"
              onClick={initMemoryGame}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.games.restart}
            </button>
          </div>

          {/* 12 Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                disabled={card.isFlipped || card.isMatched}
                onClick={() => handleCardClick(idx)}
                className={`h-24 md:h-28 rounded-2xl font-bold text-base md:text-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                  card.isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-60'
                    : card.isFlipped
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 border-2 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="font-mono">{card.content}</span>
                ) : (
                  <span className="text-2xl opacity-60">★</span>
                )}
              </button>
            ))}
          </div>

          {memoryComplete && (
            <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-3">
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                Ajoyib xotira! Barcha juftliklar topildi!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Siz {moves} ta urinishda o'yinni tugatdingiz va +8 ⭐ yulduz oldingiz!
              </p>
              <button
                type="button"
                onClick={initMemoryGame}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700"
              >
                Yana o'ynash
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCREEN: PIZZA CHEF 🍕
          ======================================================== */}
      {activeGame === 'chef' && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500">
              Buyurtma: {chefRound + 1} / {pizzaOrders.length}
            </span>
            <span className="text-xs font-bold text-amber-600 font-mono">
              Ball: {chefScore}
            </span>
          </div>

          {/* Customer Speech Card */}
          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-center gap-4">
            <div className="text-3xl">👤</div>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                Mijoz {pizzaOrders[chefRound].customerName}:
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium">
                «Salom, oshpaz! Menga {pizzaOrders[chefRound].totalSlices} bo'lakli pitsaning{' '}
                <strong className="underline text-sm">{pizzaOrders[chefRound].fractionText}</strong> qismini
                yetkazib bering!»
              </p>
            </div>
          </div>

          {/* Interactive Pizza Slices Plate */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4">
            <span className="text-xs text-slate-500 font-semibold">
              Kerakli bo'laklarni ustiga bosib tanlang ({selectedSlices.length} ta tanlandi):
            </span>

            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {Array.from({ length: pizzaOrders[chefRound].totalSlices }).map((_, idx) => {
                const isSelected = selectedSlices.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSlice(idx)}
                    className={`w-14 h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 shadow-md scale-105 ring-2 ring-amber-300'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-amber-400'
                    }`}
                  >
                    🍕
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={deliverPizza}
              className="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Buyurtmani yetkazish 📦
            </button>
          </div>

          {chefFeedback && (
            <div className="p-4 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-slate-600">
              {chefFeedback}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCREEN: FRACTION DETECTIVE 🔍
          ======================================================== */}
      {activeGame === 'detective' && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {detectiveCases[detectiveIndex].title}
            </span>
            <span className="text-xs text-slate-400">
              Ish {detectiveIndex + 1} / {detectiveCases.length}
            </span>
          </div>

          {/* Student Notebook */}
          <div className="p-6 bg-amber-50/70 dark:bg-slate-750 rounded-2xl border-2 border-amber-300 dark:border-slate-700 shadow-inner font-mono text-xs space-y-4">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-amber-200 dark:border-slate-600">
              <span>O'quvchi daftari: {detectiveCases[detectiveIndex].studentName}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Misol: {detectiveCases[detectiveIndex].problem}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
              Qaysi qadamda xato borligini toping va shu qadam ustiga bosing:
            </p>

            <div className="space-y-2 font-mono">
              {detectiveCases[detectiveIndex].steps.map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedStepIdx(i);
                  }}
                  className={`w-full p-3 text-left rounded-xl transition-all ${
                    selectedStepIdx === i
                      ? 'bg-rose-100 text-rose-950 border-2 border-rose-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {st.text}
                </button>
              ))}
            </div>
          </div>

          {/* Correction Choices */}
          {selectedStepIdx !== null && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                To'g'ri matematik tuzatishni tanlang:
              </span>
              <div className="space-y-2">
                {detectiveCases[detectiveIndex].correctionOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCorrectionIdx(i);
                    }}
                    className={`w-full p-3 text-left rounded-xl text-xs font-semibold transition-all ${
                      selectedCorrectionIdx === i
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={checkDetective}
                className="mt-3 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Xulosani tekshirish
              </button>
            </div>
          )}

          {detectiveFeedback && (
            <div
              className={`p-4 rounded-xl text-xs font-bold ${
                detectiveSolved
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-200'
              }`}
            >
              {detectiveFeedback}
              {detectiveSolved && detectiveIndex < detectiveCases.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDetectiveIndex((prev) => prev + 1);
                    setSelectedStepIdx(null);
                    setSelectedCorrectionIdx(null);
                    setDetectiveSolved(false);
                    setDetectiveFeedback(null);
                  }}
                  className="mt-2 block px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Keyingi ishga o'tish →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
