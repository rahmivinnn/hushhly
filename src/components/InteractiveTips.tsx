import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Wind, Brain, Sun, Moon, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
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
    motivation: {
      icon: <Heart size={24} />,
      title: 'Motivational Quotes',
      tips: [
        '"The present moment is the only moment available to us, and it is the door to all moments." - Thich Nhat Hanh',
        '"Peace comes from within. Do not seek it without." - Buddha',
        '"You are the sky. Everything else is just the weather." - Pema Chödrön',
        '"Quiet the mind, and the soul will speak." - Ma Jaya Sati Bhagavati',
        '"The goal of meditation isn't to control your thoughts, it's to stop letting them control you." - Unknown'
      ]
    },
    morning: {
      icon: <Sun size={24} />,
      title: 'Morning Practices',
      tips: [
        'Start with three deep breaths before getting out of bed',
        'Set a positive intention for your day ahead',
        'Practice gratitude by naming three things you're thankful for',
        'Stretch your body gently to awaken your muscles',
        'Drink a glass of water mindfully to hydrate your body'
      ]
    },
    evening: {
      icon: <Moon size={24} />,
      title: 'Evening Wind-Down',
      tips: [
        'Reflect on three positive moments from your day',
        'Release tension by progressively relaxing each muscle group',
        'Practice letting go of today's worries before sleep',
        'Visualize a peaceful place as you prepare for rest',
        'Set your intentions for tomorrow with calm confidence'
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
          onClick={onClose}
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
          {currentTitle}
        </motion.h1>
        <button
          onClick={() => setShowChat(true)}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </motion.div>

      {/* Main Content */}
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
        </div>
        
        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md mx-auto mb-4"
        >
          <h3 className="text-white text-sm mb-2 text-center">Choose a category</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleCategoryChange('mindfulness')}
              className={`flex flex-col items-center p-3 rounded-xl ${
                currentCategory === 'mindfulness' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Brain size={20} />
              <span className="text-xs mt-1">Mindfulness</span>
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
              <span className="text-xs mt-1">Breathing</span>
            </Button>
            <Button
              onClick={() => handleCategoryChange('motivation')}
              className={`flex flex-col items-center p-3 rounded-xl ${
                currentCategory === 'motivation' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={20} />
              <span className="text-xs mt-1">Quotes</span>
            </Button>
            <Button
              onClick={() => handleCategoryChange('morning')}
              className={`flex flex-col items-center p-3 rounded-xl ${
                currentCategory === 'morning' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Sun size={20} />
              <span className="text-xs mt-1">Morning</span>
            </Button>
            <Button
              onClick={() => handleCategoryChange('evening')}
              className={`flex flex-col items-center p-3 rounded-xl ${
                currentCategory === 'evening' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Moon size={20} />
              <span className="text-xs mt-1">Evening</span>
            </Button>
            <Button
              onClick={onClose}
              className="flex flex-col items-center p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} />
              <span className="text-xs mt-1">Back</span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* AI Chat overlay */}
      <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default InteractiveTips;
