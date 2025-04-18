import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MoodIcon from './MoodIcon';
import { motion } from "framer-motion";

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
  const moodOptions = [
    { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-purple-500', textColor: 'text-purple-500' },
    { id: 'calm', label: 'Calm', color: 'bg-blue-500', textColor: 'text-blue-500' },
    { id: 'exhausted', label: 'Exhausted', color: 'bg-amber-500', textColor: 'text-amber-500' },
    { id: 'anxious', label: 'Anxious', color: 'bg-red-500', textColor: 'text-red-500' },
    { id: 'tired', label: 'Tired', color: 'bg-gray-500', textColor: 'text-gray-500' },
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
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const handleSelectMood = (mood: 'overwhelmed' | 'calm' | 'exhausted' | 'anxious' | 'tired') => {
    onSelectMood(mood);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-0 bg-white shadow-lg overflow-hidden p-6">
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
          
          <div className="space-y-3 mt-6">
            {moodOptions.map((mood, index) => (
              <motion.div
                key={mood.id}
                custom={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  onClick={() => handleSelectMood(mood.id as any)}
                  className={`w-full rounded-full py-3 px-4 border border-gray-100 bg-white hover:bg-gray-50 shadow-sm flex items-center justify-between group transition-all`}
                  variant="outline"
                >
                  <div className="flex items-center">
                    <div className={`${mood.color} p-2 rounded-full mr-3`}>
                      <div className="text-white w-5 h-5 flex items-center justify-center">
                        <MoodIcon iconType={mood.id as any} />
                      </div>
                    </div>
                    <span className={`${mood.textColor} font-medium`}>{mood.label}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${mood.textColor}`}>
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelectionDialog;
