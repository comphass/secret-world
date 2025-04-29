
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star } from 'lucide-react';

interface StartScreenProps {
  onStart: (playerName: string) => void;
  onShowRanking: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowRanking }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onStart(playerName.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center bg-game-blue/10 rounded-t-lg">
        <div className="flex justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={i === 2 ? 32 : 24} 
              fill="#FFD700" 
              className="text-game-gold mx-1 animate-star-shine" 
              style={{animationDelay: `${i * 0.2}s`}}
            />
          ))}
        </div>
        <CardTitle className="text-3xl sm:text-4xl text-game-blue">
          Descubra a Palavra
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <p className="mb-4 text-lg">
            Adivinhe as letras para descobrir características 
            especiais de Deus e aprenda sobre Ele!
          </p>
          <div className="bg-game-light-purple p-3 rounded-lg inline-block">
            <p className="text-base">
              <span className="font-bold text-game-purple">Regras:</span> Tente adivinhar a palavra com o menor 
              número de erros e no menor tempo possível!
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block mb-2 font-medium text-xl">
              Qual é o seu nome?
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full text-xl py-6"
              placeholder="Digite seu nome aqui"
              required
              autoComplete="off"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSubmit} 
          className="w-full sm:w-auto bg-game-green hover:bg-game-green/90 text-xl py-6"
          disabled={!playerName.trim()}
        >
          Começar a Jogar
        </Button>
        <Button 
          onClick={onShowRanking} 
          variant="outline" 
          className="w-full sm:w-auto flex items-center gap-2 text-xl py-6"
        >
          <Trophy size={20} className="text-game-gold" />
          Ver Ranking
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StartScreen;
