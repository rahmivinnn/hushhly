import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SimpleMeditationChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleMeditationChat: React.FC<SimpleMeditationChatProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onClose}
          className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-center p-6">
          <h1 className="text-2xl font-bold mb-4">AI Meditation</h1>
          <p className="mb-6">How are you feeling today?</p>
          
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {['Happy', 'Calm', 'Anxious', 'Tired'].map((mood) => (
              <button 
                key={mood}
                className="bg-white/20 hover:bg-white/30 rounded-lg py-3 px-4 text-white"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMeditationChat;
