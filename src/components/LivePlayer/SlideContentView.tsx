import React, { useState } from 'react';
import { ContentSlideData } from '../../types/nearpod';
import { Volume2, VolumeX, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

interface SlideContentViewProps {
  content: ContentSlideData;
  isKazakh: boolean;
}

export const SlideContentView: React.FC<SlideContentViewProps> = ({ content, isKazakh }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider font-mono">
            {isKazakh ? 'Интерактивті оқу материалы' : 'Interactive Content'}
          </span>
        </div>

        {content.audioNarration && (
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isPlayingAudio
                ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? (isKazakh ? 'Тоқтату' : 'Stop') : (isKazakh ? 'Дауыстап оқу' : 'Audio Reader')}</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Text Column */}
        <div className={content.imageUrl ? 'md:col-span-7 space-y-4' : 'md:col-span-12 space-y-4'}>
          {content.subtitle && (
            <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
              {content.subtitle}
            </p>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 leading-tight">
            {content.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {content.bodyText}
          </p>

          {content.bulletPoints && content.bulletPoints.length > 0 && (
            <div className="pt-2 space-y-2.5">
              {content.bulletPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-normal">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Media Column */}
        {content.imageUrl && (
          <div className="md:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group">
              <img
                src={content.imageUrl}
                alt={content.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[360px] transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-3 text-white text-[11px] font-medium">
                {content.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
