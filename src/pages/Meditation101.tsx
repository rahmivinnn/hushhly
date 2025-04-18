import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Trophy, Play, Pause, SkipBack, SkipForward, Shuffle, Clock, RefreshCw } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";

// List of available tracks
const availableTracks = [
  {
    title: "Inner Peace Journey",
    duration: "15 Min",
    listeners: "59899 Listening",
    image: "/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png"
  },
  {
    title: "Emotional Harmony",
    duration: "12 Min",
    listeners: "48750 Listening",
    image: "/lovable-uploads/f3796138-3de0-44f8-9fab-6a71b48c7632.png"
  },
  {
    title: "Mindful Emotions",
    duration: "10 Min",
    listeners: "39084 Listening",
    image: "/lovable-uploads/97bc74f2-226d-4977-aa93-9b0d386fca75.png"
  },
  {
    title: "Balance & Clarity",
    duration: "8 Min",
    listeners: "42568 Listening",
    image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
  }
];

const Meditation101: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionLength, setSessionLength] = useState(15); // Default 15 minutes
  const [remainingTime, setRemainingTime] = useState(15 * 60); // in seconds
  const [selectedTrack, setSelectedTrack] = useState(availableTracks[0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize timer when session starts
  useEffect(() => {
    if (isPlaying) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            toast({
              title: "Meditation Complete",
              description: `Your ${sessionLength} minute meditation session is complete.`
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, sessionLength, toast]);

  // Reset timer when session length changes
  useEffect(() => {
    setRemainingTime(sessionLength * 60);
  }, [sessionLength]);

  const handleBack = () => {
    // Stop audio and timer before navigating away
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    navigate(-1);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Audio Error",
            description: "There was an error playing the audio. Please try again."
          });
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      // If audio isn't loaded yet, just toggle the state
      setIsPlaying(!isPlaying);
    }
  };

  const adjustSessionLength = () => {
    // Cycle through common meditation lengths: 5, 10, 15, 20, 30 minutes
    const lengths = [5, 10, 15, 20, 30];
    const currentIndex = lengths.indexOf(sessionLength);
    const nextIndex = (currentIndex + 1) % lengths.length;
    const newLength = lengths[nextIndex];

    setSessionLength(newLength);
    setRemainingTime(newLength * 60);

    toast({
      title: "Session Length Updated",
      description: `Meditation session set to ${newLength} minutes.`
    });
  };

  const handleSkipBack = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === selectedTrack.title);
    const prevIndex = (currentIndex - 1 + availableTracks.length) % availableTracks.length;
    setSelectedTrack(availableTracks[prevIndex]);

    toast({
      title: "Previous Track",
      description: `Now playing: ${availableTracks[prevIndex].title}`,
      duration: 2000,
    });
  };

  const handleSkipForward = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === selectedTrack.title);
    const nextIndex = (currentIndex + 1) % availableTracks.length;
    setSelectedTrack(availableTracks[nextIndex]);

    toast({
      title: "Next Track",
      description: `Now playing: ${availableTracks[nextIndex].title}`,
      duration: 2000,
    });
  };

  const handleShuffle = () => {
    // Get random track different from current
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * availableTracks.length);
    } while (availableTracks[randomIndex].title === selectedTrack.title && availableTracks.length > 1);

    setSelectedTrack(availableTracks[randomIndex]);

    toast({
      title: "Track Shuffled",
      description: `Now playing: ${availableTracks[randomIndex].title}`,
      duration: 2000,
    });
  };

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-500 to-red-600 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md">
        <button className="text-white hover:bg-white/20 p-2 rounded-full transition-all" onClick={handleBack}>
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Hushhly Logo"
            className="h-8 brightness-0 invert"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="hover:bg-white/20 p-2 rounded-full transition-all">
            <Bell size={24} />
          </button>
          <button className="hover:bg-white/20 p-2 rounded-full transition-all">
            <Trophy size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 pt-8 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/20 backdrop-blur-sm rounded-3xl -mx-2 mt-4"></div>
        <h1 className="text-3xl font-bold mb-2 relative">Loving Kindness Meditation</h1>
        <p className="text-lg mb-8 text-white/90 relative">Cultivate compassion and inner warmth</p>

        {/* Start Button */}
        <div className="relative mb-6">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center animate-pulse">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-orange-400/40 to-red-400/40 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] active:scale-95 group"
              >
                <span className="text-4xl font-bold group-hover:scale-110 transition-transform">{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-center mb-6 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
          <Clock size={20} className="mr-2 text-pink-300" />
          <span className="text-lg font-medium">{sessionLength} Min</span>
        </div>

        {/* Background Music Section */}
        <div className="w-full relative">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Background Music</span>
          </h2>

          {/* Music Selection */}
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-lg border border-white/20">
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0 shadow-[0_0_15px_rgba(219,39,119,0.3)]">
                <span className="text-4xl">🧘</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{selectedTrack.title}</h3>
                <p className="text-sm text-white/90 flex items-center">
                  <Clock size={12} className="mr-1 text-pink-300" />
                  {selectedTrack.duration} • {selectedTrack.listeners}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-between items-center mt-4 mb-4">
              <button
                className="p-3 hover:bg-white/20 rounded-full transition-all active:scale-95 backdrop-blur-sm"
                onClick={handleShuffle}
              >
                <Shuffle size={20} className="text-pink-300" />
              </button>
              <button
                className="p-3 hover:bg-white/20 rounded-full transition-all active:scale-95 backdrop-blur-sm"
                onClick={handleSkipBack}
              >
                <SkipBack size={20} className="text-pink-300" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:shadow-[0_0_25px_rgba(219,39,119,0.5)] transition-all active:scale-95"
              >
                {isPlaying ?
                  <Pause size={28} fill="white" /> :
                  <Play size={28} fill="white" className="ml-1" />
                }
              </button>
              <button
                className="p-3 hover:bg-white/20 rounded-full transition-all active:scale-95 backdrop-blur-sm"
                onClick={handleSkipForward}
              >
                <SkipForward size={20} className="text-pink-300" />
              </button>
              <button
                className="p-3 hover:bg-white/20 rounded-full transition-all active:scale-95 backdrop-blur-sm"
                onClick={handleShuffle}
              >
                <RefreshCw size={20} className="text-pink-300" />
              </button>
            </div>

            {/* Session Length Adjustment */}
            <div className="flex justify-center mt-3">
              <button
                onClick={adjustSessionLength}
                className="bg-gradient-to-br from-pink-500 to-purple-600 hover:opacity-90 text-white shadow-[0_0_15px_rgba(219,39,119,0.3)] hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] rounded-full px-6 py-2.5 text-sm font-medium flex items-center justify-center transition-all active:scale-95"
              >
                <Clock size={16} className="mr-2" />
                Adjust Session Length
              </button>
            </div>
          </div>
        </div>

        {/* Audio Element (hidden) */}
        <audio ref={audioRef} loop>
          <source src="/meditation-sound.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Meditation101;