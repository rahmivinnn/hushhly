import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import BreathingAnimation from '@/components/BreathingAnimation';
import { Button } from '@/components/ui/button';
import HeaderWithLogo from '@/components/HeaderWithLogo';

const MeditationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Audio Error",
            description: "Could not play meditation audio. Please try again.",
          });
        });
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Handle breathing phases
  useEffect(() => {
    if (!isPlaying) return;

    let breathTimer: NodeJS.Timeout;

    const runBreathCycle = () => {
      // Inhale for 4 seconds
      setBreathPhase('inhale');

      breathTimer = setTimeout(() => {
        // Hold for 4 seconds
        setBreathPhase('hold');

        breathTimer = setTimeout(() => {
          // Exhale for 6 seconds
          setBreathPhase('exhale');

          breathTimer = setTimeout(() => {
            // Rest for 2 seconds
            setBreathPhase('rest');

            breathTimer = setTimeout(() => {
              // Repeat the cycle
              runBreathCycle();
            }, 2000);
          }, 6000);
        }, 4000);
      }, 4000);
    };

    runBreathCycle();

    return () => {
      if (breathTimer) clearTimeout(breathTimer);
    };
  }, [isPlaying]);

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

            // Show completion screen
            setShowCompletionScreen(true);

            toast({
              title: "Meditation Complete",
              description: "Your meditation session is complete."
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
  }, [isPlaying, toast]);

  // Reset session
  const resetSession = () => {
    setRemainingTime(300); // Reset to 5 minutes
    setIsPlaying(false);
    setShowCompletionScreen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with blue accent */}
      <div className="bg-blue-500 py-4 px-4 text-white">
        {/* Top navigation with properly centered logo */}
        <HeaderWithLogo
          showBackButton={true}
          logoColor="white"
          bgColor="bg-transparent"
          textColor="text-white"
        />
      </div>

        {/* Timer display */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">{formatTime(remainingTime)}</h2>
          <p className="text-sm text-white/80">Mindful Breathing</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {showCompletionScreen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={40} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Great Job!</h2>
                <p className="text-gray-600">You've completed your meditation session.</p>
              </div>

              <Button
                onClick={resetSession}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Start Again
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Breathing Animation */}
              <div className="relative mb-8 w-full max-w-xs aspect-square">
                <BreathingAnimation
                  isActive={isPlaying}
                  phase={breathPhase}
                  color="bg-blue-500"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-8 mb-8">
                <button
                  onClick={toggleMute}
                  className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                <motion.button
                  onClick={togglePlayPause}
                  className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause size={32} className="text-white" />
                  ) : (
                    <Play size={32} className="text-white ml-1" />
                  )}
                </motion.button>

                <div className="w-12"></div> {/* Placeholder for balance */}
              </div>

              {/* Meditation Guide */}
              <div className="bg-blue-50 rounded-xl p-4 w-full max-w-md">
                <h3 className="font-medium text-blue-800 mb-2 text-center">Meditation Guide</h3>
                <p className="text-gray-700 text-center">
                  {breathPhase === 'inhale' && "Breathe in slowly through your nose..."}
                  {breathPhase === 'hold' && "Hold your breath gently..."}
                  {breathPhase === 'exhale' && "Exhale slowly through your mouth..."}
                  {breathPhase === 'rest' && "Relax and prepare for the next breath..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

export default MeditationScreen;
