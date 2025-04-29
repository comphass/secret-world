
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundButtonProps {
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundButton: React.FC<SoundButtonProps> = ({ isMuted, toggleMute }) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleMute} 
      className="sound-button fixed top-4 right-4 z-50"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="h-6 w-6 text-gray-600" />
      ) : (
        <Volume2 className="h-6 w-6 text-game-purple" />
      )}
    </Button>
  );
};

export default SoundButton;
