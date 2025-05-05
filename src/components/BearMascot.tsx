import React from 'react';
import { motion } from 'framer-motion';

interface BearMascotProps {
  emotion: 'happy' | 'calm' | 'thinking' | 'listening';
  message?: string;
  onAnimationComplete?: () => void;
}

const BearMascot: React.FC<BearMascotProps> = ({
  emotion = 'happy',
  message,
  onAnimationComplete
}) => {
  // Define different bear expressions based on the provided Hushhly bear image
  const getBearSvg = () => {
    switch (emotion) {
      case 'calm':
        return (
          <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M120 220C175.228 220 220 175.228 220 120C220 64.7715 175.228 20 120 20C64.7715 20 20 64.7715 20 120C20 175.228 64.7715 220 120 220Z" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Ears */}
            <circle cx="50" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <circle cx="190" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Arms */}
            <path d="M60 130C40 140 30 160 35 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M180 130C200 140 210 160 205 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Legs */}
            <ellipse cx="85" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <ellipse cx="155" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Belly */}
            <circle cx="120" cy="140" r="40" fill="white" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Closed Eyes */}
            <path d="M80 90C85 85 95 85 100 90" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M140 90C145 85 155 85 160 90" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Nose */}
            <ellipse cx="120" cy="110" rx="10" ry="8" fill="#2B5DA0" stroke="#2B5DA0" strokeWidth="2"/>

            {/* Mouth */}
            <path d="M110 125C115 130 125 130 130 125" stroke="#2B5DA0" strokeWidth="4" strokeLinecap="round"/>

            {/* Spots */}
            <circle cx="180" cy="70" r="5" fill="#2B8CA0"/>
            <circle cx="190" cy="90" r="3" fill="#2B8CA0"/>
            <circle cx="170" cy="100" r="4" fill="#2B8CA0"/>
            <circle cx="60" cy="80" r="4" fill="#2B8CA0"/>
            <circle cx="70" cy="100" r="3" fill="#2B8CA0"/>
          </svg>
        );
      case 'thinking':
        return (
          <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M120 220C175.228 220 220 175.228 220 120C220 64.7715 175.228 20 120 20C64.7715 20 20 64.7715 20 120C20 175.228 64.7715 220 120 220Z" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Ears */}
            <circle cx="50" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <circle cx="190" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Arms */}
            <path d="M60 130C40 140 30 160 35 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M180 130C200 140 210 160 205 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Legs */}
            <ellipse cx="85" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <ellipse cx="155" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Belly */}
            <circle cx="120" cy="140" r="40" fill="white" stroke="#2B8CA0" strokeWidth="6"/>

            {/* One Eye Open, One Closed */}
            <path d="M80 90C85 85 95 85 100 90" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="150" cy="90" r="8" fill="white" stroke="#2B8CA0" strokeWidth="3"/>
            <circle cx="150" cy="90" r="3" fill="#2B5DA0"/>

            {/* Nose */}
            <ellipse cx="120" cy="110" rx="10" ry="8" fill="#2B5DA0" stroke="#2B5DA0" strokeWidth="2"/>

            {/* Thinking Mouth */}
            <path d="M110 125C115 128 125 128 130 125" stroke="#2B5DA0" strokeWidth="4" strokeLinecap="round"/>

            {/* Spots */}
            <circle cx="180" cy="70" r="5" fill="#2B8CA0"/>
            <circle cx="190" cy="90" r="3" fill="#2B8CA0"/>
            <circle cx="170" cy="100" r="4" fill="#2B8CA0"/>
            <circle cx="60" cy="80" r="4" fill="#2B8CA0"/>
            <circle cx="70" cy="100" r="3" fill="#2B8CA0"/>

            {/* Thinking Bubble */}
            <circle cx="190" cy="50" r="8" fill="white" opacity="0.7"/>
            <circle cx="200" cy="40" r="5" fill="white" opacity="0.7"/>
          </svg>
        );
      case 'listening':
        return (
          <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M120 220C175.228 220 220 175.228 220 120C220 64.7715 175.228 20 120 20C64.7715 20 20 64.7715 20 120C20 175.228 64.7715 220 120 220Z" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Ears */}
            <circle cx="50" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <circle cx="190" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Arms */}
            <path d="M60 130C40 140 30 160 35 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M180 130C200 140 210 160 205 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Legs */}
            <ellipse cx="85" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <ellipse cx="155" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Belly */}
            <circle cx="120" cy="140" r="40" fill="white" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Open Eyes */}
            <circle cx="90" cy="90" r="8" fill="white" stroke="#2B8CA0" strokeWidth="3"/>
            <circle cx="90" cy="90" r="3" fill="#2B5DA0"/>
            <circle cx="150" cy="90" r="8" fill="white" stroke="#2B8CA0" strokeWidth="3"/>
            <circle cx="150" cy="90" r="3" fill="#2B5DA0"/>

            {/* Nose */}
            <ellipse cx="120" cy="110" rx="10" ry="8" fill="#2B5DA0" stroke="#2B5DA0" strokeWidth="2"/>

            {/* Neutral Mouth */}
            <path d="M110 125H130" stroke="#2B5DA0" strokeWidth="4" strokeLinecap="round"/>

            {/* Spots */}
            <circle cx="180" cy="70" r="5" fill="#2B8CA0"/>
            <circle cx="190" cy="90" r="3" fill="#2B8CA0"/>
            <circle cx="170" cy="100" r="4" fill="#2B8CA0"/>
            <circle cx="60" cy="80" r="4" fill="#2B8CA0"/>
            <circle cx="70" cy="100" r="3" fill="#2B8CA0"/>
          </svg>
        );
      case 'happy':
      default:
        return (
          <svg width="120" height="120" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M120 220C175.228 220 220 175.228 220 120C220 64.7715 175.228 20 120 20C64.7715 20 20 64.7715 20 120C20 175.228 64.7715 220 120 220Z" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Ears */}
            <circle cx="50" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <circle cx="190" cy="50" r="25" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Arms */}
            <path d="M60 130C40 140 30 160 35 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M180 130C200 140 210 160 205 180" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Legs */}
            <ellipse cx="85" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>
            <ellipse cx="155" cy="190" rx="30" ry="20" fill="#4ECCE6" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Belly */}
            <circle cx="120" cy="140" r="40" fill="white" stroke="#2B8CA0" strokeWidth="6"/>

            {/* Closed Eyes */}
            <path d="M80 90C85 85 95 85 100 90" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>
            <path d="M140 90C145 85 155 85 160 90" stroke="#2B8CA0" strokeWidth="6" strokeLinecap="round"/>

            {/* Nose */}
            <ellipse cx="120" cy="110" rx="10" ry="8" fill="#2B5DA0" stroke="#2B5DA0" strokeWidth="2"/>

            {/* Smiling Mouth */}
            <path d="M100 125C110 135 130 135 140 125" stroke="#2B5DA0" strokeWidth="4" strokeLinecap="round"/>

            {/* Spots */}
            <circle cx="180" cy="70" r="5" fill="#2B8CA0"/>
            <circle cx="190" cy="90" r="3" fill="#2B8CA0"/>
            <circle cx="170" cy="100" r="4" fill="#2B8CA0"/>
            <circle cx="60" cy="80" r="4" fill="#2B8CA0"/>
            <circle cx="70" cy="100" r="3" fill="#2B8CA0"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className="mb-4"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {getBearSvg()}
      </motion.div>

      {message && (
        <motion.div
          className="bg-white/30 backdrop-blur-md rounded-xl p-2 md:p-3 max-w-[140px] md:max-w-[180px] text-center shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-xs md:text-sm text-white font-medium">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BearMascot;
