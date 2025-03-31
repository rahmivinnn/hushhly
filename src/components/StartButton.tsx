
import React from 'react';
import { Pause, Play } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isPlaying }) => {
  return (
    <button 
      onClick={onClick}
      className="relative w-32 h-32 rounded-full flex items-center justify-center"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse-light"></div>
      
      {/* Inner button */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue flex items-center justify-center text-lg font-bold text-white">
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
    </button>
  );
};

export default StartButton;
