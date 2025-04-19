import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import { aiRecommendationService } from '@/services/aiRecommendationService';
import AIChat from './AIChat';
import InteractiveTips from './InteractiveTips';

interface AIRecommendationProps {
  onClose: () => void;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const userId = user?.id || 'guest';
  const [showTips, setShowTips] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  const { meditationType, gradient } = location.state || {
    meditationType: 'Meditation',
    duration: '10 Min',
    gradient: 'from-cyan-500 to-blue-600'
  };

  useEffect(() => {
    const personalizedRecommendations = aiRecommendationService.getPersonalizedRecommendations(userId, 1);
    if (personalizedRecommendations.length > 0) {
      setRecommendation(personalizedRecommendations[0]);
      setShowTips(true);
    }
  }, [userId]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${gradient} overflow-hidden`}>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <motion.h1
          className="text-white text-lg font-semibold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {meditationType}
        </motion.h1>
        <button
          onClick={() => setShowChat(true)}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      </motion.div>

      {/* Main Content - Interactive Tips */}
      {showTips && recommendation && (
        <InteractiveTips
          onClose={onClose}
          category={recommendation.title}
          gradient={gradient}
        />
      )}

      {/* AI Chat overlay */}
      {showChat && (
        <AIChat onClose={() => setShowChat(false)} isOpen={true} />
      )}
    </div>
  );
};

export default AIRecommendation;
