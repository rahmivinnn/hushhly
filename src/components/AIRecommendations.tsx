import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Brain, ArrowRight, Play, Calendar, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { aiRecommendationService, AIRecommendation, AIInsight, AIPersonalizedPlan } from '@/services/aiRecommendationService';
import { motion, AnimatePresence } from 'framer-motion';
import MeditationChat from './MeditationChat';
import InteractiveTips from './InteractiveTips';
import ScheduleModal from './ScheduleModal';

interface AIRecommendationsProps {
  onClose?: () => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // State for full page view
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activePlan, setActivePlan] = useState<AIPersonalizedPlan | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<AIRecommendation | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [recommendationToSchedule, setRecommendationToSchedule] = useState<AIRecommendation | null>(null);

  // State for overlay view (from AIRecommendation)
  const [isOverlayMode, setIsOverlayMode] = useState(!!onClose);

  // Get gradient and meditation type from location state or use defaults
  const { meditationType, gradient } = location.state || {
    meditationType: 'Meditation',
    duration: '10 Min',
    gradient: 'from-cyan-500 to-blue-600'
  };

  useEffect(() => {
    // Simulate AI processing time
    setIsLoading(true);

    setTimeout(() => {
      if (isOverlayMode) {
        // For overlay mode, just get a single recommendation and show tips immediately
        const personalizedRecommendations = aiRecommendationService.getPersonalizedRecommendations(userId, 1);
        if (personalizedRecommendations.length > 0) {
          setCurrentRecommendation(personalizedRecommendations[0]);
          setShowTips(true);
        }
      } else {
        // For full page view, get all recommendations, insights, and plan
        const personalizedRecommendations = aiRecommendationService.getPersonalizedRecommendations(userId, 3);
        setRecommendations(personalizedRecommendations);

        // Get insights
        const personalizedInsights = aiRecommendationService.getPersonalizedInsights(userId, 2);
        setInsights(personalizedInsights);

        // Get active plan
        const plan = aiRecommendationService.getActivePersonalizedPlan(userId);
        setActivePlan(plan);
      }

      setIsLoading(false);
    }, 1500);
  }, [userId, isOverlayMode]);

  const handleStartMeditation = (recommendation: AIRecommendation) => {
    toast({
      title: `Starting ${recommendation.title}`,
      description: `Loading interactive tips for ${recommendation.title}.`,
    });

    // Set the current recommendation and show the tips component
    setCurrentRecommendation(recommendation);
    setShowTips(true);
  };

  const handleScheduleMeditation = (recommendation: AIRecommendation) => {
    // Set the recommendation to schedule and show the modal
    setRecommendationToSchedule(recommendation);
    setShowScheduleModal(true);
  };

  const handleScheduleComplete = (scheduledDate: Date, scheduledTime: string) => {
    // Handle the scheduled meditation
    toast({
      title: "Meditation Scheduled",
      description: `Your meditation has been scheduled for ${scheduledTime}.`,
    });
  };

  const handleCreatePlan = () => {
    setIsLoading(true);

    setTimeout(() => {
      const newPlan = aiRecommendationService.createPersonalizedPlan(userId, 7);
      setActivePlan(newPlan);
      setIsLoading(false);

      toast({
        title: "Personalized Plan Created",
        description: "Your 7-day meditation journey is ready!",
      });
    }, 1500);
  };

  const handleCompleteMeditation = (day: number) => {
    if (!activePlan) return;

    aiRecommendationService.updateMeditationCompletion(userId, activePlan.id, day, true);

    // Update local state
    setActivePlan(prev => {
      if (!prev) return null;

      const updatedMeditations = prev.dailyMeditations.map(med =>
        med.day === day ? { ...med, completed: true } : med
      );

      return {
        ...prev,
        dailyMeditations: updatedMeditations
      };
    });

    toast({
      title: "Meditation Completed",
      description: "Great job! Your progress has been saved.",
    });
  };

  // Render overlay mode (previously AIRecommendation component)
  if (isOverlayMode) {
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
        {showTips && currentRecommendation && (
          <InteractiveTips
            onClose={onClose}
            category={currentRecommendation.title}
            gradient={gradient}
          />
        )}

        {/* Meditation Chat overlay */}
        {showChat && (
          <MeditationChat onClose={() => setShowChat(false)} isOpen={true} />
        )}
      </div>
    );
  }

  // Render full page mode (original AIRecommendations component)
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-cyan-500 to-blue-600 pt-6 pb-8 px-4 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <Sparkles size={20} className="mr-2" />
              <h1 className="text-xl font-semibold">AI-Powered Meditation</h1>
            </div>
            <p className="mt-1 text-sm text-white/90">Personalized for your wellbeing</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2">
              <ArrowRight size={24} />
            </button>
          )}
        </div>

        <Button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-br from-white to-white/90 text-blue-500 hover:opacity-90 rounded-full px-4 py-2 text-sm flex items-center shadow-md"
        >
          <MessageSquare size={16} className="mr-2" />
          Chat with Meditation AI
        </Button>
      </header>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">AI is analyzing your preferences...</p>
        </div>
      ) : (
        <div className="px-4 pt-6">
          {/* Personalized Recommendations */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Brain size={18} className="mr-2 text-blue-500" />
              Your Personalized Recommendations
            </h2>

            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex">
                    <div className="w-16 h-16 rounded-xl mr-3 flex items-center justify-center">
                      {recommendation.title.includes('Emotional Balance') && (
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">🌸</span>
                        </div>
                      )}
                      {recommendation.title.includes('Body Scan') && (
                        <div className="w-full h-full bg-gradient-to-br from-blue-300 to-indigo-500 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">✨</span>
                        </div>
                      )}
                      {recommendation.title.includes('Loving-Kindness') && (
                        <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">💝</span>
                        </div>
                      )}
                      {!recommendation.title.includes('Emotional Balance') && !recommendation.title.includes('Body Scan') && !recommendation.title.includes('Loving-Kindness') && (
                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">🧘</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{recommendation.title}</h3>
                        <div className="ml-2 px-2 py-0.5 bg-blue-100 rounded-full text-xs text-blue-700">
                          {recommendation.confidence}% match
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{recommendation.description}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" />
                        <span>{recommendation.duration}</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        <Sparkles size={10} className="inline mr-1" />
                        {recommendation.reasonForRecommendation}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={() => handleScheduleMeditation(recommendation)}
                      className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-500 rounded-full px-3 py-1 text-xs flex-1 flex items-center justify-center"
                    >
                      <Calendar size={12} className="mr-1" />
                      Schedule
                    </Button>
                    <Button
                      onClick={() => handleStartMeditation(recommendation)}
                      className={`${recommendation.title.includes('Emotional Balance') ? 'bg-gradient-to-r from-pink-400 to-purple-500' : recommendation.title.includes('Body Scan') ? 'bg-gradient-to-r from-blue-300 to-indigo-500' : recommendation.title.includes('Loving-Kindness') ? 'bg-gradient-to-r from-rose-400 to-pink-600' : 'bg-gradient-to-r from-teal-400 to-emerald-600'} text-white rounded-full px-3 py-1 text-xs flex-1 flex items-center justify-center hover:opacity-90 transition-opacity`}
                    >
                      <Play size={12} className="mr-1" fill="currentColor" />
                      Start Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI Insights */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>

            <div className="space-y-3">
              {insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{insight.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.content}</p>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                        {insight.type === 'insight' ? 'Research Insight' :
                         insight.type === 'tip' ? 'Helpful Tip' : 'Daily Challenge'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Personalized Plan */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Meditation Journey</h2>

            {activePlan ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 shadow-sm">
                <h3 className="font-medium text-gray-900">{activePlan.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{activePlan.description}</p>

                <div className="space-y-3 mt-4">
                  {activePlan.dailyMeditations.map((meditation) => (
                    <div
                      key={`${activePlan.id}-day-${meditation.day}`}
                      className={`flex items-center p-3 rounded-lg ${
                        meditation.completed ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                        meditation.completed ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                      }`}>
                        <span className="text-lg font-medium">{meditation.day}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{meditation.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={10} className="mr-1" />
                          <span>{meditation.duration}</span>
                        </div>
                      </div>
                      {meditation.completed ? (
                        <span className="text-green-500 text-xs font-medium">Completed</span>
                      ) : (
                        <Button
                          onClick={() => handleCompleteMeditation(meditation.day)}
                          className={`bg-gradient-to-br ${meditation.title.includes('Morning') ? 'from-yellow-400 to-orange-500' : meditation.title.includes('Stress') ? 'from-blue-400 to-blue-600' : meditation.title.includes('Mindful') ? 'from-green-400 to-teal-500' : 'from-purple-400 to-indigo-600'} text-white rounded-full px-3 py-1 text-xs`}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">No personalized plan yet. Let our AI create a custom meditation journey for you.</p>
                <Button
                  onClick={handleCreatePlan}
                  className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:opacity-90 text-white rounded-full px-4 py-2 text-sm inline-flex items-center shadow-md"
                >
                  <Sparkles size={16} className="mr-2" />
                  Create My 7-Day Plan
                </Button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Meditation Chat */}
      <MeditationChat isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Interactive Tips */}
      {showTips && currentRecommendation && (
        <InteractiveTips
          onClose={() => setShowTips(false)}
          category={currentRecommendation.title}
          gradient={currentRecommendation.title.includes('Emotional Balance') ? 'from-pink-400 to-purple-500' :
                   currentRecommendation.title.includes('Body Scan') ? 'from-blue-300 to-indigo-500' :
                   currentRecommendation.title.includes('Loving-Kindness') ? 'from-rose-400 to-pink-600' :
                   'from-teal-400 to-emerald-600'}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && recommendationToSchedule && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          meditationTitle={recommendationToSchedule.title}
          meditationDuration={recommendationToSchedule.duration}
          onScheduled={handleScheduleComplete}
        />
      )}
    </div>
  );
};

export default AIRecommendations;
