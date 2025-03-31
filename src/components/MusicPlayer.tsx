
import React from 'react';
import { Play, Shuffle, SkipBack, SkipForward, Repeat } from 'lucide-react';

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
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Background Music</h2>
      
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
          <img src="/lovable-uploads/b8c99ac8-9d66-4ede-a21c-323b3bdbdaa6.png" alt={track.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-gray-800">{track.title}</h3>
          <p className="text-gray-600">{track.duration} {track.listeners} Listening</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button className="text-gray-400 hover:text-gray-700">
          <Shuffle size={24} />
        </button>
        <button className="text-gray-400 hover:text-gray-700">
          <SkipBack size={24} />
        </button>
        <button 
          className="bg-meditation-blue hover:bg-opacity-90 text-white rounded-full p-4"
          onClick={onPlayPause}
        >
          <Play size={24} fill="white" />
        </button>
        <button className="text-gray-400 hover:text-gray-700">
          <SkipForward size={24} />
        </button>
        <button className="text-gray-400 hover:text-gray-700">
          <Repeat size={24} />
        </button>
      </div>
      
      <div className="mt-8 mb-8 text-center">
        <button className="text-meditation-blue text-xl font-medium">
          Adjust Session Length
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
