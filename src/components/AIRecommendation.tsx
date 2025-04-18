import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Bot, Volume2, Clock, Calendar, Brain, Sun, Moon, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '@/hooks/useAuth';
import { aiRecommendationService } from '@/services/aiRecommendationService';
import AIChat from './AIChat';

interface AIRecommendationProps {
  onClose: () => void;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const userId = user?.id || 'guest';
  const [currentTip, setCurrentTip] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { meditationType, duration, gradient } = location.state || {
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

  const meditationTips = {
    'Emotional Balance': [
      'Take deep breaths to center yourself',
      'Notice and acknowledge your emotions without judgment',
      'Practice self-compassion when emotions are intense',
      'Visualize a peaceful place where you feel balanced',
      'Remember that all emotions are temporary'
    ],
    'Body Scan': [
      'Find a comfortable position to relax',
      'Start from your toes and move up gradually',
      'Notice any areas of tension or discomfort',
      'Release tension with each exhale',
      'Stay present with each body part'
    ],
    'Loving-Kindness': [
      'Begin with generating loving thoughts for yourself',
      'Extend these feelings to loved ones',
      'Include neutral people in your practice',
      'Send compassion to difficult relationships',
      'Feel the warmth of connection growing'
    ],
    'Default': [
      'Focus on your breath',
      'Let thoughts pass like clouds',
      'Return gently to the present moment',
      'Notice the rhythm of your breathing',
      'Feel the peace within'
    ]
  };

  const handleStartMeditation = () => {
    const meditationTheme = recommendation ? recommendation.title : 'Mindfulness Meditation';
    const gradient = meditationTheme.includes('Emotional Balance') ? 'from-pink-400 to-purple-500' :
                    meditationTheme.includes('Body Scan') ? 'from-blue-300 to-indigo-500' :
                    meditationTheme.includes('Loving-Kindness') ? 'from-rose-400 to-pink-600' :
                    'from-teal-400 to-emerald-600';

    const tips = meditationTips[meditationTheme as keyof typeof meditationTips] || meditationTips.Default;

    navigate('/meditation', {
      state: {
        meditationType: meditationTheme,
        duration: recommendation ? recommendation.duration : '15 minutes',
        gradient: gradient,
        tips: tips
      }
    });
  };

  const nextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % 5);
      setIsAnimating(false);
    }, 300);
  };

  const prevTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + 5) % 5);
      setIsAnimating(false);
    }, 300);
  };

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
        <motion.div 
          className="flex flex-col px-5 pb-5 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-xl font-semibold">{recommendation.title}</h2>
                <p className="text-white/80 text-sm">{recommendation.duration} • Guided</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-3xl">🧘</span>
              </div>
            </div>

            <p className="text-white/90 mb-6">{recommendation.reasonForRecommendation}</p>

            {/* Interactive Tips Carousel */}
            <div className="relative bg-white/20 rounded-xl p-6 mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: isAnimating ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAnimating ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h3 className="text-white font-medium mb-2">Tip {currentTip + 1}</h3>
                  <p className="text-white/90">
                    {(meditationTips[recommendation.title as keyof typeof meditationTips] || meditationTips.Default)[currentTip]}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-4">
                <Button
                  onClick={prevTip}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
                >
                  <ArrowLeft size={20} />
                </Button>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${currentTip === index ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
                <Button
                  onClick={nextTip}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
                >
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleStartMeditation}
              className="w-full bg-gradient-to-br from-white to-white/90 text-[#0098c1] hover:opacity-90 rounded-full py-3 flex items-center justify-center shadow-md mb-4"
            >
              <Play size={18} className="mr-2" />
              Start Meditation
            </Button>

            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-br from-transparent to-white/5 border border-white text-white hover:bg-white/10 rounded-full py-3 shadow-md"
            >
              Maybe Later
            </Button>
          </div>
        </motion.div>
      )}

      {/* AI Chat overlay */}
      {showChat && (
        <AIChat onClose={() => setShowChat(false)} isOpen={true} />
      )}
    </div>
  );
};

export default AIRecommendation;
