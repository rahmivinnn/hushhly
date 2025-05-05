import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
}

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const moods: MoodOption[] = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🙏', label: 'Grateful', value: 'grateful' },
    { emoji: '🤔', label: 'Confused', value: 'confused' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🧠', label: 'Need Focus', value: 'focus' },
    { emoji: '💪', label: 'Motivated', value: 'motivated' },
    { emoji: '❤️', label: 'Loving', value: 'loving' },
    { emoji: '🌱', label: 'Growing', value: 'growing' },
  ];

  const handleSelect = (mood: string) => {
    setSelectedMood(mood);
    onSelect(mood);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-white text-lg mb-4 text-center">How are you feeling today?</h3>
      
      {/* Emoji Mood Selector */}
      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
              selectedMood === mood.value 
                ? 'bg-white/30 ring-2 ring-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-white text-xs">{mood.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Mood Intensity Slider - Optional */}
      {selectedMood && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white text-sm mb-2 text-center">How intensely are you feeling this?</p>
          <input 
            type="range" 
            min="1" 
            max="10" 
            defaultValue="5"
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-white/70 text-xs mt-1">
            <span>Subtle</span>
            <span>Moderate</span>
            <span>Intense</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodSelector;
