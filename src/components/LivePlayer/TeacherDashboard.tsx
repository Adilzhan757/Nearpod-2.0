import React, { useState } from 'react';
import { Lesson, Slide, Student, CollaborateNote } from '../../types/nearpod';
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Play, 
  Share2, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Check, 
  Sliders, 
  Download, 
  Radio, 
  PlusCircle, 
  Trophy,
  ExternalLink,
  Maximize2
} from 'lucide-react';

interface TeacherDashboardProps {
  lesson: Lesson;
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  isStudentPaced: boolean;
  onToggleStudentPaced: () => void;
  students: Student[];
  collaborateNotes: CollaborateNote[];
  hideStudentNames: boolean;
  onToggleHideNames: () => void;
  onEndSession: () => void;
  onQuickPoll: () => void;
  isKazakh: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  lesson,
  currentSlideIndex,
  onSlideChange,
  isStudentPaced,
  onToggleStudentPaced,
  students,
  collaborateNotes,
  hideStudentNames,
  onToggleHideNames,
  onEndSession,
  onQuickPoll,
  isKazakh,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedStudentDrawing, setSelectedStudentDrawing] = useState<string | null>(null);
  const [showRoster, setShowRoster] = useState(false);

  const currentSlide: Slide = lesson.slides[currentSlideIndex] || lesson.slides[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lesson.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Mock student submissions based on slide type
  const totalStudents = students.length;
  const submittedCount = Math.min(totalStudents, Math.max(3, Math.floor(totalStudents * 0.8)));
  const participationRate = Math.round((submittedCount / totalStudents) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Teacher Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Lesson Info & Code */}
        <div className="flex items-center gap-3 truncate">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {isKazakh ? 'ТІКЕЛЕЙ ЭФИР' : 'LIVE HOST'}
            </span>
          </div>

          {/* Join Code Badge */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-950 border border-sky-600 text-sky-300 rounded-lg hover:bg-sky-900 transition-colors text-xs font-mono font-bold"
            title={isKazakh ? 'Сілтеме/кодты көшіру' : 'Copy student join code'}
          >
            <span className="text-slate-400">CODE:</span>
            <span className="text-sm text-sky-200">{lesson.code}</span>
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
          </button>

          <span className="text-sm font-bold text-white truncate hidden md:inline font-display">
            {lesson.title}
          </span>
        </div>

        {/* Center: Slide Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-200 transition-colors"
            title={isKazakh ? 'Алдыңғы слайд' : 'Previous slide'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Quick slide jump dropdown */}
          <select
            value={currentSlideIndex}
            onChange={(e) => onSlideChange(Number(e.target.value))}
            className="bg-slate-800 text-slate-100 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold focus:outline-none focus:border-sky-500"
          >
            {lesson.slides.map((s, idx) => (
              <option key={s.id} value={idx}>
                {idx + 1}. {s.title.substring(0, 24)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => onSlideChange(Math.min(lesson.slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === lesson.slides.length - 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-200 transition-colors"
            title={isKazakh ? 'Келесі слайд' : 'Next slide'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Controls & End Session */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hide Student Names Toggle */}
          <button
            onClick={onToggleHideNames}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              hideStudentNames
                ? 'bg-amber-950/70 border-amber-500/80 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isKazakh ? 'Оқушы есімдерін тақтада жасыру немесе көрсету' : 'Hide student names on projected screen'}
          >
            {hideStudentNames ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {hideStudentNames ? (isKazakh ? 'Есімдер жасырылған' : 'Names Hidden') : (isKazakh ? 'Есімдерді жасыру' : 'Hide Names')}
            </span>
          </button>

          {/* Student-Paced Toggle */}
          <button
            onClick={onToggleStudentPaced}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isStudentPaced
                ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isStudentPaced ? (isKazakh ? 'Өз қарқынымен' : 'Student-Paced') : (isKazakh ? 'Мұғалім басқарады' : 'Teacher-Led')}
            </span>
          </button>

          {/* Connected Students Roster Button */}
          <button
            onClick={() => setShowRoster(!showRoster)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono">{students.length}</span>
          </button>

          {/* End Session */}
          <button
            onClick={onEndSession}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            {isKazakh ? 'Сессияны аяқтау' : 'End Session'}
          </button>
        </div>
      </header>

      {/* Main Teacher Dashboard Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Interactive Monitoring & Slide Stage */}
        <div className="lg:col-span-8 space-y-6">
          {/* Current Activity Banner */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                  {isKazakh ? 'Ағымдағы тапсырма' : 'Current Activity'} · {currentSlide.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{isKazakh ? 'Оқушылар қатысуы:' : 'Participation:'}</span>
                <span className="font-bold text-emerald-400 font-mono">{participationRate}%</span>
                <span className="text-slate-500 font-mono">({submittedCount}/{totalStudents})</span>
              </div>
            </div>

            <h2 className="text-xl font-bold font-display text-white mb-2">
              {currentSlide.title}
            </h2>

            {/* Slide-specific Teacher View */}
            {currentSlide.type === 'draw_it' && (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-slate-300">
                  {currentSlide.drawIt?.prompt}
                </p>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-slate-300">
                      {isKazakh ? 'Оқушылардың тікелей суреттері:' : 'Live Student Submissions:'}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {isKazakh ? 'Үлкейтіп көру үшін басыңыз' : 'Click to preview full-screen'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {students.slice(0, 6).map((student, idx) => {
                      const displayName = hideStudentNames ? `${isKazakh ? 'Оқушы' : 'Student'} #${idx + 1}` : student.name;
                      return (
                        <div
                          key={student.id}
                          onClick={() => setSelectedStudentDrawing(currentSlide.drawIt?.backgroundImageUrl || '')}
                          className="bg-slate-900 border border-slate-700 hover:border-sky-500 rounded-xl p-2 cursor-pointer transition-all hover:scale-102 group relative"
                        >
                          <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative flex items-center justify-center">
                            {currentSlide.drawIt?.backgroundImageUrl ? (
                              <img
                                src={currentSlide.drawIt.backgroundImageUrl}
                                alt="Student drawing preview"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                              />
                            ) : (
                              <div className="text-xs text-slate-500">No Image</div>
                            )}
                            {/* Simulated drawing stroke overlay */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-sky-400 stroke-2 fill-none">
                              <path d={`M ${20 + idx * 10} 20 Q ${80 + idx * 5} ${50 + idx * 8} ${140} ${30 + idx * 12}`} />
                              <circle cx={40 + idx * 15} cy={40 + idx * 5} r="6" className="stroke-emerald-400" />
                            </svg>
                            <div className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-300 truncate">{displayName}</span>
                            <span className="text-emerald-400 font-mono text-[10px]">✓ {isKazakh ? 'Тапсырды' : 'Done'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentSlide.type === 'time_to_climb' && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700">
                  <div className="text-xs text-amber-400 font-bold mb-1 font-mono uppercase">
                    {isKazakh ? 'Сұрақ мәтіні:' : 'Question text:'}
                  </div>
                  <div className="text-base font-semibold text-white">
                    {currentSlide.quiz?.question}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSlide.quiz?.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const mockPercentages = [12, 75, 8, 5];
                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between ${
                          opt.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            {letters[idx]}
                          </span>
                          <span className="text-xs font-medium leading-relaxed">
                            {opt.text}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                          <span className={opt.isCorrect ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {opt.isCorrect ? (isKazakh ? 'Дұрыс жауап' : 'Correct') : ''}
                          </span>
                          <span className="text-slate-300 font-bold">{mockPercentages[idx]}% ({Math.round(totalStudents * (mockPercentages[idx] / 100))} {isKazakh ? 'оқушы' : 'students'})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentSlide.type === 'collaborate_board' && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {isKazakh ? 'Келіп түскен ойлар мен стикерлер:' : 'Live Student Sticky Notes:'}
                  </span>
                  <span className="text-amber-400 font-mono">
                    {collaborateNotes.length} {isKazakh ? 'стикер' : 'notes'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scrollbar p-1">
                  {collaborateNotes.map((note, idx) => {
                    const author = hideStudentNames ? `${isKazakh ? 'Оқушы' : 'Student'} #${idx + 1}` : note.authorName;
                    return (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                          <span className="font-bold text-sky-300">{author}</span>
                          <span className="font-mono">❤️ {note.likes}</span>
                        </div>
                        <p className="leading-relaxed">{note.content}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentSlide.type === 'content' && (
              <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
                <p>{currentSlide.content?.bodyText}</p>
                <div className="mt-3 flex items-center gap-2 text-sky-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>{isKazakh ? 'Барлық оқушылар экранды көріп отыр' : 'All students are synced to this presentation slide'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick On-The-Fly Activity Trigger */}
          <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {isKazakh ? 'Жылдам сауалнама қосу (On-The-Fly)' : 'Launch Quick Activity'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isKazakh ? 'Сабақ барысында кез келген уақытта жылдам сұрақ жіберіңіз' : 'Spontaneously assess understanding right now'}
                </p>
              </div>
            </div>

            <button
              onClick={onQuickPoll}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              {isKazakh ? 'Жылдам сұрақ қосу' : 'Launch Quick Question'}
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Live Class Leaderboard & Online Roster */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Leaderboard */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <Trophy className="w-4 h-4" />
                <span>{isKazakh ? 'Оқушылар нәтижесі' : 'Live Scoreboard'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{students.length} {isKazakh ? 'оқушы' : 'students'}</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {students.map((student, idx) => {
                const displayName = hideStudentNames ? `${isKazakh ? 'Оқушы' : 'Student'} #${idx + 1}` : student.name;
                return (
                  <div
                    key={student.id}
                    className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200 truncate">{displayName}</span>
                    </div>
                    <span className="font-mono text-amber-300 font-bold shrink-0 ml-2">
                      {student.score} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Classroom Link Sharing Box */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/50 rounded-2xl p-5 text-xs text-indigo-200">
            <h4 className="font-bold text-white font-display mb-1">
              {isKazakh ? 'Интерактивті тақтаға шығару' : 'Project to Classroom Display'}
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
              {isKazakh
                ? 'Оқушыларға осы 5 таңбалы кодты айтыңыз немесе экраныңызды смарт-тақтаға жіберіңіз.'
                : 'Project your screen without worrying about student privacy—toggle "Hide Names" anytime.'}
            </p>
            <div className="p-3 bg-black/40 rounded-xl border border-indigo-500/30 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-amber-300">{lesson.code}</span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
              >
                {copiedCode ? (isKazakh ? 'Көшірілді!' : 'Copied!') : (isKazakh ? 'Көшіру' : 'Copy')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Fullscreen Lightbox Modal */}
      {selectedStudentDrawing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg font-display">
                {isKazakh ? 'Оқушының жұмысын үлкейтіп көру' : 'Student Submission Preview'}
              </h3>
              <button
                onClick={() => setSelectedStudentDrawing(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={selectedStudentDrawing}
                alt="Enlarged student drawing"
                className="max-h-[60vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isKazakh ? 'Сыныпқа тақтадан көрсетуге дайын' : 'Ready to share to classroom board'}</span>
              <button
                onClick={() => setSelectedStudentDrawing(null)}
                className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500"
              >
                {isKazakh ? 'Жабу' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
