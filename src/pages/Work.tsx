
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, Search, Clock, Calendar, Play, Trophy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LogoHeader from '@/components/LogoHeader';
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';

interface WorkSession {
  title: string;
  description: string;
  duration: string;
  time?: string;
  date?: string;
  image: string;
}

const Work: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  
  const workSessions: WorkSession[] = [
    {
      title: "Focus Meditation",
      description: "Enhance your productivity and focus",
      duration: "15 Min",
      time: "9:00 AM",
      date: "Today",
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
    },
    {
      title: "Stress Relief Break",
      description: "Quick break to reduce work stress",
      duration: "5 Min",
      time: "11:30 AM",
      date: "Today",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
    },
    {
      title: "Midday Mindfulness",
      description: "Recharge your mental energy",
      duration: "10 Min",
      time: "1:00 PM",
      date: "Today",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    },
    {
      title: "End of Workday",
      description: "Transition from work to home",
      duration: "15 Min",
      time: "5:00 PM",
      date: "Today",
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
    }
  ];
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handlePlaySession = (title: string, duration: string) => {
    setCurrentVideo({title, duration});
    setShowVideoPopup(true);
  };
  
  const handleAddToCalendar = (session: WorkSession) => {
    toast({
      title: "Added to Calendar",
      description: `${session.title} scheduled for ${session.time}`,
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center">
            Work Meditation <Briefcase size={18} className="ml-2" />
          </h1>
          <div className="w-8"></div>
        </div>
        
        {/* Search box */}
        <div className="px-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search work sessions"
              className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Your Work Stats</h2>
          <span className="text-blue-500 text-sm">This Week</span>
        </div>
        <div className="flex space-x-3">
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Focus Time</p>
                <p className="text-xl font-semibold">3.5 hrs</p>
              </div>
              <Clock size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Sessions</p>
                <p className="text-xl font-semibold">12</p>
              </div>
              <Calendar size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Streak</p>
                <p className="text-xl font-semibold">5 days</p>
              </div>
              <Trophy size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's schedule */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          {workSessions.map((session, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock size={12} className="mr-1" />
                    <span className="mr-3">{session.time}</span>
                    <span>{session.duration}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handlePlaySession(session.title, session.duration)}
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"
                  >
                    <Play size={16} />
                  </button>
                  <button 
                    onClick={() => handleAddToCalendar(session)}
                    className="w-10 h-10 border border-blue-500 rounded-full flex items-center justify-center text-blue-500"
                  >
                    <Calendar size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4 rounded-xl text-white">
            <h3 className="font-medium">Productivity Boost</h3>
            <p className="text-sm text-white/90 mb-3">10-minute morning routine to maximize your workday</p>
            <button 
              onClick={() => handlePlaySession("Productivity Boost", "10 Min")}
              className="bg-white text-blue-500 px-4 py-1.5 rounded-full text-sm flex items-center w-32"
            >
              Start Now <Play size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-4 rounded-xl text-white">
            <h3 className="font-medium">Meeting Preparation</h3>
            <p className="text-sm text-white/90 mb-3">5-minute meditation to prepare for important meetings</p>
            <button 
              onClick={() => handlePlaySession("Meeting Preparation", "5 Min")}
              className="bg-white text-purple-500 px-4 py-1.5 rounded-full text-sm flex items-center w-32"
            >
              Start Now <Play size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
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

export default Work;
