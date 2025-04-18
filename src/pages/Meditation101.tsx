import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Trophy, Play, Pause, SkipBack, SkipForward, Shuffle, Clock } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';

const Meditation101: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionLength, setSessionLength] = useState(15); // Default 15 minutes
  const [selectedBackground, setSelectedBackground] = useState({
    name: 'Painting Forest',
    duration: '15 Min',
    listeners: '59899 Listening',
    image: '/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png' // Using existing forest image
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // If audio isn't loaded yet, just toggle the state
      setIsPlaying(!isPlaying);
    }
  };

  const adjustSessionLength = (newLength: number) => {
    setSessionLength(newLength);
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
                className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl font-bold">{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Session Duration */}
        <div className="flex items-center mb-8">
          <Clock size={20} className="mr-2" />
          <span className="text-xl">{sessionLength} Min</span>
        </div>

        {/* Background Music Section */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Background Music</h2>

          {/* Music Selection */}
          <div className="flex items-center bg-white/10 rounded-lg p-3 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
              <img
                src={selectedBackground.image || '/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png'}
                alt="Forest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-medium">{selectedBackground.name}</h3>
              <p className="text-sm text-white/80">{selectedBackground.duration} {selectedBackground.listeners}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex justify-between items-center mb-8">
            <button className="p-2">
              <Shuffle size={24} />
            </button>
            <button className="p-2">
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-md"
            >
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>
            <button className="p-2">
              <SkipForward size={24} />
            </button>
            <button className="p-2">
              <Shuffle size={24} />
            </button>
          </div>

          {/* Session Length Adjustment */}
          <button
            className="w-full py-3 text-center text-cyan-400 font-medium"
            onClick={() => adjustSessionLength(sessionLength === 15 ? 30 : 15)}
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