import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Star, Check, X } from 'lucide-react';
import StartScreen from '@/components/StartScreen';
import GameHeader from '@/components/GameHeader';
import WordDisplay from '@/components/WordDisplay';
import LetterInput from '@/components/LetterInput';
import GameResult from '@/components/GameResult';
import Ranking, { RankingEntry } from '@/components/Ranking';
import { wordList } from '@/data/gameData';
import GameBackground from '@/components/GameBackground';
import SoundButton from '@/components/SoundButton';
import useSoundEffects from '@/utils/useSoundEffects';

// Game states
type GameState = 'start' | 'playing' | 'gameOver' | 'ranking';

const Index = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerName, setPlayerName] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [maskedWord, setMaskedWord] = useState('');
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [maxErrors, setMaxErrors] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | undefined>();
  const [score, setScore] = useState(0);
  const [didWin, setDidWin] = useState(false);
  const [starsCount, setStarsCount] = useState(0);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [currentWordInfo, setCurrentWordInfo] = useState({ explanation: '', verse: '' });
  const [playerRank, setPlayerRank] = useState<number | undefined>(undefined);

  const { toast } = useToast();
  const { playSound, isMuted, toggleMute } = useSoundEffects();

  // Load rankings from localStorage
  useEffect(() => {
    const savedRankings = localStorage.getItem('biblegameRankings');
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings));
    }
  }, []);

  // Save rankings to localStorage
  const saveRankings = useCallback((newRankings: RankingEntry[]) => {
    localStorage.setItem('biblegameRankings', JSON.stringify(newRankings));
    setRankings(newRankings);
  }, []);

  // Start game timer
  const startTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  }, [timerInterval]);

  // Stop game timer
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(undefined);
    }
  }, [timerInterval]);

  // Initialize a new game
  const initializeGame = useCallback(() => {
    // Pick a random word
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const wordInfo = wordList[randomIndex];
    const word = wordInfo.word.toUpperCase();

    // Calculate max errors (40% of word length, rounded up)
    const maxAllowedErrors = Math.ceil(word.length * 0.4);

    // Create masked word with underscores
    const masked = word.replace(/[A-ZÇÁÉÍÓÚÂÊÎÔÛÃÕÄËÏÖÜÑa-zçáéíóúâêîôûãõäëïöüñ]/g, '_');

    setSecretWord(word);
    setMaskedWord(masked);
    setUsedLetters([]);
    setErrors(0);
    setMaxErrors(maxAllowedErrors);
    setSecondsElapsed(0);
    setStarsCount(0);
    setCurrentWordInfo({
      explanation: wordInfo.explanation,
      verse: wordInfo.verse
    });

    startTimer();
    setGameState('playing');
    playSound('start');
  }, [startTimer, playSound]);

  // Start a new game
  const handleStartGame = (name: string) => {
    setPlayerName(name);
    initializeGame();
  };

  // Process a guessed letter
  const handleGuess = (letter: string) => {
    const upperLetter = letter.toUpperCase();
    
    // Add to used letters
    setUsedLetters(prev => [...prev, upperLetter]);
    
    if (secretWord.includes(upperLetter)) {
      // Correct guess
      playSound('correct');
      let newMaskedWord = '';
      let correctGuessCount = 0;
      
      // Reveal all occurrences of the letter
      for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === upperLetter) {
          newMaskedWord += upperLetter;
          correctGuessCount++;
        } else {
          newMaskedWord += maskedWord[i];
        }
      }
      
      setMaskedWord(newMaskedWord);
      
      // Add stars based on unique letters
      const uniqueLettersInWord = new Set(secretWord.split('')).size;
      const uniqueLettersGuessed = new Set([...usedLetters, upperLetter].filter(l => secretWord.includes(l))).size;
      const starCount = Math.min(5, Math.floor((uniqueLettersGuessed / uniqueLettersInWord) * 5));
      
      if (starCount > starsCount) {
        setStarsCount(starCount);
        toast({
          title: "Boa!",
          description: `Você ganhou uma estrela!`,
          action: <Star className="h-5 w-5 text-game-gold" fill="#FFD700" />,
        });
      }
      
      // Check for win
      if (!newMaskedWord.includes('_')) {
        handleGameOver(true);
      }
    } else {
      // Incorrect guess
      playSound('incorrect');
      const newErrors = errors + 1;
      setErrors(newErrors);
      
      // Check for loss
      if (newErrors >= maxErrors) {
        handleGameOver(false);
      }
    }
  };

  // Handle game over
  const handleGameOver = (won: boolean) => {
    stopTimer();
    setDidWin(won);
    
    if (won) {
      playSound('win');
      // Calculate score - HIGHER score is BETTER (inverse of the previous calculation)
      // Base score of 1000, subtract penalties for time and errors
      const timePoints = Math.max(0, 500 - secondsElapsed);
      const errorPoints = Math.max(0, 500 - (errors * 50));
      const finalScore = timePoints + errorPoints;
      
      setScore(finalScore);
      
      // Update rankings
      const newRanking: RankingEntry = {
        name: playerName,
        score: finalScore,
        word: secretWord,
        time: secondsElapsed,
        errors: errors
      };
      
      const newRankings = [...rankings, newRanking]
        .sort((a, b) => b.score - a.score) // Sort in DESCENDING order (higher is better)
        .slice(0, 10);
      
      saveRankings(newRankings);
      
      // Find player's rank
      const rank = newRankings.findIndex(entry => 
        entry.name === playerName && entry.score === finalScore && entry.word === secretWord
      );
      setPlayerRank(rank);
    } else {
      playSound('lose');
    }
    
    setGameState('gameOver');
  };

  // Play again
  const handlePlayAgain = () => {
    initializeGame();
  };

  // Show ranking
  const handleShowRanking = () => {
    setGameState('ranking');
  };

  // Go back to main screen
  const handleBackToMain = () => {
    stopTimer();
    setGameState('start');
  };

  // Render game based on state
  return (
    <GameBackground 
      gameState={gameState} 
      starsCount={starsCount}
      didWin={didWin}
    >
      <SoundButton isMuted={isMuted} toggleMute={toggleMute} />
      
      <div className="max-w-6xl mx-auto w-full px-4">
        {gameState === 'start' && (
          <StartScreen 
            onStart={handleStartGame} 
            onShowRanking={handleShowRanking}
          />
        )}
        
        {gameState === 'playing' && (
          <div className="flex flex-col items-center">
            <GameHeader 
              secondsElapsed={secondsElapsed} 
              errors={errors} 
              maxErrors={maxErrors}
              starsCount={starsCount}
            />
            
            <div className="game-card p-6 w-full">
              <WordDisplay 
                maskedWord={maskedWord} 
                isGameOver={false}
                secretWord={secretWord}
              />
              
              <LetterInput 
                onGuess={handleGuess} 
                disabled={false}
                usedLetters={usedLetters}
              />
            </div>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <GameResult 
            won={didWin}
            secretWord={secretWord}
            time={secondsElapsed}
            errors={errors}
            score={score}
            explanation={currentWordInfo.explanation}
            verse={currentWordInfo.verse}
            onPlayAgain={handlePlayAgain}
            onShowRanking={handleShowRanking}
            onBackToMain={handleBackToMain}
          />
        )}
        
        {gameState === 'ranking' && (
          <Ranking 
            rankings={rankings}
            playerRank={playerRank}
            onBack={handleBackToMain}
          />
        )}
      </div>
    </GameBackground>
  );
};

export default Index;
