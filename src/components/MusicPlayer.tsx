
import React, { useState } from 'react';
import { Play, Pause, Shuffle, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";

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

// Updated list of available tracks with new sleep story icons
const availableTracks = [
  {
    title: "Painting Forest",
    duration: "15 Min",
    listeners: "59899",
    coverImage: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
  },
  {
    title: "Sunset Mountains",
    duration: "10 Min",
    listeners: "48750",
    coverImage: "/lovable-uploads/073f7916-4a77-4421-8e76-4a76d2d2b3a8.png"
  },
  {
    title: "Rainforest Sounds",
    duration: "15 Min",
    listeners: "39084",
    coverImage: "/lovable-uploads/7968c94e-ae83-42cc-bd9d-57c9e901e288.png"
  },
  {
    title: "Lakeside Meditation",
    duration: "12 Min",
    listeners: "42568",
    coverImage: "/lovable-uploads/e63d8a4d-354d-4613-b686-84f7178d845c.png"
  },
  {
    title: "Forest Frog",
    duration: "8 Min",
    listeners: "31254",
    coverImage: "/lovable-uploads/b3c2e198-3032-4ec2-ac27-169ea18801ec.png"
  }
];

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onPlayPause, track: initialTrack }) => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState(initialTrack);

  const handleShuffle = () => {
    // Get random track different from current
    let randomTrack;
    do {
      randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
    } while (randomTrack.title === currentTrack.title);
    
    // Update current track
    setCurrentTrack(randomTrack);
    
    // If currently playing, restart with new track
    if (isPlaying) {
      audioService.play();
    }
    
    toast({
      title: "Track Changed",
      description: `Now playing: ${randomTrack.title}`,
      duration: 2000,
    });
  };

  const handleSkipBack = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === currentTrack.title);
    const prevIndex = (currentIndex - 1 + availableTracks.length) % availableTracks.length;
    setCurrentTrack(availableTracks[prevIndex]);
    
    toast({
      title: "Previous Track",
      description: `Now playing: ${availableTracks[prevIndex].title}`,
      duration: 2000,
    });
  };

  const handleSkipForward = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === currentTrack.title);
    const nextIndex = (currentIndex + 1) % availableTracks.length;
    setCurrentTrack(availableTracks[nextIndex]);
    
    toast({
      title: "Next Track",
      description: `Now playing: ${availableTracks[nextIndex].title}`,
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
          <img src={currentTrack.coverImage} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">{currentTrack.title}</h2>
          <p className="text-xs text-gray-500">{currentTrack.duration} • {currentTrack.listeners} Listening</p>
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
        <button 
          onClick={() => {
            toast({
              title: "Session Length",
              description: "You can adjust your session length in settings.",
              duration: 3000,
            });
          }}
          className="text-meditation-lightBlue text-sm font-medium hover:text-meditation-darkBlue transition-colors"
        >
          Adjust Session Length
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
