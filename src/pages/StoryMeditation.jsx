import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Play, Pause, Volume2, VolumeX, Moon, Heart } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

const StoryMeditation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const [waveformBars, setWaveformBars] = useState([]);

  // Get story details from location state or use default
  const storyDetails = location.state || {
    title: 'The Whispering Forest',
    description: 'A walk through a magical, quiet woodland.',
    image: '/lovable-uploads/whispering-forest.svg',
    duration: '15:00',
    icon: '🌲'
  };

  // Format seconds to time string (mm:ss)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Convert duration string to seconds
  const getDurationInSeconds = () => {
    if (!storyDetails.duration) return 900; // Default 15 minutes

    if (typeof storyDetails.duration === 'string' && storyDetails.duration.includes('Min')) {
      const minutes = parseInt(storyDetails.duration.split(' ')[0]);
      return minutes * 60;
    }

    if (typeof storyDetails.duration === 'string' && storyDetails.duration.includes(':')) {
      const [minutes, seconds] = storyDetails.duration.split(':').map(Number);
      return minutes * 60 + (seconds || 0);
    }

    return 900; // Default 15 minutes as fallback
  };

  const totalDurationInSeconds = getDurationInSeconds();
  const formattedTotalDuration = formatTime(totalDurationInSeconds);

  // Generate random waveform bars
  useEffect(() => {
    const bars = [];
    for (let i = 0; i < 50; i++) {
      bars.push(Math.random() * 100);
    }
    setWaveformBars(bars);
  }, []);

  // Format seconds to time string (mm:ss) - already defined above

  // Toggle play/pause
  const togglePlayPause = () => {
    if (showCompletionScreen) {
      setShowCompletionScreen(false);
      setProgress(0);
      setCurrentTime('00:00');
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      clearInterval(intervalRef.current);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Audio Error",
            description: "There was an error playing the audio. Please try again."
          });
        });
      }

      // Simulate playback progress
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            setShowCompletionScreen(true);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 100;
          }

          // Update current time based on progress
          const currentSeconds = Math.floor(totalDurationInSeconds * prev / 100);
          setCurrentTime(formatTime(currentSeconds));

          return prev + (100 / (totalDurationInSeconds / 0.5));
        });
      }, 500);
    }

    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Handle back button
  const handleBack = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      clearInterval(intervalRef.current);
    }
    navigate(-1);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Get background gradient based on story title
  const getBackgroundGradient = () => {
    const title = storyDetails.title.toLowerCase();

    if (title.includes('forest') || title.includes('nature') || title.includes('garden')) {
      return 'from-green-600 to-blue-800';
    } else if (title.includes('night') || title.includes('star') || title.includes('dream') || title.includes('sleep')) {
      return 'from-indigo-800 to-purple-900';
    } else if (title.includes('ocean') || title.includes('sea') || title.includes('water') || title.includes('wave')) {
      return 'from-blue-500 to-cyan-800';
    } else if (title.includes('sunset') || title.includes('warm') || title.includes('autumn')) {
      return 'from-orange-500 to-red-800';
    } else {
      return 'from-blue-600 to-indigo-900';
    }
  };

  // Get emoji icon based on story title
  const getStoryIcon = () => {
    const title = storyDetails.title.toLowerCase();

    if (title.includes('forest') || title.includes('tree')) {
      return '🌲';
    } else if (title.includes('night') || title.includes('star') || title.includes('dream')) {
      return '✨';
    } else if (title.includes('ocean') || title.includes('sea') || title.includes('water')) {
      return '🌊';
    } else if (title.includes('mountain')) {
      return '🏔️';
    } else if (title.includes('flower') || title.includes('garden')) {
      return '🌸';
    } else if (title.includes('rain')) {
      return '🌧️';
    } else if (title.includes('sun') || title.includes('morning')) {
      return '☀️';
    } else if (title.includes('moon')) {
      return '🌙';
    } else if (title.includes('child') || title.includes('kid')) {
      return '👶';
    } else {
      return '🧘';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b ${getBackgroundGradient()}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-transparent">
        <button onClick={handleBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-white">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="shh"
            className="h-8"
            style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }}
          />
        </div>
        <button className="text-white" onClick={toggleMute}>
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </header>

      <AnimatePresence>
        {showCompletionScreen ? (
          /* Meditation Completion Screen */
          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 rounded-full bg-green-500/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white">Story Complete</h2>
              <p className="text-white/80 mb-6">
                You've completed "{storyDetails.title}".
                We hope you enjoyed it.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  Back to Stories
                </button>
                <button
                  onClick={togglePlayPause}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Main Content */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Story Image */}
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mb-8 bg-blue-600 flex items-center justify-center">
              <span className="text-9xl">{storyDetails.icon || getStoryIcon()}</span>
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
              <span className="text-sm">{formattedTotalDuration}</span>
            </div>

            {/* Play/Pause Button */}
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity mb-8"
              onClick={togglePlayPause}
            >
              {isPlaying ?
                <Pause size={28} className="ml-0.5" /> :
                <Play size={28} className="ml-1" />
              }
            </button>

            {/* Meditation Guidance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md text-center mb-8">
              <h2 className="text-white text-lg font-medium mb-2">Meditation Guidance</h2>
              <p className="text-gray-200 text-sm">
                Close your eyes, relax your body, and let this story guide you into a peaceful state of mind.
                Focus on your breath and allow yourself to be fully present in this moment.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} loop>
        <source src="/lovable-uploads/meditation-sound.mp3" type="audio/mpeg" />
        <source src="/meditation-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default StoryMeditation;
