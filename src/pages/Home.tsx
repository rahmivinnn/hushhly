import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VideoPopup from '@/components/VideoPopup';
import BottomNavigation from '@/components/BottomNavigation';
import MoodIcon from '@/components/MoodIcon';
import SideMenu from '@/components/SideMenu';
import MoodFeedbackDialog from '@/components/MoodFeedbackDialog';
import AIRecommendation from '@/components/AIRecommendation';

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
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Guest");
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<'calm' | 'relax' | 'focus' | 'anxious' | null>(null);
  const [showMoodFeedback, setShowMoodFeedback] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState<boolean>(false);

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
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
    },
    {
      title: "Cardio Meditation",
      description: "Basics of Yoga for Beginners Professionals",
      duration: "10 Min",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    }
  ];

  const quickReliefMeditations: MeditationCard[] = [
    {
      title: "Focused meditation",
      description: "Quick meditation for stress relief and focus.",
      duration: "5 Min",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
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
    navigate('/meditation');
  };

  const goToSleepStories = () => {
    navigate('/sleep-stories');
  };

  const handleMoodSelection = (moodType: 'calm' | 'relax' | 'focus' | 'anxious') => {
    setSelectedMood(moodType);
    setShowMoodFeedback(true);
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
      navigate('/meditation');
    }, 1500);
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
              src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
              alt="Shh Logo"
              className="h-8"
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
              onClick={() => navigate('/sleep-stories')}
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
        <div
          onClick={handleAIRecommendationClick}
          className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-3 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow active:opacity-90"
        >
          <div>
            <h2 className="font-medium text-sm">AI-recommended meditation for the day</h2>
            <div className="flex items-center mt-1">
              <p className="text-xs">Mindfulness meditation</p>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
          <div>
            <img src="/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png" alt="Meditation" className="w-10 h-10" />
          </div>
        </div>
      </section>

      {/* Daily Meditation */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Daily Meditation</h2>
          <button
            onClick={goToSleepStories}
            className="text-blue-500 flex items-center text-xs"
          >
            View More <ArrowRight size={12} className="ml-1" />
          </button>
        </div>

        {dailyMeditations.map((meditation, index) => (
          <div key={index} className="bg-blue-100 rounded-xl p-3 mb-2">
            <h3 className="text-sm font-medium text-gray-900">{meditation.title}</h3>
            <p className="text-xs text-gray-600 mb-1">{meditation.description}</p>
            <div className="flex items-center mb-2">
              <div className="flex items-center text-gray-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meditation.duration}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleWatchNow(meditation.title, meditation.duration)}
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
        ))}
      </section>

      {/* Quick Stress Relief */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Quick Stress Relief</h2>
          <button className="text-blue-500 flex items-center text-xs">
            View More <ArrowRight size={12} className="ml-1" />
          </button>
        </div>

        {quickReliefMeditations.map((meditation, index) => (
          <div key={index} className="bg-blue-100 rounded-xl p-3 mb-2">
            <h3 className="text-sm font-medium text-gray-900">{meditation.title}</h3>
            <p className="text-xs text-gray-600 mb-1">{meditation.description}</p>
            <div className="flex items-center mb-2">
              <div className="flex items-center text-gray-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meditation.duration}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleWatchNow(meditation.title, meditation.duration)}
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
        ))}
      </section>

      {/* Quick Access Cards */}
      <section className="px-4 mb-3 space-y-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-3 text-white cursor-pointer hover:shadow-lg transition-shadow active:opacity-90"
          onClick={() => handleQuickSessionClick("1-minute", "Quick Relaxation")}
        >
          <p className="text-xs">Quick relaxation before picking up kids</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">02:58 PM</span>
            </div>
            <button className="bg-transparent border border-white rounded-full px-2 py-0.5 text-xs flex items-center">
              1-Minute Reset <ArrowRight size={10} className="ml-1" />
            </button>
          </div>
        </div>

        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-3 text-white cursor-pointer hover:shadow-lg transition-shadow active:opacity-90"
          onClick={() => handleQuickSessionClick("5-minute", "Short Guided Session")}
        >
          <p className="text-xs">Short guided session for daily relaxation</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">5 Min</span>
            </div>
            <button className="bg-transparent border border-white rounded-full px-2 py-0.5 text-xs flex items-center">
              5-Minute Meditation <ArrowRight size={10} className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        userName={userName}
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Home;
