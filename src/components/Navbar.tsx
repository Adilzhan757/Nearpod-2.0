import React from 'react';
import { LogIn, Sparkles, Presentation, BookOpen, BarChart3, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'studio' | 'reports' | 'about';
  onSelectTab: (tab: 'catalog' | 'studio' | 'reports' | 'about') => void;
  onOpenJoinModal: () => void;
  onStartTeacherSession: () => void;
  isKazakh: boolean;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenJoinModal,
  onStartTeacherSession,
  isKazakh,
  onToggleLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('catalog')}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Nearpod
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors whitespace-nowrap hover:text-sky-600 ${
              currentTab === 'catalog' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            {isKazakh ? 'Каталог' : 'Explore'}
          </button>
          <button
            onClick={() => onSelectTab('studio')}
            className={`transition-colors whitespace-nowrap hover:text-sky-600 ${
              currentTab === 'studio' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            {isKazakh ? 'Сабақ студиясы' : 'Lesson Studio'}
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`transition-colors whitespace-nowrap hover:text-sky-600 ${
              currentTab === 'reports' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            {isKazakh ? 'Есептер' : 'Reports'}
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`transition-colors whitespace-nowrap hover:text-sky-600 ${
              currentTab === 'about' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            {isKazakh ? 'Мүмкіндіктер' : 'Features'}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <button
            onClick={onToggleLang}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Тілді ауыстыру / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{isKazakh ? 'ҚАЗ' : 'ENG'}</span>
          </button>

          {/* Student Join Button */}
          <button
            onClick={onOpenJoinModal}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap"
          >
            {isKazakh ? 'Кодпен кіру' : 'Join a Lesson'}
          </button>

          {/* Teacher Launch Button */}
          <button
            onClick={onStartTeacherSession}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <Presentation className="w-4 h-4" />
            <span>{isKazakh ? 'Сабақты өткізу' : 'Teach Live'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
