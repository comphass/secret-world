
import React from 'react';

interface GameBackgroundProps {
  children: React.ReactNode;
  gameState: 'start' | 'playing' | 'gameOver' | 'ranking';
  starsCount?: number;
  didWin?: boolean;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ children, gameState, starsCount = 0, didWin = true }) => {
  // Determine background based on game state and win/lose condition
  const getBackgroundStyle = () => {
    if (gameState === 'gameOver') {
      return didWin 
        ? { 
            backgroundImage: `url('/lovable-uploads/ef6b3c08-cd49-46ab-a3f7-0247243e40c9.png')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'brightness(1.2) hue-rotate(20deg)' // More green tint for winning
          }
        : {
            backgroundImage: `url('/lovable-uploads/ef6b3c08-cd49-46ab-a3f7-0247243e40c9.png')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'brightness(0.9) hue-rotate(-20deg)' // More red tint for losing
          };
    }
    
    return { 
      backgroundImage: `url('/lovable-uploads/ef6b3c08-cd49-46ab-a3f7-0247243e40c9.png')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    };
  };

  return (
    <section 
      className={`min-h-screen py-8 px-4 relative overflow-hidden ${
        gameState === 'gameOver' && !didWin ? 'bg-gradient-to-b from-red-400 to-red-700' : 
        gameState === 'gameOver' && didWin ? 'bg-gradient-to-b from-green-400 to-green-700' : 
        'bg-gradient-to-b from-blue-400 to-purple-500'
      }`}
      style={getBackgroundStyle()}
    >
      {/* Animated Clouds */}
      <section className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        {gameState === 'playing' && (
          <>
            <span className="cloud cloud-1"></span>
            <span className="cloud cloud-2"></span>
            <span className="cloud cloud-3"></span>
          </>
        )}
        
        {/* Confetti for win, Rain clouds for lose */}
        {gameState === 'gameOver' && didWin && (
          Array.from({ length: 20 }).map((_, index) => (
            <span 
              key={index}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                zIndex: 10
              }}
            >
              <span className="text-yellow-300 rotate-12">✦</span>
            </span>
          ))
        )}
        
        {gameState === 'gameOver' && !didWin && (
          Array.from({ length: 10 }).map((_, index) => (
            <span 
              key={index}
              className="absolute animate-float opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                zIndex: 10,
                transform: 'scale(1.5)'
              }}
            >
              <span className="text-gray-600 cloud" style={{ filter: 'brightness(0.7)' }}></span>
            </span>
          ))
        )}
        
        {/* Stars that increase with correct answers */}
        {gameState === 'playing' && Array.from({ length: starsCount }).map((_, index) => (
          <span 
            key={index}
            className="absolute star-floating animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${index * 0.3}s`,
              zIndex: 10
            }}
          >
            <span className="text-game-gold animate-star-shine">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </span>
          </span>
        ))}
      </section>

      {/* Content */}
      <section className="relative z-10">
        {children}
      </section>
    </section>
  );
};

export default GameBackground;
