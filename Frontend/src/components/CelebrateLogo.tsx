import React from 'react';
import confetti from 'canvas-confetti';
import { GraduationCap } from 'lucide-react';

const CelebrateLogo = () => {
  const handleCelebrate = (event) => {
   
    const { clientX, clientY } = event;
    
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x, y },
      colors: ['#FFD700', '#FF69B4', '#00E5FF', '#7FFF00'],
      shapes: ['dot'], // Makes it look like sparkles
      ticks: 200,     
      gravity: 1.2,
      scalar: 1     
    });
  };

  return (
    <button 
      onClick={handleCelebrate}>
      <GraduationCap className="w-32 h-32 text-teal-600 dark:text-teal-400 relative z-10 animate-float mt-6" />
    </button>
  );
};

export default CelebrateLogo;