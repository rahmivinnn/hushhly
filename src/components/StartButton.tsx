
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
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
        {isPlaying ? (
          <Pause size={28} fill="white" className="text-white" />
        ) : (
          <Play size={28} fill="white" className="text-white ml-1" />
        )}
      </div>
      
      {/* Animated rings when playing */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30 animate-spin-slow"></div>
          <div className="absolute inset-1 rounded-full border-2 border-white border-opacity-20 animate-ping-slow"></div>
          <div className="absolute inset-3 rounded-full border border-white border-opacity-10 animate-pulse"></div>
        </>
      )}
    </button>
  );
};

export default StartButton;
