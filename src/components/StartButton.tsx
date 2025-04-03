
import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isPlaying }) => {
  const [waves, setWaves] = useState<Array<number>>([]);
  
  // Generate random wave frequencies when playing
  useEffect(() => {
    if (isPlaying) {
      // Initial wave set
      setWaves(Array.from({ length: 5 }, () => Math.random() * 40 + 60));
      
      const interval = setInterval(() => {
        setWaves(Array.from({ length: 5 }, () => Math.random() * 40 + 60));
      }, 300); // Faster updates for more dynamic visualization
      
      return () => clearInterval(interval);
    } else {
      setWaves([]);
    }
  }, [isPlaying]);
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center cursor-pointer" onClick={onClick}>
      {/* Frequency waves when playing - enhanced visibility */}
      {isPlaying && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {waves.map((height, index) => (
              <div
                key={index}
                className="mx-0.5 w-1.5 bg-white bg-opacity-80 rounded-full"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.5 + index * 0.1}s`,
                  animationName: 'pulse',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Outer glow ring - enhanced glow effect */}
      <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse-light"></div>
      
      {/* Inner button - more vibrant gradient */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue shadow-lg flex items-center justify-center text-lg font-bold text-white z-10 transition-transform duration-200 transform hover:scale-105 active:scale-95">
        {isPlaying ? (
          <Pause size={28} fill="white" className="text-white" />
        ) : (
          <Play size={28} fill="white" className="text-white ml-1" />
        )}
      </div>
      
      {/* Animated rings when playing - multiple rings for enhanced effect */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-20 animate-spin-slow"></div>
          <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-10" 
               style={{animation: 'spin-slow 8s linear infinite reverse'}}></div>
        </>
      )}
    </div>
  );
};

export default StartButton;
