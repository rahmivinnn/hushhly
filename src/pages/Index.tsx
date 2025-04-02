
import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import LogoHeader from '@/components/LogoHeader';
import StartButton from '@/components/StartButton';
import Timer from '@/components/Timer';
import MusicPlayer from '@/components/MusicPlayer';
import BottomNavigation from '@/components/BottomNavigation';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const { toast } = useToast();

  const trackInfo = {
    title: "Painting Forest",
    duration: "15 Min",
    listeners: "59899",
    coverImage: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
  };

  const handleStartButton = () => {
    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
      toast({
        title: "Meditation paused",
        description: "Take your time and resume when you're ready."
      });
    } else {
      audioService.play();
      setIsPlaying(true);
      toast({
        title: "Meditation started",
        description: `${sessionDuration} minute session has begun.`
      });
    }
  };

  const handlePlayPauseMusic = () => {
    handleStartButton(); // Use the same handler to keep audio state synchronized
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioService.pause();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section with blue gradient background - height adjusted */}
      <div 
        className="bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue rounded-b-[40%] pb-24 pt-0 relative overflow-hidden"
        style={{ height: '40%' }}
      >
        {/* Status Bar */}
        <StatusBar />
        
        {/* Logo and Header */}
        <LogoHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2">
          <h1 className="text-white text-xl font-semibold mb-1">Meditation 101</h1>
          <p className="text-white text-sm mb-4">Tap the start button when ready</p>
          
          {/* SSH Logo instead of bear */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <img 
              src="/lovable-uploads/cb83e1b7-4900-4ae0-aea6-8fa95e662add.png" 
              alt="SSH Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          {/* Start Button */}
          <div className="relative">
            <StartButton onClick={handleStartButton} isPlaying={isPlaying} />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Timer duration={sessionDuration} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section with white background */}
      <div className="flex-1 bg-white">
        {/* Meditation Icon */}
        <div className="flex justify-center mt-4">
          <img src="/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png" alt="Meditation" className="w-12 h-12" />
        </div>
        
        {/* Music Player - adjusted to match reference */}
        <div className="w-full px-6 mt-4">
          <MusicPlayer 
            isPlaying={isPlaying} 
            onPlayPause={handlePlayPauseMusic} 
            track={trackInfo} 
          />
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
