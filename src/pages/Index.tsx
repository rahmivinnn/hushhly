
import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import LogoHeader from '@/components/LogoHeader';
import StartButton from '@/components/StartButton';
import Timer from '@/components/Timer';
import MusicPlayer from '@/components/MusicPlayer';
import BottomNavigation from '@/components/BottomNavigation';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";
import SideMenu from '@/components/SideMenu';
import { Menu } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const [audioFrequency, setAudioFrequency] = useState<number[]>([]);

  const trackInfo = {
    title: "The Whispering Forest",
    duration: "15 Min",
    listeners: "59899",
    coverImage: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
  };

  // Generate random audio frequencies for visualization when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newFreqs = Array.from({ length: 20 }, () => Math.random() * 100);
        setAudioFrequency(newFreqs);
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

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
    setSideMenuOpen(!sideMenuOpen);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioService.pause();
    };
  }, []);

  // Get username from local storage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : { username: 'User' };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section with blue gradient background */}
      <div 
        className="relative overflow-hidden pb-24 pt-0"
        style={{ 
          height: '40%',
          background: 'linear-gradient(to bottom right, #33C3F0, #3A6CDD, #4346B8)'
        }}
      >
        {/* Status Bar */}
        <StatusBar />
        
        {/* Menu Button and Logo Header */}
        <div className="flex items-center justify-between px-4 pt-2">
          <button 
            onClick={toggleSideMenu}
            className="p-2 text-white rounded-full"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center">
            <img 
              src="/lovable-uploads/4f330210-bedd-48e1-82c5-3fbd5809d120.png" 
              alt="Hushhly Logo" 
              className="h-8"
            />
          </div>
          <div className="w-8"></div> {/* Empty div for balance */}
        </div>
        
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
        
        {/* Audio Visualization Waves */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center space-x-1 px-10">
            {audioFrequency.map((height, index) => (
              <div
                key={index}
                className="w-1 bg-white opacity-80 rounded-t-full"
                style={{ 
                  height: `${Math.max(10, height)}%`,
                  transition: 'height 0.3s ease'
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Section with white background */}
      <div className="flex-1 bg-white">
        {/* Meditation Icon */}
        <div className="flex justify-center mt-8">
          <img src="/lovable-uploads/ea183b79-044d-41d7-9965-47b76c6e771c.png" alt="Meditation" className="w-16 h-16" />
        </div>
        
        {/* Music Player */}
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
        isOpen={sideMenuOpen} 
        onClose={() => setSideMenuOpen(false)} 
        userName={user.username || 'User'}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
