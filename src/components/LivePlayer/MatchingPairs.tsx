import React, { useState, useEffect } from 'react';
import { MatchingPairsData } from '../../types/nearpod';
import { CheckCircle2, RefreshCw, Trophy, Sparkles } from 'lucide-react';

interface MatchingPairsProps {
  matching: MatchingPairsData;
  isKazakh: boolean;
  onCompleted: (attempts: number) => void;
}

export const MatchingPairs: React.FC<MatchingPairsProps> = ({
  matching,
  isKazakh,
  onCompleted,
}) => {
  interface CardItem {
    id: string;
    pairId: string;
    text: string;
    type: 'term' | 'definition';
  }

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize and shuffle cards
  useEffect(() => {
    const list: CardItem[] = [];
    matching.pairs.forEach((pair) => {
      list.push({ id: `${pair.id}-term`, pairId: pair.id, text: pair.term, type: 'term' });
      list.push({ id: `${pair.id}-def`, pairId: pair.id, text: pair.definition, type: 'definition' });
    });

    // Shuffle
    list.sort(() => Math.random() - 0.5);
    setCards(list);
    setMatchedPairIds(new Set());
    setSelectedCards([]);
    setAttempts(0);
    setIsCompleted(false);
  }, [matching]);

  const handleCardClick = (card: CardItem) => {
    if (matchedPairIds.has(card.pairId) || isCompleted) return;
    if (selectedCards.length === 1 && selectedCards[0].id === card.id) return;

    if (selectedCards.length === 0) {
      setSelectedCards([card]);
    } else if (selectedCards.length === 1) {
      const first = selectedCards[0];
      const second = card;
      setSelectedCards([first, second]);
      setAttempts((a) => a + 1);

      // Check match
      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        const updated = new Set(matchedPairIds);
        updated.add(first.pairId);
        setMatchedPairIds(updated);
        setSelectedCards([]);

        if (updated.size === matching.pairs.length) {
          setIsCompleted(true);
          onCompleted(attempts + 1);
        }
      } else {
        // Mismatch: delay reset
        setTimeout(() => {
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider font-mono">
              Matching Pairs · {isKazakh ? 'Сәйкестендіру ойыны' : 'Memory Cards'}
            </span>
          </div>
          <h2 className="text-lg font-bold font-display text-white">
            {matching.instruction}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-xs text-emerald-200 font-mono">
            {isKazakh ? 'Талпыныстар саны' : 'Attempts'}
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {attempts}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-6 bg-slate-50 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((card) => {
            const isMatched = matchedPairIds.has(card.pairId);
            const isSelected = selectedCards.some((c) => c.id === card.id);

            let cardStyle = 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800 shadow-xs hover:shadow-md';
            if (isMatched) {
              cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default';
            } else if (isSelected) {
              cardStyle = 'bg-sky-50 border-sky-500 ring-2 ring-sky-400 text-sky-900 scale-102';
            }

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isMatched}
                className={`p-4 min-h-[90px] rounded-xl border flex flex-col justify-center items-center text-center transition-all duration-150 ${cardStyle}`}
              >
                <span className={`text-xs ${card.type === 'term' ? 'font-bold font-display text-sm' : 'text-slate-600 text-xs font-medium'}`}>
                  {card.text}
                </span>
                {isMatched && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isKazakh ? 'Сәйкестік ✓' : 'Matched ✓'}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isCompleted && (
          <div className="mt-6 p-4 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">
                  {isKazakh ? 'Тамаша! Барлық жұптар дұрыс табылды!' : 'Awesome! All pairs successfully matched!'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {isKazakh ? `Сіз ${attempts} талпыныс жасадыңыз` : `Finished in ${attempts} attempts`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
