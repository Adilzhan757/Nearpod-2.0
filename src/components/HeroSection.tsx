import React, { useState } from 'react';
import { 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  PenTool, 
  Compass, 
  MessageSquare, 
  BarChart2, 
  CheckCircle2, 
  ShieldCheck,
  Play
} from 'lucide-react';
import heroImg from '../assets/images/hero_classroom_interactive_1790692970036.jpg';

interface HeroSectionProps {
  onJoinCode: (code: string) => void;
  onExploreLessons: () => void;
  onOpenStudio: () => void;
  isKazakh: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinCode,
  onExploreLessons,
  onOpenStudio,
  isKazakh,
}) => {
  const [quickCode, setQuickCode] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onJoinCode(quickCode.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero 2-Column Banner */}
      <section className="bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Direct Code Entry */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>{isKazakh ? 'Интербелсенді оқыту платформасы' : 'Interactive Learning Platform'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15] text-balance">
              {isKazakh
                ? 'Әр сабақты интерактивті және қызықты етіңіз'
                : 'Make every lesson interactive and unforgettable'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {isKazakh
                ? 'Мұғалімдер үшін — нақты уақыттағы кері байланыс пен автоматты есептер. Оқушылар үшін — Time to Climb жарыстары, Draw It тақтасы және 360° VR виртуалды саяхаттары.'
                : 'Empower teachers with real-time student insights, formative checks, gamified Time to Climb quizzes, Draw It canvases, and 360° virtual field trips.'}
            </p>

            {/* Iconic Nearpod "Students: Enter CODE" widget */}
            <div className="bg-white p-4 rounded-2xl border-2 border-sky-500 shadow-md max-w-md">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-2">
                {isKazakh ? 'Оқушылар үшін: Сабаққа код арқылы кіру' : 'Students: Enter CODE to Join Lesson'}
              </span>
              <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                    placeholder="BIO26"
                    className="w-full pl-9 pr-3 py-2.5 text-base font-bold font-mono tracking-wider uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!quickCode.trim()}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>{isKazakh ? 'Кіру' : 'Join'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isKazakh ? 'Сынап көру:' : 'Quick codes:'}</span>
                <div className="flex gap-1.5 font-mono">
                  <button type="button" onClick={() => setQuickCode('BIO26')} className="hover:text-sky-600 font-semibold underline">BIO26</button>
                  <span>·</span>
                  <button type="button" onClick={() => setQuickCode('MARS9')} className="hover:text-sky-600 font-semibold underline">MARS9</button>
                  <span>·</span>
                  <button type="button" onClick={() => setQuickCode('SILK7')} className="hover:text-sky-600 font-semibold underline">SILK7</button>
                </div>
              </div>
            </div>

            {/* Proof Metric Adjacency (Zero-Pill, quantitative precision) */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isKazakh ? 'Қазақстан мектептеріне бейімделген' : 'Designed for modern schools'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isKazakh ? '100% браузерде жұмыс істейді' : '100% browser-based, zero install'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
              <img
                src={heroImg}
                alt="Interactive Classroom Experience"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[460px] transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-mono mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{isKazakh ? 'Тікелей қатысу режимі' : 'Live Formative Engagement'}</span>
                  </div>
                  <h3 className="text-base font-bold font-display">
                    {isKazakh ? 'Оқушылардың 100% қатысуына кепілдік' : 'Real-time student participation'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearpod Signature 4-Core Feature Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider font-mono mb-1">
              Nearpod Core Activities
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              {isKazakh ? 'Сабақты жандандыратын 4 негізгі құрал' : 'Interactive Lesson Superpowers'}
            </h2>
          </div>
          <button
            onClick={onExploreLessons}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>{isKazakh ? 'Барлық сабақтар' : 'Explore all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 mb-1">
                Time to Climb
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKazakh
                  ? 'Оқушылар тау шыңына жарыса өрмелейтін, викториналық ойын форматтағы қызықты білім сайысы.'
                  : 'Gamified quiz race where students answer under time pressure to climb to the mountain peak.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-semibold">
              {isKazakh ? 'Жылдамдық пен дәлдік' : 'Speed & Accuracy'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-sky-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                <PenTool className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 mb-1">
                Draw It
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKazakh
                  ? 'Диаграммаларды белгілеу, геометриялық фигуралар сызу және түсіндірме схемаларды қолмен салу.'
                  : 'Interactive drawing canvas for annotating cellular diagrams, math graphs, and sketching.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-sky-700 font-semibold">
              {isKazakh ? 'Интерактивті тақта' : 'Canvas Annotation'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 mb-1">
                360° VR Field Trips
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKazakh
                  ? 'Сыныптан шықпай-ақ Марс ғаламшарына, ғарыш кеңістігіне немесе ежелгі қалаларға саяхаттаңыз.'
                  : 'Take students to Mars, coral reefs, and ancient ruins with 360 panoramic panoramic gyro.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-purple-700 font-semibold">
              {isKazakh ? 'Виртуалды шындық' : 'Virtual Immersion'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 mb-1">
                Collaborate Board
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isKazakh
                  ? 'Сыныптағы барлық оқушылар бір мезетте өз стикерлерін жабыстырып, идеяларға дауыс береді.'
                  : 'Interactive corkboard where every student shares ideas on sticky notes and upvotes peers.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
              {isKazakh ? 'Сыныптық миға шабуыл' : 'Classroom Brainstorm'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
