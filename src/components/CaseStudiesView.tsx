import React, { useState } from 'react';
import { FractionDisplay } from './FractionDisplay';
import { FractionInput } from './FractionInput';
import { Mascot } from './Mascot';
import { Language, UserProgress } from '../types';
import { getT } from '../i18n';
import { sounds } from '../utils/sound';
import { fireSuccessConfetti } from '../utils/confetti';
import {
  MapPin,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Send,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface CaseStudiesViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  language: Language;
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({
  progress,
  onUpdateProgress,
  language,
}) => {
  const t = getT(language);
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);

  // Student answer state for each question
  const [answers, setAnswers] = useState<{ [qKey: string]: { whole?: number; num: number; den: number } }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [qKey: string]: boolean }>({});
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [reflectionSavedMessage, setReflectionSavedMessage] = useState<boolean>(false);

  interface CaseQuestion {
    id: string;
    text: { uz: string; ru: string; en: string };
    expected: { whole?: number; num: number; den: number };
    allowWhole: boolean;
    explanation: { uz: string; ru: string; en: string };
  }

  interface CaseStory {
    id: string;
    title: { uz: string; ru: string; en: string };
    location: string;
    icon: string;
    story: { uz: string; ru: string; en: string };
    questions: CaseQuestion[];
    reflectionPrompt: { uz: string; ru: string; en: string };
  }

  const cases: CaseStory[] = [
    {
      id: 'bakery',
      title: {
        uz: "Malikaning novvoyxonasi",
        ru: "Пекарня Малики",
        en: "Malika's Bakery",
      },
      location: "Samarqand / Самарканд",
      icon: "🥐",
      story: {
        uz: "Samarqanddagi oilaviy novvoyxonada Malika va uning buvisi mashhur qatlama va somsa pishirishadi. Bir partiya somsa xamiri uchun roppa-rosa 1 ¾ kg oliy navli un sarflanadi.",
        ru: "В семейной пекарне в Самарканде Малика и её бабушка пекут знаменитую слоёную самсу. На один замес теста уходит ровно 1 ¾ кг муки высшего сорта.",
        en: "In a family bakery in Samarkand, Malika and her grandmother bake famous flaky somsa. One batch of dough requires exactly 1 ¾ kg of flour.",
      },
      questions: [
        {
          id: 'b_q1',
          text: {
            uz: "1-savol: 3 partiya somsa xamirini tayyorlash uchun necha kg un kerak bo'ladi? (Aralash son ko'rinishida)",
            ru: "Вопрос 1: Сколько кг муки нужно на 3 замеса теста? (В виде смешанного числа)",
            en: "Question 1: How many kg of flour are needed for 3 batches? (As mixed number)",
          },
          expected: { whole: 5, num: 1, den: 4 }, // 1 3/4 * 3 = 7/4 * 3 = 21/4 = 5 1/4
          allowWhole: true,
          explanation: {
            uz: "1 ¾ × 3 = 7/4 × 3 = 21/4 = 5 ¼ kg un kerak bo'ladi.",
            ru: "1 ¾ × 3 = 7/4 × 3 = 21/4 = 5 ¼ кг муки.",
            en: "1 ¾ × 3 = 7/4 × 3 = 21/4 = 5 ¼ kg of flour.",
          },
        },
        {
          id: 'b_q2',
          text: {
            uz: "2-savol: Agar Malika faqat yarim (½) partiya xamir qormoqchi bo'lsa, qancha un kerak bo'ladi?",
            ru: "Вопрос 2: Если Малика хочет замесить только половину (½) замеса, сколько кг муки потребуется?",
            en: "Question 2: If Malika only bakes half (½) a batch, how many kg of flour does she need?",
          },
          expected: { whole: 0, num: 7, den: 8 }, // 7/4 * 1/2 = 7/8
          allowWhole: false,
          explanation: {
            uz: "1 ¾ × ½ = 7/4 × ½ = 7/8 kg un kerak bo'ladi.",
            ru: "1 ¾ × ½ = 7/4 × ½ = 7/8 кг муки.",
            en: "1 ¾ × ½ = 7/4 × ½ = 7/8 kg of flour.",
          },
        },
      ],
      reflectionPrompt: {
        uz: "Novvoyxonada ishlashda kasrlarni aniq hisoblash nima uchun juda muhim deb o'ylaysiz?",
        ru: "Почему, по-твоему, в кулинарии и выпечке так важно точно рассчитывать дроби?",
        en: "Why do you think calculating fractions accurately is so essential in baking?",
      },
    },
    {
      id: 'garden',
      title: {
        uz: "Farg'onadagi maktab bog'i",
        ru: "Школьный сад в Фергане",
        en: "The School Orchard in Fergana",
      },
      location: "Farg'ona / Фергана",
      icon: "🍎",
      story: {
        uz: "Farg'ona vodiysidagi 14-maktab hovlisida jami 36 tup mevali daraxt parvarish qilinadi. Barcha daraxtlarning 5/9 qismini shirin olma daraxtlari tashkil etadi.",
        ru: "Во дворе школы №14 в Фергане растёт 36 фруктовых деревьев. 5/9 всех деревьев — это яблони со сладкими плодами.",
        en: "In the courtyard of School #14 in Fergana, 36 fruit trees are grown. 5/9 of all trees are sweet apple trees.",
      },
      questions: [
        {
          id: 'g_q1',
          text: {
            uz: "1-savol: Bog'da nechta olma daraxti bor?",
            ru: "Вопрос 1: Сколько яблонь растёт в саду?",
            en: "Question 1: How many apple trees are there in the orchard?",
          },
          expected: { whole: 20, num: 0, den: 1 }, // 36 * 5/9 = 20
          allowWhole: true,
          explanation: {
            uz: "36 × 5/9 = (36 × 5) / 9 = 4 × 5 = 20 tup olma daraxti.",
            ru: "36 × 5/9 = (36 × 5) / 9 = 4 × 5 = 20 яблонь.",
            en: "36 × 5/9 = (36 × 5) / 9 = 4 × 5 = 20 apple trees.",
          },
        },
        {
          id: 'g_q2',
          text: {
            uz: "2-savol: O'quvchilar olma daraxtlarining ⅖ qismining hosilini terib bo'lishdi. Nechta daraxtning hosili terib olingan?",
            ru: "Вопрос 2: Ученики уже собрали урожай с ⅖ части яблонь. С какого количества яблонь собран урожай?",
            en: "Question 2: Students have already harvested apples from ⅖ of the apple trees. From how many trees has the harvest been collected?",
          },
          expected: { whole: 8, num: 0, den: 1 }, // 20 * 2/5 = 8
          allowWhole: true,
          explanation: {
            uz: "20 × ⅖ = (20 × 2) / 5 = 4 × 2 = 8 tup olma daraxti hosili terilgan.",
            ru: "20 × ⅖ = (20 × 2) / 5 = 8 яблонь.",
            en: "20 × ⅖ = (20 × 2) / 5 = 8 apple trees harvested.",
          },
        },
      ],
      reflectionPrompt: {
        uz: "O'z maktabingiz yoki hovlingizda mevali daraxtlar ekish atrof-muhitga qanday foyda keltiradi?",
        ru: "Какую пользу природе и обществу приносит посадка деревьев возле школы?",
        en: "What environmental and health benefits come from planting fruit trees near schools?",
      },
    },
    {
      id: 'trip',
      title: {
        uz: "Samarqandga sayohat",
        ru: "Путешествие в Самарканд",
        en: "Trip to Samarkand",
      },
      location: "Toshkent - Samarqand / Ташкент - Самарканд",
      icon: "🚄",
      story: {
        uz: "5-sinf o'quvchilari ekskursiya uchun tezyurar avtobusda Toshkentdan Samarqand tomon yo'lga chiqishdi. Avtobus soatiga o'rtacha 64 km tezlik bilan 2 ½ soat davomida to'xtamasdan yurdi.",
        ru: "Ученики 5 класса отправились на экскурсию из Ташкента в Самарканд. Туристический автобус ехал со средней скоростью 64 км/ч в течение 2 ½ часов без остановок.",
        en: "Grade 5 students set off on a school excursion from Tashkent to Samarkand. The coach traveled at an average speed of 64 km/h for 2 ½ hours without stopping.",
      },
      questions: [
        {
          id: 't_q1',
          text: {
            uz: "1-savol: Avtobus 2 ½ soat ichida jami necha kilometr masofani bosib o'tdi?",
            ru: "Вопрос 1: Какое расстояние автобус преодолел за 2 ½ часа?",
            en: "Question 1: What total distance did the bus travel in 2 ½ hours?",
          },
          expected: { whole: 160, num: 0, den: 1 }, // 64 * 2 1/2 = 64 * 5/2 = 160
          allowWhole: true,
          explanation: {
            uz: "S = v × t ⟹ 64 × 2 ½ = 64 × 5/2 = (64 × 5)/2 = 32 × 5 = 160 km.",
            ru: "S = v × t ⟹ 64 × 2 ½ = 64 × 5/2 = 160 км пути.",
            en: "S = v × t ⟹ 64 × 2 ½ = 64 × 5/2 = 160 km.",
          },
        },
        {
          id: 't_q2',
          text: {
            uz: "2-savol: Toshkentdan Samarqandgacha umumiy masofa 300 km bo'lsa, bosib o'tilgan 160 km butun yo'lning qanday qismini tashkil etadi? (Qisqartirilgan kasr)",
            ru: "Вопрос 2: Если всё расстояние 300 км, какую часть пути составляют пройденные 160 км? (Сократи дробь)",
            en: "Question 2: If the full distance is 300 km, what fraction of the entire trip is 160 km? (Simplified fraction)",
          },
          expected: { whole: 0, num: 8, den: 15 }, // 160/300 = 16/30 = 8/15
          allowWhole: false,
          explanation: {
            uz: "160 / 300 = 16/30 = 8/15 qismi.",
            ru: "160 / 300 = 16/30 = 8/15 всего пути.",
            en: "160 / 300 = 16/30 = 8/15 of the entire distance.",
          },
        },
      ],
      reflectionPrompt: {
        uz: "Samarqand shahrida qaysi tarixiy obidani ko'rishni eng ko'p orzu qilasiz va nima uchun?",
        ru: "Какую историческую достопримечательность Самарканда ты больше всего хочешь посетить?",
        en: "Which historical monument in Samarkand would you like to visit the most and why?",
      },
    },
    {
      id: 'bazaar',
      title: {
        uz: "Chorsu bozorida xarid",
        ru: "Покупки на базаре Чорсу",
        en: "Shopping at Chorsu Bazaar",
      },
      location: "Chorsu bozori, Toshkent",
      icon: "🍇",
      story: {
        uz: "Toshkentdagi qadimiy Chorsu bozorida mayizning 1 kilogrammi 48 000 so'm turadi. Anvar bobosi uchun mayiz va yong'oq xarid qilmoqda.",
        ru: "На знаменитом Ташкентском базаре Чорсу 1 кг изюма стоит 48 000 сумов. Анвар покупает сухофрукты для дедушки.",
        en: "At Tashkent's historic Chorsu Bazaar, 1 kg of raisins costs 48,000 UZS. Anvar is buying dried fruits and nuts for his grandfather.",
      },
      questions: [
        {
          id: 'bz_q1',
          text: {
            uz: "1-savol: Anvar ¾ kg mayiz sotib oldi. U mayiz uchun necha ming so'm to'laydi?",
            ru: "Вопрос 1: Анвар купил ¾ кг изюма. Сколько тысяч сумов он заплатит?",
            en: "Question 1: Anvar bought ¾ kg of raisins. How many thousand UZS does he pay?",
          },
          expected: { whole: 36, num: 0, den: 1 }, // 48 * 3/4 = 36 (ming so'm)
          allowWhole: true,
          explanation: {
            uz: "48 000 × ¾ = (48 000 × 3)/4 = 12 000 × 3 = 36 000 so'm (36 ming).",
            ru: "48 000 × ¾ = 36 000 сумов (36 тыс).",
            en: "48,000 × ¾ = 36,000 UZS (36k).",
          },
        },
        {
          id: 'bz_q2',
          text: {
            uz: "2-savol: Bodomning 1 kg narxi 72 000 so'm. Anvar 1 ¼ kg bodom olsa, necha ming so'm bo'ladi?",
            ru: "Вопрос 2: 1 кг миндаля стоит 72 000 сумов. Если Анвар купит 1 ¼ кг, сколько тысяч сумов это составит?",
            en: "Question 2: 1 kg of almonds costs 72,000 UZS. How many thousand UZS will 1 ¼ kg cost?",
          },
          expected: { whole: 90, num: 0, den: 1 }, // 72 * 5/4 = 90
          allowWhole: true,
          explanation: {
            uz: "72 000 × 1 ¼ = 72 000 × 5/4 = 18 000 × 5 = 90 000 so'm (90 ming).",
            ru: "72 000 × 1 ¼ = 72 000 × 5/4 = 90 000 сумов.",
            en: "72,000 × 1 ¼ = 72,000 × 5/4 = 90,000 UZS.",
          },
        },
      ],
      reflectionPrompt: {
        uz: "O'zbekiston bozorlarida sotuvchilar va xaridorlar o'rtasidagi samimiy munosabatlar haqida nimalarni bilasiz?",
        ru: "Какими добрыми традициями и гостеприимством славятся восточные базары?",
        en: "What warm traditions and hospitality make Uzbek traditional bazaars special?",
      },
    },
  ];

  const currentCase = cases[activeCaseIdx];

  const handleCheckQuestion = (qId: string, expected: { whole?: number; num: number; den: number }) => {
    const ans = answers[qId];
    if (!ans) return;

    sounds.playClick();
    const sW = ans.whole || 0;
    const sN = ans.num || 0;
    const sD = ans.den || 1;

    const eW = expected.whole || 0;
    const eN = expected.num || 0;
    const eD = expected.den || 1;

    const sVal = sW + (sD !== 0 ? sN / sD : 0);
    const eVal = eW + (eD !== 0 ? eN / eD : 0);

    const isMatch = Math.abs(sVal - eVal) < 0.001;

    if (isMatch) {
      sounds.playSuccess();
      fireSuccessConfetti();
      setSubmittedAnswers((prev) => ({ ...prev, [qId]: true }));

      const updated: UserProgress = {
        ...progress,
        stars: progress.stars + 3,
        unlockedStations: {
          ...progress.unlockedStations,
          test: true,
        },
      };
      onUpdateProgress(updated);
    } else {
      sounds.playError();
      setSubmittedAnswers((prev) => ({ ...prev, [qId]: false }));
    }
  };

  const saveReflection = () => {
    if (!reflectionInput.trim()) return;
    sounds.playSuccess();
    const updated: UserProgress = {
      ...progress,
      stars: progress.stars + 2,
      caseReflections: {
        ...progress.caseReflections,
        [currentCase.id]: reflectionInput,
      },
    };
    onUpdateProgress(updated);
    setReflectionSavedMessage(true);
    setTimeout(() => setReflectionSavedMessage(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Case Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{t.cases.title}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {language === 'uz' && "Hayotiy Vaziyatlar va Amaliyot"}
            {language === 'ru' && "Практические жизненные ситуации"}
            {language === 'en' && "Real-Life Applications"}
          </h2>
          <p className="text-emerald-100 text-sm mt-1">{t.cases.subtitle}</p>
        </div>
        <Mascot language={language} mood="explaining" size="sm" />
      </div>

      {/* Case Story Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cases.map((c, idx) => {
          const isActive = activeCaseIdx === idx;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveCaseIdx(idx);
                setReflectionInput(progress.caseReflections[c.id] || '');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                isActive
                  ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-white'
              }`}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {c.title[language]}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{c.location}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Case Narrative & Questions */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* Story Illustration & Text */}
        <div className="p-5 bg-emerald-50/70 dark:bg-slate-750 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <span className="text-xl">{currentCase.icon}</span>
            <span>{currentCase.title[language]} ({currentCase.location})</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentCase.story[language]}
          </p>
        </div>

        {/* Multi-step connected questions */}
        <div className="space-y-6">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            {language === 'uz' ? "Masala savollari:" : language === 'ru' ? "Вопросы к ситуации:" : "Case Questions:"}
          </h4>

          {currentCase.questions.map((q, idx) => {
            const isDone = submittedAnswers[q.id];
            const hasSubmitted = submittedAnswers[q.id] !== undefined;

            return (
              <div
                key={q.id}
                className="p-5 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {q.text[language]}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <FractionInput
                    value={answers[q.id] || { whole: undefined, num: 0, den: 1 }}
                    onChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                    allowWhole={q.allowWhole}
                    showKeypad={false}
                    disabled={isDone}
                  />

                  <button
                    type="button"
                    onClick={() => handleCheckQuestion(q.id, q.expected)}
                    disabled={isDone}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isDone
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                    }`}
                  >
                    {isDone ? "To'g'ri! (+3 ⭐)" : t.practice.check_btn}
                  </button>
                </div>

                {hasSubmitted && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                    }`}
                  >
                    {isDone ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{q.explanation[language]}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Noto'g'ri javob. Qayta hisoblab ko'ring!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reflection Box */}
        <div className="p-5 bg-indigo-50/50 dark:bg-slate-750 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide">
            <MessageSquare className="w-4 h-4" />
            <span>{t.cases.reflection_title}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {currentCase.reflectionPrompt[language]}
          </p>
          <textarea
            rows={3}
            value={reflectionInput || progress.caseReflections[currentCase.id] || ''}
            onChange={(e) => setReflectionInput(e.target.value)}
            placeholder="O'z fikringizni shu yerga yozing..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={saveReflection}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.cases.save_reflection} (+2 ⭐)</span>
            </button>
            {reflectionSavedMessage && (
              <span className="text-xs font-bold text-emerald-600">
                {t.cases.reflection_saved}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
