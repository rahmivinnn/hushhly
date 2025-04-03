
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, VolumeX, Volume2, Heart, Share2, Download, Clock, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const SleepStoryPreview: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  
  const handleBack = () => {
    navigate('/sleep-stories');
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: isPlaying ? "Story playback paused" : "Starting 'The Whispering Forest'",
    });
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Sound Enabled" : "Muted",
      description: isMuted ? "Audio has been enabled" : "Audio has been muted",
    });
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: isLiked ? "The Whispering Forest removed from your favorites" : "The Whispering Forest added to your favorites",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share Story",
      description: "Sharing options coming soon",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Downloading",
      description: "The Whispering Forest is being downloaded for offline listening",
    });
  };
  
  return (
    <div className="flex flex-col h-screen relative">
      {/* Background Image - Forest from the provided image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/d2c727d8-9d1c-40a7-9db8-1b7e09ed0c16.png" 
          alt="Whispering Forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 pt-4 px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="p-2 text-white bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute}
              className="p-2 text-white bg-black/20 rounded-full backdrop-blur-sm"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={toggleLike}
              className={`p-2 ${isLiked ? 'text-red-500 bg-white/20' : 'text-white bg-black/20'} rounded-full backdrop-blur-sm`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow flex flex-col justify-end relative z-10 px-6 pb-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">The Whispering Forest</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-4">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" className="text-gray-400" />
              <span className="ml-1 text-white text-sm">4.1</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <Clock size={14} className="mr-1" />
              25 min
            </div>
          </div>
          
          <p className="text-white/90 text-sm mb-6">
            Step into an enchanted forest where the ancient trees whisper secrets of the past. 
            Let the gentle rustle of leaves and the distant calls of woodland creatures guide you 
            into a deep, peaceful sleep.
          </p>
          
          <div className="mb-6">
            <div className="w-full h-1 bg-white/30 rounded-full mb-2">
              <div className="h-1 bg-blue-500 rounded-full" style={{ width: isPlaying ? '15%' : '0%' }}></div>
            </div>
            <div className="flex justify-between text-white/70 text-xs">
              <span>{isPlaying ? '3:45' : '0:00'}</span>
              <span>25:00</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={handleShare}
              className="p-3 text-white bg-white/10 rounded-full backdrop-blur-sm"
            >
              <Share2 size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="p-6 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white ml-1" />
              )}
            </button>
            
            <button 
              onClick={handleDownload}
              className="p-3 text-white bg-white/10 rounded-full backdrop-blur-sm"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStoryPreview;
