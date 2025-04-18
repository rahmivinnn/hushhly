import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MoodIcon from './MoodIcon';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

interface MoodSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMood: (mood: 'overwhelmed' | 'calm' | 'exhausted' | 'anxious' | 'tired') => void;
}

const MoodSelectionDialog: React.FC<MoodSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectMood
}) => {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const moodOptions = [
    {
      id: 'overwhelmed',
      label: 'Overwhelmed',
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      emoji: '😩',
      message: 'Taking a moment to breathe can help'
    },
    {
      id: 'calm',
      label: 'Calm',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      emoji: '😌',
      message: 'Perfect state for mindfulness'
    },
    {
      id: 'exhausted',
      label: 'Exhausted',
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      gradient: 'from-amber-400 to-amber-600',
      emoji: '😴',
      message: 'Rest is important for recovery'
    },
    {
      id: 'anxious',
      label: 'Anxious',
      color: 'bg-red-500',
      textColor: 'text-red-500',
      gradient: 'from-red-400 to-red-600',
      emoji: '😰',
      message: 'Deep breathing can help calm anxiety'
    },
    {
      id: 'tired',
      label: 'Tired',
      color: 'bg-gray-500',
      textColor: 'text-gray-500',
      gradient: 'from-gray-400 to-gray-600',
      emoji: '🥱',
      message: 'A short meditation can be energizing'
    },
  ];

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

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + (custom * 0.1),
        duration: 0.4
      }
    }),
    hover: (custom: string) => ({
      scale: 1.05,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    }),
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const emojiVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      rotate: 180,
      transition: { duration: 0.3 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.2
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  const handleSelectMood = (mood: 'overwhelmed' | 'calm' | 'exhausted' | 'anxious' | 'tired') => {
    setSelectedMood(mood);
    setShowConfetti(true);

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Wait a moment before closing the dialog
    setTimeout(() => {
      onSelectMood(mood);
      onClose();

      // Reset state after dialog closes
      setTimeout(() => {
        setSelectedMood(null);
        setShowConfetti(false);
      }, 500);
    }, 1000);
  };

  const handleMouseEnter = (id: string) => {
    setHoveredMood(id);
  };

  const handleMouseLeave = () => {
    setHoveredMood(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-0 bg-white shadow-lg overflow-hidden p-6 z-[100]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DialogHeader className="mb-6">
            <motion.div variants={titleVariants}>
              <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                How are you feeling today?
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {moodOptions.map((mood, index) => (
              <motion.div
                key={mood.id}
                custom={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button
                  onClick={() => handleSelectMood(mood.id as any)}
                  onMouseEnter={() => handleMouseEnter(mood.id)}
                  onMouseLeave={handleMouseLeave}
                  disabled={!!selectedMood}
                  className={`w-full rounded-full py-3 px-4 border ${selectedMood === mood.id ? `bg-gradient-to-r ${mood.gradient} text-white` : 'bg-white'} hover:bg-gray-50 shadow-sm flex items-center justify-between group transition-all overflow-hidden`}
                  variant="outline"
                >
                  <div className="flex items-center z-10 relative">
                    <div className={`${selectedMood === mood.id ? 'bg-white' : mood.color} p-2 rounded-full mr-3 transition-all duration-300`}>
                      <div className={`${selectedMood === mood.id ? mood.textColor : 'text-white'} w-5 h-5 flex items-center justify-center transition-all duration-300`}>
                        <MoodIcon iconType={mood.id as any} />
                      </div>
                    </div>
                    <span className={`${selectedMood === mood.id ? 'text-white' : mood.textColor} font-medium transition-all duration-300`}>
                      {mood.label}
                    </span>
                  </div>

                  {/* Animated background for selected mood */}
                  {selectedMood === mood.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${mood.gradient} -z-10`}
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  )}

                  {/* Show emoji when hovered or selected */}
                  <AnimatePresence>
                    {(hoveredMood === mood.id || selectedMood === mood.id) && (
                      <motion.div
                        className="text-xl"
                        variants={emojiVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {mood.emoji}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>

                {/* Show message when hovered */}
                <AnimatePresence>
                  {hoveredMood === mood.id && !selectedMood && (
                    <motion.div
                      className={`absolute right-0 -top-8 ${mood.textColor} text-xs font-medium bg-white px-3 py-1 rounded-full shadow-md`}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {mood.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Animated message when a mood is selected */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600">Thank you for sharing how you feel!</p>
                <p className="text-gray-600 text-sm mt-1">Personalizing your experience...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelectionDialog;
