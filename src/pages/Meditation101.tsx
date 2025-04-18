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
    title: "Painting Forest",
    duration: "15 Min",
    listeners: "59899 Listening",
    image: "/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png"
  },
  {
    title: "The Whispering Forest",
    duration: "15 Min",
    listeners: "48750 Listening",
    image: "/lovable-uploads/f3796138-3de0-44f8-9fab-6a71b48c7632.png"
  },
  {
    title: "Starlit Dreams",
    duration: "15 Min",
    listeners: "39084 Listening",
    image: "/lovable-uploads/97bc74f2-226d-4977-aa93-9b0d386fca75.png"
  },
  {
    title: "The Gentle Night",
    duration: "15 Min",
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button className="text-white" onClick={handleBack}>
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Hushhly Logo"
            className="h-8 brightness-0 invert"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Bell size={24} />
          <Trophy size={24} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 pt-4 pb-12">
        <h1 className="text-3xl font-semibold mb-2">Meditation 101</h1>
        <p className="text-lg mb-8">Tap the start button when ready</p>

        {/* Start Button */}
        <div className="relative mb-6">
          <div className="w-64 h-64 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg transition-all hover:shadow-xl active:scale-95"
              >
                <span className="text-4xl font-bold">{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-center mb-6">
          <Clock size={20} className="mr-2" />
          <span className="text-lg">{sessionLength} Min</span>
        </div>

        {/* Background Music Section */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Background Music</h2>

          {/* Music Selection */}
          <div className="flex items-center bg-white/10 rounded-lg p-3 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
              <img
                src={selectedTrack.image}
                alt={selectedTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium">{selectedTrack.title}</h3>
              <p className="text-sm text-white/80">{selectedTrack.duration} {selectedTrack.listeners}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex justify-between items-center mb-8">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={handleShuffle}>
              <Shuffle size={24} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={handleSkipBack}>
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-md hover:bg-cyan-400 transition-colors active:scale-95"
            >
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={handleSkipForward}>
              <SkipForward size={24} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={handleShuffle}>
              <RefreshCw size={24} />
            </button>
          </div>

          {/* Session Length Adjustment */}
          <button
            className="w-full py-3 text-center text-cyan-400 font-medium hover:text-white transition-colors"
            onClick={adjustSessionLength}
          >
            Adjust Session Length
          </button>
        </div>
      </div>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} loop>
        <source src="/meditation-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Meditation101;