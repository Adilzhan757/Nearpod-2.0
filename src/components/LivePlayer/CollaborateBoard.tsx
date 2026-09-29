import React, { useState } from 'react';
import { CollaborateBoardData, CollaborateNote } from '../../types/nearpod';
import { Heart, Plus, Sparkles, MessageSquare, Send, Check } from 'lucide-react';

interface CollaborateBoardProps {
  board: CollaborateBoardData;
  studentName: string;
  onAddNote: (note: CollaborateNote) => void;
  onLikeNote: (noteId: string) => void;
  isKazakh: boolean;
}

export const CollaborateBoard: React.FC<CollaborateBoardProps> = ({
  board,
  studentName,
  onAddNote,
  onLikeNote,
  isKazakh,
}) => {
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'blue' | 'pink' | 'green'>('yellow');
  const [likedNoteIds, setLikedNoteIds] = useState<Set<string>>(new Set());

  const colorStyles = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-950',
    blue: 'bg-sky-50 border-sky-200 text-sky-950',
    pink: 'bg-rose-50 border-rose-200 text-rose-950',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-950',
  };

  const colorPickers = [
    { key: 'yellow', label: 'Yellow', bg: 'bg-amber-300' },
    { key: 'blue', label: 'Blue', bg: 'bg-sky-300' },
    { key: 'pink', label: 'Pink', bg: 'bg-rose-300' },
    { key: 'green', label: 'Green', bg: 'bg-emerald-300' },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote: CollaborateNote = {
      id: 'note-' + Date.now(),
      authorName: studentName || (isKazakh ? 'Оқушы' : 'Student'),
      content: content.trim(),
      color: selectedColor,
      likes: 1,
      timestamp: isKazakh ? 'Жаңа ғана' : 'Just now',
    };

    onAddNote(newNote);
    setContent('');
  };

  const handleToggleLike = (noteId: string) => {
    const updated = new Set(likedNoteIds);
    if (!updated.has(noteId)) {
      updated.add(noteId);
      setLikedNoteIds(updated);
      onLikeNote(noteId);
    }
  };

  return (
    <div className="bg-slate-100/90 rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Board Header / Topic Prompt */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white relative">
        <div className="flex items-center gap-2 mb-1 text-amber-200 text-xs font-mono font-bold uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Collaborate Board · {isKazakh ? 'Ой бөлісу тақтасы' : 'Brainstorm'}</span>
        </div>
        <h2 className="text-xl font-bold font-display text-white">
          {board.topic}
        </h2>
        {board.description && (
          <p className="text-xs text-amber-100 mt-1 max-w-3xl leading-relaxed">
            {board.description}
          </p>
        )}
      </div>

      {/* Main Corkboard Wall & Sticky Notes */}
      <div className="p-6 min-h-[380px] bg-repeat bg-slate-100 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {board.notes.map((note) => {
            const isLiked = likedNoteIds.has(note.id);
            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-md ${
                  colorStyles[note.color] || colorStyles.yellow
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-black/10 mb-2">
                    <span className="text-xs font-bold font-display truncate">
                      {note.authorName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {note.timestamp}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-end">
                  <button
                    onClick={() => handleToggleLike(note.id)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      isLiked
                        ? 'text-rose-600 bg-rose-100/80 font-bold'
                        : 'text-slate-600 hover:text-rose-600 hover:bg-black/5'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-mono">{note.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input / Post Bar at Bottom */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Color pickers */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {colorPickers.map((cp) => (
              <button
                key={cp.key}
                type="button"
                onClick={() => setSelectedColor(cp.key)}
                className={`w-6 h-6 rounded-md ${cp.bg} transition-all ${
                  selectedColor === cp.key
                    ? 'ring-2 ring-offset-2 ring-slate-800 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={cp.label}
              />
            ))}
          </div>

          {/* Text Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isKazakh ? 'Өз ойыңызды стикерге жазыңыз...' : 'Share your thought on a sticky note...'}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
            />
          </div>

          {/* Post Button */}
          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isKazakh ? 'Стикер жапсыру' : 'Post Note'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
