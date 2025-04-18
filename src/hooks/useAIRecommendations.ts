import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  aiRecommendationService, 
  AIRecommendation, 
  AIInsight, 
  AIPersonalizedPlan 
} from '@/services/aiRecommendationService';

export const useAIRecommendations = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activePlan, setActivePlan] = useState<AIPersonalizedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load recommendations on mount
  useEffect(() => {
    loadRecommendations();
  }, [userId]);
  
  // Load all AI recommendations
  const loadRecommendations = () => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Get personalized recommendations
      const personalizedRecommendations = aiRecommendationService.getPersonalizedRecommendations(userId, 3);
      setRecommendations(personalizedRecommendations);
      
      // Get insights
      const personalizedInsights = aiRecommendationService.getPersonalizedInsights(userId, 2);
      setInsights(personalizedInsights);
      
      // Get active plan
      const plan = aiRecommendationService.getActivePersonalizedPlan(userId);
      setActivePlan(plan);
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Create a new personalized plan
  const createPersonalizedPlan = (duration: number = 7) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newPlan = aiRecommendationService.createPersonalizedPlan(userId, duration);
      setActivePlan(newPlan);
      setIsLoading(false);
    }, 1000);
    
    return activePlan;
  };
  
  // Update user preferences
  const updatePreferences = (preferences: Partial<{
    mood: 'calm' | 'relax' | 'focus' | 'anxious' | 'overwhelmed' | 'tired';
    preferredDuration: string;
    preferVariety: boolean;
    preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
    goals: string[];
  }>) => {
    aiRecommendationService.updateUserPreferences(userId, preferences);
    
    // Reload recommendations to reflect new preferences
    loadRecommendations();
  };
  
  // Get user preferences
  const getUserPreferences = () => {
    return aiRecommendationService.getUserPreferences(userId);
  };
  
  // Mark a meditation as completed in the plan
  const completeMeditation = (planId: string, day: number) => {
    aiRecommendationService.updateMeditationCompletion(userId, planId, day, true);
    
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
  };
  
  return {
    recommendations,
    insights,
    activePlan,
    isLoading,
    loadRecommendations,
    createPersonalizedPlan,
    updatePreferences,
    getUserPreferences,
    completeMeditation
  };
};
