import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, KeyRound, User } from 'lucide-react';

interface StudentJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string, studentName: string) => void;
  isKazakh: boolean;
}

export const StudentJoinModal: React.FC<StudentJoinModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  isKazakh,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanCode) {
      setError(isKazakh ? 'Сабақ кодын енгізіңіз (мысалы: BIO26)' : 'Please enter lesson code (e.g. BIO26)');
      return;
    }
    if (!cleanName) {
      setError(isKazakh ? 'Есіміңізді жазыңыз' : 'Please enter your name');
      return;
    }

    setError('');
    onJoin(cleanCode, cleanName);
  };

  const handleQuickCode = (quickCode: string) => {
    setCode(quickCode);
    if (!name) {
      setName(isKazakh ? 'Айгерім' : 'Alex');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-display">
            {isKazakh ? 'Сабаққа қосылу' : 'Join a Lesson'}
          </h2>
          <p className="text-sky-100 text-xs mt-1">
            {isKazakh
              ? 'Мұғаліміңіз берген 5 таңбалы кодты енгізіп, сыныппен бірге интерактивті сабаққа қатысыңыз.'
              : 'Enter the 5-character code shared by your teacher to jump straight into the live interactive session.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isKazakh ? 'Сабақ коды (CODE)' : 'Lesson Code'}
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="BIO26"
                className="w-full px-4 py-3 text-center text-2xl font-bold font-mono tracking-widest text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:bg-white focus:outline-none uppercase transition-all"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isKazakh ? 'Сіздің атыңыз (Оқушы)' : 'Your Name'}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder={isKazakh ? 'Мысалы: Айгерім, Әлихан' : 'e.g. Alex, Sarah'}
                className="w-full pl-11 pr-4 py-2.5 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          {/* Quick Demo Codes */}
          <div className="pt-2">
            <span className="text-xs text-slate-500 block mb-2 font-medium">
              {isKazakh ? 'Тестілеуге арналған дайын кодтар:' : 'Demo lesson codes to try:'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickCode('BIO26')}
                className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-md border border-slate-200 transition-colors"
              >
                BIO26 (Биология)
              </button>
              <button
                type="button"
                onClick={() => handleQuickCode('MARS9')}
                className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-md border border-slate-200 transition-colors"
              >
                MARS9 (Марс VR)
              </button>
              <button
                type="button"
                onClick={() => handleQuickCode('SILK7')}
                className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-md border border-slate-200 transition-colors"
              >
                SILK7 (Жібек жолы)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>{isKazakh ? 'Сабаққа кіру' : 'Join Lesson'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
