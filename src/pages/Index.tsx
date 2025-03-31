
import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import LogoHeader from '@/components/LogoHeader';
import StartButton from '@/components/StartButton';
import Timer from '@/components/Timer';
import MusicPlayer from '@/components/MusicPlayer';
import BottomNavigation from '@/components/BottomNavigation';
import { audioService } from '@/services/audioService';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const { toast } = useToast();

  const trackInfo = {
    title: "Painting Forest",
    duration: "15 Min",
    listeners: "59899",
    coverImage: "/lovable-uploads/b8c99ac8-9d66-4ede-a21c-323b3bdbdaa6.png" // Using the updated forest image
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
    if (audioService.isPlaying()) {
      audioService.pause();
      setIsPlaying(false);
    } else {
      audioService.play();
      setIsPlaying(true);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioService.pause();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section with blue gradient background */}
      <div className="bg-meditation-gradient rounded-b-[40%] pb-32 pt-0 relative overflow-hidden">
        {/* Status Bar */}
        <StatusBar />
        
        {/* Logo and Header */}
        <LogoHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24 pt-6">
          <h1 className="text-white text-4xl font-bold mb-2">Meditation 101</h1>
          <p className="text-white text-xl mb-12">Tap the start button when ready</p>
          
          {/* Start Button */}
          <div className="relative">
            <StartButton onClick={handleStartButton} isPlaying={isPlaying} />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <Timer duration={sessionDuration} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section with white background */}
      <div className="flex-1 bg-white">
        {/* Music Player */}
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
