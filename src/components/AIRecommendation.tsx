import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Bot, Volume2, Clock, Calendar, Brain, Sun, Moon, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Sequence of animations for the introduction
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        setAnalyzing(true);

        // Get a personalized recommendation while "analyzing"
        const personalizedRecommendations = aiRecommendationService.getPersonalizedRecommendations(userId, 1);
        if (personalizedRecommendations.length > 0) {
          setRecommendation(personalizedRecommendations[0]);
        }

        // After "analyzing", show the result
        setTimeout(() => {
          setAnalyzing(false);
          setShowResult(true);
        }, 3000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showIntro, userId]);

  const handleStartMeditation = () => {
    navigate('/meditation');
    toast({
      title: "Starting Meditation",
      description: "Initiating your personalized AI-recommended session",
    });
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-cyan-500 to-blue-600">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onClose}
          className="text-white p-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-semibold">AI Recommendation</h1>
        <button
          onClick={() => setShowChat(true)}
          className="text-white p-2"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Introduction Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 bg-opacity-90 z-10 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Bot size={60} className="text-[#0098c1]" />
            </motion.div>
            <motion.h2
              className="text-white text-2xl font-bold mb-3 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Hushhly AI
            </motion.h2>
            <motion.p
              className="text-white text-center max-w-xs"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Creating your personalized meditation recommendation based on your preferences and patterns
            </motion.p>
          </motion.div>
        )}

        {analyzing && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 bg-opacity-90 z-10 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 border-4 border-white rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Brain size={40} className="text-white" />
              </motion.div>
            </div>
            <motion.h2
              className="text-white text-xl font-bold mb-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Analyzing Your Patterns
            </motion.h2>
            <div className="flex space-x-2 items-center">
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.4
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Step-by-Step Recommendation */}
      {showResult && (
        <div className="flex flex-col px-5 pb-5 mt-2">
          {/* Stepper indicator */}
          <div className="flex justify-between px-6 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setStep(0)}
            />
            <div className="w-16 h-0.5 bg-white/30 self-center" />
            <div
              className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setStep(1)}
            />
            <div className="w-16 h-0.5 bg-white/30 self-center" />
            <div
              className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setStep(2)}
            />
          </div>

          {/* Content based on current step */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4"
              >
                <h2 className="text-white text-xl font-semibold mb-3">Your Personalized Recommendation</h2>
                <p className="text-white/90 mb-6">
                  {recommendation ? recommendation.reasonForRecommendation : 'Based on your mood patterns and meditation history, we recommend a personalized session just for you.'}
                </p>

                <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-6">
                  <div>
                    <h3 className="text-white font-medium">{recommendation ? recommendation.title : 'Mindfulness Meditation'}</h3>
                    <p className="text-white/80 text-sm">{recommendation ? recommendation.duration : '15 minutes'} • Guided</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-3xl">🧘</span>
                  </div>
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-br from-white to-white/90 text-[#0098c1] hover:opacity-90 rounded-full py-3 flex items-center justify-center shadow-md"
                >
                  See Why This Works For You
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4"
              >
                <h2 className="text-white text-xl font-semibold mb-4">Why This Works For You</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-full mt-1">
                      <Brain size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Matches Your Stress Patterns</h4>
                      <p className="text-white/80 text-sm">Your recent activity shows elevated stress levels in afternoons</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-full mt-1">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Optimal Duration</h4>
                      <p className="text-white/80 text-sm">15 minutes aligns with your preferred session length</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-white/20 p-2 rounded-full mt-1">
                      <Volume2 size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Ambient Sounds</h4>
                      <p className="text-white/80 text-sm">Includes forest sounds that enhance your focus</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={prevStep}
                    className="flex-1 bg-gradient-to-br from-white/20 to-white/30 text-white hover:opacity-90 rounded-full py-3 shadow-md"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-br from-white to-white/90 text-[#0098c1] hover:opacity-90 rounded-full py-3 shadow-md"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4"
              >
                <h2 className="text-white text-xl font-semibold mb-3">Best Time For You</h2>

                <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-full">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Today at 5:30 PM</h3>
                      <p className="text-white/80 text-sm">Free time in your schedule</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/30 p-2 rounded-full">
                      <Sun size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Alternative: Tomorrow morning</h3>
                      <p className="text-white/80 text-sm">Start your day mindfully</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mb-4">
                  <Button
                    onClick={prevStep}
                    className="flex-1 bg-gradient-to-br from-white/20 to-white/30 text-white hover:opacity-90 rounded-full py-3 shadow-md"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleStartMeditation}
                    className="flex-1 bg-gradient-to-br from-white to-white/90 text-[#0098c1] hover:opacity-90 rounded-full py-3 flex items-center justify-center shadow-md"
                  >
                    <Play size={18} className="mr-2" />
                    Start Now
                  </Button>
                </div>

                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-br from-transparent to-white/5 border border-white text-white hover:bg-white/10 rounded-full py-3 shadow-md"
                >
                  Maybe Later
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Cloud decoration at bottom */}
      <img
        src="/lovable-uploads/262033dd-3446-4e39-9a19-6be70d2da587.png"
        alt="Clouds"
        className="absolute bottom-0 w-full h-auto opacity-50 z-0"
      />

      {/* AI Chat */}
      <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default AIRecommendation;
