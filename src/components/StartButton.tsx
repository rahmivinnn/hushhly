
import React, { useState } from 'react';

interface StartButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, isPlaying }) => {
  return (
    <button 
      onClick={onClick}
      className="relative w-60 h-60 rounded-full flex items-center justify-center"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-pulse-light"></div>
      
      {/* Inner button */}
      <div className="w-52 h-52 rounded-full bg-meditation-gradient flex items-center justify-center text-4xl font-bold text-white">
        {isPlaying ? 'Pause' : 'Start'}
      </div>
      
      {/* Animated ring when playing */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30 animate-spin-slow"></div>
      )}
    </button>
  );
};

export default StartButton;
