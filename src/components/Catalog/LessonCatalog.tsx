import React, { useState } from 'react';
import { Lesson } from '../../types/nearpod';
import { 
  Play, 
  Search, 
  Clock, 
  Layers, 
  Users, 
  Star, 
  SlidersHorizontal, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface LessonCatalogProps {
  lessons: Lesson[];
  onLaunchTeacherLive: (lesson: Lesson) => void;
  onLaunchStudentLive: (lesson: Lesson) => void;
  onEditInStudio: (lesson: Lesson) => void;
  isKazakh: boolean;
}

export const LessonCatalog: React.FC<LessonCatalogProps> = ({
  lessons,
  onLaunchTeacherLive,
  onLaunchStudentLive,
  onEditInStudio,
  isKazakh,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const subjects = [
    { id: 'all', label: isKazakh ? 'Барлық пәндер' : 'All Subjects' },
    { id: 'Биология', label: isKazakh ? 'Биология' : 'Biology' },
    { id: 'Астрономия & Физика', label: isKazakh ? 'Астрономия & Физика' : 'Astronomy & Physics' },
    { id: 'Тарих', label: isKazakh ? 'Қазақстан тарихы' : 'History' },
  ];

  const grades = [
    { id: 'all', label: isKazakh ? 'Барлық сыныптар' : 'All Grades' },
    { id: '5-9 сынып', label: isKazakh ? '5-9 сынып' : 'Grades 5-9' },
    { id: '7-8 сынып', label: isKazakh ? '7-8 сынып' : 'Grades 7-8' },
    { id: '6-7 сынып', label: isKazakh ? '6-7 сынып' : 'Grades 6-7' },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject = selectedSubject === 'all' || lesson.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || lesson.grade === selectedGrade;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKazakh ? 'Сабақтар мен тақырыптарды іздеу (мысалы: Жасуша, Марс, Жібек жолы)...' : 'Search lessons (e.g. Plant cell, Mars, Silk Road)...'}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:outline-none transition-all"
            />
          </div>

          {/* Interactive Filter Tabs (functional segmented controls per Section 1.A) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto custom-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedSubject === sub.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade filter & quick stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              {isKazakh ? 'Сынып бойынша сүзу:' : 'Filter by grade:'}
            </span>
            <div className="flex items-center gap-1.5">
              {grades.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    selectedGrade === g.id
                      ? 'bg-sky-100 text-sky-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-slate-500 font-mono">
            {filteredLessons.length} {isKazakh ? 'дайын сабақ табылды' : 'interactive lessons'}
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Thumbnail Header */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-mono font-bold text-amber-300 border border-white/10">
                CODE: {lesson.code}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] font-semibold text-sky-300 block mb-0.5">
                  {lesson.subject}
                </span>
                <h3 className="text-sm font-bold font-display line-clamp-1 text-white">
                  {lesson.title}
                </h3>
              </div>
            </div>

            {/* Content & Metadata (Zero-Pill: clean unboxed text with · separators) */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span>{lesson.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{lesson.durationMin} мин</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{lesson.slidesCount} слайд</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[150px]">
                  {lesson.author}
                </span>
                <span className="font-mono font-semibold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{lesson.rating}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onLaunchTeacherLive(lesson)}
                  className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isKazakh ? 'Тікелей өткізу' : 'Teach Live'}</span>
                </button>

                <button
                  onClick={() => onLaunchStudentLive(lesson)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{isKazakh ? 'Оқушы режімі' : 'Student Mode'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <button
                  onClick={() => setPreviewLesson(lesson)}
                  className="hover:text-sky-600 font-medium underline underline-offset-2"
                >
                  {isKazakh ? 'Слайдтарды қарап шығу' : 'Preview deck'}
                </button>
                <button
                  onClick={() => onEditInStudio(lesson)}
                  className="hover:text-sky-600 font-medium"
                >
                  {isKazakh ? 'Өңдеу & Көшіру' : 'Edit in Studio'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-sky-600 uppercase">
                  {previewLesson.subject} · CODE: {previewLesson.code}
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                  {previewLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {previewLesson.description}
            </p>

            {/* Slide sequence overview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {isKazakh ? 'Сабақ құрылымы:' : 'Included Activities:'}
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {previewLesson.slides.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-700 font-semibold bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
                      {s.type.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewLesson(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                {isKazakh ? 'Жабу' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const target = previewLesson;
                  setPreviewLesson(null);
                  onLaunchTeacherLive(target);
                }}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {isKazakh ? 'Осы сабақты тікелей өткізу' : 'Teach This Lesson Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
