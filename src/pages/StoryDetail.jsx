import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Trophy, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Home, BookOpen, Users, Moon, User } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const StoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('08:00');
  const [totalTime, setTotalTime] = useState('15:00');
  const [progress, setProgress] = useState(30); // Progress in percentage

  // Get story details from location state or use default
  const storyDetails = location.state?.story || {
    title: 'The Whispering Forest',
    description: 'A walk through a magical, quiet woodland.',
    image: '/lovable-uploads/whispering-forest.svg'
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Start meditation button
  const handleStartMeditation = () => {
    navigate('/meditation');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <button onClick={handleBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-white">
          <img src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" alt="shh" className="h-8 brightness-0 invert" />
        </div>
        <div className="flex space-x-4">
          <button className="text-white">
            <Bell size={24} />
          </button>
          <button className="text-amber-400">
            <Trophy size={24} />
          </button>
        </div>
      </header>

      {/* Story Title and Description */}
      <div className="text-center px-6 pt-4 pb-6">
        <h1 className="text-white text-3xl font-bold mb-2">{storyDetails.title}</h1>
        <p className="text-white text-lg">{storyDetails.description}</p>
      </div>

      {/* Story Image */}
      <div className="flex justify-center px-6 mb-8">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white">
          <img
            src={storyDetails.image}
            alt={storyDetails.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Audio Progress */}
      <div className="px-6 mb-4">
        <div className="flex justify-between text-white mb-2">
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
        <div className="h-4 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 h-4 bg-white rounded-full shadow-md"></div>
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex justify-center items-center space-x-8 px-6 mb-8">
        <button className="text-white">
          <Shuffle size={24} />
        </button>
        <button className="text-white">
          <SkipBack size={28} />
        </button>
        <button
          className="bg-cyan-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
        </button>
        <button className="text-white">
          <SkipForward size={28} />
        </button>
        <button className="text-white">
          <Repeat size={24} />
        </button>
      </div>

      {/* Start Meditation Button */}
      <div className="flex justify-center px-6 mb-16">
        <button
          className="text-cyan-500 text-xl font-semibold"
          onClick={handleStartMeditation}
        >
          Start Meditation
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default StoryDetail;
