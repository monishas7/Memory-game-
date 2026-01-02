
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Difficulty, Levels, CardType } from './types';
import { EMOJIS } from './constants';
import Card from './components/Card';
import GameStats from './components/GameStats';
import WinModal from './components/WinModal';
import { getCheerMessage, getGameStartMessage } from './services/geminiService';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [cheer, setCheer] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fix: Replaced NodeJS.Timeout with any to avoid "Cannot find namespace 'NodeJS'" error in browser environments
  const timerRef = useRef<any>(null);

  const initGame = useCallback((level: Difficulty) => {
    const config = Levels[level];
    const pairsCount = (config.rows * config.cols) / 2;
    
    // Shuffle and pick emojis
    const selectedEmojis = [...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsCount);

    const gameCards: CardType[] = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: `card-${index}`,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameStatus(GameStatus.PLAYING);
    setCheer("");

    // AI Greeting
    getGameStartMessage().then(msg => setCheer(msg));
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING) {
      // Fix: Explicitly use window.setInterval for clarity in browser environment
      timerRef.current = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Win condition check
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameStatus(GameStatus.WON);
    }
  }, [cards]);

  const handleCardClick = (id: string) => {
    if (isProcessing || flippedCards.length >= 2) return;

    const newCards = [...cards];
    const clickedCard = newCards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    clickedCard.isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlipped, newCards);
    }
  };

  const checkMatch = (currentFlipped: string[], currentCards: CardType[]) => {
    const [id1, id2] = currentFlipped;
    const card1 = currentCards.find(c => c.id === id1)!;
    const card2 = currentCards.find(c => c.id === id2)!;

    if (card1.value === card2.value) {
      // It's a match!
      card1.isMatched = true;
      card2.isMatched = true;
      setCards([...currentCards]);
      setFlippedCards([]);
      
      // AI Cheer
      getCheerMessage(card1.value).then(msg => setCheer(msg));
    } else {
      // No match
      setIsProcessing(true);
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        setCards([...currentCards]);
        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const currentLevel = Levels[difficulty];

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-fredoka text-sky-500 drop-shadow-sm flex items-center justify-center gap-3">
          <i className="fas fa-paw"></i>
          Tom's Match
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Memory Trainer</p>
      </header>

      {gameStatus === GameStatus.IDLE ? (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border-b-8 border-gray-100 mt-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🐱</span>
            </div>
            <h2 className="text-2xl font-fredoka text-gray-700">Choose Difficulty</h2>
          </div>

          <div className="flex flex-col gap-4">
            {(Object.keys(Levels) as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-4 rounded-2xl font-bold transition-all shadow-md ${
                  difficulty === level 
                    ? 'bg-sky-500 text-white scale-105 shadow-sky-200' 
                    : 'bg-sky-50 text-sky-500 hover:bg-sky-100'
                }`}
              >
                {Levels[level].name} ({Levels[level].rows}x{Levels[level].cols})
              </button>
            ))}

            <button
              onClick={() => initGame(difficulty)}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-5 rounded-3xl shadow-lg border-b-8 border-yellow-600 transition-all active:translate-y-2 active:border-b-0 text-xl"
            >
              START GAME
            </button>
          </div>
        </div>
      ) : (
        <>
          <GameStats moves={moves} time={time} />

          {/* AI Sidekick Box */}
          <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-4 border-l-4 border-yellow-400 min-h-[80px]">
            <div className="text-3xl flex-shrink-0 animate-bounce">🐱</div>
            <p className="text-sm font-bold text-gray-600 italic">
              {cheer || "Match the animals to win!"}
            </p>
          </div>

          {/* Grid */}
          <div 
            className="grid gap-3 w-full max-w-2xl mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${currentLevel.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${currentLevel.rows}, minmax(0, 1fr))`
            }}
          >
            {cards.map((card) => (
              <Card 
                key={card.id} 
                card={card} 
                onClick={handleCardClick}
                disabled={isProcessing}
              />
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setGameStatus(GameStatus.IDLE)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-6 py-3 rounded-2xl font-bold transition-all"
            >
              <i className="fas fa-cog mr-2"></i> LEVEL
            </button>
            <button
              onClick={() => initGame(difficulty)}
              className="bg-white hover:bg-sky-50 text-sky-500 px-8 py-3 rounded-2xl font-bold shadow-md border-b-4 border-sky-100 transition-all active:translate-y-1 active:border-b-0"
            >
              <i className="fas fa-rotate mr-2"></i> RESTART
            </button>
          </div>
        </>
      )}

      {gameStatus === GameStatus.WON && (
        <WinModal 
          moves={moves} 
          time={time} 
          onRestart={() => initGame(difficulty)} 
        />
      )}

      {/* Footer / Branding */}
      <footer className="mt-auto py-8 text-gray-400 text-sm font-medium">
        Made for Animal Lovers 🐾
      </footer>
    </div>
  );
};

export default App;
