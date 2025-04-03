
import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import LogoHeader from '@/components/LogoHeader';
import StartButton from '@/components/StartButton';
import Timer from '@/components/Timer';
import MusicPlayer from '@/components/MusicPlayer';
import BottomNavigation from '@/components/BottomNavigation';
import SideMenu from '@/components/SideMenu';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { toast } = useToast();
  
  // Get username from local storage
  const storedUser = localStorage.getItem('user');
  const userName = storedUser ? JSON.parse(storedUser).fullName || JSON.parse(storedUser).name || "Guest" : "Guest";

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

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
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
        <LogoHeader onMenuToggle={toggleSideMenu} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2">
          <h1 className="text-white text-xl font-semibold mb-1">Meditation 101</h1>
          <p className="text-white text-sm mb-4">Tap the start button when ready</p>
          
          {/* Start Button */}
          <div className="relative">
            <StartButton onClick={handleStartButton} isPlaying={isPlaying} />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Timer duration={sessionDuration} />
            </div>
          </div>
        </div>
        
        {/* Audio waves visualization above the start button */}
        <div className="absolute top-24 left-0 right-0 flex justify-center">
          <img 
            src="/lovable-uploads/45c1427f-cca7-4c14-accd-61d713b7fe0f.png" 
            alt="Audio visualization" 
            className={`h-12 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-30'}`} 
          />
        </div>
        
        {/* Cloud decoration on top of the circle */}
        <img 
          src="/lovable-uploads/262033dd-3446-4e39-9a19-6be70d2da587.png" 
          alt="Clouds" 
          className="absolute top-36 left-1/2 transform -translate-x-1/2 w-64 h-auto opacity-30 z-0"
        />
      </div>
      
      {/* Bottom Section with white background */}
      <div className="flex-1 bg-white">
        {/* Meditation Icon */}
        <div className="flex justify-center mt-4">
          <img src="/lovable-uploads/c0cb37e6-6c26-4923-ace7-eb84ba25eae4.png" alt="Meditation" className="w-12 h-12" />
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
      
      {/* Side Menu */}
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        userName={userName}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
