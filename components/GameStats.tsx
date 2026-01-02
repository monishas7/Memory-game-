
import React from 'react';

interface GameStatsProps {
  moves: number;
  time: number;
}

const GameStats: React.FC<GameStatsProps> = ({ moves, time }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-4 justify-center mb-6 w-full max-w-md">
      <div className="flex-1 bg-white rounded-2xl shadow-md p-4 flex flex-col items-center border-b-4 border-sky-500">
        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Moves</span>
        <span className="text-2xl font-fredoka text-sky-600">{moves}</span>
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-md p-4 flex flex-col items-center border-b-4 border-pink-500">
        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Time</span>
        <span className="text-2xl font-fredoka text-pink-600">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default GameStats;
