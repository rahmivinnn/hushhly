import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import BearMascot from './BearMascot';
import MoodSelector from './MoodSelector';

interface WorkingMeditationChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  suggestions?: string[];
}

const WorkingMeditationChat: React.FC<WorkingMeditationChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [bearEmotion, setBearEmotion] = useState<'happy' | 'calm' | 'thinking' | 'listening'>('happy');
  const [bearMessage, setBearMessage] = useState("Hi there! I'm Hushhly Bear, your meditation companion. How are you feeling today?");

  if (!isOpen) return null;

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response with a slight delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        content: "I understand how you're feeling. Taking a moment to breathe can help center your mind. Would you like to try a short meditation with me?",
        sender: 'ai',
        timestamp: Date.now(),
        suggestions: ['Yes, let\'s meditate', 'Tell me more', 'Maybe later', 'I need something else']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleMoodSelect = (mood: string) => {
    setShowMoodSelector(false);
    
    // Add user message about mood
    const userMessage: ChatMessage = {
      id: generateId(),
      content: `I'm feeling ${mood} today.`,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setMessages([userMessage]);
    
    // Update bear emotion based on mood
    if (mood === 'anxious' || mood === 'sad') {
      setBearEmotion('calm');
      setBearMessage("I understand how you feel. Let's take a moment to breathe together.");
    } else if (mood === 'happy' || mood === 'grateful') {
      setBearEmotion('happy');
      setBearMessage("That's wonderful! I'm happy to hear that. Let's build on this positive energy.");
    } else if (mood === 'tired') {
      setBearEmotion('thinking');
      setBearMessage("I understand. Let's find a gentle practice that respects your energy levels today.");
    } else {
      setBearEmotion('listening');
      setBearMessage("I'm here with you. How can I support your meditation practice today?");
    }
    
    // Generate AI response with a slight delay
    setTimeout(() => {
      let responseContent = '';
      let suggestions: string[] = [];
      
      if (mood === 'anxious') {
        responseContent = "I feel that anxiety with you. Like ripples on water, these feelings move through you but aren't the whole of who you are. Would you like to try a gentle breathing practice to help ground your nervous system?";
        suggestions = ['Yes, help me breathe', 'I need something quick', 'Tell me more', 'I want to schedule a session'];
      } else if (mood === 'tired') {
        responseContent = "I hear the weariness in your words. Your body carries so much wisdom when it asks for rest. Let's honor that together with some gentle renewal. Would you like a soft energizing practice, or something to help you surrender more deeply to rest?";
        suggestions = ['Gentle energy renewal', 'Help me rest deeply', 'I need better sleep', 'Why am I always tired?'];
      } else if (mood === 'sad') {
        responseContent = "I'm sitting with your sadness. Emotions flow through us like weather patterns—sometimes stormy, sometimes clear. Your feelings are valid and worthy of gentle attention. Would you like to explore a meditation that offers a soft holding space for whatever you're experiencing?";
        suggestions = ['Yes, hold space for me', 'How can meditation help sadness?', 'I want to talk more', 'Schedule a session'];
      } else if (mood === 'happy' || mood === 'grateful') {
        responseContent = "What a beautiful energy you're carrying today. Gratitude is like sunlight for the soul—it illuminates everything it touches. Would you like to amplify this feeling, letting it sink deeper into your being with a gratitude practice?";
        suggestions = ['Yes, deepen this feeling', 'How to maintain this state', 'I want something different', 'Schedule for later'];
      } else {
        responseContent = "Thank you for sharing how you're feeling. Being aware of our emotions is the first step in mindfulness. Would you like to explore a meditation practice tailored to your current state?";
        suggestions = ['Yes, let\'s meditate', 'Tell me more about meditation', 'Maybe later', 'I need something else'];
      }
      
      const aiResponse: ChatMessage = {
        id: generateId(),
        content: responseContent,
        sender: 'ai',
        timestamp: Date.now(),
        suggestions
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: suggestion,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response with a slight delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        content: "Let's begin this journey together. Find a position where your body feels supported and at ease. I'll guide you with my voice as we move through this practice. Let's start by arriving fully in this moment with a deep, nourishing breath.",
        sender: 'ai',
        timestamp: Date.now(),
        suggestions: ['Continue', 'I need a different practice', 'How long will this take?', 'End session']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <button
          onClick={onClose}
          className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold text-white ml-4">AI Meditation</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {showMoodSelector ? (
          <div className="flex flex-col items-center justify-center h-full">
            <BearMascot emotion={bearEmotion} message={bearMessage} />
            <div className="mt-8 w-full max-w-md">
              <MoodSelector onSelect={handleMoodSelect} />
            </div>
          </div>
        ) : (
          <>
            {/* Bear Mascot */}
            <div className="flex justify-center mb-6">
              <BearMascot emotion={bearEmotion} message={bearMessage} />
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 backdrop-blur-md text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Suggestions */}
                    {message.sender === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="bg-white/20 hover:bg-white/30 text-white text-xs rounded-full px-3 py-1 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Input Area */}
      {!showMoodSelector && (
        <div className="p-4 bg-white/10 backdrop-blur-md">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="ml-2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingMeditationChat;
