
import { useState, useEffect, useCallback } from 'react';

type SoundType = 'correct' | 'incorrect' | 'win' | 'lose' | 'start';

const useSoundEffects = () => {
  const [sounds, setSounds] = useState<Record<SoundType, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    win: null,
    lose: null,
    start: null
  });

  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Define sound URLs with full paths and fallbacks
    const soundUrls = {
      correct: ['/sounds/correct.mp3', '/correct.mp3'],
      incorrect: ['/sounds/incorrect.mp3', '/incorrect.mp3'],
      win: ['/sounds/win.mp3', '/win.mp3'],
      lose: ['/sounds/lose.mp3', '/lose.mp3'],
      start: ['/sounds/start.mp3', '/start.mp3']
    };

    const loadSound = (type: SoundType): HTMLAudioElement => {
      // Try to create audio with the first URL
      const audio = new Audio(soundUrls[type][0]);
      
      // Add error handler to try fallback URL if first one fails
      audio.addEventListener('error', () => {
        console.log(`Failed to load sound from ${soundUrls[type][0]}, trying fallback...`);
        audio.src = soundUrls[type][1];
      });
      
      // Set volume and preload
      audio.volume = 0.7; // Increased volume
      audio.load();
      
      return audio;
    };

    // Initialize and load all sounds
    const loadedSounds: Record<SoundType, HTMLAudioElement> = {
      correct: loadSound('correct'),
      incorrect: loadSound('incorrect'),
      win: loadSound('win'),
      lose: loadSound('lose'),
      start: loadSound('start')
    };

    // Pre-interact with sounds to work around autoplay restrictions
    document.addEventListener('click', () => {
      Object.values(loadedSounds).forEach(sound => {
        sound.play().then(() => {
          sound.pause();
          sound.currentTime = 0;
        }).catch(err => {
          console.log('Audio playback attempt during user interaction:', err);
        });
      });
    }, { once: true });

    setSounds(loadedSounds);

    // Cleanup function
    return () => {
      Object.values(loadedSounds).forEach(sound => {
        sound.pause();
        sound.src = '';
      });
    };
  }, []);

  // Save mute state to localStorage
  useEffect(() => {
    localStorage.setItem('soundMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted || !sounds[type]) return;
    
    // Log sound play attempt for debugging
    console.log(`Attempting to play sound: ${type}`);
    
    try {
      // Stop any playing sounds first
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
      
      // Play the requested sound
      const sound = sounds[type];
      if (sound) {
        sound.currentTime = 0;
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error(`Error playing sound ${type}:`, error);
          });
        }
      }
    } catch (error) {
      console.error(`Error in playSound function:`, error);
    }
  }, [sounds, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playSound, isMuted, toggleMute };
};

export default useSoundEffects;
