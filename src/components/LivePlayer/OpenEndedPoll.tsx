import React, { useState } from 'react';
import { OpenEndedData, PollSlideData } from '../../types/nearpod';
import { Mic, Send, CheckCircle2, BarChart2, MessageSquare } from 'lucide-react';

interface OpenEndedPollProps {
  openEnded?: OpenEndedData;
  poll?: PollSlideData;
  isKazakh: boolean;
  onSubmit: (response: string) => void;
  initialResponse?: string;
}

export const OpenEndedPoll: React.FC<OpenEndedPollProps> = ({
  openEnded,
  poll,
  isKazakh,
  onSubmit,
  initialResponse,
}) => {
  // Open-ended state
  const [text, setText] = useState(initialResponse || '');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(initialResponse));

  // Poll state
  const [selectedPollIndex, setSelectedPollIndex] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState<number[]>([14, 8, 3, 2]);

  const handleOpenEndedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitted(true);
    onSubmit(text.trim());
  };

  const handlePollSelect = (idx: number) => {
    if (selectedPollIndex !== null) return;
    setSelectedPollIndex(idx);
    const updated = [...pollVotes];
    updated[idx] += 1;
    setPollVotes(updated);
    onSubmit(poll?.options[idx] || '');
  };

  const totalVotes = pollVotes.reduce((a, b) => a + b, 0);

  if (poll) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 bg-gradient-to-r from-violet-600 to-indigo-700 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-violet-200 uppercase tracking-wider font-mono">
              Live Poll · {isKazakh ? 'Интерактивті сауалнама' : 'Real-Time Poll'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            {poll.question}
          </h2>
        </div>

        <div className="p-6 space-y-3 bg-slate-50 flex-1">
          {poll.options.map((option, idx) => {
            const votes = pollVotes[idx] || 0;
            const percent = Math.round((votes / totalVotes) * 100);
            const isSelected = selectedPollIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => handlePollSelect(idx)}
                disabled={selectedPollIndex !== null}
                className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col ${
                  isSelected
                    ? 'bg-violet-50 border-violet-500 ring-2 ring-violet-400'
                    : 'bg-white border-slate-200 hover:border-violet-300'
                }`}
              >
                {/* Visual percentage background progress */}
                {selectedPollIndex !== null && (
                  <div
                    className="absolute inset-y-0 left-0 bg-violet-100/60 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {option}
                    </span>
                  </div>

                  {selectedPollIndex !== null && (
                    <span className="font-mono text-xs font-bold text-violet-700">
                      {percent}% ({votes})
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {selectedPollIndex !== null && (
            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isKazakh ? 'Дауысыңыз қабылданды' : 'Your vote has been counted'}</span>
              <span>· {totalVotes} {isKazakh ? 'қатысушы дауыс берді' : 'total votes'}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (openEnded) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider font-mono">
              Open-Ended Question · {isKazakh ? 'Ашық сұрақ / Рефлексия' : 'Reflection'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            {openEnded.prompt}
          </h2>
        </div>

        <form onSubmit={handleOpenEndedSubmit} className="p-6 bg-slate-50 space-y-4 flex-1">
          <div>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitted}
              placeholder={isKazakh ? 'Толық жауабыңызды немесе көзқарасыңызды осында жазыңыз...' : 'Type your detailed answer or reflection here...'}
              className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none transition-all resize-none shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">{text.trim() ? text.trim().split(/\s+/).length : 0} {isKazakh ? 'сөз' : 'words'}</span>

              {openEnded.allowAudioSubmission && (
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isRecording
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? (isKazakh ? 'Жазылуда...' : 'Recording...') : (isKazakh ? 'Дауыспен жазу' : 'Record Audio')}</span>
                </button>
              )}
            </div>

            {isSubmitted ? (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isKazakh ? 'Жауап мұғалімге жіберілді ✓' : 'Answer submitted to teacher ✓'}</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isKazakh ? 'Жауапты тапсыру' : 'Submit Answer'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return null;
};
