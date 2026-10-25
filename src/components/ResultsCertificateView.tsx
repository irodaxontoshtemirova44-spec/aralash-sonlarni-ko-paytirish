import React, { useRef } from 'react';
import { UserProgress, Language } from '../types';
import { getT } from '../i18n';
import { Mascot } from './Mascot';
import { sounds } from '../utils/sound';
import { Award, Printer, Star, Calendar, CheckCircle2, Medal, Trophy, ShieldCheck } from 'lucide-react';

interface ResultsCertificateViewProps {
  progress: UserProgress;
  language: Language;
}

export const ResultsCertificateView: React.FC<ResultsCertificateViewProps> = ({
  progress,
  language,
}) => {
  const t = getT(language);
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const latestTest = progress.testHistory[0];

  const badgesList = [
    {
      id: 'welcome_badge',
      title: { uz: "Yosh Matematik", ru: "Юный Математик", en: "Young Math Whiz" },
      desc: { uz: "Dasturni boshlagani uchun", ru: "За начало обучения", en: "For starting the journey" },
      icon: "🌱",
      unlocked: true,
    },
    {
      id: 'lessons_badge',
      title: { uz: "Nazariya Bilimdoni", ru: "Знаток Теории", en: "Theory Master" },
      desc: { uz: "Barcha 4 ta darsni tamomlagani uchun", ru: "За завершение всех 4 уроков", en: "Completed all 4 lessons" },
      icon: "📘",
      unlocked: progress.completedLessons.length >= 4,
    },
    {
      id: 'racer_badge',
      title: { uz: "Tezkor Poygachi", ru: "Быстрый Гонщик", en: "Speed Racer" },
      desc: { uz: "Poygada 10+ ball to'plagani uchun", ru: "10+ очков в гонках дробей", en: "Scored 10+ in Fraction Race" },
      icon: "🏎️",
      unlocked: progress.gameHighScores.race >= 10,
    },
    {
      id: 'detective_badge',
      title: { uz: "Kasr Detektivi", ru: "Детектив Дробей", en: "Fraction Detective" },
      desc: { uz: "Daftardagi barcha xatolarni fosh etgani uchun", ru: "За расследование всех ошибок", en: "Solved detective cases" },
      icon: "🔍",
      unlocked: progress.gameHighScores.detective >= 2,
    },
    {
      id: 'chef_badge',
      title: { uz: "Mohir Pizza Oshpazi", ru: "Шеф-Повар Пиццы", en: "Master Pizza Chef" },
      desc: { uz: "Pizza buyurtmalarini a'lo bajargani uchun", ru: "За идеальные заказы пиццы", en: "Delivered all fraction pizzas" },
      icon: "🍕",
      unlocked: progress.gameHighScores.chef >= 20,
    },
    {
      id: 'test_champ',
      title: { uz: "Sinov Qahramoni (5 Baho)", ru: "Отличник (Оценка 5)", en: "Honor Roll (Grade 5)" },
      desc: { uz: "Yakuniy testda 5 (A'lo) olgani uchun", ru: "За оценку 5 на итоговом тесте", en: "Achieved Grade 5 on Final Test" },
      icon: "🏆",
      unlocked: progress.testHistory.some((th) => th.grade === 5),
    },
  ];

  const studentName = progress.profile.name || (language === 'uz' ? "O'quvchi" : language === 'ru' ? "Ученик" : "Student");
  const studentClass = progress.profile.className || "5-A";
  const currentDate = new Date().toLocaleDateString(
    language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ'
  );
  const gradeText = latestTest
    ? latestTest.grade === 5
      ? "5 (A'lo / Отлично)"
      : latestTest.grade === 4
      ? "4 (Yaxshi / Хорошо)"
      : "3 (Qoniqarli)"
    : "5 (A'lo)";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Print Hide container for screen navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm print:hidden">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>{t.certificate.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.certificate.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>{t.certificate.print_btn}</span>
        </button>
      </div>

      {/* ========================================================
          OFFICIAL HONORABLE CERTIFICATE / DIPLOMA (PRINTABLE)
          ======================================================== */}
      <div
        ref={certRef}
        id="printable-diploma"
        className="relative bg-gradient-to-br from-amber-50/50 via-white to-blue-50/40 p-8 md:p-14 rounded-3xl border-8 border-double border-amber-600/80 shadow-2xl text-center space-y-6 overflow-hidden print:p-8 print:m-0 print:border-8 print:shadow-none print:w-full print:max-w-none text-slate-900"
      >
        {/* Decorative oriental frame corners */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600 pointer-events-none" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600 pointer-events-none" />

        {/* Top Seal / Emblem */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-white flex items-center justify-center shadow-lg border-2 border-white text-3xl mb-2">
            🏅
          </div>
          <span className="text-xs font-bold tracking-[0.25em] text-amber-800 uppercase font-serif">
            O'zbekiston Respublikasi Xalq Ta'limi / Matematika
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-900 tracking-wider mt-2 border-b-2 border-amber-500/60 pb-2 inline-block">
            {t.certificate.official_title}
          </h1>
        </div>

        {/* Dedication Text */}
        <div className="space-y-3 max-w-2xl mx-auto py-2">
          <p className="text-sm md:text-base font-serif italic text-slate-600">
            {t.certificate.issued_to}:
          </p>
          <div className="text-3xl md:text-5xl font-extrabold text-indigo-900 font-serif underline decoration-amber-500 decoration-wavy py-1">
            {studentName}
          </div>
          <div className="text-xs md:text-sm font-bold text-slate-500">
            {t.certificate.student_class}: <span className="text-indigo-800 font-bold">{studentClass}</span>
          </div>

          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-serif pt-2">
            {t.certificate.awarded_for}
          </p>
        </div>

        {/* Certificate Meta & Badge Grid */}
        <div className="grid grid-cols-2 max-w-md mx-auto pt-4 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-serif">{t.certificate.date}:</span>
            <span className="font-bold text-slate-800 font-mono text-sm">{currentDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-serif">{t.certificate.grade}:</span>
            <span className="font-extrabold text-amber-600 text-sm">{gradeText}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex items-end justify-between pt-8 px-4 max-w-2xl mx-auto border-t-2 border-dashed border-slate-300">
          <div className="text-center">
            <div className="w-36 border-b border-slate-700 font-serif italic text-xs pb-1 text-slate-600">
              O'qituvchi
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
              {t.certificate.signature_teacher}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Mascot language={language} mood="proud" size="sm" />
            <span className="text-[10px] font-bold text-indigo-700 mt-1">
              {t.certificate.signature_mascot}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          STUDENT BADGES & ACHIEVEMENTS DASHBOARD (SCREEN ONLY)
          ======================================================== */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print:hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {t.certificate.badges_title}
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-500">
            {t.certificate.stars_total} {progress.stars} ⭐
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badgesList.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                b.unlocked
                  ? 'bg-amber-50/60 dark:bg-slate-750 border-amber-200 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 opacity-50'
              }`}
            >
              <div className="text-3xl shrink-0">{b.icon}</div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  {b.title[language]}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {b.desc[language]}
                </p>
                {b.unlocked && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Ochilgan
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test History */}
      {progress.testHistory.length > 0 && (
        <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 print:hidden">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Testlar tarixi:</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-700 text-slate-500 uppercase">
                <tr>
                  <th className="p-3 rounded-l-xl">Sana</th>
                  <th className="p-3">To'g'ri</th>
                  <th className="p-3">Foiz</th>
                  <th className="p-3 rounded-r-xl">Baho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {progress.testHistory.map((h, i) => (
                  <tr key={h.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-3 font-sans">{h.date}</td>
                    <td className="p-3">
                      {h.correctCount} / {h.totalQuestions}
                    </td>
                    <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {h.scorePercent}%
                    </td>
                    <td className="p-3 font-bold text-amber-500">{h.grade} (baho)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
