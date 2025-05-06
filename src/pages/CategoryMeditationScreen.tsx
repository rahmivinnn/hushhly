import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Play, Pause, Clock, Volume2, VolumeX, Moon, Sun, Heart, Cloud, Waves } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/animations.css';
import BreathingAnimation from '@/components/BreathingAnimation';
import GuidedMeditationPrompts from '@/components/GuidedMeditationPrompts';
import AmbientBackground from '@/components/AmbientBackground';

// Define category-specific animations and icons
interface CategoryVisuals {
  icon: React.ReactNode;
  animation: string;
  background: string;
  secondaryColor: string;
}

const getCategoryVisuals = (category: string): CategoryVisuals => {
  switch (category) {
    case 'Quick Reset':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="4"/>
            <path className="animate-pulse-slow" d="M50 75C63.8071 75 75 63.8071 75 50C75 36.1929 63.8071 25 50 25C36.1929 25 25 36.1929 25 50C25 63.8071 36.1929 75 50 75Z" fill="#7DD3FC" stroke="#0EA5E9" strokeWidth="3"/>
            <path className="animate-pulse-medium" d="M50 65C58.2843 65 65 58.2843 65 50C65 41.7157 58.2843 35 50 35C41.7157 35 35 41.7157 35 50C35 58.2843 41.7157 65 50 65Z" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="2"/>
            <path d="M45 40L55 50L45 60" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        animation: 'animate-pulse-slow',
        background: 'from-blue-400 to-blue-600',
        secondaryColor: 'bg-blue-500'
      };
    case 'Mindful Parenting':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 70C46.0457 70 55 61.0457 55 50C55 38.9543 46.0457 30 35 30C23.9543 30 15 38.9543 15 50C15 61.0457 23.9543 70 35 70Z" fill="#FBCFE8" stroke="#EC4899" strokeWidth="3"/>
            <path className="animate-pulse-medium" d="M65 70C76.0457 70 85 61.0457 85 50C85 38.9543 76.0457 30 65 30C53.9543 30 45 38.9543 45 50C45 61.0457 53.9543 70 65 70Z" fill="#F9A8D4" stroke="#EC4899" strokeWidth="3"/>
            <path d="M50 30C61.0457 30 70 21.0457 70 10C70 21.0457 78.9543 30 90 30C78.9543 30 70 38.9543 70 50C70 38.9543 61.0457 30 50 30Z" fill="#F472B6" stroke="#EC4899" strokeWidth="3"/>
            <path className="animate-pulse-slow" d="M30 90C41.0457 90 50 81.0457 50 70C50 81.0457 58.9543 90 70 90C58.9543 90 50 98.9543 50 110C50 98.9543 41.0457 90 30 90Z" fill="#F472B6" stroke="#EC4899" strokeWidth="3"/>
          </svg>
        ),
        animation: 'animate-float',
        background: 'from-pink-400 to-purple-500',
        secondaryColor: 'bg-pink-500'
      };
    case 'Deep Sleep Recovery':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="animate-pulse-slow" d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z" fill="#C7D2FE" stroke="#6366F1" strokeWidth="3"/>
            <path d="M35 40C38.866 40 42 36.866 42 33C42 36.866 45.134 40 49 40C45.134 40 42 43.134 42 47C42 43.134 38.866 40 35 40Z" fill="#818CF8" stroke="#6366F1" strokeWidth="2"/>
            <path className="animate-pulse-medium" d="M60 65C65.5228 65 70 60.5228 70 55C70 60.5228 74.4772 65 80 65C74.4772 65 70 69.4772 70 75C70 69.4772 65.5228 65 60 65Z" fill="#818CF8" stroke="#6366F1" strokeWidth="2"/>
            <path d="M30 60L70 60" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
            <path d="M40 50L60 50" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
            <path d="M45 70L55 70" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-pulse-slow',
        background: 'from-indigo-400 to-blue-700',
        secondaryColor: 'bg-indigo-600'
      };
    case 'Start Your Day Calm':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3"/>
            <circle className="animate-spin-slow" cx="50" cy="50" r="45" stroke="#F59E0B" strokeWidth="2" strokeDasharray="10 10"/>
            <path d="M50 25V30" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M50 70V75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M25 50H30" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M70 50H75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M32.9289 32.9289L36.4645 36.4645" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M63.5355 63.5355L67.0711 67.0711" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M32.9289 67.0711L36.4645 63.5355" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
            <path d="M63.5355 36.4645L67.0711 32.9289" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-spin-slow',
        background: 'from-amber-400 to-orange-500',
        secondaryColor: 'bg-amber-500'
      };
    case 'Parent–Child Bonding':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="40" r="20" fill="#BBF7D0" stroke="#22C55E" strokeWidth="3"/>
            <circle className="animate-pulse-medium" cx="65" cy="60" r="15" fill="#86EFAC" stroke="#22C55E" strokeWidth="3"/>
            <path className="animate-pulse-slow" d="M35 70C35 70 45 60 65 60" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
            <path d="M30 35C30 35 33 40 40 40C47 40 50 35 50 35" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M60 55C60 55 62 58 65 58C68 58 70 55 70 55" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-bounce-slow',
        background: 'from-green-400 to-teal-500',
        secondaryColor: 'bg-green-500'
      };
    case 'Emotional First Aid':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="animate-pulse-medium" d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z" fill="#FECDD3" stroke="#E11D48" strokeWidth="3"/>
            <path d="M35 40C38.866 40 42 36.866 42 33C42 36.866 45.134 40 49 40C45.134 40 42 43.134 42 47C42 43.134 38.866 40 35 40Z" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2"/>
            <path d="M50 40V60" stroke="#E11D48" strokeWidth="4" strokeLinecap="round"/>
            <path d="M40 50H60" stroke="#E11D48" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-pulse-medium',
        background: 'from-red-400 to-pink-600',
        secondaryColor: 'bg-red-500'
      };
    case 'Affirmations & Mantras':
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="animate-spin-slow" d="M50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="3"/>
            <path d="M50 30L53.5317 40.7295H64.8492L55.6588 47.0409L59.1905 57.7705L50 51.4591L40.8095 57.7705L44.3412 47.0409L35.1508 40.7295H46.4683L50 30Z" fill="#A78BFA" stroke="#8B5CF6" strokeWidth="2"/>
            <path className="animate-pulse-medium" d="M30 65C30 65 40 55 50 55C60 55 70 65 70 65" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-float',
        background: 'from-purple-400 to-indigo-600',
        secondaryColor: 'bg-purple-500'
      };
    default:
      return {
        icon: (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="#A5F3FC" stroke="#06B6D4" strokeWidth="3"/>
            <path className="animate-pulse-medium" d="M50 30V70" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round"/>
            <path d="M30 50H70" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        ),
        animation: 'animate-pulse-medium',
        background: 'from-cyan-500 to-blue-600',
        secondaryColor: 'bg-cyan-500'
      };
  }
};

const CategoryMeditationScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get category and meditation info from location state
  const state = location.state as { title?: string; category?: string; duration?: string } | null;
  const title = state?.title || "Meditation";
  const category = state?.category || "default";
  const duration = state?.duration || "15 Min";

  // Get the numeric duration
  const initialDuration = parseInt(duration.split(' ')[0]) || 15;

  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(initialDuration * 60); // in seconds
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [ambientSoundType, setAmbientSoundType] = useState<'nature' | 'rain' | 'waves' | 'white-noise'>('nature');
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [meditationStats, setMeditationStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);

  // Get the visuals for this category
  const visuals = getCategoryVisuals(category);

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

            // Pause all audio
            if (mainAudioRef.current) {
              mainAudioRef.current.pause();
            }
            if (ambientAudioRef.current) {
              ambientAudioRef.current.pause();
            }

            // Show completion screen
            setShowCompletionScreen(true);

            // Update meditation stats
            setMeditationStats(prev => ({
              totalSessions: prev.totalSessions + 1,
              totalMinutes: prev.totalMinutes + initialDuration,
              currentStreak: prev.currentStreak + 1
            }));

            toast({
              title: "Meditation Complete",
              description: `Your ${initialDuration} minute meditation session is complete.`
            });
            return 0;
          }
          return prev - 1;
        });

        // Update elapsed time
        setElapsedTime(prev => prev + 1);
      }, 1000);

      // Start breathing guide
      setShowBreathingGuide(true);
      runBreathCycle();

      // Play audio
      if (mainAudioRef.current) {
        mainAudioRef.current.volume = 0.7;
        mainAudioRef.current.play().catch(error => {
          console.error('Error playing main audio:', error);
        });
      }

      if (ambientAudioRef.current) {
        ambientAudioRef.current.volume = 0.3;
        ambientAudioRef.current.play().catch(error => {
          console.error('Error playing ambient audio:', error);
        });
      }
    } else {
      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Pause breathing guide
      if (breathTimerRef.current) {
        clearInterval(breathTimerRef.current);
      }

      // Pause audio
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }

      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (breathTimerRef.current) {
        clearInterval(breathTimerRef.current);
      }

      // Pause all audio
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    };
  }, [isPlaying, initialDuration, toast]);

  const runBreathCycle = () => {
    // Clear any existing breath timer
    if (breathTimerRef.current) {
      clearInterval(breathTimerRef.current);
    }

    // Start with inhale
    setBreathPhase('inhale');

    // Inhale for 4 seconds
    breathTimerRef.current = setTimeout(() => {
      // Hold for 4 seconds
      setBreathPhase('hold');

      breathTimerRef.current = setTimeout(() => {
        // Exhale for 6 seconds
        setBreathPhase('exhale');

        breathTimerRef.current = setTimeout(() => {
          // Rest for 2 seconds
          setBreathPhase('rest');

          breathTimerRef.current = setTimeout(() => {
            // Repeat the cycle
            if (isPlaying) {
              runBreathCycle();
            }
          }, 2000);
        }, 6000);
      }, 4000);
    }, 4000);
  };

  const handleBack = () => {
    // Stop audio and timer before navigating away
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (breathTimerRef.current) {
        clearInterval(breathTimerRef.current);
      }
    }
    navigate(-1);
  };

  const togglePlayPause = () => {
    // If meditation is complete, reset it
    if (showCompletionScreen) {
      setShowCompletionScreen(false);
      setRemainingTime(initialDuration * 60);
      setElapsedTime(0);
    }

    if (isPlaying) {
      // Pause all audio
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    } else {
      // Play all audio
      if (mainAudioRef.current) {
        mainAudioRef.current.play().catch(error => {
          console.error('Error playing main audio:', error);
          toast({
            title: "Audio Error",
            description: "There was an error playing the audio. Please try again."
          });
        });
      }

      if (ambientAudioRef.current) {
        ambientAudioRef.current.play().catch(error => {
          console.error('Error playing ambient audio:', error);
        });
      }
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (mainAudioRef.current) {
      mainAudioRef.current.muted = !isMuted;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Change ambient sound type
  const cycleAmbientSound = () => {
    const soundTypes: Array<'nature' | 'rain' | 'waves' | 'white-noise'> = ['nature', 'rain', 'waves', 'white-noise'];
    const currentIndex = soundTypes.indexOf(ambientSoundType);
    const nextIndex = (currentIndex + 1) % soundTypes.length;
    setAmbientSoundType(soundTypes[nextIndex]);

    toast({
      title: "Ambient Sound Changed",
      description: `Now playing: ${soundTypes[nextIndex].replace('-', ' ')} sounds`,
      duration: 2000,
    });
  };

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get breathing instruction based on current phase
  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
      default:
        return '';
    }
  };

  // Get the scale factor for the breathing circle
  const getBreathingScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-100';
      case 'rest':
        return 'scale-100';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br ${visuals.background} text-white relative overflow-hidden`}>
      {/* Ambient Background */}
      <AmbientBackground category={category} isActive={isPlaying} />

      {/* Header */}
      <header className="flex items-center justify-between p-4 z-10">
        <button
          className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm"
          onClick={handleBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white drop-shadow-md">{title}</h1>
        <div className="flex space-x-2">
          <button
            className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm"
            onClick={cycleAmbientSound}
          >
            {ambientSoundType === 'nature' && <Sun size={24} />}
            {ambientSoundType === 'rain' && <Cloud size={24} />}
            {ambientSoundType === 'waves' && <Waves size={24} />}
            {ambientSoundType === 'white-noise' && <Moon size={24} />}
          </button>
          <button
            className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showCompletionScreen ? (
          /* Meditation Completion Screen */
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md p-6"
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

              <h2 className="text-2xl font-bold mb-2">Meditation Complete</h2>
              <p className="text-white/80 mb-6">
                You've completed your {initialDuration} minute {category} meditation.
                How do you feel?
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-2xl font-bold">{meditationStats.totalSessions}</div>
                  <div className="text-sm text-white/70">Total Sessions</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-2xl font-bold">{meditationStats.totalMinutes}</div>
                  <div className="text-sm text-white/70">Total Minutes</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={togglePlayPause}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Meditate Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Main Meditation Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
            {/* Timer Display */}
            <div className="text-4xl font-bold mb-6 drop-shadow-lg">{formatTime(remainingTime)}</div>

            {/* Breathing Animation */}
            <div className="relative mb-8">
              {isPlaying ? (
                <BreathingAnimation
                  isActive={isPlaying}
                  phase={breathPhase}
                  color={visuals.secondaryColor.replace('bg-', 'bg-')}
                />
              ) : (
                <div className={`${visuals.animation}`}>
                  {visuals.icon}
                </div>
              )}
            </div>

            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              className={`w-20 h-20 rounded-full ${visuals.secondaryColor} flex items-center justify-center shadow-lg hover:opacity-90 transition-all active:scale-95 mb-8`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {isPlaying ? (
                <Pause size={40} fill="white" />
              ) : (
                <Play size={40} fill="white" className="ml-2" />
              )}
            </motion.button>

            {/* Meditation Instructions */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-2">Meditation Guide</h2>
              <p className="mb-4">
                {category === 'Quick Reset' && "Focus on your breath. Let go of tension with each exhale."}
                {category === 'Mindful Parenting' && "Breathe in patience, exhale reactivity. Connect with your inner calm."}
                {category === 'Deep Sleep Recovery' && "Release the day with each breath. Let your body grow heavy and relaxed."}
                {category === 'Start Your Day Calm' && "Breathe in new possibilities. Set your intention for the day ahead."}
                {category === 'Parent–Child Bonding' && "Breathe together, creating a shared moment of peace and connection."}
                {category === 'Emotional First Aid' && "Acknowledge your feelings without judgment. Breathe through any discomfort."}
                {category === 'Affirmations & Mantras' && "With each breath, affirm your strength, peace, and resilience."}
              </p>
              <div className="flex items-center justify-center text-sm">
                <Clock size={16} className="mr-2" />
                <span>{duration} session</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guided Meditation Prompts */}
      <GuidedMeditationPrompts
        isActive={isPlaying && !showCompletionScreen}
        category={category}
        elapsedTime={elapsedTime}
      />

      {/* Audio Elements (hidden) */}
      <audio ref={mainAudioRef} loop>
        <source src="/meditation-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <audio ref={ambientAudioRef} loop>
        <source
          src={`/ambient-${ambientSoundType}.mp3`}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CategoryMeditationScreen;
