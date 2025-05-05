import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, Clock, Calendar, Play, ArrowRight, Check, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import * as reminderService from '@/services/reminderService';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  videoId?: string;
}

interface Tip {
  id: string;
  title: string;
  content: string;
}

interface CategoryDetailProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    icon: string;
    title: string;
    description: string;
    subtext: string;
    color: string;
    promptTitle?: string;
    promptText?: string;
  };
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ isOpen, onClose, category }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'meditations' | 'tips'>('meditations');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('Today');

  // Generate meditations based on category
  const getMeditations = (): Meditation[] => {
    // Different meditations for each category
    switch (category.title) {
      case 'Quick Reset':
        return [
          {
            id: 'qr-1',
            title: '5-Minute Breath Focus',
            description: 'A quick reset for busy moments',
            duration: '5 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'qr-2',
            title: 'Instant Calm',
            description: 'Rapid stress relief technique',
            duration: '3 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'qr-3',
            title: 'Mindful Minute',
            description: 'Reset your nervous system quickly',
            duration: '1 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Mindful Parenting':
        return [
          {
            id: 'mp-1',
            title: 'Patience Practice',
            description: 'Cultivate patience during challenging moments',
            duration: '10 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'mp-2',
            title: 'Emotional Regulation',
            description: 'Manage your emotions during parenting challenges',
            duration: '12 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'mp-3',
            title: 'Present Moment Parenting',
            description: 'Be fully present with your children',
            duration: '15 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Deep Sleep Recovery':
        return [
          {
            id: 'dsr-1',
            title: 'Bedtime Wind-Down',
            description: 'Prepare your mind and body for deep sleep',
            duration: '20 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'dsr-2',
            title: 'Racing Thoughts Relief',
            description: 'Calm an overactive mind before sleep',
            duration: '15 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'dsr-3',
            title: 'Night Waking Rescue',
            description: 'Return to sleep after middle-of-night waking',
            duration: '10 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Start Your Day Calm':
        return [
          {
            id: 'sydc-1',
            title: 'Morning Affirmations',
            description: 'Begin your day with positive intentions',
            duration: '8 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'sydc-2',
            title: 'Grounding Practice',
            description: 'Center yourself before the day begins',
            duration: '10 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'sydc-3',
            title: 'Intention Setting',
            description: 'Set clear intentions for your day',
            duration: '12 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Parent–Child Bonding':
        return [
          {
            id: 'pcb-1',
            title: 'Shared Breathing',
            description: 'Breathe together to build connection',
            duration: '5 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'pcb-2',
            title: 'Mindful Listening',
            description: 'Practice truly hearing your child',
            duration: '8 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'pcb-3',
            title: 'Bedtime Connection',
            description: 'Create a peaceful bedtime ritual',
            duration: '10 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Emotional First Aid':
        return [
          {
            id: 'efa-1',
            title: 'Anxiety Relief',
            description: 'Calm anxiety in the moment',
            duration: '7 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'efa-2',
            title: 'Mom Guilt Antidote',
            description: 'Release parenting guilt and shame',
            duration: '12 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'efa-3',
            title: 'Frustration Release',
            description: 'Let go of building frustration',
            duration: '8 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      case 'Affirmations & Mantras':
        return [
          {
            id: 'am-1',
            title: 'Self-Worth Affirmations',
            description: 'Strengthen your sense of self-worth',
            duration: '10 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'am-2',
            title: 'Calming Mantras',
            description: 'Simple phrases to return to calm',
            duration: '8 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'am-3',
            title: 'Confidence Boosters',
            description: 'Build confidence through positive self-talk',
            duration: '12 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'c1Ndym-IsQg'
          }
        ];
      default:
        return [
          {
            id: 'default-1',
            title: 'Basic Meditation',
            description: 'A simple meditation for beginners',
            duration: '10 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          }
        ];
    }
  };

  // Get the appropriate icon for each category
  const getCategoryIcon = (categoryTitle: string): string => {
    switch (categoryTitle) {
      case 'Quick Reset':
        return '🧠';
      case 'Mindful Parenting':
        return '💞';
      case 'Deep Sleep Recovery':
        return '🌙';
      case 'Start Your Day Calm':
        return '☀️';
      case 'Parent–Child Bonding':
        return '🧸';
      case 'Emotional First Aid':
        return '🛠';
      case 'Affirmations & Mantras':
        return '🌺';
      default:
        return '🧘';
    }
  };

  // Get the appropriate color for each category
  const getCategoryColor = (categoryTitle: string): string => {
    switch (categoryTitle) {
      case 'Quick Reset':
        return 'bg-blue-500';
      case 'Mindful Parenting':
        return 'bg-pink-500';
      case 'Deep Sleep Recovery':
        return 'bg-indigo-600';
      case 'Start Your Day Calm':
        return 'bg-amber-500';
      case 'Parent–Child Bonding':
        return 'bg-green-500';
      case 'Emotional First Aid':
        return 'bg-red-500';
      case 'Affirmations & Mantras':
        return 'bg-purple-500';
      default:
        return 'bg-cyan-500';
    }
  };

  // Generate tips based on category
  const getTips = (): Tip[] => {
    switch (category.title) {
      case 'Quick Reset':
        return [
          {
            id: 'qrt-1',
            title: 'Box Breathing',
            content: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 3-5 times.'
          },
          {
            id: 'qrt-2',
            title: '5-4-3-2-1 Technique',
            content: 'Notice 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.'
          },
          {
            id: 'qrt-3',
            title: 'Hand Tracing',
            content: 'Trace your hand with your finger, breathing in as you go up each finger and out as you go down.'
          }
        ];
      case 'Mindful Parenting':
        return [
          {
            id: 'mpt-1',
            title: 'Pause Before Responding',
            content: 'Take a deep breath before responding to challenging behavior. This creates space for a thoughtful response.'
          },
          {
            id: 'mpt-2',
            title: 'Notice Your Triggers',
            content: 'Identify what triggers your stress or frustration. Awareness is the first step to responding differently.'
          },
          {
            id: 'mpt-3',
            title: 'Daily Connection Moments',
            content: 'Create small daily rituals of connection with each child, even just 2-3 minutes of focused attention.'
          }
        ];
      case 'Deep Sleep Recovery':
        return [
          {
            id: 'dsrt-1',
            title: 'Digital Sunset',
            content: 'Turn off screens 1-2 hours before bed to allow your brain to produce melatonin naturally.'
          },
          {
            id: 'dsrt-2',
            title: 'Gratitude Practice',
            content: "Name three things you're grateful for before getting out of bed."
          },
          {
            id: 'dsrt-3',
            title: 'Mindful Morning Routine',
            content: 'Choose one morning activity (brushing teeth, showering, making coffee) to do with full awareness.'
          }
        ];
      case 'Parent–Child Bonding':
        return [
          {
            id: 'pct-1',
            title: 'Mindful Walks',
            content: 'Take a "noticing walk" with your child, pointing out colors, sounds, and sensations.'
          },
          {
            id: 'pct-2',
            title: 'Breathing Buddy',
            content: 'Have your child lie down with a stuffed animal on their belly, watching it rise and fall with their breath.'
          },
          {
            id: 'pct-3',
            title: 'Gratitude Sharing',
            content: "At dinner or bedtime, share one thing you're each grateful for from the day."
          }
        ];
      case 'Emotional First Aid':
        return [
          {
            id: 'eft-1',
            title: 'STOP Technique',
            content: 'Stop, Take a breath, Observe how you\'re feeling, Proceed with awareness.'
          },
          {
            id: 'eft-2',
            title: 'Self-Compassion Break',
            content: 'Say to yourself: "This is a moment of suffering. Suffering is part of life. May I be kind to myself in this moment."'
          },
          {
            id: 'eft-3',
            title: 'Physical Reset',
            content: 'Splash cold water on your face, step outside for fresh air, or do 10 jumping jacks to shift your emotional state.'
          }
        ];
      case 'Affirmations & Mantras':
        return [
          {
            id: 'amt-1',
            title: 'Morning Affirmations',
            content: 'Start your day with: "I am enough. I am doing my best. I am worthy of love and joy."'
          },
          {
            id: 'amt-2',
            title: 'Challenging Moments Mantra',
            content: 'When stressed, repeat: "This too shall pass" or "I can handle this moment."'
          },
          {
            id: 'amt-3',
            title: 'Bedtime Reflection',
            content: 'End your day with: "I did my best today. Tomorrow is a new opportunity."'
          }
        ];
      default:
        return [
          {
            id: 'default-t1',
            title: 'Basic Mindfulness',
            content: 'Focus on your breath for a few minutes each day to build your mindfulness muscle.'
          }
        ];
    }
  };

  const meditations = getMeditations();
  const tips = getTips();

  const handleStartCategory = () => {
    // Get the first meditation for this category
    const firstMeditation = meditations[0];

    toast({
      title: `Starting ${category.promptTitle || category.title}`,
      description: `Beginning your meditation session now.`,
    });

    setTimeout(() => {
      navigate('/category-meditation-screen', {
        state: {
          title: category.promptTitle || category.title,
          category: category.title,
          duration: firstMeditation.duration
        }
      });
    }, 1000);
  };

  const handleScheduleCategory = () => {
    // Get the first meditation for this category
    const firstMeditation = meditations[0];
    setSelectedMeditation(firstMeditation);
    setShowScheduleModal(true);

    // Set a default time based on the category
    if (category.title === 'Deep Sleep Recovery') {
      setScheduledTime('21:00'); // 9:00 PM
    } else if (category.title === 'Start Your Day Calm') {
      setScheduledTime('07:00'); // 7:00 AM
      setScheduledDate('Tomorrow');
    } else {
      // Set default time to current time + 1 hour
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setScheduledTime(`${hours}:${minutes}`);
    }
  };

  const handleStartMeditation = (meditation: Meditation) => {
    toast({
      title: `Starting ${meditation.title}`,
      description: `Beginning your ${meditation.duration} session now.`,
    });

    setTimeout(() => {
      navigate('/category-meditation-screen', {
        state: {
          title: meditation.title,
          category: category.title,
          duration: meditation.duration
        }
      });
    }, 1000);
  };

  const handleSchedule = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedMeditation || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please select a time for your meditation",
      });
      return;
    }

    // Format time as 12-hour format with AM/PM
    const timeValue = scheduledTime;
    const [hourStr, minuteStr] = timeValue.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minuteStr} ${period}`;

    // Create a session object with unique ID
    const sessionId = `ws-custom-${Date.now()}`;
    const session = {
      id: sessionId,
      title: selectedMeditation.title,
      description: selectedMeditation.description,
      duration: selectedMeditation.duration,
      time: formattedTime,
      date: scheduledDate,
      image: selectedMeditation.image,
      videoId: selectedMeditation.videoId,
      completed: false
    };

    // Get existing calendar events
    const savedEvents = localStorage.getItem('workCalendarEvents');
    const calendarEvents = savedEvents ? JSON.parse(savedEvents) : [];

    // Add new session
    const newCalendarEvents = [...calendarEvents, session];

    // Save to localStorage
    localStorage.setItem('workCalendarEvents', JSON.stringify(newCalendarEvents));

    // Request notification permission if needed
    const hasPermission = await reminderService.requestNotificationPermission();

    // Schedule a reminder
    if (hasPermission) {
      reminderService.scheduleReminder(
        sessionId,
        selectedMeditation.title,
        formattedTime,
        scheduledDate,
        selectedMeditation.duration
      );

      // Custom toast messages based on category
      let toastTitle = "Meditation Scheduled";
      let toastDescription = `${selectedMeditation.title} scheduled for ${formattedTime}. You'll receive a reminder.`;

      if (category.title === 'Deep Sleep Recovery') {
        toastTitle = "Sleep Aid Scheduled";
        toastDescription = `Your sleep meditation has been scheduled for ${formattedTime}. Sweet dreams!`;
      } else if (category.title === 'Start Your Day Calm') {
        toastTitle = "Morning Meditation Scheduled";
        toastDescription = `Your morning mindset reset has been scheduled for ${formattedTime} tomorrow.`;
      } else if (category.title === 'Parent–Child Bonding') {
        toastTitle = "Family Session Scheduled";
        toastDescription = `Your family meditation has been scheduled for ${formattedTime}. Time to connect!`;
      } else if (category.title === 'Emotional First Aid') {
        toastTitle = "Emotional Check-In Scheduled";
        toastDescription = `Your emotional rescue session has been scheduled for ${formattedTime}.`;
      } else if (category.title === 'Affirmations & Mantras') {
        toastTitle = "Daily Affirmations Scheduled";
        toastDescription = `Your affirmation practice has been scheduled for ${formattedTime}.`;
      }

      toast({
        title: toastTitle,
        description: toastDescription,
      });
    } else {
      toast({
        title: "Meditation Scheduled",
        description: `${selectedMeditation.title} scheduled for ${formattedTime}. Enable notifications for reminders.`,
      });
    }

    setShowScheduleModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <header className={`${category.color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">{category.title}</h1>
          <div className="w-10"></div> {/* For balance */}
        </div>

        {/* Prompt Title and Text */}
        <h2 className="mt-3 text-lg font-medium">{category.promptTitle || category.title}</h2>
        <p className="mt-2 text-sm text-white/90">{category.promptText || category.description}</p>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <Button
            onClick={() => handleScheduleCategory()}
            className="category-schedule-button flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full py-2 text-sm flex items-center justify-center"
          >
            <Calendar size={16} className="mr-2" />
            {category.title === 'Deep Sleep Recovery' ? 'Schedule Sleep Aid' :
             category.title === 'Start Your Day Calm' ? 'Schedule for Tomorrow' :
             category.title === 'Parent–Child Bonding' ? 'Schedule Family Session' :
             category.title === 'Emotional First Aid' ? 'Schedule Check-In' :
             category.title === 'Affirmations & Mantras' ? 'Schedule Daily Reminder' :
             'Schedule Session'}
          </Button>
          <Button
            onClick={() => handleStartCategory()}
            className="flex-1 bg-white hover:bg-white/90 text-blue-600 rounded-full py-2 text-sm flex items-center justify-center"
          >
            <Play size={16} className="mr-2" fill="currentColor" />
            {category.title === 'Deep Sleep Recovery' ? 'Start Sleep Meditation' :
             category.title === 'Start Your Day Calm' ? 'Start Morning Meditation' :
             category.title === 'Parent–Child Bonding' ? 'Start Together' :
             category.title === 'Emotional First Aid' ? 'Start Emotional Recovery' :
             category.title === 'Affirmations & Mantras' ? 'Start Affirmation Session' :
             'Start Meditation'}
          </Button>
        </div>

        <Button
          onClick={onClose}
          className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full py-2 text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Categories
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex border-b mt-4">
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'meditations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('meditations')}
        >
          Meditations
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'tips'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('tips')}
        >
          Tips & Techniques
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'meditations' ? (
            <motion.div
              key="meditations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {meditations.map((meditation) => (
                <div
                  key={meditation.id}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex">
                    <div className={`w-16 h-16 rounded-lg ${getCategoryColor(category.title)} flex items-center justify-center mr-3 text-white`}>
                      <span className="text-3xl">{getCategoryIcon(category.title)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{meditation.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{meditation.description}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" />
                        <span>{meditation.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={() => handleSchedule(meditation)}
                      className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-500 rounded-full px-3 py-1 text-xs flex-1"
                    >
                      Schedule
                    </Button>
                    <Button
                      onClick={() => handleStartMeditation(meditation)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-xs flex-1 flex items-center justify-center"
                    >
                      Start Now <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {tips.map((tip) => (
                <motion.div
                  key={tip.id}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-medium text-blue-600 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-700">{tip.content}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-md shadow-lg"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {category.title === 'Deep Sleep Recovery' ? 'Schedule Sleep Aid' :
                 category.title === 'Start Your Day Calm' ? 'Schedule Morning Meditation' :
                 category.title === 'Parent–Child Bonding' ? 'Schedule Family Session' :
                 category.title === 'Emotional First Aid' ? 'Schedule Emotional Check-In' :
                 category.title === 'Affirmations & Mantras' ? 'Schedule Daily Affirmations' :
                 'Schedule Meditation'}
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {selectedMeditation && (
                <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className={`w-12 h-12 rounded-lg mr-3 flex items-center justify-center ${getCategoryColor(category.title)}`}>
                    <span className="text-2xl text-white">{getCategoryIcon(category.title)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedMeditation.title}</h3>
                    <p className="text-xs text-gray-500">{selectedMeditation.duration}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <select
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>

                <Button
                  onClick={handleSaveSchedule}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-2"
                >
                  {category.title === 'Deep Sleep Recovery' ? 'Schedule Sleep Aid' :
                   category.title === 'Start Your Day Calm' ? 'Schedule Morning Meditation' :
                   category.title === 'Parent–Child Bonding' ? 'Schedule Family Session' :
                   category.title === 'Emotional First Aid' ? 'Schedule Emotional Check-In' :
                   category.title === 'Affirmations & Mantras' ? 'Schedule Daily Affirmations' :
                   'Schedule Meditation'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
