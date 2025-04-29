
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LetterInputProps {
  onGuess: (letter: string) => void;
  disabled: boolean;
  usedLetters: string[];
}

const LetterInput: React.FC<LetterInputProps> = ({ onGuess, disabled, usedLetters }) => {
  const [letter, setLetter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!letter) {
      toast.error("Por favor, digite uma letra");
      return;
    }
    
    const normalizedLetter = letter.toUpperCase();
    
    if (!/^[A-ZÇÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÄËÏÖÜÑa-zçáéíóúâêîôûàèìòùãõäëïöüñ]$/.test(normalizedLetter)) {
      toast.error("Por favor, digite apenas uma letra");
      setLetter('');
      return;
    }
    
    if (usedLetters.includes(normalizedLetter)) {
      toast.warning("Você já usou esta letra");
      setLetter('');
      return;
    }
    
    onGuess(normalizedLetter);
    setLetter('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8">
      <div className="flex flex-col sm:flex-row mb-6 w-full max-w-sm gap-3">
        <Input
          ref={inputRef}
          type="text"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={1}
          className="text-center text-4xl font-bold h-20 bg-white/90"
          placeholder="?"
          aria-label="Digite uma letra"
          disabled={disabled}
          autoComplete="off"
        />
        <Button 
          type="submit" 
          disabled={disabled}
          className="bg-game-purple hover:bg-game-purple/90 transition-all duration-300 h-20 text-2xl font-bold"
        >
          Adivinhar
        </Button>
      </div>
      
      <div className="flex flex-wrap justify-center max-w-xl gap-2 mt-3">
        {usedLetters.length > 0 && (
          <div className="w-full text-center mb-3 text-xl font-medium bg-white/80 rounded-full px-4 py-2 shadow-sm">
            Letras usadas:
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-2 p-3 bg-white/50 rounded-lg shadow-inner">
          {usedLetters.map((usedLetter, index) => {
            const correctLetter = document.querySelector('.letter-box.revealed')?.textContent?.includes(usedLetter);
            return (
              <div 
                key={index} 
                className={`used-letter ${correctLetter ? 'correct' : 'incorrect'} text-2xl w-12 h-12 flex items-center justify-center`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {usedLetter}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default LetterInput;
