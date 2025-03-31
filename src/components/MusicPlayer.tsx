
import React from 'react';
import { Play, Shuffle, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { audioService } from '@/services/audioService';

interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  track: {
    title: string;
    duration: string;
    listeners: string;
    coverImage: string;
  };
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onPlayPause, track }) => {
  const handleShuffle = () => {
    console.log('Shuffle clicked');
    // Future functionality
  };

  const handleSkipBack = () => {
    console.log('Skip back clicked');
    // Future functionality
  };

  const handleSkipForward = () => {
    console.log('Skip forward clicked');
    // Future functionality
  };

  const handleRepeat = () => {
    console.log('Repeat clicked');
    // Future functionality
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Background Music</h1>
      
      <div className="flex items-center mb-6">
        <div className="w-24 h-24 rounded-3xl overflow-hidden mr-6">
          <img src="/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png" alt={track.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-5xl font-semibold text-gray-800">{track.title}</h2>
          <p className="text-2xl text-gray-500">{track.duration} {track.listeners} Listening</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center my-10">
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2"
          onClick={handleShuffle}
        >
          <Shuffle size={32} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2"
          onClick={handleSkipBack}
        >
          <SkipBack size={32} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue hover:bg-opacity-90 text-white rounded-full p-6 transform hover:scale-105 transition-all"
          onClick={onPlayPause}
        >
          <Play size={36} fill="white" className={isPlaying ? "animate-pulse" : ""} />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2"
          onClick={handleSkipForward}
        >
          <SkipForward size={32} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2"
          onClick={handleRepeat}
        >
          <Repeat size={32} className="transform hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <div className="mt-10 mb-8 text-center">
        <button className="text-meditation-lightBlue text-3xl font-medium hover:text-meditation-darkBlue transition-colors">
          Adjust Session Length
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
