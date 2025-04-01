
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPopupProps {
  title: string;
  duration: string;
  onClose: () => void;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ title, duration, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Get appropriate YouTube video ID based on title
  const getYoutubeVideoId = (title: string): string => {
    // Map meditation titles to YouTube video IDs
    const videoMap: Record<string, string> = {
      "The Whispering Forest": "NcQEcSlspZw", // 15-min meditation for sleep
      "Starlit Dreams": "ZToicYcHIOU", // Meditation with relaxing music
      "Painting Forest": "inpok4MKVLM", // Forest sounds meditation
      "The Gentle Night": "ZVTsbz9L1ZA", // 15-min breathing meditation
      "Meditation 101": "ZVTsbz9L1ZA", // Default meditation
      "Cardio Meditation": "6kP-SonMQjU", // Cardio-related meditation
      "Focused meditation": "xvQeERWvDyI", // Short 5-min meditation
    };
    
    return videoMap[title] || "ZVTsbz9L1ZA"; // Default meditation if not found
  };
  
  // Simulate video playback with progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);
  
  // Handle escape key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Restore scrolling
    };
  }, [onClose]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor((seconds / 100) * parseInt(duration));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const videoId = getYoutubeVideoId(title);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="relative bg-black rounded-lg w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 z-10 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Close video"
        >
          <X size={20} />
        </button>
        
        {/* Video - YouTube embed */}
        <div className="relative aspect-[9/16]">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0&controls=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full object-cover"
          ></iframe>
          
          {/* Overlay for controls - only show when not playing */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button 
                onClick={togglePlayPause} 
                className="bg-black/30 p-5 rounded-full"
                aria-label="Play"
              >
                <Play size={32} className="text-white ml-1" />
              </button>
            </div>
          )}
          
          {/* Video info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-lg font-bold">{title}</h3>
            <p className="text-gray-300 text-sm">
              Meditation Guide • {duration}
            </p>
            
            {/* Progress bar */}
            <div className="mt-3 mb-1">
              <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{duration}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center mt-2">
              <button 
                onClick={togglePlayPause} 
                className="text-white hover:text-blue-300 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              
              <button 
                onClick={toggleMute} 
                className="text-white hover:text-blue-300 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX size={24} />
                ) : (
                  <Volume2 size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
