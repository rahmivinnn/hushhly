import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Heart, Wind, Brain, Sun, Moon, MessageSquare,
  ChevronLeft, ChevronRight, Zap, Focus, Sparkles,
  Flame, CloudFog, Waves, Timer, Activity, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import AIChat from './AIChat';

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
  };
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
      description: 'A guided 2-minute exercise to quickly reduce stress and anxiety',
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
        text: 'text-blue-50'
      },
      steps: [
        {
          instruction: 'Find a comfortable position and close your eyes',
          duration: 5,
          icon: <CloudFog size={32} />
        },
        {
          instruction: 'Take a deep breath in through your nose for 4 counts',
          duration: 4,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Hold your breath for 4 counts',
          duration: 4,
          animation: 'hold',
          icon: <Timer size={32} />
        },
        {
          instruction: 'Exhale slowly through your mouth for 6 counts',
          duration: 6,
          animation: 'breatheOut',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Feel the tension leaving your body with each exhale',
          duration: 5,
          animation: 'breatheOut',
          icon: <CloudFog size={32} />
        },
        {
          instruction: 'Imagine a peaceful blue light surrounding you',
          duration: 8,
          animation: 'pulse',
          icon: <Sparkles size={32} />
        },
        {
          instruction: 'With each breath, let go of any worries or stress',
          duration: 10,
          animation: 'breatheOut',
          icon: <CloudFog size={32} />
        },
        {
          instruction: 'Notice how your body feels lighter and more relaxed',
          duration: 5,
          icon: <Sparkles size={32} />
        }
      ]
    },
    focusEnhancement: {
      title: 'Focus Enhancement',
      description: 'A powerful exercise to sharpen your concentration and mental clarity',
      benefits: [
        'Improves attention span',
        'Reduces mental chatter',
        'Enhances cognitive performance',
        'Builds mental stamina'
      ],
      theme: {
        primary: 'from-indigo-600 to-purple-500',
        secondary: 'bg-indigo-500/30',
        accent: 'bg-purple-400/50',
        text: 'text-indigo-50'
      },
      steps: [
        {
          instruction: 'Sit upright with a straight spine and relaxed shoulders',
          duration: 5,
          icon: <Focus size={32} />
        },
        {
          instruction: 'Focus your gaze on a single point in front of you',
          duration: 5,
          icon: <Focus size={32} />
        },
        {
          instruction: 'Visualize a bright golden light at the center of your forehead',
          duration: 8,
          animation: 'pulse',
          icon: <Sparkles size={32} />
        },
        {
          instruction: 'Take three deep, focused breaths',
          duration: 10,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Now count each breath - Inhale: 1',
          duration: 4,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Exhale: 2',
          duration: 4,
          animation: 'breatheOut',
          icon: <Wind size={32} />
        },
        {
          instruction: 'With each number, increase your mental clarity',
          duration: 10,
          animation: 'pulse',
          icon: <Brain size={32} />
        },
        {
          instruction: 'If your mind wanders, gently return to counting',
          duration: 5,
          icon: <Brain size={32} />
        },
        {
          instruction: 'Feel your concentration becoming sharper and stronger',
          duration: 8,
          animation: 'pulse',
          icon: <Focus size={32} />
        },
        {
          instruction: 'Notice how your mind feels clear, alert and focused',
          duration: 5,
          icon: <Sparkles size={32} />
        }
      ]
    },
    energyBoost: {
      title: 'Quick Energy Boost',
      description: 'A dynamic 1-minute exercise to instantly increase energy and alertness',
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
        text: 'text-orange-50'
      },
      steps: [
        {
          instruction: 'Stand up straight with feet shoulder-width apart',
          duration: 3,
          icon: <Zap size={32} />
        },
        {
          instruction: 'Shake out your hands and arms vigorously for 5 seconds',
          duration: 5,
          animation: 'shake',
          icon: <Activity size={32} />
        },
        {
          instruction: 'Take a powerful breath in while raising your arms overhead',
          duration: 3,
          animation: 'breatheIn',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Exhale forcefully with a "HA" sound while bringing arms down',
          duration: 2,
          animation: 'breatheOut',
          icon: <Wind size={32} />
        },
        {
          instruction: 'Visualize bright orange energy filling your body',
          duration: 5,
          animation: 'pulse',
          icon: <Flame size={32} />
        },
        {
          instruction: 'Tap rapidly on your chest, arms, and legs to activate energy',
          duration: 8,
          animation: 'shake',
          icon: <Activity size={32} />
        },
        {
          instruction: 'Jump up and down gently 5 times',
          duration: 5,
          animation: 'bounce',
          icon: <Zap size={32} />
        },
        {
          instruction: 'Take one final powerful breath and feel the energy surging',
          duration: 5,
          animation: 'breatheIn',
          icon: <Flame size={32} />
        },
        {
          instruction: 'Feel the vibrant energy flowing through your entire body',
          duration: 5,
          icon: <Sparkles size={32} />
        }
      ]
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
                setSimulationStep(prev => prev + 1);
                return currentSim.steps[simulationStep + 1].duration;
              } else {
                // End of simulation
                setIsTimerRunning(false);
                toast({
                  title: "Simulation Complete",
                  description: "Great job! How do you feel?",
                });
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
      setCurrentSimulation(simulationKey);
      setSimulationStep(0);
      setTimerSeconds(simulations[simulationKey].steps[0].duration);
      setIsTimerRunning(true);
      setShowSimulation(true);

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
    }
  };

  // Exit simulation
  const exitSimulation = () => {
    setShowSimulation(false);
    setCurrentSimulation(null);
    setSimulationStep(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
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
        <div className={`flex flex-col items-center justify-between h-[calc(100%-60px)] px-6 py-4 bg-gradient-to-br ${simulations[currentSimulation]?.theme.primary || gradient}`}>
          {currentSimulation && (
            <>
              {/* Simulation Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto mb-4"
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
              </motion.div>

              {/* Current Step Display */}
              <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center">
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

                  {/* Step Content */}
                  <div className="flex flex-col items-center justify-center py-6">
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
                        <Timer size={18} />
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
                    <Activity size={18} />
                    <span>Restart</span>
                  </Button>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="w-full max-w-md mx-auto mb-4">
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
            </>
          )}
        </div>
      )}

      {/* AI Chat overlay */}
      <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default InteractiveTips;
