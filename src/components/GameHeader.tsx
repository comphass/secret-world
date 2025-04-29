
import React from 'react';
import { Star, Clock, AlertTriangle } from 'lucide-react';

interface GameHeaderProps {
  secondsElapsed: number;
  errors: number;
  maxErrors: number;
  starsCount: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  secondsElapsed, 
  errors, 
  maxErrors,
  starsCount
}) => {
  
  // Format the time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 game-card card-gradient-1 mb-6 w-full">
      <div className="flex items-center mb-4 sm:mb-0 space-x-3">
        <div className="flex items-center bg-game-blue/80 text-white p-2 rounded-lg shadow-md">
          <Clock className="mr-1 h-5 w-5" />
          <span className="font-bold">{formatTime(secondsElapsed)}</span>
        </div>
        <div className={`flex items-center p-2 rounded-lg shadow-md ${errors > maxErrors/2 ? 'bg-red-500/80 text-white' : 'bg-gray-100/80'}`}>
          <AlertTriangle className={`mr-1 h-5 w-5 ${errors > maxErrors/2 ? 'text-white' : 'text-gray-600'}`} />
          <span className="font-bold">{errors} / {maxErrors}</span>
        </div>
      </div>
      <div className="flex items-center bg-white/70 p-2 rounded-lg shadow-md">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={24}
            className={i < starsCount ? "star" : "text-gray-300"}
            fill={i < starsCount ? "#FFD700" : "none"}
            strokeWidth={i < starsCount ? 0 : 2}
          />
        ))}
      </div>
    </div>
  );
};

export default GameHeader;
