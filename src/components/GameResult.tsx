
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy, Home } from 'lucide-react';

interface GameResultProps {
  won: boolean;
  secretWord: string;
  time: number;
  errors: number;
  score: number;
  explanation: string;
  verse: string;
  onPlayAgain: () => void;
  onShowRanking: () => void;
  onBackToMain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  won,
  secretWord,
  time,
  errors,
  score,
  explanation,
  verse,
  onPlayAgain,
  onShowRanking,
  onBackToMain
}) => {
  return (
    <Card className={`w-full max-w-3xl mx-auto animate-fade-in shadow-2xl ${won ? 'border-green-500' : 'border-red-500'} border-4`}>
      <CardHeader className={`${won ? 'bg-green-500/90' : 'bg-red-500/90'} rounded-t-lg`}>
        <CardTitle className="text-center flex items-center justify-center gap-2 text-white text-2xl md:text-3xl">
          {won ? (
            <>
              <Star className="text-yellow-300" fill="#FFD700" />
              <span>Parabéns! Você venceu!</span>
              <Star className="text-yellow-300" fill="#FFD700" />
            </>
          ) : (
            <span>Não foi dessa vez...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={`pt-6 ${won ? 'bg-green-100' : 'bg-red-100'}`}>
        {won ? (
          <>
            <div className="text-center mb-4">
              <p className="text-2xl mb-2">
                Você acertou a palavra <span className="font-bold text-game-purple">{secretWord}</span>!
              </p>
              <p className="text-xl">
                Tempo: <span className="font-semibold">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span> • 
                Erros: <span className="font-semibold">{errors}</span> • 
                Pontuação: <span className="font-bold text-game-blue">{score}</span>
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg mb-4 border-2 border-green-300 shadow-md">
              <h3 className="font-bold text-game-purple mb-2 text-xl">Você aprendeu:</h3>
              <p className="mb-4 text-lg">{explanation}</p>
              
              {/* Highlighted verse with special styling - animation removed */}
              <div className="p-5 bg-game-light-purple rounded-lg border-l-4 border-game-purple shadow-inner">
                <p className="italic text-xl font-semibold text-game-purple leading-relaxed">
                  "{verse}"
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center mb-6 p-6">
            <p className="text-2xl mb-4">
              A palavra era: <span className="font-bold text-game-purple text-3xl">{secretWord}</span>
            </p>
            <p className="text-xl">Não desista! Tente novamente e descubra mais sobre Deus!</p>
          </div>
        )}
      </CardContent>
      <CardFooter className={`flex flex-col sm:flex-row gap-3 justify-center ${won ? 'bg-green-100' : 'bg-red-100'} rounded-b-lg p-6`}>
        <Button 
          onClick={onPlayAgain} 
          className={`${won ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} w-full sm:w-auto text-xl py-6`}
        >
          Jogar Novamente
        </Button>
        {won && (
          <Button 
            onClick={onShowRanking} 
            variant="outline" 
            className="w-full sm:w-auto flex gap-2 items-center text-xl py-6 bg-white"
          >
            <Trophy size={20} className="text-game-gold" />
            Ver Ranking
          </Button>
        )}
        <Button 
          onClick={onBackToMain} 
          variant="outline" 
          className="w-full sm:w-auto flex gap-2 items-center text-xl py-6 bg-white border-gray-300"
        >
          <Home size={20} className="text-gray-600" />
          Voltar ao Início
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameResult;
