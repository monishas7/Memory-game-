
import React from 'react';
import { CardType } from '../types';
import { COLORS } from '../constants';

interface CardProps {
  card: CardType;
  onClick: (id: string) => void;
  disabled: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div 
      className={`relative w-full aspect-[4/5] cursor-pointer perspective-1000 ${isRevealed ? 'flipped' : ''}`}
      onClick={() => !disabled && !isRevealed && onClick(card.id)}
    >
      <div className="card-inner w-full h-full relative duration-500">
        {/* Front side (Face down) */}
        <div className={`card-front w-full h-full rounded-xl shadow-lg flex items-center justify-center border-4 border-white ${COLORS.cardBack}`}>
          <div className="text-white text-3xl opacity-50">
            <i className="fas fa-paw"></i>
          </div>
        </div>

        {/* Back side (Face up) */}
        <div className={`card-back w-full h-full rounded-xl shadow-lg flex items-center justify-center border-4 border-sky-400 bg-white`}>
          <span className="text-4xl md:text-5xl drop-shadow-sm select-none">
            {card.value}
          </span>
          {card.isMatched && (
            <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
              <div className="bg-white rounded-full p-1 animate-bounce">
                <i className="fas fa-check text-green-500 text-sm"></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
