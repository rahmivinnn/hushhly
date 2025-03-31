
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MoodIcon from './MoodIcon';
import { motion } from "framer-motion";

interface MoodFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMood: 'calm' | 'relax' | 'focus' | 'anxious' | null;
}

const MoodFeedbackDialog: React.FC<MoodFeedbackDialogProps> = ({ isOpen, onClose, selectedMood }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Reset animation state when dialog opens
      setAnimationComplete(false);
      
      // Trigger animation completion after delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!selectedMood) return null;
  
  const getFeedbackContent = () => {
    switch (selectedMood) {
      case 'calm':
        return {
          title: "Feeling Calm Today",
          description: "It's wonderful that you're feeling calm. This is a perfect state for mindfulness and reflection. Would you like to maintain this tranquility with a peaceful meditation?",
          color: "text-blue-500",
          bgColor: "bg-blue-500",
          gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
          lightBg: "bg-blue-50",
        };
      case 'relax':
        return {
          title: "Relaxed Mind, Happy Heart",
          description: "Relaxation is key to reducing stress and improving overall well-being. We have some perfect meditations to help you maintain this serene state.",
          color: "text-green-500",
          bgColor: "bg-green-500",
          gradient: "bg-gradient-to-br from-green-400 to-green-600",
          lightBg: "bg-green-50",
        };
      case 'focus':
        return {
          title: "Sharp Focus Activated",
          description: "Your focused state is ideal for productivity and achievement. We can suggest some concentration exercises to help you maintain this clarity throughout the day.",
          color: "text-purple-500",
          bgColor: "bg-purple-500",
          gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
          lightBg: "bg-purple-50",
        };
      case 'anxious':
        return {
          title: "We're Here for You",
          description: "It's okay to feel anxious sometimes. Deep breathing and guided meditations can help calm your mind and restore your sense of peace and balance.",
          color: "text-amber-500",
          bgColor: "bg-amber-500",
          gradient: "bg-gradient-to-br from-amber-400 to-amber-600",
          lightBg: "bg-amber-50",
        };
      default:
        return {
          title: "Thank You for Sharing",
          description: "Your emotional well-being matters to us. We'll tailor your experience based on how you're feeling.",
          color: "text-blue-500",
          bgColor: "bg-blue-500",
          gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
          lightBg: "bg-blue-50",
        };
    }
  };
  
  const content = getFeedbackContent();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.4
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.5,
        duration: 0.4
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] rounded-2xl border-0 ${content.lightBg} shadow-lg overflow-hidden p-0`}>
        <motion.div
          className="p-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className={`${content.gradient} absolute top-0 left-0 right-0 h-24 rounded-t-2xl -z-10`}></div>
          
          <DialogHeader className="relative z-10 pt-8">
            <motion.div 
              className={`mx-auto p-4 rounded-full ${content.bgColor} bg-opacity-90 mb-6 shadow-md`}
              variants={iconVariants}
            >
              <div className="text-white w-10 h-10 flex items-center justify-center">
                <MoodIcon iconType={selectedMood} />
              </div>
            </motion.div>
            
            <motion.div variants={textVariants}>
              <DialogTitle className={`text-center ${content.color} text-2xl font-bold mb-2`}>
                {content.title}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 pt-2 leading-relaxed">
                {content.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col items-center mt-8">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                onClick={onClose} 
                className={`${content.gradient} hover:opacity-90 rounded-full px-8 py-2 text-white border-0 shadow-md`}
              >
                {animationComplete ? "Continue" : "Personalizing..."}
              </Button>
            </motion.div>
            
            <motion.p
              className="text-xs text-gray-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              We'll recommend content based on your mood
            </motion.p>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodFeedbackDialog;
