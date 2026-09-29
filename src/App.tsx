import React, { useState } from 'react';
import { Lesson, Student, CollaborateNote } from './types/nearpod';
import { INITIAL_LESSONS, INITIAL_STUDENTS } from './data/mockLessons';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LessonCatalog } from './components/Catalog/LessonCatalog';
import { StudentJoinModal } from './components/StudentJoinModal';
import { StudentView } from './components/LivePlayer/StudentView';
import { TeacherDashboard } from './components/LivePlayer/TeacherDashboard';
import { LessonEditor } from './components/LessonStudio/LessonEditor';
import { SessionReports } from './components/Reports/SessionReports';
import { AboutNearpod } from './components/AboutNearpod';

type ViewMode = 'hub' | 'teacher_live' | 'student_live';
type HubTab = 'catalog' | 'studio' | 'reports' | 'about';

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(INITIAL_LESSONS[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [hubTab, setHubTab] = useState<HubTab>('catalog');
  const [isKazakh, setIsKazakh] = useState(true);

  // Live session state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isStudentPaced, setIsStudentPaced] = useState(false);
  const [hideStudentNames, setHideStudentNames] = useState(false);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: 's-curr',
    name: 'Айгерім Қасымова',
    score: 2850,
    joinedAt: '10:00',
    isOnline: true,
    avatarSeed: 'Aigerim',
    drawings: {},
    quizAnswers: {},
    openAnswers: {},
  });

  // Dynamic Collaborate Board state
  const [collaborateNotes, setCollaborateNotes] = useState<Record<string, CollaborateNote[]>>({
    'cell-slide-5': INITIAL_LESSONS[0].slides[4]?.collaborate?.notes || [],
    'mars-slide-4': INITIAL_LESSONS[1]?.slides[3]?.collaborate?.notes || [],
  });

  // Modals
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // --- Handlers ---
  const handleOpenJoinModal = () => {
    setIsJoinModalOpen(true);
  };

  const handleJoinByCode = (code: string, studentName?: string) => {
    const cleanCode = code.trim().toUpperCase();
    const foundLesson = lessons.find((l) => l.code === cleanCode) || lessons[0];

    setCurrentLesson(foundLesson);
    setCurrentSlideIndex(0);

    const name = studentName || (isKazakh ? 'Оқушы' : 'Student');
    const newStudent: Student = {
      id: 'student-' + Date.now(),
      name,
      score: 2000,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOnline: true,
      avatarSeed: name,
      drawings: {},
      quizAnswers: {},
      openAnswers: {},
    };

    setCurrentStudent(newStudent);
    // Add to students list if not present
    if (!students.some((s) => s.name === name)) {
      setStudents((prev) => [newStudent, ...prev]);
    }

    setIsJoinModalOpen(false);
    setViewMode('student_live');
  };

  const handleStartTeacherLive = (lessonToStart?: Lesson) => {
    const target = lessonToStart || currentLesson;
    setCurrentLesson(target);
    setCurrentSlideIndex(0);
    setViewMode('teacher_live');
  };

  const handleStartStudentLive = (lessonToStart?: Lesson) => {
    const target = lessonToStart || currentLesson;
    setCurrentLesson(target);
    setCurrentSlideIndex(0);
    setViewMode('student_live');
  };

  const handleAddCollaborateNote = (note: CollaborateNote) => {
    const currentSlideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    setCollaborateNotes((prev) => ({
      ...prev,
      [currentSlideId]: [note, ...(prev[currentSlideId] || [])],
    }));
  };

  const handleLikeCollaborateNote = (noteId: string) => {
    const currentSlideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    setCollaborateNotes((prev) => {
      const list = prev[currentSlideId] || [];
      return {
        ...prev,
        [currentSlideId]: list.map((n) => (n.id === noteId ? { ...n, likes: n.likes + 1 } : n)),
      };
    });
  };

  const handleSaveDrawing = (dataUrl: string) => {
    const currentSlideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    setCurrentStudent((prev) => ({
      ...prev,
      drawings: { ...prev.drawings, [currentSlideId]: dataUrl },
    }));
  };

  const handleQuizAnswer = (optionId: string, isCorrect: boolean, points: number) => {
    const currentSlideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    setCurrentStudent((prev) => ({
      ...prev,
      score: prev.score + points,
      quizAnswers: { ...prev.quizAnswers, [currentSlideId]: optionId },
    }));

    // Update in teacher roster
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id ? { ...s, score: s.score + points } : s
      )
    );
  };

  const handleOpenEndedAnswer = (answer: string) => {
    const currentSlideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    setCurrentStudent((prev) => ({
      ...prev,
      openAnswers: { ...prev.openAnswers, [currentSlideId]: answer },
    }));
  };

  const handleQuickPoll = () => {
    // Add quick poll slide on the fly to lesson
    const quickPollSlide = {
      id: 'quick-poll-' + Date.now(),
      type: 'poll' as const,
      title: isKazakh ? 'Жылдам сауалнама: Түсінікті ме?' : 'Quick Check: Understood?',
      poll: {
        question: isKazakh
          ? 'Осы түсіндірілген бөлім бойынша қаншалықты сенімдісіз?'
          : 'How confident are you with this topic right now?',
        options: [
          isKazakh ? '100% бәрі анық әрі түсінікті' : 'Completely clear (100%)',
          isKazakh ? 'Жалпы түсіндім, бірақ сұрақтарым бар' : 'Mostly clear, few questions',
          isKazakh ? 'Қайта түсіндіруді қажет етемін' : 'Need teacher review'
        ]
      }
    };

    const updatedSlides = [...currentLesson.slides];
    updatedSlides.splice(currentSlideIndex + 1, 0, quickPollSlide);
    const updatedLesson = { ...currentLesson, slides: updatedSlides, slidesCount: updatedSlides.length };

    setCurrentLesson(updatedLesson);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  // --- Render Views ---
  if (viewMode === 'student_live') {
    const slideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    return (
      <StudentView
        lesson={currentLesson}
        student={currentStudent}
        currentSlideIndex={currentSlideIndex}
        isStudentPaced={isStudentPaced}
        onSlideChange={setCurrentSlideIndex}
        onExit={() => setViewMode('hub')}
        collaborateNotes={collaborateNotes[slideId] || []}
        onAddCollaborateNote={handleAddCollaborateNote}
        onLikeCollaborateNote={handleLikeCollaborateNote}
        onSaveDrawing={handleSaveDrawing}
        onQuizAnswer={handleQuizAnswer}
        onOpenEndedAnswer={handleOpenEndedAnswer}
        allStudents={students}
        isKazakh={isKazakh}
      />
    );
  }

  if (viewMode === 'teacher_live') {
    const slideId = currentLesson.slides[currentSlideIndex]?.id || 'default';
    return (
      <TeacherDashboard
        lesson={currentLesson}
        currentSlideIndex={currentSlideIndex}
        onSlideChange={setCurrentSlideIndex}
        isStudentPaced={isStudentPaced}
        onToggleStudentPaced={() => setIsStudentPaced(!isStudentPaced)}
        students={students}
        collaborateNotes={collaborateNotes[slideId] || []}
        hideStudentNames={hideStudentNames}
        onToggleHideNames={() => setHideStudentNames(!hideStudentNames)}
        onEndSession={() => {
          setViewMode('hub');
          setHubTab('reports');
        }}
        onQuickPoll={handleQuickPoll}
        isKazakh={isKazakh}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 3-Zone Top Bar Contract */}
      <Navbar
        currentTab={hubTab}
        onSelectTab={setHubTab}
        onOpenJoinModal={handleOpenJoinModal}
        onStartTeacherSession={() => handleStartTeacherLive()}
        isKazakh={isKazakh}
        onToggleLang={() => setIsKazakh(!isKazakh)}
      />

      {/* Main Content Areas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {hubTab === 'catalog' && (
          <div className="space-y-8">
            <HeroSection
              onJoinCode={(code) => handleJoinByCode(code)}
              onExploreLessons={() => {}}
              onOpenStudio={() => setHubTab('studio')}
              isKazakh={isKazakh}
            />

            <div>
              <div className="mb-4">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider font-mono">
                  {isKazakh ? 'Интерактивті сабақтар кітапханасы' : 'Curated Curriculum Library'}
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  {isKazakh ? 'Дайын сабақтар жинағы' : 'Explore Ready-To-Teach Lessons'}
                </h2>
              </div>

              <LessonCatalog
                lessons={lessons}
                onLaunchTeacherLive={(lesson) => handleStartTeacherLive(lesson)}
                onLaunchStudentLive={(lesson) => handleStartStudentLive(lesson)}
                onEditInStudio={(lesson) => {
                  setCurrentLesson(lesson);
                  setHubTab('studio');
                }}
                isKazakh={isKazakh}
              />
            </div>
          </div>
        )}

        {hubTab === 'studio' && (
          <LessonEditor
            initialLesson={currentLesson}
            onSaveLesson={(saved) => {
              setLessons((prev) => {
                const idx = prev.findIndex((l) => l.id === saved.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = saved;
                  return updated;
                }
                return [saved, ...prev];
              });
              setCurrentLesson(saved);
            }}
            onLaunchLesson={(lesson) => {
              setCurrentLesson(lesson);
              handleStartTeacherLive(lesson);
            }}
            isKazakh={isKazakh}
          />
        )}

        {hubTab === 'reports' && (
          <SessionReports
            lesson={currentLesson}
            students={students}
            isKazakh={isKazakh}
            onLaunchNewSession={() => handleStartTeacherLive()}
          />
        )}

        {hubTab === 'about' && (
          <AboutNearpod
            onStartTeaching={() => handleStartTeacherLive()}
            onJoinLesson={handleOpenJoinModal}
            isKazakh={isKazakh}
          />
        )}
      </main>

      {/* Student Join Code Modal */}
      <StudentJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinByCode}
        isKazakh={isKazakh}
      />

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
              N
            </div>
            <span className="font-semibold text-slate-700 font-display">Nearpod Interactive</span>
            <span>·</span>
            <span>{isKazakh ? 'Интербелсенді оқыту платформасы' : 'Interactive Classroom Learning'}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => setHubTab('catalog')} className="hover:text-slate-900 transition-colors">
              {isKazakh ? 'Каталог' : 'Explore'}
            </button>
            <button onClick={() => setHubTab('studio')} className="hover:text-slate-900 transition-colors">
              {isKazakh ? 'Студия' : 'Studio'}
            </button>
            <button onClick={() => setHubTab('reports')} className="hover:text-slate-900 transition-colors">
              {isKazakh ? 'Есептер' : 'Reports'}
            </button>
            <button onClick={() => setHubTab('about')} className="hover:text-slate-900 transition-colors">
              {isKazakh ? 'Қалай жұмыс істейді' : 'How it works'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
