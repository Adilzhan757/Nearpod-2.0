import React, { useState, useEffect } from 'react';
import { QuizSlideData, Student } from '../../types/nearpod';
import { Clock, Trophy, Flame, Check, X, Award, Zap } from 'lucide-react';

interface TimeToClimbProps {
  quiz: QuizSlideData;
  students: Student[];
  currentStudentName: string;
  onAnswerSubmitted: (optionId: string, isCorrect: boolean, pointsEarned: number) => void;
  isKazakh: boolean;
}

export const TimeToClimb: React.FC<TimeToClimbProps> = ({
  quiz,
  students,
  currentStudentName,
  onAnswerSubmitted,
  isKazakh,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSec || 30);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [streakCount, setStreakCount] = useState(2);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Timer countdown
  useEffect(() => {
    setTimeLeft(quiz.timeLimitSec || 30);
    setIsAnswerRevealed(false);
    setSelectedOptionId(null);
    setEarnedPoints(0);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnswerRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId !== null || isAnswerRevealed) return;
    setSelectedOptionId(optionId);

    const chosenOption = quiz.options.find((opt) => opt.id === optionId);
    const isCorrect = Boolean(chosenOption?.isCorrect);

    // Calculate score based on time remaining and base points
    const calculatedPoints = isCorrect ? Math.round(quiz.points * (0.6 + 0.4 * (timeLeft / quiz.timeLimitSec))) : 0;
    setEarnedPoints(calculatedPoints);

    if (isCorrect) {
      setStreakCount((s) => s + 1);
    } else {
      setStreakCount(0);
    }

    setIsAnswerRevealed(true);
    onAnswerSubmitted(optionId, isCorrect, calculatedPoints);
  };

  // Sort students for leaderboard
  const leaderboard = [...students].sort((a, b) => b.score - a.score).slice(0, 5);

  const timerPercentage = (timeLeft / (quiz.timeLimitSec || 30)) * 100;

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col">
      {/* Gamified Mountain Header */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-sky-900 to-indigo-950 p-6 border-b border-indigo-800/60 overflow-hidden">
        {/* Mountain backdrop graphic */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end">
          <svg viewBox="0 0 1200 200" className="w-full text-white fill-current">
            <polygon points="0,200 150,80 300,200 550,20 750,180 900,50 1200,200" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-lg">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Time to Climb · {isKazakh ? 'Шыңға өрмелеу' : 'Mountain Race'}
                </span>
                {streakCount > 1 && (
                  <span className="flex items-center gap-1 text-xs text-orange-300 font-semibold bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-400/30">
                    <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    <span>{streakCount}x {isKazakh ? 'Стрик' : 'Streak'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold font-display text-white mt-0.5">
                {quiz.question}
              </h2>
            </div>
          </div>

          {/* Timer Ring / Bar */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-sky-200 font-mono">
                {isKazakh ? 'Қалған уақыт' : 'Time Left'}
              </div>
              <div className={`text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {timeLeft}s
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={timeLeft <= 5 ? 'text-rose-500' : 'text-sky-400'}
                  strokeDasharray={`${timerPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Clock className="w-5 h-5 absolute text-slate-300" />
            </div>
          </div>
        </div>

        {/* Mountain Altitude Visual Track */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">0m ({isKazakh ? 'Етек' : 'Base'})</span>
            <div className="w-48 sm:w-80 h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (streakCount * 25) + 20)}%` }}
              />
            </div>
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> 3,000m ({isKazakh ? 'Шың' : 'Peak'})
            </span>
          </div>
          <div className="text-xs font-mono text-amber-300">
            {isKazakh ? 'Ұпай қоры:' : 'Max Points:'} +{quiz.points}
          </div>
        </div>
      </div>

      {/* Main Grid: Options on left, Live Mountain Leaderboard on right */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Options */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {isKazakh ? 'Дұрыс жауапты таңдаңыз:' : 'Choose the correct answer:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quiz.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              let btnClass = 'bg-slate-800 hover:bg-slate-750 text-slate-100 border-slate-700';

              if (isAnswerRevealed) {
                if (option.isCorrect) {
                  btnClass = 'bg-emerald-600/90 text-white border-emerald-400 shadow-lg shadow-emerald-900/30';
                } else if (isSelected && !option.isCorrect) {
                  btnClass = 'bg-rose-600/90 text-white border-rose-400';
                } else {
                  btnClass = 'bg-slate-800/50 text-slate-400 border-slate-800 opacity-60';
                }
              } else if (isSelected) {
                btnClass = 'bg-sky-600 text-white border-sky-400 ring-2 ring-sky-300';
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswerRevealed}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 relative ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {letters[idx] || idx + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug flex-1">
                    {option.text}
                  </span>

                  {isAnswerRevealed && option.isCorrect && (
                    <Check className="w-5 h-5 text-white shrink-0" />
                  )}
                  {isAnswerRevealed && isSelected && !option.isCorrect && (
                    <X className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback message banner */}
          {isAnswerRevealed && (
            <div className={`p-4 rounded-xl mt-4 border flex items-center justify-between ${
              earnedPoints > 0
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/60 border-rose-800 text-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                {earnedPoints > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-white">
                        {isKazakh ? 'Керемет! Дұрыс жауап!' : 'Excellent! Correct Answer!'}
                      </div>
                      <div className="text-xs text-emerald-300">
                        {isKazakh ? 'Сіз шыңға қарай көтерілдіңіз' : 'You climbed closer to the summit'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-rose-400" />
                    <div>
                      <div className="text-sm font-bold text-white">
                        {isKazakh ? 'Қате жауап, келесі сұрақта бағыңызды сынаңыз!' : 'Incorrect, try to catch up next question!'}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {earnedPoints > 0 && (
                <div className="text-right">
                  <span className="text-xs text-emerald-300 font-mono block">
                    {isKazakh ? 'Алынған ұпай:' : 'Points:'}
                  </span>
                  <span className="text-xl font-mono font-bold text-amber-300">
                    +{earnedPoints}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Mountain Summit Leaderboard */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{isKazakh ? 'Көшбасшылар тақтасы' : 'Leaderboard'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Top 5</span>
          </div>

          <div className="space-y-2 flex-1">
            {leaderboard.map((student, rank) => {
              const isCurrent = student.name.includes(currentStudentName) || currentStudentName.includes(student.name);
              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    isCurrent
                      ? 'bg-sky-900/60 border border-sky-500/50 text-white'
                      : 'bg-slate-900/50 text-slate-300 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      rank === 0
                        ? 'bg-amber-400 text-slate-950'
                        : rank === 1
                        ? 'bg-slate-300 text-slate-900'
                        : rank === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rank + 1}
                    </span>
                    <span className="font-medium truncate">{student.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-amber-300 shrink-0 ml-2">
                    {student.score + (isCurrent && earnedPoints > 0 ? earnedPoints : 0)} pts
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 text-center">
            {isKazakh ? 'Жылдамдық пен дәлдік қосымша ұпай сыйлайды' : 'Speed and accuracy grant bonus altitude'}
          </div>
        </div>
      </div>
    </div>
  );
};
