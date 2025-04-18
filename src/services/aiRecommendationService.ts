import { User } from '../types/user';
import { activityTrackingService, MeditationSession } from './activityTrackingService';

// Types for AI recommendations
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  videoId?: string;
  confidence: number; // 0-100 score of how confident the AI is in this recommendation
  tags: string[];
  reasonForRecommendation: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'insight' | 'challenge';
  icon: string;
}

export interface AIChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  suggestions?: string[];
}

export interface AIPersonalizedPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  dailyMeditations: {
    day: number;
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    image: string;
    videoId?: string;
  }[];
}

// Storage keys
const AI_CHAT_HISTORY_KEY = 'hushhly_ai_chat_history';
const AI_PREFERENCES_KEY = 'hushhly_ai_preferences';
const AI_PLANS_KEY = 'hushhly_ai_plans';

// Helper functions
const getRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

// Sample meditation data
const meditationDatabase = [
  {
    id: 'med-1',
    title: 'Morning Mindfulness',
    description: 'Start your day with clarity and purpose',
    duration: '10 Min',
    image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
    videoId: 'nRkP3lKj_lY',
    tags: ['morning', 'mindfulness', 'beginner', 'focus'],
    bestFor: ['morning', 'focus', 'calm']
  },
  {
    id: 'med-2',
    title: 'Stress Relief Breathing',
    description: 'Quick breathing exercises to reduce stress',
    duration: '5 Min',
    image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
    videoId: 'U5o8UiYxfeY',
    tags: ['stress', 'breathing', 'quick', 'anxiety'],
    bestFor: ['anxious', 'overwhelmed', 'afternoon']
  },
  {
    id: 'med-3',
    title: 'Deep Sleep Preparation',
    description: 'Prepare your mind and body for restful sleep',
    duration: '15 Min',
    image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
    videoId: 'rnDiXEhkBd8',
    tags: ['sleep', 'relaxation', 'evening', 'deep'],
    bestFor: ['night', 'relax', 'tired']
  },
  {
    id: 'med-4',
    title: 'Focus Enhancement',
    description: 'Sharpen your concentration and mental clarity',
    duration: '12 Min',
    image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
    videoId: 'XqeAt45goBI',
    tags: ['focus', 'concentration', 'productivity', 'work'],
    bestFor: ['focus', 'afternoon', 'morning']
  },
  {
    id: 'med-5',
    title: 'Emotional Balance',
    description: 'Find equilibrium during emotional turbulence',
    duration: '8 Min',
    image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
    videoId: 'nRkP3lKj_lY',
    tags: ['emotions', 'balance', 'mindfulness', 'anxiety'],
    bestFor: ['anxious', 'overwhelmed', 'evening']
  },
  {
    id: 'med-6',
    title: 'Gratitude Practice',
    description: 'Cultivate appreciation and positive outlook',
    duration: '7 Min',
    image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
    videoId: 'U5o8UiYxfeY',
    tags: ['gratitude', 'positivity', 'mindfulness', 'morning'],
    bestFor: ['morning', 'calm', 'focus']
  },
  {
    id: 'med-7',
    title: 'Body Scan Relaxation',
    description: 'Release tension throughout your body',
    duration: '15 Min',
    image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
    videoId: 'rnDiXEhkBd8',
    tags: ['relaxation', 'body', 'tension', 'stress'],
    bestFor: ['evening', 'tired', 'relax']
  },
  {
    id: 'med-8',
    title: 'Quick Energy Boost',
    description: 'Revitalize your energy in just minutes',
    duration: '3 Min',
    image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
    videoId: 'XqeAt45goBI',
    tags: ['energy', 'quick', 'afternoon', 'focus'],
    bestFor: ['afternoon', 'tired', 'focus']
  },
  {
    id: 'med-9',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    duration: '10 Min',
    image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
    videoId: 'nRkP3lKj_lY',
    tags: ['compassion', 'kindness', 'emotions', 'relationships'],
    bestFor: ['calm', 'evening', 'morning']
  },
  {
    id: 'med-10',
    title: 'Mindful Walking',
    description: 'Practice mindfulness while in motion',
    duration: '8 Min',
    image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
    videoId: 'U5o8UiYxfeY',
    tags: ['walking', 'movement', 'outdoors', 'mindfulness'],
    bestFor: ['afternoon', 'focus', 'calm']
  }
];

// Sample insights
const insightsDatabase = [
  {
    id: 'insight-1',
    title: 'Consistency Matters',
    content: 'Research shows that meditating for just 5 minutes daily is more beneficial than 35 minutes once a week.',
    type: 'insight',
    icon: '📊'
  },
  {
    id: 'insight-2',
    title: 'Breathing Technique',
    content: 'Try 4-7-8 breathing: Inhale for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system.',
    type: 'tip',
    icon: '💨'
  },
  {
    id: 'insight-3',
    title: 'Mindful Moment',
    content: 'Take 30 seconds right now to notice 3 things you can see, 2 things you can hear, and 1 thing you can feel.',
    type: 'challenge',
    icon: '⏱️'
  },
  {
    id: 'insight-4',
    title: 'Sleep Connection',
    content: 'Regular meditation can increase melatonin levels, helping you fall asleep faster and improve sleep quality.',
    type: 'insight',
    icon: '😴'
  },
  {
    id: 'insight-5',
    title: 'Stress Response',
    content: 'Meditation reduces cortisol levels, your body's main stress hormone, within just 8 weeks of regular practice.',
    type: 'insight',
    icon: '🧠'
  }
];

// Sample chat responses
const chatResponses = {
  greeting: [
    "Hello! I'm your Hushhly AI meditation guide. How can I help you today?",
    "Welcome to Hushhly! I'm here to support your meditation journey. What's on your mind?",
    "Hi there! I'm your personal meditation assistant. How are you feeling today?"
  ],
  stress: [
    "I'm sorry to hear you're feeling stressed. Would you like to try a quick 5-minute breathing exercise to help calm your mind?",
    "Stress can be challenging. I recommend our 'Stress Relief Breathing' meditation. It's only 5 minutes and can help you reset.",
    "When you're feeling stressed, focusing on your breath can help. Would you like me to guide you through a quick breathing exercise?"
  ],
  sleep: [
    "Having trouble sleeping? Our 'Deep Sleep Preparation' meditation can help prepare your mind and body for rest.",
    "For better sleep, I recommend trying our 15-minute sleep meditation before bed. Would you like me to add it to your evening routine?",
    "Sleep issues are common. Have you tried a body scan meditation before bed? It can help release tension and prepare for sleep."
  ],
  focus: [
    "Need help focusing? Our 'Focus Enhancement' meditation is designed to improve concentration and mental clarity.",
    "For better focus, I recommend starting your day with a short mindfulness practice. Would you like to try our 'Morning Mindfulness' session?",
    "When concentration is challenging, even a 3-minute meditation break can help reset your mind. Would you like to try our 'Quick Energy Boost'?"
  ],
  general: [
    "Meditation is a practice that gets easier with time. What specific aspect of meditation are you interested in?",
    "I'm here to support your mindfulness journey. Would you like recommendations based on how you're feeling right now?",
    "Everyone's meditation journey is unique. What are your goals with meditation practice?"
  ]
};

// Main service
export const aiRecommendationService = {
  // Get personalized recommendations based on user data
  getPersonalizedRecommendations(userId: string, count: number = 3): AIRecommendation[] {
    // Get user activity data
    const activitySummary = activityTrackingService.getActivitySummary(userId);
    const recentMeditations = activityTrackingService.getMeditationSessions(userId);
    const recentPageVisits = activityTrackingService.getRecentPageVisits(userId);
    
    // Get time of day
    const timeOfDay = getTimeOfDay();
    
    // Get user preferences
    const preferences = this.getUserPreferences(userId);
    
    // Calculate recommendation scores for each meditation
    const scoredMeditations = meditationDatabase.map(meditation => {
      let score = 50; // Base score
      
      // Adjust score based on time of day
      if (meditation.bestFor.includes(timeOfDay)) {
        score += 15;
      }
      
      // Adjust score based on user mood if available
      if (preferences.mood && meditation.bestFor.includes(preferences.mood)) {
        score += 20;
      }
      
      // Adjust score based on user preferences
      if (preferences.preferredDuration) {
        const meditationMinutes = parseInt(meditation.duration.split(' ')[0]);
        const preferredMinutes = parseInt(preferences.preferredDuration.split(' ')[0]);
        
        // If within 5 minutes of preferred duration
        if (Math.abs(meditationMinutes - preferredMinutes) <= 5) {
          score += 10;
        }
      }
      
      // Adjust score based on past activity
      const hasDoneSimilar = recentMeditations.some(session => 
        meditation.tags.some(tag => session.title.toLowerCase().includes(tag))
      );
      
      if (hasDoneSimilar) {
        // User has done similar meditations before
        if (preferences.preferVariety) {
          score -= 15; // Reduce score if user prefers variety
        } else {
          score += 10; // Increase score if user likes consistency
        }
      }
      
      // Generate reason for recommendation
      let reason = '';
      if (meditation.bestFor.includes(timeOfDay)) {
        reason = `Perfect for ${timeOfDay} meditation`;
      } else if (preferences.mood && meditation.bestFor.includes(preferences.mood)) {
        reason = `Recommended for your ${preferences.mood} mood`;
      } else if (hasDoneSimilar && !preferences.preferVariety) {
        reason = 'Based on meditations you've enjoyed';
      } else {
        reason = 'Recommended to expand your practice';
      }
      
      return {
        ...meditation,
        confidence: Math.min(Math.max(score, 0), 100), // Ensure score is between 0-100
        reasonForRecommendation: reason
      };
    });
    
    // Sort by score and take the top 'count' recommendations
    return scoredMeditations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, count);
  },
  
  // Get personalized insights
  getPersonalizedInsights(userId: string, count: number = 2): AIInsight[] {
    // In a real implementation, this would analyze user data to provide relevant insights
    // For now, we'll randomly select from our database
    const shuffled = [...insightsDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
  
  // Get chat history
  getChatHistory(userId: string): AIChatMessage[] {
    try {
      const storedHistory = localStorage.getItem(`${AI_CHAT_HISTORY_KEY}_${userId}`);
      if (storedHistory) {
        return JSON.parse(storedHistory);
      }
    } catch (error) {
      console.error('Error getting chat history:', error);
    }
    
    // If no history or error, return empty array
    return [];
  },
  
  // Add message to chat
  addChatMessage(userId: string, content: string, sender: 'user' | 'ai', suggestions?: string[]): AIChatMessage {
    try {
      const history = this.getChatHistory(userId);
      
      const newMessage: AIChatMessage = {
        id: getRandomId(),
        content,
        sender,
        timestamp: Date.now(),
        suggestions
      };
      
      const updatedHistory = [...history, newMessage];
      
      // Keep only the last 50 messages to avoid localStorage size issues
      const trimmedHistory = updatedHistory.slice(-50);
      
      localStorage.setItem(`${AI_CHAT_HISTORY_KEY}_${userId}`, JSON.stringify(trimmedHistory));
      
      return newMessage;
    } catch (error) {
      console.error('Error adding chat message:', error);
      
      // Return a fallback message
      return {
        id: getRandomId(),
        content,
        sender,
        timestamp: Date.now(),
        suggestions
      };
    }
  },
  
  // Generate AI response based on user message
  generateAIResponse(userId: string, userMessage: string): AIChatMessage {
    // In a real implementation, this would use a proper NLP model or API
    // For now, we'll use simple keyword matching
    
    const lowerMessage = userMessage.toLowerCase();
    let responseContent = '';
    let suggestions: string[] = [];
    
    // Check for keywords and generate appropriate response
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseContent = chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)];
      suggestions = ['I need help with stress', 'How can I sleep better?', 'Tell me about meditation'];
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      responseContent = chatResponses.stress[Math.floor(Math.random() * chatResponses.stress.length)];
      suggestions = ['Start stress meditation', 'More stress tips', 'I need to sleep better'];
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
      responseContent = chatResponses.sleep[Math.floor(Math.random() * chatResponses.sleep.length)];
      suggestions = ['Start sleep meditation', 'Sleep tips', 'I wake up during the night'];
    } else if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate') || lowerMessage.includes('distracted')) {
      responseContent = chatResponses.focus[Math.floor(Math.random() * chatResponses.focus.length)];
      suggestions = ['Start focus meditation', 'Focus techniques', 'How long should I meditate?'];
    } else {
      responseContent = chatResponses.general[Math.floor(Math.random() * chatResponses.general.length)];
      suggestions = ['Recommend a meditation', 'How do I start meditating?', 'Benefits of meditation'];
    }
    
    // Add the AI response to chat history
    return this.addChatMessage(userId, responseContent, 'ai', suggestions);
  },
  
  // Get user preferences
  getUserPreferences(userId: string): {
    mood?: 'calm' | 'relax' | 'focus' | 'anxious' | 'overwhelmed' | 'tired';
    preferredDuration?: string;
    preferVariety?: boolean;
    preferredTime?: 'morning' | 'afternoon' | 'evening' | 'night';
    goals?: string[];
  } {
    try {
      const storedPreferences = localStorage.getItem(`${AI_PREFERENCES_KEY}_${userId}`);
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
    } catch (error) {
      console.error('Error getting user preferences:', error);
    }
    
    // If no preferences or error, return empty object
    return {};
  },
  
  // Update user preferences
  updateUserPreferences(userId: string, preferences: Partial<{
    mood: 'calm' | 'relax' | 'focus' | 'anxious' | 'overwhelmed' | 'tired';
    preferredDuration: string;
    preferVariety: boolean;
    preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
    goals: string[];
  }>): void {
    try {
      const currentPreferences = this.getUserPreferences(userId);
      const updatedPreferences = { ...currentPreferences, ...preferences };
      
      localStorage.setItem(`${AI_PREFERENCES_KEY}_${userId}`, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  },
  
  // Create a personalized meditation plan
  createPersonalizedPlan(userId: string, duration: number = 7): AIPersonalizedPlan {
    // Get user preferences
    const preferences = this.getUserPreferences(userId);
    
    // Create a plan with daily meditations
    const dailyMeditations = [];
    
    for (let day = 1; day <= duration; day++) {
      // Select a meditation for this day based on preferences
      // In a real implementation, this would be more sophisticated
      const meditationPool = [...meditationDatabase];
      
      // Shuffle the pool
      const shuffled = meditationPool.sort(() => 0.5 - Math.random());
      
      // Select a meditation that matches preferences if possible
      let selectedMeditation = shuffled[0];
      
      if (preferences.mood) {
        const matchingMeditation = shuffled.find(med => 
          med.bestFor.includes(preferences.mood || '')
        );
        
        if (matchingMeditation) {
          selectedMeditation = matchingMeditation;
        }
      }
      
      dailyMeditations.push({
        day,
        title: selectedMeditation.title,
        description: selectedMeditation.description,
        duration: selectedMeditation.duration,
        completed: false,
        image: selectedMeditation.image,
        videoId: selectedMeditation.videoId
      });
    }
    
    const plan: AIPersonalizedPlan = {
      id: `plan-${getRandomId()}`,
      title: 'Your Personalized Meditation Journey',
      description: 'A custom plan designed for your specific needs and goals',
      duration,
      dailyMeditations
    };
    
    // Save the plan
    this.savePersonalizedPlan(userId, plan);
    
    return plan;
  },
  
  // Save a personalized plan
  savePersonalizedPlan(userId: string, plan: AIPersonalizedPlan): void {
    try {
      const storedPlans = localStorage.getItem(`${AI_PLANS_KEY}_${userId}`);
      let plans: AIPersonalizedPlan[] = [];
      
      if (storedPlans) {
        plans = JSON.parse(storedPlans);
      }
      
      // Check if plan with this ID already exists
      const existingPlanIndex = plans.findIndex(p => p.id === plan.id);
      
      if (existingPlanIndex !== -1) {
        // Update existing plan
        plans[existingPlanIndex] = plan;
      } else {
        // Add new plan
        plans.push(plan);
      }
      
      localStorage.setItem(`${AI_PLANS_KEY}_${userId}`, JSON.stringify(plans));
    } catch (error) {
      console.error('Error saving personalized plan:', error);
    }
  },
  
  // Get all personalized plans
  getPersonalizedPlans(userId: string): AIPersonalizedPlan[] {
    try {
      const storedPlans = localStorage.getItem(`${AI_PLANS_KEY}_${userId}`);
      if (storedPlans) {
        return JSON.parse(storedPlans);
      }
    } catch (error) {
      console.error('Error getting personalized plans:', error);
    }
    
    return [];
  },
  
  // Get active personalized plan (most recent)
  getActivePersonalizedPlan(userId: string): AIPersonalizedPlan | null {
    const plans = this.getPersonalizedPlans(userId);
    
    if (plans.length === 0) {
      return null;
    }
    
    // Return the most recently created plan
    return plans[plans.length - 1];
  },
  
  // Update meditation completion status in a plan
  updateMeditationCompletion(userId: string, planId: string, day: number, completed: boolean): void {
    try {
      const plans = this.getPersonalizedPlans(userId);
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex !== -1) {
        const plan = plans[planIndex];
        const meditationIndex = plan.dailyMeditations.findIndex(m => m.day === day);
        
        if (meditationIndex !== -1) {
          plan.dailyMeditations[meditationIndex].completed = completed;
          plans[planIndex] = plan;
          
          localStorage.setItem(`${AI_PLANS_KEY}_${userId}`, JSON.stringify(plans));
        }
      }
    } catch (error) {
      console.error('Error updating meditation completion:', error);
    }
  }
};
