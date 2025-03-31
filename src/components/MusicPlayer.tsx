
import React from 'react';
import { Play, Pause, Shuffle, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { audioService } from '@/services/audioService';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleShuffle = () => {
    toast({
      title: "Shuffle",
      description: "Shuffle functionality coming soon",
      duration: 2000,
    });
  };

  const handleSkipBack = () => {
    toast({
      title: "Previous Track",
      description: "Previous track functionality coming soon",
      duration: 2000,
    });
  };

  const handleSkipForward = () => {
    toast({
      title: "Next Track",
      description: "Next track functionality coming soon",
      duration: 2000,
    });
  };

  const handleRepeat = () => {
    const isRepeating = audioService.toggleRepeat();
    toast({
      title: isRepeating ? "Repeat On" : "Repeat Off",
      description: isRepeating ? "Track will repeat" : "Track will not repeat",
      duration: 2000,
    });
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-5 text-center">Background Music</h1>
      
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden mr-4">
          <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">{track.title}</h2>
          <p className="text-xs text-gray-500">{track.duration} • {track.listeners} Listening</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center my-6">
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2 active:scale-95 transform"
          onClick={handleShuffle}
          aria-label="Shuffle"
        >
          <Shuffle size={20} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2 active:scale-95 transform"
          onClick={handleSkipBack}
          aria-label="Previous track"
        >
          <SkipBack size={20} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue hover:opacity-90 text-white rounded-full p-4 transform hover:scale-105 transition-all active:scale-95"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={24} fill="white" />
          ) : (
            <Play size={24} fill="white" className="ml-0.5" />
          )}
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2 active:scale-95 transform"
          onClick={handleSkipForward}
          aria-label="Next track"
        >
          <SkipForward size={20} className="transform hover:scale-110 transition-transform" />
        </button>
        <button 
          className="text-gray-400 hover:text-gray-700 transition-colors p-2 active:scale-95 transform"
          onClick={handleRepeat}
          aria-label="Repeat"
        >
          <Repeat size={20} className="transform hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <div className="mt-5 mb-4 text-center">
        <button className="text-meditation-lightBlue text-sm font-medium hover:text-meditation-darkBlue transition-colors">
          Adjust Session Length
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
