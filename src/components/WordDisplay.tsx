
import React from 'react';

interface WordDisplayProps {
  maskedWord: string;
  isGameOver: boolean;
  secretWord: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ maskedWord, isGameOver, secretWord }) => {
  return (
    <section className="mb-8 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-game-blue bg-white/80 px-6 py-3 rounded-full shadow-md">
        Descubra a Palavra:
      </h1>
      
      <section className="letter-container flex flex-wrap justify-center gap-3 md:gap-4">
        {isGameOver 
          ? secretWord.split('').map((letter, index) => (
              <span 
                key={index} 
                className="letter-box revealed animate-float w-14 h-14 md:w-16 md:h-16 text-4xl md:text-5xl"
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <span className="flex items-center justify-center h-full w-full">
                  {letter}
                </span>
              </span>
            ))
          : maskedWord.split('').map((char, index) => (
              <span 
                key={index} 
                className={`letter-box ${char !== '_' ? 'revealed letter-pop' : ''} w-14 h-14 md:w-16 md:h-16 text-4xl md:text-5xl`}
                style={{ 
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <span className="flex items-center justify-center h-full w-full">
                  {char !== '_' ? char : ''}
                </span>
              </span>
            ))
        }
      </section>
    </section>
  );
};

export default WordDisplay;
