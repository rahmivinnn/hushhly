import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Trophy, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Home, BookOpen, Users, Moon, User } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const StoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('15:00');
  const [progress, setProgress] = useState(0); // Progress in percentage
  const intervalRef = useRef(null);
  const [waveformBars, setWaveformBars] = useState([]);

  // Get story details from location state or use default
  const storyDetails = location.state?.story || {
    title: 'The Whispering Forest',
    description: 'A walk through a magical, quiet woodland.',
    image: '/lovable-uploads/whispering-forest.svg',
    duration: '15:00',
    icon: '🌲',
    isPremium: false
  };

  // Generate random waveform bars
  useEffect(() => {
    const bars = [];
    for (let i = 0; i < 50; i++) {
      bars.push(Math.random() * 100);
    }
    setWaveformBars(bars);
    setTotalTime(storyDetails.duration || '15:00');
  }, [storyDetails]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
    } else {
      // Simulate playback progress
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 100;
          }

          // Update current time based on progress
          const totalSeconds = convertTimeToSeconds(totalTime);
          const currentSeconds = Math.floor(totalSeconds * (prev + 0.5) / 100);
          setCurrentTime(formatTime(currentSeconds));

          return prev + 0.5;
        });
      }, 500);
    }
    setIsPlaying(!isPlaying);
  };

  // Convert time string (mm:ss) to seconds
  const convertTimeToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Format seconds to time string (mm:ss)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Start meditation button
  const handleStartMeditation = () => {
    navigate('/meditation');
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-transparent">
        <button onClick={handleBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-white">
          <img src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" alt="shh" className="h-8" style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }} />
        </div>
        <div className="flex space-x-4">
          <button className="text-white">
            <Bell size={24} />
          </button>
          <button className="text-yellow-300">
            <Trophy size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Story Image */}
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mb-8 bg-blue-600 flex items-center justify-center">
          <span className="text-9xl text-white">{storyDetails.icon}</span>
        </div>

        {/* Story Title and Description */}
        <div className="text-center mb-10">
          <h1 className="text-white text-2xl font-bold mb-2">{storyDetails.title}</h1>
          <p className="text-gray-200 text-sm">{storyDetails.description}</p>
        </div>

        {/* Waveform Visualization */}
        <div className="w-full mb-4">
          <div className="flex items-end justify-between h-16 px-2">
            {waveformBars.map((height, index) => {
              const barProgress = (index / waveformBars.length) * 100;
              const isActive = barProgress <= progress;
              return (
                <div
                  key={index}
                  className={`w-1 rounded-full mx-0.5 ${isActive ? 'bg-gradient-to-t from-blue-400 to-cyan-300' : 'bg-white/30'}`}
                  style={{
                    height: `${Math.max(15, height)}%`,
                    transition: 'height 0.5s ease, background-color 0.3s ease'
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between w-full text-white mb-6">
          <span className="text-sm">{currentTime}</span>
          <span className="text-sm">{totalTime}</span>
        </div>

        {/* Audio Controls */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <button className="text-white hover:text-cyan-300 transition-colors">
            <Shuffle size={20} />
          </button>
          <button className="text-white hover:text-cyan-300 transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            onClick={togglePlayPause}
          >
            {isPlaying ?
              <Pause size={28} className="ml-0.5" /> :
              <Play size={28} className="ml-1" />
            }
          </button>
          <button className="text-white hover:text-cyan-300 transition-colors">
            <SkipForward size={24} />
          </button>
          <button className="text-white hover:text-cyan-300 transition-colors">
            <Repeat size={20} />
          </button>
        </div>

        {/* Start Meditation Button */}
        <button
          className="text-cyan-400 text-lg font-medium mb-16 hover:text-cyan-300 transition-colors"
          onClick={handleStartMeditation}
        >
          Start Meditation
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full py-3 px-6 shadow-lg">
          <div className="flex justify-between items-center">
            <button className="flex flex-col items-center text-white opacity-70 hover:opacity-100 transition-opacity">
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center text-white opacity-70 hover:opacity-100 transition-opacity">
              <div className="relative">
                <Jar size={20} />
              </div>
              <span className="text-xs mt-1">Meditate</span>
            </button>
            <button className="flex flex-col items-center text-white opacity-70 hover:opacity-100 transition-opacity">
              <Users size={20} />
              <span className="text-xs mt-1">Community</span>
            </button>
            <button className="flex flex-col items-center text-white opacity-100 transition-opacity">
              <Moon size={20} />
              <span className="text-xs mt-1">Stories</span>
            </button>
            <button className="flex flex-col items-center text-white opacity-70 hover:opacity-100 transition-opacity">
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
