
import React from 'react';

interface WinModalProps {
  moves: number;
  time: number;
  onRestart: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ moves, time, onRestart }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center transform animate-in zoom-in duration-300">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-fredoka text-sky-600 mb-2">Great Job!</h2>
        <p className="text-gray-500 mb-6 font-medium">You've matched all the pairs!</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-sky-50 p-4 rounded-2xl">
            <div className="text-xs text-sky-400 uppercase font-bold">Moves</div>
            <div className="text-2xl font-fredoka text-sky-600">{moves}</div>
          </div>
          <div className="bg-pink-50 p-4 rounded-2xl">
            <div className="text-xs text-pink-400 uppercase font-bold">Time</div>
            <div className="text-2xl font-fredoka text-pink-600">{formatTime(time)}</div>
          </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-yellow-600 transition-all active:translate-y-1 active:border-b-0"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default WinModal;
