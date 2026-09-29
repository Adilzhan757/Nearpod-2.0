import React from 'react';
import { 
  CheckCircle, 
  Presentation, 
  Users, 
  Sparkles, 
  BarChart3, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface AboutNearpodProps {
  onStartTeaching: () => void;
  onJoinLesson: () => void;
  isKazakh: boolean;
}

export const AboutNearpod: React.FC<AboutNearpodProps> = ({
  onStartTeaching,
  onJoinLesson,
  isKazakh,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-12">
      {/* Intro */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nearpod баламасы</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
          {isKazakh ? 'Интерактивті оқытудың жаңа деңгейі' : 'Transform Every Classroom Session'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isKazakh
            ? 'Nearpod мұғалімдерге әрбір оқушының ойын естуге, сабақты ойын түрінде өткізуге және білім сапасын бір сәтте бағалауға мүмкіндік береді.'
            : 'Nearpod provides real-time insights into student learning with interactive media, gamified quizzes, and collaborative discussions.'}
        </p>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold font-mono">
            01
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">
            {isKazakh ? 'Сабақ таңдау немесе құрастыру' : 'Choose or Build'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isKazakh
              ? 'Дайын интерактивті сабақтар каталогынан таңдаңыз немесе Nearpod AI көмегімен бірнеше секундта өз сабағыңызды жасаңыз.'
              : 'Browse our curriculum-aligned library or generate a custom lesson with our AI builder in seconds.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold font-mono">
            02
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">
            {isKazakh ? 'Кодты сыныпқа ұсыну' : 'Share 5-Letter Code'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isKazakh
              ? 'Оқушыларға логин/құпиясөз қажет емес — олар 5 әріпті кодты (мысалы: BIO26) енгізіп, сабаққа лезде қосылады.'
              : 'No student accounts needed. Students simply enter the 5-character code and their name to join.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold font-mono">
            03
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">
            {isKazakh ? 'Тікелей қадағалау & Есептер' : 'Live Insights & Reports'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isKazakh
              ? 'Оқушылардың суреттерін, жауаптарын нақты уақытта көріңіз, қажет болса есімдерін жасырып, смарт-тақтаға шығарыңыз.'
              : 'Monitor student responses live, toggle privacy mode to project on screen, and export comprehensive post-session reports.'}
          </p>
        </div>
      </div>

      {/* Call to action card */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold font-display text-white">
            {isKazakh ? 'Бүгіннен бастап интерактивті сабақ өткізіңіз' : 'Ready to teach interactively?'}
          </h2>
          <p className="text-sky-100 text-xs max-w-lg">
            {isKazakh
              ? 'Тікелей эфирді бастап, сыныптағы оқушылармен қызықты викториналар мен тапсырмаларды орындаңыз.'
              : 'Launch a live session right now or enter a code to experience the student perspective.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onJoinLesson}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors"
          >
            {isKazakh ? 'Оқушы ретінде кіру' : 'Join as Student'}
          </button>
          <button
            onClick={onStartTeaching}
            className="px-5 py-2.5 bg-white text-sky-900 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            {isKazakh ? 'Сабақ бастау' : 'Host Live Session'}
          </button>
        </div>
      </div>
    </div>
  );
};
