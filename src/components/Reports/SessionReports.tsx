import React, { useState } from 'react';
import { Lesson, Student } from '../../types/nearpod';
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Award, 
  Clock, 
  FileSpreadsheet, 
  Share2,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface SessionReportsProps {
  lesson: Lesson;
  students: Student[];
  isKazakh: boolean;
  onLaunchNewSession: () => void;
}

export const SessionReports: React.FC<SessionReportsProps> = ({
  lesson,
  students,
  isKazakh,
  onLaunchNewSession,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Computed metrics
  const totalStudents = students.length;
  const avgScore = Math.round(students.reduce((acc, s) => acc + s.score, 0) / (totalStudents || 1));
  const participationRate = 96; // percentage
  const quizAccuracy = 88; // percentage

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Score,Status,Participation\n' +
      students.map((s, i) => `${i + 1},"${s.name}",${s.score},Completed,100%`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nearpod_Report_${lesson.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider font-mono">
              Nearpod Reports · {isKazakh ? 'Сынып нәтижелері мен талдау' : 'Post-Session Analytics'}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" /> 2026-09-29
            </span>
            <span>·</span>
            <span className="font-mono">CODE: {lesson.code}</span>
            <span>·</span>
            <span>{lesson.grade}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{downloadSuccess ? (isKazakh ? 'Жүктелді ✓' : 'Exported ✓') : (isKazakh ? 'CSV жүктеу' : 'Export CSV')}</span>
          </button>

          <button
            onClick={onLaunchNewSession}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>{isKazakh ? 'Жаңа сабақты өткізу' : 'Teach Again'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (60-30-10 discipline) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>{isKazakh ? 'Орташа дұрыстық' : 'Overall Accuracy'}</span>
            <span className="text-emerald-600 font-bold font-mono">↑ 6%</span>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 font-mono tabular-nums">
            {quizAccuracy}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKazakh ? 'Time to Climb викториналары бойынша' : 'Across all quiz assessments'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>{isKazakh ? 'Қатысу белсенділігі' : 'Participation Rate'}</span>
            <span className="text-sky-600 font-bold font-mono">96%</span>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 font-mono tabular-nums">
            {participationRate}%
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKazakh ? 'Интерактивті слайдтарға жауап беру' : 'Interactive slides responded'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>{isKazakh ? 'Қатысушылар саны' : 'Students Enrolled'}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKazakh ? 'Барлық оқушылар сессияны аяқтады' : 'All students completed lesson'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>{isKazakh ? 'Орташа ұпай қоры' : 'Average Score'}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-display text-amber-600 font-mono tabular-nums">
            {avgScore} <span className="text-base text-slate-400 font-normal">pts</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKazakh ? 'Сынып бойынша ең жоғары: 2850 pts' : 'Class peak: 2,850 pts'}
          </div>
        </div>
      </div>

      {/* Student Roster Table with Tabular Figures */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-slate-900">
            {isKazakh ? 'Оқушылардың жеке нәтижелері' : 'Student Performance Roster'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {totalStudents} {isKazakh ? 'оқушы' : 'records'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider font-mono">
                <th className="py-3 px-6">#</th>
                <th className="py-3 px-6">{isKazakh ? 'Оқушының аты-жөні' : 'Student Name'}</th>
                <th className="py-3 px-6 text-right font-mono tabular-nums">{isKazakh ? 'Ұпайы' : 'Score'}</th>
                <th className="py-3 px-6 text-center">{isKazakh ? 'Draw It' : 'Draw It'}</th>
                <th className="py-3 px-6 text-center">{isKazakh ? 'Collaborate' : 'Board'}</th>
                <th className="py-3 px-6 text-center">{isKazakh ? 'Нәтиже' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, idx) => {
                const isTop = idx < 3;
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-mono text-slate-400 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                          {student.name.charAt(0)}
                        </span>
                        <span>{student.name}</span>
                        {isTop && (
                          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            TOP {idx + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {student.score} pts
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isKazakh ? 'Тапсырды' : 'Done'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isKazakh ? 'Қатысты' : 'Active'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        100% {isKazakh ? 'Меңгерді' : 'Mastered'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
