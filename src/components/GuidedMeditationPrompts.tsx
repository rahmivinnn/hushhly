import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidedMeditationPromptsProps {
  isActive: boolean;
  category: string;
  elapsedTime: number; // in seconds
}

interface Prompt {
  time: number; // when to show in seconds
  text: string;
  duration: number; // how long to show in seconds
}

const GuidedMeditationPrompts: React.FC<GuidedMeditationPromptsProps> = ({ 
  isActive, 
  category,
  elapsedTime 
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Get prompts based on category
  const getPrompts = (): Prompt[] => {
    switch (category) {
      case 'Quick Reset':
        return [
          { time: 5, text: "Find a comfortable position and close your eyes", duration: 8 },
          { time: 20, text: "Notice the weight of your body", duration: 8 },
          { time: 35, text: "Focus on your breath, in and out", duration: 8 },
          { time: 60, text: "Let go of any tension with each exhale", duration: 8 },
          { time: 90, text: "If your mind wanders, gently bring it back", duration: 8 },
          { time: 120, text: "Feel a wave of calm washing over you", duration: 8 },
          { time: 150, text: "Breathe in peace, breathe out stress", duration: 8 },
        ];
      case 'Mindful Parenting':
        return [
          { time: 5, text: "Settle into a comfortable position", duration: 8 },
          { time: 20, text: "Bring to mind your role as a parent", duration: 8 },
          { time: 40, text: "Acknowledge any challenges you're facing", duration: 8 },
          { time: 60, text: "Breathe in patience, exhale reactivity", duration: 8 },
          { time: 90, text: "Imagine responding to your child with calm presence", duration: 10 },
          { time: 120, text: "You are doing your best, and that is enough", duration: 8 },
          { time: 150, text: "With each breath, renew your commitment to mindful parenting", duration: 10 },
        ];
      case 'Deep Sleep Recovery':
        return [
          { time: 5, text: "Make yourself comfortable and close your eyes", duration: 8 },
          { time: 20, text: "Feel your body becoming heavy and relaxed", duration: 8 },
          { time: 40, text: "Release any tension from your day", duration: 8 },
          { time: 60, text: "Your breath is becoming slower and deeper", duration: 8 },
          { time: 90, text: "With each exhale, sink deeper into relaxation", duration: 10 },
          { time: 120, text: "Your mind is becoming quiet and still", duration: 8 },
          { time: 150, text: "Prepare your body and mind for restful sleep", duration: 10 },
        ];
      case 'Start Your Day Calm':
        return [
          { time: 5, text: "Begin this new day with awareness and intention", duration: 8 },
          { time: 20, text: "Take a deep breath in, welcoming the day's possibilities", duration: 10 },
          { time: 40, text: "Set your intention for how you wish to feel today", duration: 8 },
          { time: 60, text: "Breathe in energy, exhale any lingering sleepiness", duration: 10 },
          { time: 90, text: "Imagine yourself moving through the day with ease", duration: 8 },
          { time: 120, text: "You are prepared for whatever comes your way", duration: 8 },
          { time: 150, text: "Carry this calm energy with you throughout your day", duration: 10 },
        ];
      case 'Parent–Child Bonding':
        return [
          { time: 5, text: "Find a comfortable position with your child", duration: 8 },
          { time: 20, text: "Notice the connection between you", duration: 8 },
          { time: 40, text: "Breathe together, creating a shared rhythm", duration: 10 },
          { time: 60, text: "Feel the love and care that flows between you", duration: 8 },
          { time: 90, text: "This moment of connection is a gift", duration: 8 },
          { time: 120, text: "Appreciate the unique bond you share", duration: 8 },
          { time: 150, text: "Carry this feeling of connection forward", duration: 10 },
        ];
      case 'Emotional First Aid':
        return [
          { time: 5, text: "Find a comfortable position and close your eyes", duration: 8 },
          { time: 20, text: "Acknowledge whatever emotions are present", duration: 8 },
          { time: 40, text: "There's no need to judge or change how you feel", duration: 10 },
          { time: 60, text: "Breathe into any areas of emotional discomfort", duration: 8 },
          { time: 90, text: "You are not your emotions; you are the awareness of them", duration: 10 },
          { time: 120, text: "With each breath, create space around difficult feelings", duration: 10 },
          { time: 150, text: "You have the inner resources to handle whatever arises", duration: 10 },
        ];
      case 'Affirmations & Mantras':
        return [
          { time: 5, text: "Settle into a comfortable position", duration: 8 },
          { time: 20, text: "I am exactly where I need to be", duration: 8 },
          { time: 40, text: "With each breath, I become more peaceful", duration: 8 },
          { time: 60, text: "I release what no longer serves me", duration: 8 },
          { time: 90, text: "I am strong, I am capable, I am enough", duration: 10 },
          { time: 120, text: "Peace begins with me", duration: 8 },
          { time: 150, text: "I welcome joy and abundance into my life", duration: 10 },
        ];
      default:
        return [
          { time: 5, text: "Find a comfortable position and close your eyes", duration: 8 },
          { time: 30, text: "Focus on your breath, in and out", duration: 8 },
          { time: 60, text: "Let go of any tension with each exhale", duration: 8 },
          { time: 90, text: "If your mind wanders, gently bring it back", duration: 8 },
          { time: 120, text: "Feel a wave of calm washing over you", duration: 8 },
        ];
    }
  };
  
  // Check for prompts to display based on elapsed time
  useEffect(() => {
    if (!isActive) {
      setShowPrompt(false);
      return;
    }
    
    const prompts = getPrompts();
    
    // Find if there's a prompt that should be shown at current time
    const promptToShow = prompts.find(p => 
      elapsedTime >= p.time && elapsedTime < p.time + p.duration
    );
    
    if (promptToShow) {
      setCurrentPrompt(promptToShow.text);
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [isActive, elapsedTime, category]);
  
  return (
    <AnimatePresence>
      {showPrompt && currentPrompt && (
        <motion.div 
          className="absolute bottom-32 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/30 backdrop-blur-md px-6 py-4 rounded-xl max-w-xs text-center">
            <p className="text-white text-lg">{currentPrompt}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuidedMeditationPrompts;
