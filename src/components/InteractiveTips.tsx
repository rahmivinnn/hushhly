import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Heart, Wind, Brain, Sun, Moon, MessageSquare,
  ChevronLeft, ChevronRight, Zap, Focus, Sparkles,
  Flame, CloudFog, Waves, Timer, Activity, Play,
  Pause, RotateCcw, Check, X, Music, Volume2, VolumeX,
  Droplets, Flower, Leaf, Cloud, Snowflake, Sunrise
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import MeditationChat from './MeditationChat';

interface InteractiveTipsProps {
  onClose: () => void;
  category?: string;
  gradient?: string;
}

type SimulationStep = {
  instruction: string;
  duration: number; // in seconds
  animation?: string;
  icon?: React.ReactNode;
  color?: string;
};

type Simulation = {
  title: string;
  description: string;
  steps: SimulationStep[];
  benefits: string[];
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background?: string;
  };
  layout?: 'standard' | 'breathwork' | 'energy' | 'focus';
  backgroundElements?: React.ReactNode;
  hasAudio?: boolean;
  audioTitle?: string;
  interactiveElements?: React.ReactNode;
};

const InteractiveTips: React.FC<InteractiveTipsProps> = ({
  onClose,
  category = 'Mindfulness',
  gradient = 'from-cyan-500 to-blue-600'
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('mindfulness');
  const [showChat, setShowChat] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<string | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showBreathCircle, setShowBreathCircle] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [interactionCount, setInteractionCount] = useState(0);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // Define tip categories
  const tipCategories = {
    mindfulness: {
      icon: <Brain size={24} />,
      title: 'Mindfulness Tips',
      tips: [
        'Focus on your breath - notice the sensation of air flowing in and out',
        'Observe your thoughts without judgment, like clouds passing in the sky',
        'Bring awareness to the present moment, not the past or future',
        'Notice the small details around you - colors, textures, sounds',
        'Practice mindful eating by savoring each bite slowly'
      ]
    },
    breathing: {
      icon: <Wind size={24} />,
      title: 'Breathing Techniques',
      tips: [
        '4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8',
        'Box Breathing: Equal counts of inhale, hold, exhale, and hold',
        'Diaphragmatic Breathing: Breathe deeply into your belly, not chest',
        'Alternate Nostril Breathing: Close one nostril at a time while breathing',
        'Pursed Lip Breathing: Inhale through nose, exhale slowly through pursed lips'
      ]
    },
    stress: {
      icon: <CloudFog size={24} />,
      title: 'Stress Relief',
      tips: [
        'Progressive muscle relaxation: tense and release each muscle group',
        'Visualize a peaceful place where you feel safe and calm',
        'Practice self-compassion by treating yourself with kindness',
        'Try a body scan meditation to release tension from head to toe',
        'Use the 5-4-3-2-1 technique: notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste'
      ]
    },
    focus: {
      icon: <Focus size={24} />,
      title: 'Focus Enhancement',
      tips: [
        'Set a clear intention for your meditation or work session',
        'Use a single point of focus like a candle flame or your breath',
        'Count your breaths from 1 to 10, then start over if your mind wanders',
        'Practice the Pomodoro technique: 25 minutes of focus, then a 5-minute break',
        'Create a distraction-free environment before beginning your practice'
      ]
    },
    energy: {
      icon: <Zap size={24} />,
      title: 'Energy Boost',
      tips: [
        'Try energizing "breath of fire" - rapid, rhythmic breathing through the nose',
        'Perform a quick 1-minute stretching routine to increase blood flow',
        'Use stimulating pressure points: tap the top of your head, between eyebrows, and under your nose',
        'Visualize bright, warm energy filling your body from head to toe',
        'Take 10 deep, full breaths while standing with arms raised overhead'
      ]
    },
    sleep: {
      icon: <Moon size={24} />,
      title: 'Better Sleep',
      tips: [
        'Practice the 4-7-8 breathing technique while lying in bed',
        'Progressively relax each part of your body from toes to head',
        'Visualize yourself in a peaceful, safe place as you drift off',
        'Count backward slowly from 100, focusing only on the numbers',
        'Listen to gentle nature sounds or white noise to mask distractions'
      ]
    },
    gratitude: {
      icon: <Heart size={24} />,
      title: 'Gratitude Practice',
      tips: [
        'Name three things you\'re grateful for that happened today',
        'Write a mental thank-you note to someone who helped you recently',
        'Notice five simple pleasures you experienced in the last 24 hours',
        'Appreciate one aspect of your body and what it allows you to do',
        'Find gratitude for a challenge that helped you grow stronger'
      ]
    },
    quotes: {
      icon: <MessageSquare size={24} />,
      title: 'Wisdom Quotes',
      tips: [
        '"The present moment is the only moment available to us, and it is the door to all moments." - Thich Nhat Hanh',
        '"Peace comes from within. Do not seek it without." - Buddha',
        '"You are the sky. Everything else is just the weather." - Pema Chödrön',
        '"Quiet the mind, and the soul will speak." - Ma Jaya Sati Bhagavati',
        "\"The goal of meditation is not to control your thoughts, it is to stop letting them control you.\" - Unknown"
      ]
    }
  };

  // Define interactive simulations
  const simulations: Record<string, Simulation> = {
    stressRelief: {
      title: 'Stress Relief Breathing',
      description: 'A guided ocean-themed breathing exercise to reduce stress and anxiety',
      benefits: [
        'Lowers cortisol levels',
        'Reduces muscle tension',
        'Calms racing thoughts',
        'Improves focus and clarity'
      ],
      theme: {
        primary: 'from-blue-500 to-cyan-400',
        secondary: 'bg-blue-400/30',
        accent: 'bg-cyan-300/50',
        text: 'text-blue-50',
        background: 'bg-gradient-to-b from-blue-600 via-blue-500 to-cyan-400'
      },
      layout: 'breathwork',
      hasAudio: true,
      audioTitle: 'Ocean Waves',
      backgroundElements: (
        <>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 bg-blue-400/20 rounded-t-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 bg-blue-300/20 rounded-t-full"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-20 right-10 text-blue-200/30"
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Cloud size={40} />
          </motion.div>
          <motion.div
            className="absolute top-40 left-10 text-blue-200/30"
            animate={{ y: [0, -5, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          >
            <Cloud size={30} />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-20 text-cyan-200/30"
            animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <Droplets size={25} />
          </motion.div>
        </>
      ),
      steps: [
        {
          instruction: 'Find a comfortable position and imagine yourself by the ocean',
          duration: 5,
          icon: <Waves size={32} />
        },
        {
          instruction: 'Watch the circle expand and inhale deeply through your nose',
          duration: 4,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Hold your breath as the circle pauses',
          duration: 4,
          animation: 'hold',
          icon: <Timer size={32} />
        },
        {
          instruction: 'Exhale slowly as the circle contracts',
          duration: 6,
          animation: 'breatheOut',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Feel the tension flowing away like receding waves',
          duration: 5,
          animation: 'breatheOut',
          icon: <Waves size={32} />
        },
        {
          instruction: 'Imagine a peaceful blue light surrounding you like ocean water',
          duration: 8,
          animation: 'pulse',
          icon: <Sparkles size={32} />
        },
        {
          instruction: 'With each breath, let your worries drift away with the tide',
          duration: 10,
          animation: 'breatheOut',
          icon: <CloudFog size={32} />
        },
        {
          instruction: 'Notice how your body feels lighter, like floating in water',
          duration: 5,
          icon: <Droplets size={32} />
        }
      ]
    },
    focusEnhancement: {
      title: 'Focus Enhancement',
      description: 'A forest-inspired meditation to sharpen your concentration and mental clarity',
      benefits: [
        'Improves attention span',
        'Reduces mental chatter',
        'Enhances cognitive performance',
        'Builds mental stamina'
      ],
      theme: {
        primary: 'from-emerald-600 to-green-500',
        secondary: 'bg-emerald-600/30',
        accent: 'bg-green-400/50',
        text: 'text-emerald-50',
        background: 'bg-gradient-to-b from-emerald-700 via-emerald-600 to-green-500'
      },
      layout: 'focus',
      hasAudio: true,
      audioTitle: 'Forest Sounds',
      backgroundElements: (
        <>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 bg-green-900/30"
          />
          <motion.div
            className="absolute bottom-10 left-10 text-green-400/40"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          >
            <Leaf size={30} />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-20 text-green-300/40"
            animate={{ rotate: [0, -5, 0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          >
            <Leaf size={25} />
          </motion.div>
          <motion.div
            className="absolute top-40 right-10 text-green-200/30"
            animate={{ y: [0, -5, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Flower size={20} />
          </motion.div>
          <motion.div
            className="absolute top-60 left-20 text-green-200/30"
            animate={{ y: [0, -3, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <Flower size={15} />
          </motion.div>
        </>
      ),
      steps: [
        {
          instruction: 'Sit upright with a straight spine, as strong as a tree',
          duration: 5,
          icon: <Leaf size={32} />
        },
        {
          instruction: 'Imagine yourself in a peaceful forest clearing',
          duration: 5,
          icon: <Flower size={32} />
        },
        {
          instruction: 'Focus on a single point, like sunlight through leaves',
          duration: 8,
          animation: 'pulse',
          icon: <Sunrise size={32} />
        },
        {
          instruction: 'Take three deep breaths, inhaling the fresh forest air',
          duration: 10,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'With each breath, your mind becomes clearer like a forest stream',
          duration: 8,
          animation: 'breatheIn',
          icon: <Droplets size={32} />
        },
        {
          instruction: 'If your mind wanders, gently return to the forest scene',
          duration: 5,
          icon: <Leaf size={32} />
        },
        {
          instruction: 'Feel your roots growing deeper, your focus strengthening',
          duration: 8,
          animation: 'pulse',
          icon: <Focus size={32} />
        },
        {
          instruction: 'Your mind is now clear and alert, like a watchful forest animal',
          duration: 5,
          icon: <Sparkles size={32} />
        }
      ],
      interactiveElements: (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-400/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>
      )
    },
    energyBoost: {
      title: 'Quick Energy Boost',
      description: 'A dynamic fire-inspired exercise to instantly increase energy and alertness',
      benefits: [
        'Increases oxygen flow',
        'Stimulates the nervous system',
        'Improves mental alertness',
        'Boosts physical energy'
      ],
      theme: {
        primary: 'from-orange-500 to-red-500',
        secondary: 'bg-orange-500/30',
        accent: 'bg-yellow-400/50',
        text: 'text-orange-50',
        background: 'bg-gradient-to-b from-red-600 via-orange-500 to-yellow-500'
      },
      layout: 'energy',
      hasAudio: true,
      audioTitle: 'Energizing Beats',
      backgroundElements: (
        <>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 bg-red-500/20"
            animate={{ height: [80, 100, 120, 90, 80] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-16 bg-orange-400/20"
            animate={{ height: [60, 90, 70, 100, 60] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-12 bg-yellow-300/20"
            animate={{ height: [40, 70, 50, 80, 40] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-40 right-10 text-yellow-300/40"
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Flame size={30} />
          </motion.div>
          <motion.div
            className="absolute bottom-60 left-20 text-orange-400/40"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
          >
            <Flame size={25} />
          </motion.div>
          <motion.div
            className="absolute top-40 left-10 text-red-300/30"
            animate={{ y: [0, -5, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            <Zap size={20} />
          </motion.div>
        </>
      ),
      steps: [
        {
          instruction: 'Stand up with feet shoulder-width apart, feel the energy rising',
          duration: 3,
          icon: <Zap size={32} />
        },
        {
          instruction: 'Shake your hands and arms vigorously like flames dancing',
          duration: 5,
          animation: 'shake',
          icon: <Activity size={32} />
        },
        {
          instruction: 'Take a powerful breath in while raising your arms like rising fire',
          duration: 3,
          animation: 'breatheIn',
          icon: <Flame size={32} />
        },
        {
          instruction: 'Exhale forcefully with a "HA" sound, releasing energy',
          duration: 2,
          animation: 'breatheOut',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Tap rapidly on your chest and arms to spark your inner fire',
          duration: 8,
          animation: 'shake',
          icon: <Activity size={32} />
        },
        {
          instruction: 'Jump up and down, letting energy surge through your body',
          duration: 5,
          animation: 'bounce',
          icon: <Zap size={32} />
        },
        {
          instruction: 'Visualize bright flames of energy filling your entire body',
          duration: 5,
          animation: 'pulse',
          icon: <Flame size={32} />
        },
        {
          instruction: 'Feel the vibrant energy radiating from your core like the sun',
          duration: 5,
          icon: <Sparkles size={32} />
        }
      ],
      interactiveElements: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex justify-around"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-10 h-32 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-t-full opacity-40"
                animate={{
                  height: [120, 160 + (i * 10) % 40, 100, 140 + (i * 15) % 50, 120],
                  opacity: [0.3, 0.5, 0.4, 0.6, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + (i * 0.2),
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        </div>
      )
    }
  };

  // Get current tips array
  const currentTips = tipCategories[currentCategory as keyof typeof tipCategories].tips;
  const currentTitle = tipCategories[currentCategory as keyof typeof tipCategories].title;
  const currentIcon = tipCategories[currentCategory as keyof typeof tipCategories].icon;

  // Handle next tip
  const handleNextTip = () => {
    setIsAnimating(true);
    setCurrentTipIndex((prev) => (prev + 1) % currentTips.length);
  };

  // Handle previous tip
  const handlePrevTip = () => {
    setIsAnimating(false);
    setCurrentTipIndex((prev) => (prev - 1 + currentTips.length) % currentTips.length);
  };

  // Timer effect for simulations
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Move to next step when timer reaches 0
            if (currentSimulation) {
              const currentSim = simulations[currentSimulation];
              if (simulationStep < currentSim.steps.length - 1) {
                // Update breath phase based on the next step's animation
                const nextStep = currentSim.steps[simulationStep + 1];
                if (nextStep.animation === 'breatheIn') {
                  setBreathPhase('inhale');
                  setShowBreathCircle(true);
                } else if (nextStep.animation === 'hold') {
                  setBreathPhase('hold');
                  setShowBreathCircle(true);
                } else if (nextStep.animation === 'breatheOut') {
                  setBreathPhase('exhale');
                  setShowBreathCircle(true);
                } else {
                  setShowBreathCircle(false);
                }

                // Increment interaction counter for energy layout
                if (currentSim.layout === 'energy' &&
                    (nextStep.animation === 'shake' || nextStep.animation === 'bounce')) {
                  setInteractionCount(prev => prev + 1);
                }

                setSimulationStep(prev => prev + 1);
                return nextStep.duration;
              } else {
                // End of simulation
                setIsTimerRunning(false);

                // Show completion screen with appropriate message
                let message = "You've completed the exercise successfully!";
                if (currentSimulation === 'stressRelief') {
                  message = "Your mind and body should feel more relaxed now. Take this calm feeling with you throughout your day.";
                } else if (currentSimulation === 'focusEnhancement') {
                  message = "Your mind is now clear and focused. You're ready to tackle any task with improved concentration.";
                } else if (currentSimulation === 'energyBoost') {
                  message = "Feel that energy flowing through you! You're recharged and ready to take on the day.";
                }

                setCompletionMessage(message);
                setShowCompletionScreen(true);

                return 0;
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timerSeconds, currentSimulation, simulationStep]);

  // Start a simulation
  const startSimulation = (simulationKey: string) => {
    if (simulations[simulationKey]) {
      // Reset all states
      setCurrentSimulation(simulationKey);
      setSimulationStep(0);
      setTimerSeconds(simulations[simulationKey].steps[0].duration);
      setIsTimerRunning(true);
      setShowSimulation(true);
      setShowCompletionScreen(false);
      setInteractionCount(0);
      setAudioEnabled(false);

      // Set initial breath phase based on first step
      const firstStep = simulations[simulationKey].steps[0];
      if (simulations[simulationKey].layout === 'breathwork') {
        if (firstStep.animation === 'breatheIn') {
          setBreathPhase('inhale');
          setShowBreathCircle(true);
        } else if (firstStep.animation === 'hold') {
          setBreathPhase('hold');
          setShowBreathCircle(true);
        } else if (firstStep.animation === 'breatheOut') {
          setBreathPhase('exhale');
          setShowBreathCircle(true);
        } else {
          setShowBreathCircle(false);
        }
      } else {
        setShowBreathCircle(false);
      }

      // Show toast notification
      toast({
        title: `Starting ${simulations[simulationKey].title}`,
        description: "Follow the guided instructions",
        duration: 2000,
      });
    }
  };

  // Pause or resume simulation
  const toggleSimulationTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  // Reset simulation
  const resetSimulation = () => {
    if (currentSimulation) {
      setSimulationStep(0);
      setTimerSeconds(simulations[currentSimulation].steps[0].duration);
      setIsTimerRunning(true);
      setShowCompletionScreen(false);
      setInteractionCount(0);

      // Reset breath phase if needed
      const firstStep = simulations[currentSimulation].steps[0];
      if (simulations[currentSimulation].layout === 'breathwork') {
        if (firstStep.animation === 'breatheIn') {
          setBreathPhase('inhale');
          setShowBreathCircle(true);
        } else if (firstStep.animation === 'hold') {
          setBreathPhase('hold');
          setShowBreathCircle(true);
        } else if (firstStep.animation === 'breatheOut') {
          setBreathPhase('exhale');
          setShowBreathCircle(true);
        } else {
          setShowBreathCircle(false);
        }
      } else {
        setShowBreathCircle(false);
      }

      toast({
        title: "Exercise Restarted",
        description: "Starting from the beginning",
        duration: 2000,
      });
    }
  };

  // Exit simulation
  const exitSimulation = () => {
    setShowSimulation(false);
    setCurrentSimulation(null);
    setSimulationStep(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setShowCompletionScreen(false);
    setShowBreathCircle(false);
    setAudioEnabled(false);
    setInteractionCount(0);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentTipIndex(0);

    toast({
      title: `${tipCategories[category as keyof typeof tipCategories].title}`,
      description: "Explore new tips in this category",
      duration: 2000,
    });
  };

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${gradient} overflow-hidden`}>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={showSimulation ? exitSimulation : onClose}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <motion.h1
          className="text-white text-lg font-semibold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {showSimulation && currentSimulation
            ? simulations[currentSimulation].title
            : currentTitle}
        </motion.h1>
        <button
          onClick={() => setShowChat(true)}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </motion.div>

      {/* Main Content */}
      {!showSimulation ? (
        <div className="flex flex-col items-center justify-between h-[calc(100%-60px)] px-6 py-4">
          {/* Tip Display */}
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full mb-6"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/30 p-3 rounded-full">
                  {currentIcon}
                </div>
              </div>

              <div className="relative h-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentCategory}-${currentTipIndex}`}
                    initial={{ opacity: 0, x: isAnimating ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isAnimating ? -50 : 50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center absolute inset-0 flex items-center justify-center"
                  >
                    <p className="text-white text-lg">
                      {currentTips[currentTipIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  {currentTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentTipIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full max-w-xs mb-6">
              <Button
                onClick={handlePrevTip}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                onClick={handleNextTip}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              >
                <ChevronRight size={24} />
              </Button>
            </div>

            {/* Interactive Simulations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-md mx-auto mb-6"
            >
              <h3 className="text-white text-sm mb-3 text-center font-medium">Try an Interactive Exercise</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => startSimulation('stressRelief')}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90 transition-opacity border border-white/10 shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-400/30 p-2 rounded-full mr-3">
                      <CloudFog size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Stress Relief</span>
                      <p className="text-xs text-white/90">2-min guided breathing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">Start</span>
                    <ChevronRight size={16} />
                  </div>
                </Button>

                <Button
                  onClick={() => startSimulation('focusEnhancement')}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:opacity-90 transition-opacity border border-white/10 shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-indigo-500/30 p-2 rounded-full mr-3">
                      <Focus size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Focus Enhancement</span>
                      <p className="text-xs text-white/90">3-min concentration exercise</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">Start</span>
                    <ChevronRight size={16} />
                  </div>
                </Button>

                <Button
                  onClick={() => startSimulation('energyBoost')}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 transition-opacity border border-white/10 shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-orange-500/30 p-2 rounded-full mr-3">
                      <Zap size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Quick Energy Boost</span>
                      <p className="text-xs text-white/90">1-min energizing practice</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">Start</span>
                    <ChevronRight size={16} />
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-md mx-auto mb-4"
          >
            <h3 className="text-white text-sm mb-2 text-center">Choose a category</h3>
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => handleCategoryChange('mindfulness')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'mindfulness'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Brain size={20} />
                <span className="text-xs mt-1">Mindful</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('breathing')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'breathing'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Wind size={20} />
                <span className="text-xs mt-1">Breath</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('stress')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'stress'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <CloudFog size={20} />
                <span className="text-xs mt-1">Stress</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('focus')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'focus'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Focus size={20} />
                <span className="text-xs mt-1">Focus</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('energy')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'energy'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Zap size={20} />
                <span className="text-xs mt-1">Energy</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('sleep')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'sleep'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Moon size={20} />
                <span className="text-xs mt-1">Sleep</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('gratitude')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'gratitude'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={20} />
                <span className="text-xs mt-1">Gratitude</span>
              </Button>
              <Button
                onClick={() => handleCategoryChange('quotes')}
                className={`flex flex-col items-center p-3 rounded-xl ${
                  currentCategory === 'quotes'
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <MessageSquare size={20} />
                <span className="text-xs mt-1">Quotes</span>
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Simulation Mode */
        <div className={`flex flex-col items-center justify-between h-[calc(100%-60px)] px-6 py-4 relative overflow-hidden ${simulations[currentSimulation]?.theme.background || `bg-gradient-to-br ${simulations[currentSimulation]?.theme.primary || gradient}`}`}>
          {/* Background Elements */}
          {currentSimulation && simulations[currentSimulation].backgroundElements}

          {currentSimulation && (
            <>
              {/* Simulation Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto mb-4 relative z-10"
              >
                <p className={`${simulations[currentSimulation].theme.text} text-sm text-center mb-2`}>
                  {simulations[currentSimulation].description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {simulations[currentSimulation].benefits.map((benefit, index) => (
                    <div key={index} className={`${simulations[currentSimulation].theme.secondary} rounded-full px-3 py-1 text-xs ${simulations[currentSimulation].theme.text}`}>
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Audio Controls */}
                {simulations[currentSimulation].hasAudio && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={() => setAudioEnabled(prev => !prev)}
                      className={`${simulations[currentSimulation].theme.secondary} p-2 rounded-full ${simulations[currentSimulation].theme.text}`}
                    >
                      {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    <span className={`text-xs ${simulations[currentSimulation].theme.text}`}>
                      {audioEnabled ? `${simulations[currentSimulation].audioTitle} Playing` : `${simulations[currentSimulation].audioTitle} Muted`}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Current Step Display */}
              <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full mb-6 relative overflow-hidden border border-white/20"
                >
                  {/* Timer */}
                  <div className={`absolute top-4 right-4 ${simulations[currentSimulation].theme.secondary} rounded-full h-10 w-10 flex items-center justify-center`}>
                    <span className={`${simulations[currentSimulation].theme.text} font-medium`}>{timerSeconds}</span>
                  </div>

                  {/* Step Progress */}
                  <div className="w-full bg-white/10 rounded-full h-1 mb-6">
                    <div
                      className={`${simulations[currentSimulation].theme.accent} h-1 rounded-full transition-all duration-300`}
                      style={{
                        width: `${(simulationStep / (simulations[currentSimulation].steps.length - 1)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Interactive Elements */}
                  {simulations[currentSimulation].interactiveElements}

                  {/* Breath Circle for Breathwork Layout */}
                  {simulations[currentSimulation].layout === 'breathwork' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        animate={{
                          scale: breathPhase === 'inhale' ? [1, 1.5] :
                                 breathPhase === 'hold' ? 1.5 :
                                 breathPhase === 'exhale' ? [1.5, 1] : 1,
                          opacity: breathPhase === 'hold' ? [0.8, 1, 0.8] : 0.8,
                          borderColor: breathPhase === 'hold' ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'] : 'rgba(255,255,255,0.3)'
                        }}
                        transition={{
                          duration: breathPhase === 'inhale' ? 4 :
                                   breathPhase === 'hold' ? 4 :
                                   breathPhase === 'exhale' ? 6 : 1,
                          ease: "easeInOut",
                          repeat: breathPhase === 'hold' ? Infinity : 0,
                          repeatType: "reverse"
                        }}
                        className="w-40 h-40 rounded-full border-2 border-white/30 absolute opacity-0"
                        style={{ opacity: showBreathCircle ? 0.8 : 0 }}
                      />
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="flex flex-col items-center justify-center py-6 relative z-10">
                    <div className={`${simulations[currentSimulation].theme.secondary} p-4 rounded-full mb-6`}>
                      {simulations[currentSimulation].steps[simulationStep].icon}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`step-${simulationStep}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <h3 className="text-white text-xl font-medium mb-2">
                          {simulations[currentSimulation].steps[simulationStep].instruction}
                        </h3>

                        {/* Animation based on step type */}
                        {simulations[currentSimulation].steps[simulationStep].animation === 'breatheIn' && (
                          <motion.div
                            animate={{
                              scale: [1, 1.5],
                              opacity: [0.7, 1]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 4,
                              repeatType: 'reverse'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4`}
                          />
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'breatheOut' && (
                          <motion.div
                            animate={{
                              scale: [1.5, 1],
                              opacity: [1, 0.7]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 4,
                              repeatType: 'reverse'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4`}
                          />
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'hold' && (
                          <motion.div
                            animate={{
                              boxShadow: ['0 0 0 rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.7)', '0 0 0 rgba(255,255,255,0.3)']
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              repeatType: 'reverse'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4`}
                          />
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'cycle' && (
                          <motion.div
                            animate={{
                              scale: [1, 1.5, 1.5, 1],
                              opacity: [0.7, 1, 1, 0.7],
                              borderRadius: ['50%', '50%', '50%', '50%']
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 8,
                              times: [0, 0.3, 0.6, 1],
                              repeatType: 'loop'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4`}
                          />
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'pulse' && (
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.7, 1, 0.7],
                              boxShadow: [
                                '0 0 0 rgba(255,255,255,0.3)',
                                '0 0 30px rgba(255,255,255,0.7)',
                                '0 0 0 rgba(255,255,255,0.3)'
                              ]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: 'easeInOut'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4`}
                          />
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'shake' && (
                          <motion.div
                            animate={{
                              x: [0, -10, 10, -10, 10, 0],
                              y: [0, -5, 5, -5, 5, 0],
                              rotate: [0, -5, 5, -5, 5, 0]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: 'easeInOut'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4 flex items-center justify-center`}
                          >
                            <Activity size={24} className="text-white" />
                          </motion.div>
                        )}

                        {simulations[currentSimulation].steps[simulationStep].animation === 'bounce' && (
                          <motion.div
                            animate={{
                              y: [0, -20, 0],
                              scale: [1, 0.9, 1]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: 'easeInOut'
                            }}
                            className={`w-16 h-16 ${simulations[currentSimulation].theme.accent} rounded-full mx-auto mt-4 flex items-center justify-center`}
                          >
                            <Zap size={24} className="text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4 w-full max-w-xs">
                  <Button
                    onClick={toggleSimulationTimer}
                    className={`flex-1 ${simulations[currentSimulation].theme.secondary} hover:opacity-80 ${simulations[currentSimulation].theme.text} rounded-xl py-3 flex items-center justify-center gap-2`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause size={18} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        <span>Resume</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetSimulation}
                    className={`flex-1 ${simulations[currentSimulation].theme.secondary} hover:opacity-80 ${simulations[currentSimulation].theme.text} rounded-xl py-3 flex items-center justify-center gap-2`}
                  >
                    <RotateCcw size={18} />
                    <span>Restart</span>
                  </Button>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="w-full max-w-md mx-auto mb-4 relative z-10">
                <div className="flex justify-center space-x-1 mb-4">
                  {simulations[currentSimulation].steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === simulationStep ? simulations[currentSimulation].theme.accent : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={exitSimulation}
                  className={`w-full ${simulations[currentSimulation].theme.secondary} hover:opacity-80 ${simulations[currentSimulation].theme.text} rounded-xl py-3 flex items-center justify-center gap-2 border border-white/10`}
                >
                  <ArrowLeft size={18} />
                  <span>Exit Exercise</span>
                </Button>
              </div>

              {/* Completion Screen */}
              {showCompletionScreen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`bg-gradient-to-b ${simulations[currentSimulation].theme.primary} p-6 rounded-2xl max-w-md w-full text-center`}
                  >
                    <div className="bg-white/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                      <Check size={40} className="text-white" />
                    </div>

                    <h3 className="text-white text-xl font-bold mb-2">Great Job!</h3>
                    <p className="text-white/90 mb-6">{completionMessage}</p>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          setShowCompletionScreen(false);
                          resetSimulation();
                        }}
                        className={`flex-1 bg-white/20 hover:bg-white/30 text-white rounded-xl py-3 flex items-center justify-center gap-2`}
                      >
                        <RotateCcw size={18} />
                        <span>Repeat</span>
                      </Button>

                      <Button
                        onClick={() => {
                          setShowCompletionScreen(false);
                          exitSimulation();
                        }}
                        className={`flex-1 bg-white hover:bg-white/90 text-blue-600 rounded-xl py-3 flex items-center justify-center gap-2`}
                      >
                        <Check size={18} />
                        <span>Done</span>
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>
      )}

      {/* Meditation Chat overlay */}
      <MeditationChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default InteractiveTips;
