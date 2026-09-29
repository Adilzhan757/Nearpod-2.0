import React, { useState } from 'react';
import { Lesson, Slide, Student, CollaborateNote } from '../../types/nearpod';
import { SlideContentView } from './SlideContentView';
import { TimeToClimb } from './TimeToClimb';
import { DrawItCanvas } from './DrawItCanvas';
import { CollaborateBoard } from './CollaborateBoard';
import { VRViewer } from './VRViewer';
import { MatchingPairs } from './MatchingPairs';
import { OpenEndedPoll } from './OpenEndedPoll';
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Hand, 
  ThumbsUp, 
  HelpCircle, 
  Heart,
  User,
  Sparkles,
  Share2
} from 'lucide-react';

interface StudentViewProps {
  lesson: Lesson;
  student: Student;
  currentSlideIndex: number;
  isStudentPaced: boolean;
  onSlideChange: (index: number) => void;
  onExit: () => void;
  collaborateNotes: CollaborateNote[];
  onAddCollaborateNote: (note: CollaborateNote) => void;
  onLikeCollaborateNote: (noteId: string) => void;
  onSaveDrawing: (dataUrl: string) => void;
  onQuizAnswer: (optionId: string, isCorrect: boolean, points: number) => void;
  onOpenEndedAnswer: (answer: string) => void;
  allStudents: Student[];
  isKazakh: boolean;
}

export const StudentView: React.FC<StudentViewProps> = ({
  lesson,
  student,
  currentSlideIndex,
  isStudentPaced,
  onSlideChange,
  onExit,
  collaborateNotes,
  onAddCollaborateNote,
  onLikeCollaborateNote,
  onSaveDrawing,
  onQuizAnswer,
  onOpenEndedAnswer,
  allStudents,
  isKazakh,
}) => {
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const currentSlide: Slide = lesson.slides[currentSlideIndex] || lesson.slides[0];

  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Student Session Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Code & Title */}
          <div className="flex items-center gap-3 truncate">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-xs font-mono font-bold shrink-0">
              <span className="text-[10px] uppercase text-sky-600">CODE:</span>
              <span>{lesson.code}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate font-display">
              {lesson.title}
            </h1>
          </div>

          {/* Center: Slide indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {isStudentPaced && (
              <button
                onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                title={isKazakh ? 'Алдыңғы слайд' : 'Previous slide'}
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
            )}

            <div className="px-3 py-1 bg-slate-100 rounded-md text-xs font-mono font-semibold text-slate-700">
              {currentSlideIndex + 1} / {lesson.slides.length}
            </div>

            {isStudentPaced && (
              <button
                onClick={() => onSlideChange(Math.min(lesson.slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === lesson.slides.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                title={isKazakh ? 'Келесі слайд' : 'Next slide'}
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            )}
          </div>

          {/* Right: Student Avatar & Reactions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Reactions */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setIsHandRaised(!isHandRaised);
                  triggerReaction('✋');
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  isHandRaised ? 'bg-amber-100 text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-200'
                }`}
                title={isKazakh ? 'Қол көтеру' : 'Raise hand'}
              >
                <Hand className="w-4 h-4" />
              </button>
              <button
                onClick={() => triggerReaction('👍')}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200 transition-colors"
                title="Ұнады"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => triggerReaction('❤️')}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200 transition-colors"
                title="Жүрекше"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={() => triggerReaction('❓')}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200 transition-colors"
                title="Сұрағым бар"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Student profile pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                {student.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
                {student.name}
              </span>
            </div>

            {/* Exit */}
            <button
              onClick={onExit}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title={isKazakh ? 'Сабақтан шығу' : 'Leave session'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Animated Reaction */}
      {activeReaction && (
        <div className="fixed bottom-10 right-10 z-50 text-5xl animate-bounce drop-shadow-lg pointer-events-none">
          {activeReaction}
        </div>
      )}

      {/* Main Slide Activity Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {currentSlide.type === 'content' && currentSlide.content && (
          <SlideContentView content={currentSlide.content} isKazakh={isKazakh} />
        )}

        {currentSlide.type === 'time_to_climb' && currentSlide.quiz && (
          <TimeToClimb
            quiz={currentSlide.quiz}
            students={allStudents}
            currentStudentName={student.name}
            onAnswerSubmitted={(optId, isCorrect, pts) => onQuizAnswer(optId, isCorrect, pts)}
            isKazakh={isKazakh}
          />
        )}

        {currentSlide.type === 'draw_it' && currentSlide.drawIt && (
          <DrawItCanvas
            prompt={currentSlide.drawIt.prompt}
            instructions={currentSlide.drawIt.instructions}
            backgroundImageUrl={currentSlide.drawIt.backgroundImageUrl}
            onSubmit={(url) => onSaveDrawing(url)}
            isKazakh={isKazakh}
            initialSubmittedUrl={student.drawings?.[currentSlide.id]}
          />
        )}

        {currentSlide.type === 'collaborate_board' && currentSlide.collaborate && (
          <CollaborateBoard
            board={{
              ...currentSlide.collaborate,
              notes: collaborateNotes.length > 0 ? collaborateNotes : currentSlide.collaborate.notes,
            }}
            studentName={student.name}
            onAddNote={onAddCollaborateNote}
            onLikeNote={onLikeCollaborateNote}
            isKazakh={isKazakh}
          />
        )}

        {currentSlide.type === 'vr_field_trip' && currentSlide.vr && (
          <VRViewer vr={currentSlide.vr} isKazakh={isKazakh} />
        )}

        {currentSlide.type === 'matching_pairs' && currentSlide.matching && (
          <MatchingPairs
            matching={currentSlide.matching}
            isKazakh={isKazakh}
            onCompleted={(att) => {}}
          />
        )}

        {(currentSlide.type === 'open_ended' || currentSlide.type === 'poll') && (
          <OpenEndedPoll
            openEnded={currentSlide.openEnded}
            poll={currentSlide.poll}
            isKazakh={isKazakh}
            onSubmit={(ans) => onOpenEndedAnswer(ans)}
            initialResponse={student.openAnswers?.[currentSlide.id]}
          />
        )}
      </main>

      {/* Footer Navigation Bar (for teacher sync indicator) */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isStudentPaced ? (isKazakh ? 'Өз қарқыныңызбен оқу режимі' : 'Student-Paced Mode') : (isKazakh ? 'Мұғаліммен тікелей синхрондалған' : 'Live Teacher-Paced')}</span>
          </div>
          <span className="font-mono text-slate-400">Nearpod Student Live v2.6</span>
        </div>
      </footer>
    </div>
  );
};
