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
      const interval = setInterval(() => {
        setWaves(Array.from({ length: 5 }, () => Math.random() * 40 + 60));
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setWaves([]);
    }
  }, [isPlaying]);
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Audio frequency visualization - more dynamic with uploaded image */}
      {isPlaying && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64">
          <img 
            src="/lovable-uploads/dce868d6-bbb3-4793-898f-41efab62551b.png" 
            alt="Audio Frequency" 
            className="w-full animate-pulse"
          />
        </div>
      )}
      
      {/* Frequency waves when playing - keep as backup or addition */}
      {isPlaying && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {waves.map((height, index) => (
              <div
                key={index}
                className="mx-0.5 w-1 bg-white bg-opacity-70 animate-pulse-slow"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse-light"></div>
      
      {/* Inner button */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue flex items-center justify-center text-lg font-bold text-white z-10">
        {isPlaying ? (
          <Pause size={28} fill="white" className="text-white" />
        ) : (
          <Play size={28} fill="white" className="text-white ml-1" />
        )}
      </div>
      
      {/* Animated ring when playing */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30 animate-spin-slow"></div>
      )}
    </div>
  );
};

export default StartButton;
