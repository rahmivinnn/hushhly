import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  category: string;
  isActive: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ category, isActive }) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  
  // Get background configuration based on category
  const getBackgroundConfig = () => {
    switch (category) {
      case 'Quick Reset':
        return {
          particleColor: 'bg-blue-400',
          particleCount: 15,
          baseSpeed: 20,
        };
      case 'Mindful Parenting':
        return {
          particleColor: 'bg-pink-400',
          particleCount: 12,
          baseSpeed: 15,
        };
      case 'Deep Sleep Recovery':
        return {
          particleColor: 'bg-indigo-400',
          particleCount: 20,
          baseSpeed: 10,
        };
      case 'Start Your Day Calm':
        return {
          particleColor: 'bg-amber-400',
          particleCount: 18,
          baseSpeed: 25,
        };
      case 'Parent–Child Bonding':
        return {
          particleColor: 'bg-green-400',
          particleCount: 14,
          baseSpeed: 18,
        };
      case 'Emotional First Aid':
        return {
          particleColor: 'bg-red-400',
          particleCount: 16,
          baseSpeed: 22,
        };
      case 'Affirmations & Mantras':
        return {
          particleColor: 'bg-purple-400',
          particleCount: 17,
          baseSpeed: 20,
        };
      default:
        return {
          particleColor: 'bg-cyan-400',
          particleCount: 15,
          baseSpeed: 20,
        };
    }
  };
  
  const config = getBackgroundConfig();
  
  // Initialize particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < config.particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // percentage position
        y: Math.random() * 100,
        size: Math.random() * 8 + 2, // between 2-10px
        speed: (Math.random() * 20 + config.baseSpeed) * (Math.random() > 0.5 ? 1 : -1), // random direction
      });
    }
    setParticles(newParticles);
  }, [category]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20"></div>
      </div>
      
      {/* Floating particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${config.particleColor} opacity-20 blur-sm`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={isActive ? {
            x: [0, particle.speed, 0],
            y: [0, particle.speed * 0.7, 0],
          } : {}}
          transition={{
            duration: Math.abs(30 / particle.speed),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Light rays */}
      {isActive && (
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white opacity-5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AmbientBackground;
