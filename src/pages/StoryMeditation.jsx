import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Play, Pause, Volume2, VolumeX, Heart, SkipBack, SkipForward, Shuffle, Repeat, Home, BookOpen, Users, Moon, User } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Frequency visualization constants
const FREQUENCY_TYPES = {
  LOW: { label: 'Low Frequency (Calming, Grounding)', color: 'from-blue-400 to-blue-600' },
  MID: { label: 'Mid Frequency (Soothing, Ambient)', color: 'from-cyan-400 to-cyan-600' },
  HIGH: { label: 'High Frequency (Subtle, Ethereal)', color: 'from-purple-400 to-purple-600' }
};

const StoryMeditation = () => {
  // Animation variants for UI elements
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: { scale: 1.05 },
    transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
  };

  const buttonHoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };
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
  const [currentFrequency, setCurrentFrequency] = useState('MID');
  const [isHovered, setIsHovered] = useState(false);

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

  // Generate and animate waveform bars
  useEffect(() => {
    const generateBars = () => {
      const bars = [];
      for (let i = 0; i < 50; i++) {
        const frequency = Math.sin((Date.now() / 1000) + i * 0.2);
        const amplitude = Math.random() * 100;
        bars.push({
          height: amplitude,
          frequency: frequency
        });
      }
      return bars;
    };

    setWaveformBars(generateBars());

    const interval = setInterval(() => {
      if (isPlaying) {
        setWaveformBars(generateBars());
        // Simulate frequency changes
        setCurrentFrequency(prev => {
          const frequencies = Object.keys(FREQUENCY_TYPES);
          const currentIndex = frequencies.indexOf(prev);
          return frequencies[(currentIndex + 1) % frequencies.length];
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

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

  // Get story image based on title
  const getStoryImage = () => {
    const title = storyDetails.title.toLowerCase();

    if (title.includes('forest') || title.includes('tree')) {
      return '/lovable-uploads/forest-meditation.jpg';
    } else if (title.includes('night') || title.includes('star') || title.includes('dream')) {
      return '/lovable-uploads/starlit-dreams.jpg';
    } else if (title.includes('ocean') || title.includes('sea') || title.includes('water')) {
      return '/lovable-uploads/ocean-waves.jpg';
    } else if (title.includes('mountain')) {
      return '/lovable-uploads/mountain-serenity.jpg';
    } else if (title.includes('flower') || title.includes('garden')) {
      return '/lovable-uploads/peaceful-garden.jpg';
    } else if (title.includes('rain')) {
      return '/lovable-uploads/gentle-rainfall.jpg';
    } else if (title.includes('sun') || title.includes('morning')) {
      return '/lovable-uploads/sunrise-meditation.jpg';
    } else if (title.includes('moon')) {
      return '/lovable-uploads/moonlight-magic.jpg';
    } else if (title.includes('child') || title.includes('kid')) {
      return '/lovable-uploads/child-meditation.jpg';
    } else {
      return '/lovable-uploads/whispering-forest.jpg';
    }
  };

  // Get background gradient based on story title
  const getBackgroundGradient = () => {
    // Use a consistent cyan-to-blue gradient as shown in the reference image
    return 'from-cyan-500 via-blue-500 to-indigo-600';
  };

  // Get emoji icon based on story title (fallback function)
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-transparent">
        <button onClick={handleBack} className="text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Shh Logo"
            className="h-8"
            style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }}
          />
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-800" onClick={toggleMute}>
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
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
            {/* Story Image with Animation */}
            <motion.div
              className="w-full max-w-[500px] aspect-square rounded-full overflow-hidden border-8 border-white/30 shadow-2xl mb-8 relative"
              initial="initial"
              animate="animate"
              variants={pulseAnimation}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getStoryImage()})`
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-cyan-500/30 to-purple-500/40 backdrop-blur-sm"
                animate={{
                  opacity: [0.4, 0.6, 0.4],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="text-9xl relative z-10 drop-shadow-2xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                >
                  {storyDetails.icon}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Story Title and Description with Animation */}
            <motion.div
              className="text-center mb-10"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.h1
                className="text-gray-800 text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {storyDetails.title}
              </motion.h1>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {storyDetails.description}
              </motion.p>
            </motion.div>

            {/* Enhanced Waveform Visualization */}
            <div className="w-full mb-4 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r opacity-20"
                animate={{
                  background: [
                    `linear-gradient(90deg, ${FREQUENCY_TYPES[currentFrequency].color})`,
                    `linear-gradient(90deg, ${FREQUENCY_TYPES[currentFrequency].color})`
                  ]
                }}
                transition={{ duration: 1 }}
              />
              <div className="flex items-end justify-between h-16 px-2 relative">
                {waveformBars.map((bar, index) => {
                  const barProgress = (index / waveformBars.length) * 100;
                  const isActive = barProgress <= progress;
                  return (
                    <motion.div
                      key={index}
                      className={cn(
                        'w-1 rounded-full mx-0.5',
                        isActive ? `bg-gradient-to-t ${FREQUENCY_TYPES[currentFrequency].color}` : 'bg-gray-200'
                      )}
                      initial={{ height: '20%' }}
                      animate={{
                        height: `${Math.max(15, isPlaying ? (bar.height + (bar.frequency * 20)) : bar.height)}%`,
                        opacity: isPlaying ? [0.6, 1] : 0.8
                      }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeInOut'
                      }}
                    />
                  );
                })}
              </div>
              <style jsx>{`
                @keyframes pulse {
                  0% { transform: scaleY(1); }
                  50% { transform: scaleY(1.1); }
                  100% { transform: scaleY(1); }
                }
              `}</style>
            </div>

            {/* Time Display */}
            <div className="flex justify-between w-full text-white mb-6">
              <span className="text-sm">{currentTime}</span>
              <span className="text-sm">{formattedTotalDuration}</span>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-between w-full mb-8">
              <button className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <Shuffle size={20} />
              </button>

              <button className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <SkipBack size={24} />
              </button>

              <motion.button
                onClick={togglePlayPause}
                className="relative bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg overflow-hidden"
                whileHover={buttonHoverAnimation}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30"
                  animate={{
                    scale: isPlaying ? [1, 1.2, 1] : 1,
                    opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.2
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <motion.div
                  animate={{
                    scale: isPlaying ? [1, 1.1, 1] : 1,
                    rotate: isPlaying ? [0, 180, 360] : 0
                  }}
                  transition={{
                    duration: isPlaying ? 4 : 0.3,
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'linear'
                  }}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </motion.div>
              </motion.button>

              <button className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <SkipForward size={24} />
              </button>

              <button className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                <Repeat size={20} />
              </button>
            </div>

            {/* Enhanced Start Meditation Button */}
            <motion.button
              className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white text-lg font-medium mb-8 px-8 py-3 rounded-full shadow-lg overflow-hidden"
              whileHover={{
                scale: 1.05,
                backgroundPosition: ['0%', '100%'],
                transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPlaying(true);
                togglePlayPause();
                toast({
                  title: "Meditation Started",
                  description: "Relax and enjoy your meditation journey",
                  duration: 3000
                });
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              <span className="relative z-10">Start Meditation</span>
            </motion.button>
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
