import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, ArrowRight, Calendar, Play, Clock, Sparkles, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VideoPopup from '@/components/VideoPopup';
import BottomNavigation from '@/components/BottomNavigation';
import MoodIcon from '@/components/MoodIcon';
import SideMenu from '@/components/SideMenu';
import MoodFeedbackDialog from '@/components/MoodFeedbackDialog';
import MoodSelectionDialog from '@/components/MoodSelectionDialog';
import AIRecommendation from '@/components/AIRecommendation';
import FeaturesPopup from '@/components/FeaturesPopup';
import CategoryDetail from '@/components/CategoryDetail';
import { motion } from 'framer-motion';

interface MoodOption {
  icon: React.ReactNode;
  label: string;
  color: string;
  type: 'calm' | 'relax' | 'focus' | 'anxious';
}

interface MeditationCard {
  title: string;
  description: string;
  duration: string;
  image: string;
  icon?: string;
}

interface CategoryCard {
  icon: string;
  title: string;
  description: string;
  subtext: string;
  color: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Guest");
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<'calm' | 'relax' | 'focus' | 'anxious' | 'overwhelmed' | 'tired' | null>(null);
  const [showMoodFeedback, setShowMoodFeedback] = useState<boolean>(false);
  const [showMoodSelection, setShowMoodSelection] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState<boolean>(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryCard | null>(null);

  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.fullName) {
          setUserName(userData.fullName);
        } else if (userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Check if this is the first time the app is being opened in this session
    const isFirstVisit = sessionStorage.getItem('app_visited') !== 'true';

    // Only check for popups on the first visit in this session
    if (isFirstVisit) {
      // Mark that the app has been visited in this session
      sessionStorage.setItem('app_visited', 'true');

      // Check if popups have been shown before (across all sessions)
      const featuresPopupShown = localStorage.getItem('features_popup_shown');
      const moodPopupShown = localStorage.getItem('mood_popup_shown');

      // Only show the features popup if it hasn't been shown before
      if (!featuresPopupShown) {
        setShowFeaturesPopup(true);
        localStorage.setItem('features_popup_shown', 'true');
      }

      // Only show the mood selection popup if it hasn't been shown before
      // and features popup has been shown
      if (!moodPopupShown && featuresPopupShown) {
        setShowMoodSelection(true);
        localStorage.setItem('mood_popup_shown', 'true');
      }
    }
  }, []);

  const moodOptions: MoodOption[] = [
    {
      icon: <MoodIcon iconType="calm" />,
      label: "Calm",
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      type: "calm"
    },
    {
      icon: <MoodIcon iconType="relax" />,
      label: "Relax",
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      type: "relax"
    },
    {
      icon: <MoodIcon iconType="focus" />,
      label: "Focus",
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      type: "focus"
    },
    {
      icon: <MoodIcon iconType="anxious" />,
      label: "Anxious",
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
      type: "anxious"
    }
  ];

  const dailyMeditations: MeditationCard[] = [
    {
      title: "Meditation 101",
      description: "Techniques, Benefits, and a Beginner's How-To",
      duration: "15 Min",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
      icon: "🧘"
    },
    {
      title: "Cardio Meditation",
      description: "Basics of Yoga for Beginners Professionals",
      duration: "10 Min",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
      icon: "🧘"
    }
  ];

  const quickReliefMeditations: MeditationCard[] = [
    {
      title: "5-Minute Breath Focus",
      description: "A quick reset for busy moments",
      duration: "5 Min",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
      icon: "🧠"
    },
    {
      title: "Instant Calm",
      description: "Rapid stress relief technique",
      duration: "3 Min",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
      icon: "🧠"
    },
    {
      title: "Mindful Minute",
      description: "Reset your nervous system quickly",
      duration: "1 Min",
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
      icon: "🧠"
    }
  ];

  const categoryCards: CategoryCard[] = [
    {
      icon: "🧠",
      title: "Quick Reset",
      description: "For overwhelmed moments, school runs, or toddler tantrums.",
      subtext: "Breathe and reset in under 5 minutes.",
      color: "bg-gradient-to-r from-blue-400 to-blue-500"
    },
    {
      icon: "💞",
      title: "Mindful Parenting",
      description: "For patience, emotional regulation, and presence with kids.",
      subtext: "Show up grounded, even on the messy days.",
      color: "bg-gradient-to-r from-pink-400 to-pink-500"
    },
    {
      icon: "🌙",
      title: "Deep Sleep Recovery",
      description: "For bedtime wind-down, racing thoughts, or night wakings.",
      subtext: "Let go of the day and drift into deep rest.",
      color: "bg-gradient-to-r from-indigo-400 to-indigo-600"
    },
    {
      icon: "☀️",
      title: "Start Your Day Calm",
      description: "Morning affirmations, grounding meditations, or intention-setting.",
      subtext: "Begin with clarity, not chaos.",
      color: "bg-gradient-to-r from-amber-400 to-amber-500"
    },
    {
      icon: "🧸",
      title: "Parent–Child Bonding",
      description: "Shared meditations, breathing games, or bedtime stories.",
      subtext: "Connect through calm.",
      color: "bg-gradient-to-r from-green-400 to-green-500"
    },
    {
      icon: "🛠",
      title: "Emotional First Aid",
      description: "For anxiety, mom guilt, frustration, or when you're touched out.",
      subtext: "Press pause and recalibrate.",
      color: "bg-gradient-to-r from-red-400 to-red-500"
    },
    {
      icon: "🌺",
      title: "Affirmations & Mantras",
      description: "For mental clarity, confidence, or emotional support.",
      subtext: "Reframe your thoughts, reclaim your calm.",
      color: "bg-gradient-to-r from-purple-400 to-purple-500"
    }
  ];

  const handleWatchNow = (title: string, duration: string) => {
    if (title === "Meditation 101") {
      navigate('/meditation-101');
    } else {
      setCurrentVideo({title, duration});
      setShowVideoPopup(true);
    }
  };

  const handleStartMeditation = () => {
    navigate('/category-meditation', {
      state: {
        title: "Meditation 101",
        category: "default",
        duration: "15 Min"
      }
    });
  };

  const goToSleepStories = () => {
    navigate('/stories');
  };

  const handleMoodSelection = (moodType: 'calm' | 'relax' | 'focus' | 'anxious') => {
    setSelectedMood(moodType);

    // Check if mood feedback has been shown in this session
    const moodFeedbackShown = sessionStorage.getItem('mood_feedback_shown') === 'true';

    // Only show the mood feedback dialog once per session
    if (!moodFeedbackShown) {
      setShowMoodFeedback(true);
      sessionStorage.setItem('mood_feedback_shown', 'true');
    } else {
      // Just show a toast instead
      toast({
        title: `Feeling ${moodType}`,
        description: "We've updated your recommendations based on your mood.",
      });
    }
  };

  const handleMoodSelectionFromDialog = (mood: 'overwhelmed' | 'calm' | 'exhausted' | 'anxious' | 'tired') => {
    // Map the mood from the dialog to the mood types used in the app
    let mappedMood: 'calm' | 'relax' | 'focus' | 'anxious';

    switch(mood) {
      case 'overwhelmed':
      case 'exhausted':
        mappedMood = 'focus';
        break;
      case 'anxious':
        mappedMood = 'anxious';
        break;
      case 'tired':
        mappedMood = 'relax';
        break;
      case 'calm':
      default:
        mappedMood = 'calm';
        break;
    }

    setSelectedMood(mappedMood);

    // Mark that mood feedback has been shown in this session
    sessionStorage.setItem('mood_feedback_shown', 'true');
    setShowMoodFeedback(true);
  };

  // Function to open the mood selection dialog
  const openMoodSelectionDialog = () => {
    setShowMoodSelection(true);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleNotificationClick = () => {
    if (!showNotification) {
      setShowNotification(true);
      toast({
        title: "New Notification",
        description: "You have a meditation session scheduled in 30 minutes!",
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleAIRecommendationClick = () => {
    setShowAIRecommendation(true);
  };

  const handleQuickSessionClick = (duration: string, title: string) => {
    toast({
      title: `${title}`,
      description: `Starting your ${duration} session now.`,
    });

    setTimeout(() => {
      navigate('/category-meditation', {
        state: {
          title: title,
          category: 'Quick Reset',
          duration: duration
        }
      });
    }, 1500);
  };

  const handleScheduleSession = (category: string) => {
    // Create a default meditation for this category
    const meditation = {
      id: `${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: `${category} Meditation`,
      description: `A meditation session for ${category}`,
      duration: '15 Min',
      image: '/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png'
    };

    // Get current time and add 30 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${hour12}:${formattedMinutes} ${period}`;

    // Create a session object
    const session = {
      id: `ws-custom-${Date.now()}`,
      title: meditation.title,
      description: meditation.description,
      duration: meditation.duration,
      time: formattedTime,
      date: 'Today',
      image: meditation.image,
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
      title: `${category} Scheduled`,
      description: `Your ${category} meditation has been scheduled for ${formattedTime}`,
    });

    // Navigate to work page to show the scheduled session
    setTimeout(() => {
      navigate('/work');
    }, 1000);
  };

  const handleStartNow = (category: string) => {
    toast({
      title: `Starting ${category}`,
      description: `Beginning your ${category} session now.`,
    });

    setTimeout(() => {
      navigate('/category-meditation', {
        state: {
          title: `${category} Meditation`,
          category: category,
          duration: '15 Min'
        }
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-y-auto pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <button
            className="p-2 text-gray-800"
            onClick={toggleSideMenu}
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>

          <div className="flex items-center">
            <img
              src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
              alt="Shh Logo"
              className="h-8 filter brightness-0 saturate-100 invert-[.25] sepia-[.6] saturate-[8] hue-rotate-[270deg]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              className={`text-gray-800 ${showNotification ? 'animate-bounce' : ''}`}
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
            </button>
            <button
              className="text-yellow-500"
              onClick={() => navigate('/stories')}
            >
              <Moon size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="px-4 pt-1 pb-3">
        <h1 className="text-xl font-semibold text-gray-900">Welcome back, {userName}!</h1>
        <p className="text-gray-600 text-sm">How are you feeling today?</p>

        <div className="flex justify-between mt-3">
          {moodOptions.map((mood, index) => (
            <button
              key={index}
              className={`flex flex-col items-center ${mood.color} w-14 h-14 rounded-2xl text-white p-1 transition-transform hover:scale-105 active:scale-95`}
              aria-label={`Feeling ${mood.label}`}
              onClick={() => handleMoodSelection(mood.type)}
            >
              <div className="mb-1 text-white">{mood.icon}</div>
              <span className="text-xs">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section className="px-4 mb-3">
        <motion.div
          onClick={() => navigate('/ai-meditation')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-3 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow active:opacity-90"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div>
            <h2 className="font-medium text-sm flex items-center">
              <Sparkles size={14} className="mr-1" />
              AI-powered meditation guide
            </h2>
            <div className="flex items-center mt-1">
              <p className="text-xs">Personalized recommendations</p>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <Brain size={24} className="text-white" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Meditation Categories</h2>
          <button
            onClick={goToSleepStories}
            className="text-blue-500 flex items-center text-xs"
          >
            View All <ArrowRight size={12} className="ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {categoryCards.map((category, index) => (
            <motion.div
              key={index}
              className={`${category.color} rounded-xl p-3 text-white cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex items-start mb-1">
                <span className="text-2xl mr-2">{category.icon}</span>
                <div>
                  <h3 className="text-sm font-medium">{category.title}</h3>
                  <p className="text-xs text-white/90">{category.description}</p>
                </div>
              </div>
              <p className="text-xs italic text-white/80 mb-2">"{category.subtext}"</p>

              <div className="flex space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the category detail
                    handleScheduleSession(category.title);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full px-3 py-1 text-xs flex-1"
                >
                  <Calendar size={12} className="mr-1" />
                  Schedule
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the category detail
                    handleStartNow(category.title);
                  }}
                  className="bg-white hover:bg-white/90 text-blue-600 rounded-full px-3 py-1 text-xs flex-1 flex items-center justify-center"
                >
                  <Play size={12} className="mr-1" fill="currentColor" />
                  Start Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Meditation - Keeping one card as example */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Today's Recommendation</h2>
          <button
            onClick={goToSleepStories}
            className="text-blue-500 flex items-center text-xs"
          >
            More <ArrowRight size={12} className="ml-1" />
          </button>
        </div>

        <div className="bg-blue-100 rounded-xl p-3 mb-2">
          <h3 className="text-sm font-medium text-gray-900">{dailyMeditations[0].icon} {dailyMeditations[0].title}</h3>
          <p className="text-xs text-gray-600 mb-1">{dailyMeditations[0].description}</p>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-gray-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {dailyMeditations[0].duration}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleWatchNow(dailyMeditations[0].title, dailyMeditations[0].duration)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-xs flex items-center"
            >
              Watch Now <div className="ml-1 p-0.5 bg-white rounded-full"><ArrowRight size={10} className="text-blue-500" /></div>
            </Button>
            <Button
              onClick={handleStartMeditation}
              className="bg-white hover:bg-gray-100 text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs"
            >
              Start Meditation
            </Button>
          </div>
        </div>
      </section>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        userName={userName}
      />

      {/* Mood Selection Dialog - only shown when user clicks the button */}
      <MoodSelectionDialog
        isOpen={showMoodSelection}
        onClose={() => setShowMoodSelection(false)}
        onSelectMood={handleMoodSelectionFromDialog}
      />

      {/* Mood Feedback Dialog */}
      <MoodFeedbackDialog
        isOpen={showMoodFeedback}
        onClose={() => setShowMoodFeedback(false)}
        selectedMood={selectedMood}
      />

      {/* AI Recommendation */}
      {showAIRecommendation && (
        <AIRecommendation onClose={() => setShowAIRecommendation(false)} />
      )}

      {/* Video Popup */}
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          onClose={() => setShowVideoPopup(false)}
        />
      )}

      {/* Features Popup */}
      <FeaturesPopup
        isOpen={showFeaturesPopup}
        onClose={() => {
          setShowFeaturesPopup(false);
          // Only show mood selection if it hasn't been shown before
          // AND this is the first visit in this session
          const isFirstVisit = sessionStorage.getItem('app_visited') === 'true';
          if (isFirstVisit && !localStorage.getItem('mood_popup_shown')) {
            setShowMoodSelection(true);
            localStorage.setItem('mood_popup_shown', 'true');
          }
        }}
      />

      {/* Category Detail */}
      {selectedCategory && (
        <CategoryDetail
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Home;
