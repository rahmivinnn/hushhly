import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, Clock, Calendar, Play, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
            description: 'Reset your mind in just 60 seconds',
            duration: '1 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'rnDiXEhkBd8'
          }
        ];
      case 'Mindful Parenting':
        return [
          {
            id: 'mp-1',
            title: 'Patience Practice',
            description: 'Cultivate patience during challenging moments',
            duration: '10 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'XqeAt45goBI'
          },
          {
            id: 'mp-2',
            title: 'Emotional Regulation',
            description: 'Techniques for managing strong emotions',
            duration: '12 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'mp-3',
            title: 'Present Moment Parenting',
            description: 'Being fully present with your children',
            duration: '15 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'U5o8UiYxfeY'
          }
        ];
      case 'Deep Sleep Recovery':
        return [
          {
            id: 'ds-1',
            title: 'Bedtime Wind-Down',
            description: 'Prepare your mind and body for deep sleep',
            duration: '20 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'rnDiXEhkBd8'
          },
          {
            id: 'ds-2',
            title: 'Racing Thoughts Relief',
            description: 'Calm an overactive mind before sleep',
            duration: '15 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'XqeAt45goBI'
          },
          {
            id: 'ds-3',
            title: 'Night Waking Meditation',
            description: 'Return to sleep after waking in the night',
            duration: '10 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'nRkP3lKj_lY'
          }
        ];
      case 'Start Your Day Calm':
        return [
          {
            id: 'sd-1',
            title: 'Morning Affirmations',
            description: 'Positive affirmations to start your day',
            duration: '8 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'sd-2',
            title: 'Grounding Practice',
            description: 'Connect with the present moment',
            duration: '10 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'rnDiXEhkBd8'
          },
          {
            id: 'sd-3',
            title: 'Intention Setting',
            description: 'Set your intentions for a mindful day',
            duration: '12 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'XqeAt45goBI'
          }
        ];
      case 'Parent–Child Bonding':
        return [
          {
            id: 'pc-1',
            title: 'Shared Breathing',
            description: 'Breathing exercises to do together',
            duration: '7 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'pc-2',
            title: 'Mindful Listening',
            description: 'Practice listening to each other fully',
            duration: '10 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          },
          {
            id: 'pc-3',
            title: 'Bedtime Connection',
            description: 'Special time before sleep',
            duration: '15 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'rnDiXEhkBd8'
          }
        ];
      case 'Emotional First Aid':
        return [
          {
            id: 'ef-1',
            title: 'Anxiety Relief',
            description: 'Techniques to reduce anxiety quickly',
            duration: '8 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'XqeAt45goBI'
          },
          {
            id: 'ef-2',
            title: 'Guilt Release',
            description: 'Let go of parental guilt and shame',
            duration: '12 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          },
          {
            id: 'ef-3',
            title: 'Frustration Diffuser',
            description: 'Calm intense frustration in the moment',
            duration: '5 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'U5o8UiYxfeY'
          }
        ];
      case 'Affirmations & Mantras':
        return [
          {
            id: 'am-1',
            title: 'Confidence Boosters',
            description: 'Affirmations to build self-confidence',
            duration: '10 Min',
            image: '/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png',
            videoId: 'rnDiXEhkBd8'
          },
          {
            id: 'am-2',
            title: 'Calming Mantras',
            description: 'Mantras for stress and anxiety',
            duration: '8 Min',
            image: '/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png',
            videoId: 'XqeAt45goBI'
          },
          {
            id: 'am-3',
            title: 'Self-Compassion Practice',
            description: 'Cultivate kindness toward yourself',
            duration: '15 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'nRkP3lKj_lY'
          }
        ];
      default:
        return [
          {
            id: 'default-1',
            title: 'Basic Meditation',
            description: 'A simple meditation practice',
            duration: '10 Min',
            image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png',
            videoId: 'U5o8UiYxfeY'
          }
        ];
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
            content: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 3-5 times for an instant reset.'
          },
          {
            id: 'qrt-2',
            title: '5-4-3-2-1 Technique',
            content: 'Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.'
          },
          {
            id: 'qrt-3',
            title: 'Hand on Heart',
            content: 'Place your hand on your heart, close your eyes, and take 3 deep breaths while focusing on the sensation of your hand.'
          }
        ];
      case 'Mindful Parenting':
        return [
          {
            id: 'mpt-1',
            title: 'Pause Before Responding',
            content: 'When feeling triggered, take a deep breath before responding to your child.'
          },
          {
            id: 'mpt-2',
            title: 'Name the Emotion',
            content: 'Help your child name their emotions: "You seem frustrated right now. Is that how you're feeling?"'
          },
          {
            id: 'mpt-3',
            title: 'Special Time',
            content: 'Set aside 10 minutes of uninterrupted, child-led play time daily to strengthen your connection.'
          }
        ];
      case 'Deep Sleep Recovery':
        return [
          {
            id: 'dst-1',
            title: 'Digital Sunset',
            content: 'Turn off all screens 1 hour before bedtime to help your brain prepare for sleep.'
          },
          {
            id: 'dst-2',
            title: 'Body Scan',
            content: 'Lying in bed, mentally scan from head to toe, relaxing each body part as you go.'
          },
          {
            id: 'dst-3',
            title: 'Sleep Environment',
            content: 'Keep your bedroom cool, dark, and quiet. Consider using white noise if helpful.'
          }
        ];
      case 'Start Your Day Calm':
        return [
          {
            id: 'sdt-1',
            title: 'Morning Mindfulness',
            content: 'Before checking your phone, take 3 deep breaths and set an intention for the day.'
          },
          {
            id: 'sdt-2',
            title: 'Gratitude Practice',
            content: 'Name three things you're grateful for before getting out of bed.'
          },
          {
            id: 'sdt-3',
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
            content: 'At dinner or bedtime, share one thing you're each grateful for from the day.'
          }
        ];
      case 'Emotional First Aid':
        return [
          {
            id: 'eft-1',
            title: 'STOP Technique',
            content: 'Stop, Take a breath, Observe how you're feeling, Proceed with awareness.'
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

  const handleStartMeditation = (meditation: Meditation) => {
    toast({
      title: `Starting ${meditation.title}`,
      description: `Beginning your ${meditation.duration} session now.`,
    });

    setTimeout(() => {
      navigate('/meditation');
    }, 1000);
  };

  const handleSchedule = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
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

    // Create a session object
    const session = {
      id: `ws-custom-${Date.now()}`,
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

    toast({
      title: "Meditation Scheduled",
      description: `${selectedMeditation.title} scheduled for ${formattedTime}`,
    });

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
        <p className="mt-2 text-sm text-white/90">{category.description}</p>
        <p className="mt-1 text-sm italic">"{category.subtext}"</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b">
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
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                      <img
                        src={meditation.image}
                        alt={meditation.title}
                        className="w-full h-full object-cover"
                      />
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
              <h2 className="text-lg font-semibold">Schedule Meditation</h2>
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
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                    <img
                      src={selectedMeditation.image}
                      alt={selectedMeditation.title}
                      className="w-full h-full object-cover"
                    />
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
                  Schedule Meditation
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
