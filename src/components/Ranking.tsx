
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ArrowLeft, Star } from 'lucide-react';

export interface RankingEntry {
  name: string;
  score: number;
  word: string;
  time: number;
  errors: number;
}

interface RankingProps {
  rankings: RankingEntry[];
  playerRank?: number;
  onBack: () => void;
}

const Ranking: React.FC<RankingProps> = ({ rankings, playerRank, onBack }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="bg-game-blue/10 rounded-t-lg">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Trophy size={24} className="text-game-gold" />
          <span className="text-game-blue">Ranking de Pontuações</span>
          <Trophy size={24} className="text-game-gold" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {rankings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Ainda não há pontuações registradas.</p>
            <p className="text-gray-500">Seja o primeiro a jogar!</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-12 text-sm font-semibold text-gray-500 mb-2 px-3">
              <div className="col-span-1">#</div>
              <div className="col-span-3 sm:col-span-4">Nome</div>
              <div className="col-span-3 text-center">Pontos</div>
              <div className="col-span-3 sm:col-span-2 text-center">Tempo</div>
              <div className="col-span-2 text-center">Erros</div>
            </div>
            {rankings.map((entry, index) => (
              <div 
                key={index}
                className={`grid grid-cols-12 py-3 px-3 rounded-md items-center ${
                  playerRank === index ? 'bg-game-gold/20 border border-game-gold' : 
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="col-span-1 font-bold flex items-center">
                  {index === 0 ? (
                    <Trophy size={16} className="text-game-gold" fill="#FFD700" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="col-span-3 sm:col-span-4 font-medium truncate">
                  {entry.name}
                </div>
                <div className="col-span-3 text-center font-bold text-game-blue">
                  {entry.score}
                </div>
                <div className="col-span-3 sm:col-span-2 text-center text-gray-600">
                  {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
                </div>
                <div className="col-span-2 text-center text-gray-600">
                  {entry.errors}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Ranking;
