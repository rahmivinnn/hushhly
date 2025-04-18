import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { aiRecommendationService, AIChatMessage } from '@/services/aiRecommendationService';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load chat history on component mount
  useEffect(() => {
    if (isOpen) {
      const history = aiRecommendationService.getChatHistory(userId);
      
      if (history.length === 0) {
        // If no history, add a welcome message
        const welcomeMessage = aiRecommendationService.addChatMessage(
          userId,
          "Hello! I'm your Hushhly AI meditation guide. How can I help you today?",
          'ai',
          ['I need help with stress', 'How can I sleep better?', 'Tell me about meditation']
        );
        setMessages([welcomeMessage]);
      } else {
        setMessages(history);
      }
    }
  }, [userId, isOpen]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = aiRecommendationService.addChatMessage(userId, inputValue, 'user');
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response with a slight delay to simulate thinking
    setTimeout(() => {
      const aiResponse = aiRecommendationService.generateAIResponse(userId, userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    const userMessage = aiRecommendationService.addChatMessage(userId, suggestion, 'user');
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response with a slight delay
    setTimeout(() => {
      const aiResponse = aiRecommendationService.generateAIResponse(userId, suggestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles size={20} className="mr-2" />
            <h1 className="text-xl font-semibold">Hushhly AI Guide</h1>
          </div>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>
        <p className="mt-1 text-sm text-white/90">Your personal meditation assistant</p>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white shadow-sm rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.sender === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white shadow-sm rounded-2xl rounded-tl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="max-w-md mx-auto flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about meditation..."
            className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-full px-4 py-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
