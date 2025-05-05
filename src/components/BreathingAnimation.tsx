import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingAnimationProps {
  isActive: boolean;
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  color: string;
}

const BreathingAnimation: React.FC<BreathingAnimationProps> = ({ isActive, phase, color }) => {
  const [progress, setProgress] = useState(0);
  
  // Update progress based on breathing phase
  useEffect(() => {
    if (!isActive) return;
    
    let duration = 0;
    switch (phase) {
      case 'inhale':
        duration = 4000; // 4 seconds
        break;
      case 'hold':
        duration = 4000; // 4 seconds
        break;
      case 'exhale':
        duration = 6000; // 6 seconds
        break;
      case 'rest':
        duration = 2000; // 2 seconds
        break;
    }
    
    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        clearInterval(interval);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [isActive, phase]);
  
  // Get animation properties based on phase
  const getAnimationProps = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: 1 + (progress * 0.3),
          opacity: 0.8 + (progress * 0.2)
        };
      case 'hold':
        return {
          scale: 1.3,
          opacity: 1
        };
      case 'exhale':
        return {
          scale: 1.3 - (progress * 0.3),
          opacity: 1 - (progress * 0.2)
        };
      case 'rest':
        return {
          scale: 1,
          opacity: 0.8
        };
    }
  };
  
  // Get instruction text
  const getInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
    }
  };
  
  // Get progress indicator width
  const getProgressWidth = () => {
    return `${progress * 100}%`;
  };
  
  const animProps = getAnimationProps();
  
  return (
    <div className="relative w-full max-w-md aspect-square">
      {/* Outer static circle */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
      
      {/* Animated breathing circle */}
      <motion.div 
        className={`absolute inset-0 rounded-full ${color} bg-opacity-20 backdrop-blur-sm`}
        animate={{
          scale: animProps.scale,
          opacity: animProps.opacity
        }}
        transition={{
          type: "tween",
          ease: phase === 'inhale' ? "easeIn" : phase === 'exhale' ? "easeOut" : "linear"
        }}
      />
      
      {/* Ripple effect */}
      <AnimatePresence>
        {(phase === 'inhale' || phase === 'exhale') && (
          <motion.div
            className={`absolute inset-0 rounded-full ${color} bg-opacity-10`}
            initial={{ scale: phase === 'inhale' ? 0.9 : 1.3, opacity: 0 }}
            animate={{ scale: phase === 'inhale' ? 1.4 : 0.9, opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: 1, repeatType: "reverse" }}
          />
        )}
      </AnimatePresence>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-2xl font-medium mb-2">{getInstruction()}</div>
        
        {/* Progress bar */}
        <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: getProgressWidth() }}
          />
        </div>
      </div>
    </div>
  );
};

export default BreathingAnimation;
