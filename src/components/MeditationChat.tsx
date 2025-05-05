import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, MessageSquare, ArrowLeft, Heart, Wind, Brain, Moon, Mic, MicOff, Volume2, VolumeX,
  Cloud, Flower, Droplets, Sun, Calendar, PenTool, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleModal from './ScheduleModal';
import BearMascot from './BearMascot';
import MoodSelector from './MoodSelector';
import { getRandomQuestion } from '@/data/meditationQuestions';

interface MeditationChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  type?: 'text' | 'breathing' | 'meditation' | 'reflection';
  breathingCue?: 'inhale' | 'hold' | 'exhale' | 'rest';
  duration?: number;
  suggestions?: string[];
  emotion?: 'sad' | 'anxious' | 'grateful' | 'tired' | 'energized' | 'neutral';
  showHugAnimation?: boolean;
}

const MeditationChat: React.FC<MeditationChatProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id || 'guest';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isMeditating, setIsMeditating] = useState(false);
  const [currentBreathPhase, setCurrentBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReflectionCard, setShowReflectionCard] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [meditationTitle, setMeditationTitle] = useState('Personalized Meditation');
  const [meditationDuration, setMeditationDuration] = useState('10 Min');
  const [currentEmotion, setCurrentEmotion] = useState<'sad' | 'anxious' | 'grateful' | 'tired' | 'energized' | 'neutral'>('neutral');
  const [showHugAnimation, setShowHugAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for bear mascot
  const [showBearMascot, setShowBearMascot] = useState(true);
  const [bearEmotion, setBearEmotion] = useState<'happy' | 'calm' | 'thinking' | 'listening'>('happy');
  const [bearMessage, setBearMessage] = useState("Hi there! I'm Hushhly Bear, your meditation companion.");

  // State for welcome question
  const [welcomeQuestion, setWelcomeQuestion] = useState(getRandomQuestion().text);

  // Load chat history on component mount
  useEffect(() => {
    if (isOpen) {
      // Show bear mascot first, then add welcome message after animation
      setShowBearMascot(true);

      // After 3 seconds, show the welcome message
      setTimeout(() => {
        // Add a welcome message with the Hushhly personality using a random question
        const welcomeMessage: ChatMessage = {
          id: generateId(),
          content: welcomeQuestion,
          sender: 'ai',
          timestamp: Date.now(),
          type: 'text',
          suggestions: ['I feel anxious', 'I feel tired', 'I feel grateful', 'I need to focus'],
          emotion: 'neutral'
        };
        setMessages([welcomeMessage]);
        setBearEmotion('listening');
        setBearMessage("How are you feeling today? I'm here to listen and help you find peace.");
      }, 3000);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle breathing cues during meditation
  useEffect(() => {
    let breathTimer: NodeJS.Timeout;

    if (isMeditating) {
      const runBreathCycle = () => {
        // Inhale for 4 seconds
        setCurrentBreathPhase('inhale');
        addBreathingCue('inhale');

        breathTimer = setTimeout(() => {
          // Hold for 4 seconds
          setCurrentBreathPhase('hold');
          addBreathingCue('hold');

          breathTimer = setTimeout(() => {
            // Exhale for 6 seconds
            setCurrentBreathPhase('exhale');
            addBreathingCue('exhale');

            breathTimer = setTimeout(() => {
              // Rest for 2 seconds
              setCurrentBreathPhase('rest');

              breathTimer = setTimeout(() => {
                // Repeat the cycle
                runBreathCycle();
              }, 2000);
            }, 6000);
          }, 4000);
        }, 4000);
      };

      runBreathCycle();
    }

    return () => {
      if (breathTimer) clearTimeout(breathTimer);
    };
  }, [isMeditating]);

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const addBreathingCue = (phase: 'inhale' | 'hold' | 'exhale' | 'rest') => {
    if (phase === 'rest') return; // Don't add message for rest phase

    // More poetic breathing guidance
    const breathingContent = phase === 'inhale'
      ? '[breathe in...] Receive this breath as nourishment'
      : phase === 'hold'
        ? '[hold...] Feel the stillness within'
        : '[breathe out...] Release what no longer serves you';

    const cueMessage: ChatMessage = {
      id: generateId(),
      content: breathingContent,
      sender: 'ai',
      timestamp: Date.now(),
      type: 'breathing',
      breathingCue: phase,
      duration: phase === 'inhale' ? 4 : phase === 'hold' ? 4 : 6,
      emotion: currentEmotion
    };

    setMessages(prev => [...prev, cueMessage]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Generate AI response with a slight delay to simulate thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // If the response is a meditation start, begin the meditation
      if (aiResponse.type === 'meditation') {
        setIsMeditating(true);
      }
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start listening
      setIsListening(true);

      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);

          // Automatically send the message after voice input
          setTimeout(() => {
            if (transcript.trim() !== '') {
              const userMessage: ChatMessage = {
                id: generateId(),
                content: transcript,
                sender: 'user',
                timestamp: Date.now(),
                type: 'text'
              };

              setMessages(prev => [...prev, userMessage]);
              setInputValue('');

              // Show typing indicator
              setIsTyping(true);

              // Generate AI response
              setTimeout(() => {
                const aiResponse = generateAIResponse(transcript);
                setMessages(prev => [...prev, aiResponse]);
                setIsTyping(false);

                // If the response is a meditation start, begin the meditation
                if (aiResponse.type === 'meditation') {
                  setIsMeditating(true);
                }
              }, 1500);
            }
          }, 500);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);

          toast({
            title: "Voice Recognition Error",
            description: "We couldn't process your voice. Please try again or type your message.",
            duration: 3000,
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        toast({
          title: "Voice Recognition Not Supported",
          description: "Your browser doesn't support voice recognition. Please type your message instead.",
          duration: 3000,
        });
        setIsListening(false);
      }
    } else {
      // Stop listening
      setIsListening(false);

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: suggestion,
      sender: 'user',
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Generate AI response with a slight delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(suggestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // If the response is a meditation start, begin the meditation
      if (aiResponse.type === 'meditation') {
        setIsMeditating(true);
      }
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    let responseContent = '';
    let suggestions: string[] = [];
    let messageType: 'text' | 'breathing' | 'meditation' | 'reflection' = 'text';
    let showHug = false;

    // Detect emotion in user message
    const emotion = detectEmotion(lowerMessage);

    // Update bear emotion based on user message
    if (emotion === 'sad' || emotion === 'anxious') {
      setBearEmotion('calm');
      setBearMessage("I understand how you feel. Let's take a moment to breathe together.");
      showHug = true;
      setTimeout(() => {
        setShowHugAnimation(true);
        setTimeout(() => setShowHugAnimation(false), 3000);
      }, 500);
    } else if (emotion === 'grateful' || emotion === 'energized') {
      setBearEmotion('happy');
      setBearMessage("That's wonderful! I'm happy to hear that. Let's build on this positive energy.");
    } else if (emotion === 'tired') {
      setBearEmotion('thinking');
      setBearMessage("I understand. Let's find a gentle practice that respects your energy levels today.");
    } else {
      setBearEmotion('listening');
      setBearMessage("I'm here with you. How can I support your meditation practice today?");
    }

    // Check for keywords and generate appropriate response with more poetic, soulful language
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseContent = "I'm here with you. [pause]\nHow is your inner landscape today? I'm listening with my full presence.";
      suggestions = ['I feel anxious', 'I feel tired', 'I feel grateful', 'I need to focus'];
    }
    else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      responseContent = "I feel that anxiety with you. [pause]\nLike ripples on water, these feelings move through you but aren't the whole of who you are. [pause]\nWhere in your body do you feel this anxiety most strongly right now? [pause]\nWould you like to try a gentle breathing practice to help ground your nervous system?";
      suggestions = ['Yes, help me breathe', 'In my chest/stomach', 'I need something quick', 'I want to schedule a session'];
      setMeditationTitle('Anxiety Relief Meditation');
    }
    else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('no energy')) {
      responseContent = "I hear the weariness in your words. [pause]\nYour body carries so much wisdom when it asks for rest. [pause]\nLet's honor that together with some gentle renewal. [pause]\nWould you like a soft energizing practice, or something to help you surrender more deeply to rest?";
      suggestions = ['Gentle energy renewal', 'Help me rest deeply', 'I need better sleep', 'Why am I always tired?'];
      setMeditationTitle('Energy Renewal Meditation');
    }
    else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      responseContent = "I'm sitting with your sadness. [pause]\nEmotions flow through us like weather patterns—sometimes stormy, sometimes clear. [pause]\nYour feelings are valid and worthy of gentle attention. [pause]\nWould you like to explore a meditation that offers a soft holding space for whatever you're experiencing?";
      suggestions = ['Yes, hold space for me', 'How can meditation help sadness?', 'I want to talk more', 'Schedule a session'];
      setMeditationTitle('Emotional Comfort Meditation');
    }
    else if (lowerMessage.includes('happy') || lowerMessage.includes('grateful') || lowerMessage.includes('good')) {
      responseContent = "What a beautiful energy you're carrying today. [pause]\nGratitude is like sunlight for the soul—it illuminates everything it touches. [pause]\nWould you like to amplify this feeling, letting it sink deeper into your being with a gratitude practice?";
      suggestions = ['Yes, deepen this feeling', 'How to maintain this state', 'I want something different', 'Schedule for later'];
      setMeditationTitle('Gratitude Amplification');
    }
    else if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate') || lowerMessage.includes('distracted')) {
      responseContent = "Finding focus can be challenging in our busy world. [pause]\nYour awareness of needing concentration is already a mindful step. [pause]\nWould you like a short meditation to help clear your mind and sharpen your attention?";
      suggestions = ['Yes, help me focus', 'Quick concentration tips', 'I need a longer session', 'Schedule for later'];
      setMeditationTitle('Focus Enhancement');
    }
    else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('can\'t sleep')) {
      responseContent = "The night can feel so long when sleep won't come. [pause]\nYour body and mind are seeking that sweet surrender to rest. [pause]\nWould you like a gentle meditation to help prepare your whole being for deep, nourishing sleep?";
      suggestions = ['Yes, guide me to sleep', 'Tips for better sleep', 'I need something now', 'Schedule for bedtime'];
      setMeditationTitle('Sleep Preparation');
    }
    else if (lowerMessage.includes('yes') && (lowerMessage.includes('meditation') || lowerMessage.includes('breathe') || lowerMessage.includes('help') || lowerMessage.includes('focus'))) {
      // User wants to start meditation
      responseContent = "Let's begin this journey together. [pause]\nFind a position where your body feels supported and at ease. [pause]\nI'll guide you with my voice as we move through this practice. [pause]\nLet's start by arriving fully in this moment with a deep, nourishing breath. [breathe in]... [pause]... [breathe out]...";
      messageType = 'meditation';
      suggestions = [];
    }
    else if (lowerMessage.includes('schedule') || lowerMessage.includes('later') || lowerMessage.includes('reminder')) {
      responseContent = "I'd be honored to reserve this time for your future self. [pause]\nWhen would feel most nurturing for you to return to this practice?";
      suggestions = ['This evening', 'Tomorrow morning', 'Set a custom time', 'Never mind'];
    }
    else if (lowerMessage.includes('evening') || lowerMessage.includes('tonight')) {
      responseContent = "Evening practice can be so beautiful—a gentle transition between the day's activities and the night's rest. [pause]\nBefore we schedule, would you like to capture a reflection about how you're feeling in this moment?";
      suggestions = ['Yes, save a reflection', 'No, just schedule', 'Cancel scheduling'];

      // Show schedule modal
      setTimeout(() => {
        setShowScheduleModal(true);
      }, 1000);
    }
    else if (lowerMessage.includes('morning') || lowerMessage.includes('tomorrow')) {
      responseContent = "Morning meditation can set such a beautiful tone for your day. [pause]\nBefore we schedule, would you like to save a reflection about how you're feeling right now, to revisit tomorrow?";
      suggestions = ['Yes, save a reflection', 'No, just schedule', 'Cancel scheduling'];

      // Show schedule modal
      setTimeout(() => {
        setShowScheduleModal(true);
      }, 1000);
    }
    else if (lowerMessage.includes('reflection') || lowerMessage.includes('save')) {
      responseContent = "I've saved your reflection like a precious moment in time. [pause]\nThese breadcrumbs of your journey can reveal such beautiful patterns when revisited. [pause]\nYour meditation has been scheduled with care.";
      suggestions = ['Thank you', 'Start a meditation now', 'Tell me more about reflections'];

      // Simulate saving reflection to backend
      setTimeout(() => {
        toast({
          title: "Reflection Saved",
          description: "Your emotional reflection has been saved to your journal.",
          duration: 3000,
        });
      }, 1000);

      messageType = 'reflection';
    }
    else {
      // Default response for other messages
      responseContent = "I'm here with you on this meditation journey. [pause]\nWould you like to explore a practice tailored to how you're feeling right now, or would you prefer guidance on a specific aspect of meditation?";
      suggestions = ['Start a meditation', 'Help with anxiety', 'Help with focus', 'Help with sleep'];
    }

    return {
      id: generateId(),
      content: responseContent,
      sender: 'ai',
      timestamp: Date.now(),
      type: messageType,
      suggestions,
      emotion,
      showHugAnimation: showHug
    };
  };

  const detectEmotion = (message: string): 'sad' | 'anxious' | 'grateful' | 'tired' | 'energized' | 'neutral' => {
    // Simple keyword-based emotion detection
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('stress')) {
      setCurrentEmotion('anxious');
      return 'anxious';
    } else if (message.includes('tired') || message.includes('exhausted') || message.includes('no energy')) {
      setCurrentEmotion('tired');
      return 'tired';
    } else if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      setCurrentEmotion('sad');
      return 'sad';
    } else if (message.includes('happy') || message.includes('grateful') || message.includes('good') || message.includes('thankful')) {
      setCurrentEmotion('grateful');
      return 'grateful';
    } else if (message.includes('energetic') || message.includes('energized') || message.includes('motivated') || message.includes('excited')) {
      setCurrentEmotion('energized');
      return 'energized';
    } else if (message.includes('focus') || message.includes('concentrate') || message.includes('distracted')) {
      // For focus issues, we'll use the 'neutral' emotion but provide focused guidance
      setCurrentEmotion('neutral');
      return 'neutral';
    } else if (message.includes('sleep') || message.includes('insomnia')) {
      // For sleep issues, we'll use the 'tired' emotion
      setCurrentEmotion('tired');
      return 'tired';
    } else {
      setCurrentEmotion('neutral');
      return 'neutral';
    }
  };

  const handleEndMeditation = () => {
    setIsMeditating(false);

    // Update bear emotion
    setBearEmotion('happy');
    setBearMessage("Wonderful job! How do you feel after that meditation? I'm here to help you reflect on your experience.");

    // Add more soulful completion message
    const completionMessage: ChatMessage = {
      id: generateId(),
      content: "Gently returning to this moment. [pause]\nTake your time to notice any shifts in your inner landscape. [pause]\nHow does your heart feel now? Would you like to capture this feeling in a reflection, or schedule your next moment of connection?",
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      suggestions: ['Save a reflection', 'Schedule next session', 'I feel more peaceful', 'I need more guidance'],
      emotion: 'grateful'
    };

    setMessages(prev => [...prev, completionMessage]);

    // Show reflection card after a short delay
    setTimeout(() => {
      setShowReflectionCard(true);
    }, 1500);
  };

  // Function to handle schedule completion
  const handleScheduleComplete = (scheduledDate: Date, scheduledTime: string) => {
    setShowScheduleModal(false);

    // Add scheduling confirmation message
    const schedulingMessage: ChatMessage = {
      id: generateId(),
      content: `I've scheduled your ${meditationTitle} for ${scheduledTime}. I'll send you a reminder before the session.`,
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      suggestions: ['Thank you', 'Start a meditation now', 'Cancel this schedule']
    };

    setMessages(prev => [...prev, schedulingMessage]);

    // Show toast notification
    toast({
      title: "Meditation Scheduled",
      description: `Your ${meditationTitle} has been scheduled for ${scheduledTime}.`,
      duration: 3000,
    });
  };



  const handleSaveReflection = () => {
    if (reflectionText.trim() === '') {
      toast({
        title: "Reflection Empty",
        description: "Please write a short reflection before saving.",
        duration: 3000,
      });
      return;
    }

    // Add more poetic reflection message
    const reflectionMessage: ChatMessage = {
      id: generateId(),
      content: `I've saved your reflection like a precious stone in the river of your journey. [pause]\nThese moments of awareness create a beautiful mosaic over time, revealing the patterns of your growth and healing. [pause]\nThank you for sharing this piece of your heart.`,
      sender: 'ai',
      timestamp: Date.now(),
      type: 'reflection',
      suggestions: ['Thank you for holding space', 'Schedule next session', 'Start another meditation'],
      emotion: 'grateful'
    };

    setMessages(prev => [...prev, reflectionMessage]);
    setShowReflectionCard(false);

    // Simulate saving reflection to backend
    toast({
      title: "Reflection Saved",
      description: "Your emotional reflection has been saved to your journal.",
      duration: 3000,
    });

    // Show schedule modal after saving reflection
    setTimeout(() => {
      setShowScheduleModal(true);
    }, 1000);
  };



  if (!isOpen) return null;

  // Determine background gradient based on emotion
  const getEmotionBackground = () => {
    switch (currentEmotion) {
      case 'sad':
        return 'from-blue-700 to-indigo-900 bg-opacity-70'; // Foggy blue
      case 'anxious':
        return 'from-indigo-800 to-purple-900'; // Dim purple that brightens
      case 'grateful':
        return 'from-green-600 to-teal-800'; // Blooming green
      case 'tired':
        return 'from-blue-800 to-indigo-900'; // Soft blue clouds
      case 'energized':
        return 'from-amber-600 to-orange-800'; // Golden particles
      default:
        return 'from-indigo-500 to-purple-600'; // Default purple (matching screenshot)
    }
  };

  // Get animation elements based on emotion
  const getEmotionAnimations = () => {
    switch (currentEmotion) {
      case 'sad':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none bg-blue-500/5 backdrop-blur-sm"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      case 'anxious':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              backgroundColor: ['rgba(76, 29, 149, 0.1)', 'rgba(76, 29, 149, 0.2)', 'rgba(76, 29, 149, 0.1)']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      case 'grateful':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 bg-green-300/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 90],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 8,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      case 'tired':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-10 bg-blue-200/10 rounded-full blur-md"
                style={{
                  left: `${-10 + (i * 25)}%`,
                  top: `${20 + (i * 10)}%`,
                }}
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 15 + (i * 5),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );
      case 'energized':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-amber-300/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0%',
                }}
                animate={{
                  y: [0, -Math.random() * 300 - 100],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 4 + (Math.random() * 3),
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Add a function to handle emotion selection from the MoodSelector
  const handleEmotionSelect = (mood: string) => {
    // Map the mood to the appropriate emotion and message
    switch (mood) {
      case 'anxious':
        setCurrentEmotion('anxious');
        handleSuggestionClick('I feel anxious');
        setBearEmotion('calm');
        break;
      case 'tired':
        setCurrentEmotion('tired');
        handleSuggestionClick('I feel tired');
        setBearEmotion('thinking');
        break;
      case 'sad':
        setCurrentEmotion('sad');
        handleSuggestionClick('I feel sad');
        setBearEmotion('calm');
        break;
      case 'grateful':
        setCurrentEmotion('grateful');
        handleSuggestionClick('I feel grateful');
        setBearEmotion('happy');
        break;
      case 'happy':
        setCurrentEmotion('grateful');
        handleSuggestionClick('I feel happy');
        setBearEmotion('happy');
        break;
      case 'calm':
        setCurrentEmotion('neutral');
        handleSuggestionClick('I feel calm');
        setBearEmotion('calm');
        break;
      case 'focus':
        setCurrentEmotion('neutral');
        handleSuggestionClick('I need to focus');
        setBearEmotion('thinking');
        break;
      case 'motivated':
        setCurrentEmotion('energized');
        handleSuggestionClick('I feel motivated');
        setBearEmotion('happy');
        break;
      case 'confused':
        setCurrentEmotion('anxious');
        handleSuggestionClick('I feel confused');
        setBearEmotion('thinking');
        break;
      case 'frustrated':
        setCurrentEmotion('anxious');
        handleSuggestionClick('I feel frustrated');
        setBearEmotion('thinking');
        break;
      case 'loving':
        setCurrentEmotion('grateful');
        handleSuggestionClick('I feel loving');
        setBearEmotion('happy');
        break;
      case 'growing':
        setCurrentEmotion('energized');
        handleSuggestionClick('I feel like I\'m growing');
        setBearEmotion('happy');
        break;
      default:
        setCurrentEmotion('neutral');
        handleSuggestionClick('I\'m not sure how I feel');
        setBearEmotion('thinking');
    }

    // Get a new random question for next time
    setWelcomeQuestion(getRandomQuestion().text);
  };

  // State for emotion selection screen
  const [showEmotionSelection, setShowEmotionSelection] = useState(true);

  // Hide emotion selection after selecting an emotion
  useEffect(() => {
    if (messages.length > 1) {
      setShowEmotionSelection(false);
    }
  }, [messages]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${getEmotionBackground()} flex flex-col relative`}>
      {/* Emotion-based background animations */}
      {getEmotionAnimations()}

      {/* Emotion Selection Screen */}
      <AnimatePresence>
        {showEmotionSelection && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-600/90 to-indigo-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-4 left-4">
              <button
                onClick={onClose}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <ArrowLeft size={24} className="text-white" />
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">{welcomeQuestion}</h2>

            {/* Emoji Mood Selector */}
            <MoodSelector onSelect={(mood) => handleEmotionSelect(mood)} />

            {/* Continue Button */}
            <motion.div
              className="mt-8 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl text-base"
                onClick={() => setShowEmotionSelection(false)}
              >
                Continue to Meditation
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hug Animation */}
      <AnimatePresence>
        {showHugAnimation && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 0 rgba(255, 255, 255, 0.3)',
                  '0 0 0 20px rgba(255, 255, 255, 0.2)',
                  '0 0 0 40px rgba(255, 255, 255, 0.1)',
                  '0 0 0 0 rgba(255, 255, 255, 0)'
                ]
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <Heart size={48} className="text-white/70" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified Header - removed to match screenshot */}

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onClose}
          className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      {/* Bear Mascot - optimized for mobile */}
      <AnimatePresence>
        {showBearMascot && (
          <div className="absolute top-16 md:top-20 right-2 md:right-4 z-20 max-w-[120px] md:max-w-[160px]">
            <BearMascot
              emotion={bearEmotion}
              message={bearMessage}
              onAnimationComplete={() => {
                // Optional: Hide bear after some time
                // setTimeout(() => setShowBearMascot(false), 5000);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-transparent relative z-10">
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
                  className={`max-w-[85%] rounded-2xl p-3 relative ${
                    message.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-tr-none'
                      : message.type === 'breathing'
                        ? 'bg-indigo-400/30 backdrop-blur-sm text-white rounded-tl-none'
                        : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none'
                  }`}
                >
                  {/* Hug bubble animation for AI messages */}
                  {message.sender === 'ai' && message.showHugAnimation && (
                    <motion.div
                      className="absolute -inset-2 rounded-full pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(255, 255, 255, 0)',
                          '0 0 0 4px rgba(255, 255, 255, 0.2)',
                          '0 0 0 8px rgba(255, 255, 255, 0.1)',
                          '0 0 0 0 rgba(255, 255, 255, 0)'
                        ]
                      }}
                      transition={{ duration: 2, ease: "easeInOut", repeat: 1 }}
                    />
                  )}

                  {message.type === 'breathing' ? (
                    <motion.div
                      className="flex items-center justify-center py-2"
                      animate={{
                        scale: message.breathingCue === 'inhale' ? [1, 1.2] :
                               message.breathingCue === 'hold' ? 1.2 :
                               message.breathingCue === 'exhale' ? [1.2, 1] : 1
                      }}
                      transition={{
                        duration: message.duration || 4,
                        ease: "easeInOut"
                      }}
                    >
                      <p className="text-lg font-light">{message.content}</p>
                    </motion.div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">
                      {message.content.split(/(\[pause\]|\[breathe in\]|\[breathe out\])/).map((part, i) => {
                        if (part === '[pause]') {
                          return <span key={i} className="text-white/50">...</span>;
                        } else if (part === '[breathe in]') {
                          return <span key={i} className="text-white/70 font-light italic">breathe in...</span>;
                        } else if (part === '[breathe out]') {
                          return <span key={i} className="text-white/70 font-light italic">breathe out...</span>;
                        } else {
                          return <span key={i}>{part}</span>;
                        }
                      })}
                    </p>
                  )}

                  {/* Suggestions */}
                  {message.sender === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-sm bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors text-white"
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
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Meditation Controls with Breathing Light */}
      {isMeditating && (
        <div className="bg-indigo-800/50 backdrop-blur-sm p-4 flex justify-center items-center relative z-10">
          <div className="flex space-x-4 items-center">
            <Button
              onClick={handleEndMeditation}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2"
            >
              End Meditation
            </Button>

            {/* Breathing visualization with glow */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: currentBreathPhase === 'inhale' ? [1, 1.5] :
                         currentBreathPhase === 'hold' ? 1.5 :
                         currentBreathPhase === 'exhale' ? [1.5, 1] : 1,
                  boxShadow: currentBreathPhase === 'inhale' ? [
                    '0 0 0 0 rgba(255, 255, 255, 0.3)',
                    '0 0 20px 10px rgba(255, 255, 255, 0.5)'
                  ] : currentBreathPhase === 'hold' ?
                    '0 0 20px 10px rgba(255, 255, 255, 0.5)' :
                    currentBreathPhase === 'exhale' ? [
                      '0 0 20px 10px rgba(255, 255, 255, 0.5)',
                      '0 0 0 0 rgba(255, 255, 255, 0.3)'
                    ] : '0 0 0 0 rgba(255, 255, 255, 0.3)'
                }}
                transition={{
                  duration: currentBreathPhase === 'inhale' ? 4 :
                           currentBreathPhase === 'hold' ? 4 :
                           currentBreathPhase === 'exhale' ? 6 : 1,
                  ease: "easeInOut"
                }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Wind size={20} className="text-white" />
              </motion.div>
            </div>

            <div className="text-white text-sm">
              {currentBreathPhase === 'inhale' ? 'Breathe In' :
               currentBreathPhase === 'hold' ? 'Hold' :
               currentBreathPhase === 'exhale' ? 'Breathe Out' : 'Rest'}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {!isMeditating && (
        <div className="p-4 border-t border-white/10 bg-transparent relative z-10">
          <div className="max-w-md mx-auto flex">
            <button
              onClick={handleVoiceInput}
              className={`${isListening ? 'bg-red-500' : 'bg-indigo-500'} hover:opacity-90 text-white rounded-l-full px-4 py-2`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tell me how you're feeling..."
              className="flex-1 border border-white/20 bg-white/10 text-white placeholder-white/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-r-full px-4 py-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Reflection Card */}
      <AnimatePresence>
        {showReflectionCard && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl p-5 w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <PenTool size={18} className="mr-2" />
                  Save Your Reflection
                </h3>
                <button
                  onClick={() => setShowReflectionCard(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <motion.p
                    className="text-white/90 text-sm mb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Write your thoughts about today's meditation:
                  </motion.p>
                  <motion.textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Today, I felt..."
                    className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowReflectionCard(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleSaveReflection}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    Save Reflection
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          meditationTitle={meditationTitle}
          meditationDuration={meditationDuration}
          onScheduled={handleScheduleComplete}
        />
      )}
    </div>
  );
};

// Add these interfaces to make TypeScript happy with the SpeechRecognition API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default MeditationChat;
