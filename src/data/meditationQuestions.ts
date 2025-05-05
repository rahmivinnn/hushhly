// 100 different question variations for the meditation AI
// These questions are designed to create unique user experiences

export interface MeditationQuestion {
  id: number;
  text: string;
  category: 'general' | 'emotional' | 'physical' | 'mindfulness' | 'gratitude' | 'growth';
  emoji?: string;
}

export const meditationQuestions: MeditationQuestion[] = [
  // General Questions
  {
    id: 1,
    text: "Welcome back. Before we begin, how's your heart today?",
    category: 'general',
    emoji: '💗'
  },
  {
    id: 2,
    text: "How are you feeling in this moment?",
    category: 'general',
    emoji: '✨'
  },
  {
    id: 3,
    text: "What emotions are visiting you today?",
    category: 'emotional',
    emoji: '🌊'
  },
  {
    id: 4,
    text: "How is your inner weather today?",
    category: 'emotional',
    emoji: '🌦️'
  },
  {
    id: 5,
    text: "What's the temperature of your mind right now?",
    category: 'mindfulness',
    emoji: '🧠'
  },
  {
    id: 6,
    text: "How is your energy flowing today?",
    category: 'physical',
    emoji: '⚡'
  },
  {
    id: 7,
    text: "What's one word that describes how you feel right now?",
    category: 'emotional',
    emoji: '💭'
  },
  {
    id: 8,
    text: "What color would your mood be today?",
    category: 'emotional',
    emoji: '🎨'
  },
  {
    id: 9,
    text: "If your feelings were weather, what would the forecast be?",
    category: 'emotional',
    emoji: '☁️'
  },
  {
    id: 10,
    text: "How is your body feeling today?",
    category: 'physical',
    emoji: '🧘'
  },
  // More Emotional Questions
  {
    id: 11,
    text: "What emotions have been most present for you today?",
    category: 'emotional',
    emoji: '🌈'
  },
  {
    id: 12,
    text: "Is there something specific weighing on your heart today?",
    category: 'emotional',
    emoji: '🪶'
  },
  {
    id: 13,
    text: "What's the loudest emotion in your heart right now?",
    category: 'emotional',
    emoji: '📢'
  },
  {
    id: 14,
    text: "Are you carrying any emotional weight today that you'd like to set down?",
    category: 'emotional',
    emoji: '🎒'
  },
  {
    id: 15,
    text: "How would you describe the rhythm of your emotions today?",
    category: 'emotional',
    emoji: '🎵'
  },
  // Mindfulness Questions
  {
    id: 16,
    text: "On a scale of stormy to peaceful, how is your mind today?",
    category: 'mindfulness',
    emoji: '🌊'
  },
  {
    id: 17,
    text: "How present have you been able to be today?",
    category: 'mindfulness',
    emoji: '🎁'
  },
  {
    id: 18,
    text: "What's the quality of your attention right now?",
    category: 'mindfulness',
    emoji: '🔍'
  },
  {
    id: 19,
    text: "How busy is your mind in this moment?",
    category: 'mindfulness',
    emoji: '🐝'
  },
  {
    id: 20,
    text: "What's the pace of your thoughts right now?",
    category: 'mindfulness',
    emoji: '⏱️'
  },
  // Physical Awareness Questions
  {
    id: 21,
    text: "Where in your body do you feel the most tension today?",
    category: 'physical',
    emoji: '💪'
  },
  {
    id: 22,
    text: "How is your breathing right now - deep or shallow?",
    category: 'physical',
    emoji: '🫁'
  },
  {
    id: 23,
    text: "How rested does your body feel today?",
    category: 'physical',
    emoji: '😴'
  },
  {
    id: 24,
    text: "What is your body asking for today?",
    category: 'physical',
    emoji: '👂'
  },
  {
    id: 25,
    text: "How connected do you feel to your physical self right now?",
    category: 'physical',
    emoji: '🧵'
  },
  // Gratitude Questions
  {
    id: 26,
    text: "What's one thing you're grateful for in this moment?",
    category: 'gratitude',
    emoji: '🙏'
  },
  {
    id: 27,
    text: "Has anything brought you joy today, however small?",
    category: 'gratitude',
    emoji: '✨'
  },
  {
    id: 28,
    text: "What's something beautiful you've noticed today?",
    category: 'gratitude',
    emoji: '🌸'
  },
  {
    id: 29,
    text: "Is there a moment from today you'd like to treasure?",
    category: 'gratitude',
    emoji: '💎'
  },
  {
    id: 30,
    text: "What's nurturing your spirit today?",
    category: 'gratitude',
    emoji: '🌱'
  },
  // Growth Questions
  {
    id: 31,
    text: "What are you learning about yourself today?",
    category: 'growth',
    emoji: '📚'
  },
  {
    id: 32,
    text: "What challenge are you facing that might be helping you grow?",
    category: 'growth',
    emoji: '🧗'
  },
  {
    id: 33,
    text: "How have you been kind to yourself today?",
    category: 'growth',
    emoji: '❤️'
  },
  {
    id: 34,
    text: "What wisdom has today offered you?",
    category: 'growth',
    emoji: '🦉'
  },
  {
    id: 35,
    text: "What part of yourself are you discovering today?",
    category: 'growth',
    emoji: '🔍'
  },
  // More General Questions
  {
    id: 36,
    text: "How would you describe your inner landscape right now?",
    category: 'general',
    emoji: '🏞️'
  },
  {
    id: 37,
    text: "What's the quality of your presence today?",
    category: 'general',
    emoji: '✨'
  },
  {
    id: 38,
    text: "How aligned do you feel with yourself today?",
    category: 'general',
    emoji: '⚖️'
  },
  {
    id: 39,
    text: "What's the story your heart is telling today?",
    category: 'general',
    emoji: '📖'
  },
  {
    id: 40,
    text: "How would you describe your soul's weather today?",
    category: 'general',
    emoji: '🌦️'
  },
  // More Varied Questions
  {
    id: 41,
    text: "If your heart could speak right now, what would it say?",
    category: 'emotional',
    emoji: '💬'
  },
  {
    id: 42,
    text: "What's one thing your body needs right now?",
    category: 'physical',
    emoji: '🧠'
  },
  {
    id: 43,
    text: "How connected do you feel to your purpose today?",
    category: 'growth',
    emoji: '🧭'
  },
  {
    id: 44,
    text: "What's the tempo of your day been like?",
    category: 'general',
    emoji: '🎵'
  },
  {
    id: 45,
    text: "What's one thing you'd like to release before our meditation?",
    category: 'mindfulness',
    emoji: '🕊️'
  },
  {
    id: 46,
    text: "How would you describe the texture of your thoughts today?",
    category: 'mindfulness',
    emoji: '🧶'
  },
  {
    id: 47,
    text: "What's one sensation you're aware of in your body right now?",
    category: 'physical',
    emoji: '👐'
  },
  {
    id: 48,
    text: "What's the quality of your breath today?",
    category: 'physical',
    emoji: '💨'
  },
  {
    id: 49,
    text: "What emotion is asking for your attention right now?",
    category: 'emotional',
    emoji: '🔔'
  },
  {
    id: 50,
    text: "How would you describe your relationship with yourself today?",
    category: 'growth',
    emoji: '🤝'
  },
  // More Creative Questions
  {
    id: 51,
    text: "If your day was a landscape, what would it look like?",
    category: 'general',
    emoji: '🏞️'
  },
  {
    id: 52,
    text: "If your emotions were music, what would be playing right now?",
    category: 'emotional',
    emoji: '🎵'
  },
  {
    id: 53,
    text: "What season does your heart feel like it's in?",
    category: 'emotional',
    emoji: '🍂'
  },
  {
    id: 54,
    text: "If your mind was a room, how would you describe it right now?",
    category: 'mindfulness',
    emoji: '🏠'
  },
  {
    id: 55,
    text: "What animal reflects your energy today?",
    category: 'general',
    emoji: '🦋'
  },
  // Specific Emotional Check-ins
  {
    id: 56,
    text: "How is anxiety showing up for you today, if at all?",
    category: 'emotional',
    emoji: '😰'
  },
  {
    id: 57,
    text: "Where are you finding peace today?",
    category: 'emotional',
    emoji: '☮️'
  },
  {
    id: 58,
    text: "How is your heart holding joy today?",
    category: 'emotional',
    emoji: '🎉'
  },
  {
    id: 59,
    text: "What's the quality of your sadness today, if present?",
    category: 'emotional',
    emoji: '💧'
  },
  {
    id: 60,
    text: "How is your confidence feeling today?",
    category: 'emotional',
    emoji: '💪'
  },
  // Mindful Awareness Questions
  {
    id: 61,
    text: "What are you noticing about your thoughts right now?",
    category: 'mindfulness',
    emoji: '💭'
  },
  {
    id: 62,
    text: "How present are you feeling in your body right now?",
    category: 'mindfulness',
    emoji: '🧘'
  },
  {
    id: 63,
    text: "What's one thing you can sense with each of your five senses right now?",
    category: 'mindfulness',
    emoji: '👁️'
  },
  {
    id: 64,
    text: "How would you describe your relationship with the present moment?",
    category: 'mindfulness',
    emoji: '⏱️'
  },
  {
    id: 65,
    text: "What's one thing you're aware of that you weren't aware of yesterday?",
    category: 'mindfulness',
    emoji: '💡'
  },
  // Relationship Questions
  {
    id: 66,
    text: "How connected do you feel to others today?",
    category: 'general',
    emoji: '🤲'
  },
  {
    id: 67,
    text: "What's one relationship that's nurturing you right now?",
    category: 'gratitude',
    emoji: '💞'
  },
  {
    id: 68,
    text: "How are you showing up in your relationships today?",
    category: 'growth',
    emoji: '🌟'
  },
  {
    id: 69,
    text: "What's one boundary you're honoring today?",
    category: 'growth',
    emoji: '🛡️'
  },
  {
    id: 70,
    text: "How is your heart feeling about your closest connections?",
    category: 'emotional',
    emoji: '❤️'
  },
  // Purpose and Meaning Questions
  {
    id: 71,
    text: "What's giving your day meaning today?",
    category: 'growth',
    emoji: '✨'
  },
  {
    id: 72,
    text: "How aligned do you feel with your purpose right now?",
    category: 'growth',
    emoji: '🧭'
  },
  {
    id: 73,
    text: "What values are you honoring today?",
    category: 'growth',
    emoji: '🏆'
  },
  {
    id: 74,
    text: "What's one small way you're making a difference today?",
    category: 'gratitude',
    emoji: '🌱'
  },
  {
    id: 75,
    text: "What's one thing that feels meaningful to you right now?",
    category: 'growth',
    emoji: '💎'
  },
  // Balance Questions
  {
    id: 76,
    text: "How balanced does your energy feel today?",
    category: 'physical',
    emoji: '⚖️'
  },
  {
    id: 77,
    text: "What area of your life needs more attention right now?",
    category: 'growth',
    emoji: '🔍'
  },
  {
    id: 78,
    text: "How are you balancing giving and receiving today?",
    category: 'growth',
    emoji: '🔄'
  },
  {
    id: 79,
    text: "What's one way you could bring more harmony to your day?",
    category: 'growth',
    emoji: '☯️'
  },
  {
    id: 80,
    text: "How are you honoring both your strengths and vulnerabilities today?",
    category: 'growth',
    emoji: '🦋'
  },
  // Transition Questions
  {
    id: 81,
    text: "What are you in the process of letting go of?",
    category: 'growth',
    emoji: '🍃'
  },
  {
    id: 82,
    text: "What new beginning are you experiencing or hoping for?",
    category: 'growth',
    emoji: '🌅'
  },
  {
    id: 83,
    text: "What's transforming within you right now?",
    category: 'growth',
    emoji: '🦋'
  },
  {
    id: 84,
    text: "What chapter of your life are you currently in?",
    category: 'growth',
    emoji: '📖'
  },
  {
    id: 85,
    text: "What's one thing that's changing in your inner landscape?",
    category: 'growth',
    emoji: '🌊'
  },
  // Intention Questions
  {
    id: 86,
    text: "What intention would you like to set for our time together?",
    category: 'mindfulness',
    emoji: '🧭'
  },
  {
    id: 87,
    text: "What quality would you like to cultivate in yourself today?",
    category: 'growth',
    emoji: '🌱'
  },
  {
    id: 88,
    text: "What's one thing you'd like to invite more of into your life?",
    category: 'growth',
    emoji: '✨'
  },
  {
    id: 89,
    text: "What would you like to focus on during our meditation today?",
    category: 'mindfulness',
    emoji: '🔍'
  },
  {
    id: 90,
    text: "What's one small shift you'd like to make today?",
    category: 'growth',
    emoji: '🔄'
  },
  // Final Set of Varied Questions
  {
    id: 91,
    text: "How would you describe the landscape of your heart today?",
    category: 'emotional',
    emoji: '💗'
  },
  {
    id: 92,
    text: "What's one thing your body is communicating to you right now?",
    category: 'physical',
    emoji: '👂'
  },
  {
    id: 93,
    text: "What's the most alive part of you today?",
    category: 'general',
    emoji: '✨'
  },
  {
    id: 94,
    text: "What's one truth you're holding today?",
    category: 'growth',
    emoji: '💎'
  },
  {
    id: 95,
    text: "How is your spirit feeling today?",
    category: 'general',
    emoji: '🕊️'
  },
  {
    id: 96,
    text: "What's one thing you're curious about today?",
    category: 'growth',
    emoji: '🔍'
  },
  {
    id: 97,
    text: "How would you describe your relationship with uncertainty today?",
    category: 'growth',
    emoji: '❓'
  },
  {
    id: 98,
    text: "What's one way you've shown yourself compassion today?",
    category: 'growth',
    emoji: '❤️'
  },
  {
    id: 99,
    text: "What's the quality of your hope today?",
    category: 'emotional',
    emoji: '🌈'
  },
  {
    id: 100,
    text: "Before we begin our meditation, what's in your heart right now?",
    category: 'emotional',
    emoji: '💗'
  }
];

// Function to get a random question
export const getRandomQuestion = (): MeditationQuestion => {
  const randomIndex = Math.floor(Math.random() * meditationQuestions.length);
  return meditationQuestions[randomIndex];
};

// Function to get a random question from a specific category
export const getRandomQuestionByCategory = (category: MeditationQuestion['category']): MeditationQuestion => {
  const categoryQuestions = meditationQuestions.filter(q => q.category === category);
  const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
  return categoryQuestions[randomIndex];
};
