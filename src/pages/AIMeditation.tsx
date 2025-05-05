import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Brain, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import AIRecommendations from '@/components/AIRecommendations';
import MeditationChat from '@/components/MeditationChat';
import { motion } from 'framer-motion';

const AIMeditation: React.FC = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-cyan-500 to-blue-600 pt-4 pb-6 px-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold flex items-center">
            <Sparkles size={18} className="mr-2" />
            AI Meditation Guide
          </h1>
          <div className="w-10"></div> {/* For balance */}
        </div>

        <p className="text-white/90 text-sm mb-4">
          Personalized meditation recommendations powered by AI
        </p>

        <Button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-br from-white to-white/90 text-blue-500 hover:opacity-90 rounded-full px-4 py-2 text-sm flex items-center shadow-md"
        >
          <MessageSquare size={16} className="mr-2" />
          Chat with Meditation AI
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AIRecommendations />
      </div>

      {/* Meditation Chat */}
      <MeditationChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AIMeditation;
