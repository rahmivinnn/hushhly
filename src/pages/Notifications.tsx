
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, MoreVertical, User, Home, Briefcase, Users, Moon } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  time: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  
  const todayNotifications: NotificationItem[] = [
    {
      id: 1,
      title: "Take a Deep Breath!",
      message: "Your 1-minute reset is ready. Refresh before picking up your kids.",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
      ),
      time: "Today"
    },
    {
      id: 2,
      title: "Time to Unwind!",
      message: "Tonight's featured sleep story: The Whispering Forest 🌙 Tap to listen.",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      ),
      time: "Today"
    },
    {
      id: 3,
      title: "Fresh Meditation Just for You!",
      message: "Try our latest 5-Minute Morning Boost session and start your day right",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
      ),
      time: "Today"
    }
  ];
  
  const yesterdayNotifications: NotificationItem[] = [
    {
      id: 4,
      title: "Don't Break Your Streak!",
      message: "You're on a 5-day meditation streak! Keep going strong.",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
      ),
      time: "Yesterday"
    }
  ];
  
  const lastWeekNotifications: NotificationItem[] = [
    {
      id: 5,
      title: "Join the Conversation!",
      message: "A new discussion has started in the Parent Mindfulness group. Share your thoughts!",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <Users size={24} className="text-white" />
        </div>
      ),
      time: "Last week"
    },
    {
      id: 6,
      title: "Congrats! You've Earned a Badge!",
      message: "You just unlocked the Peaceful Parent badge. Keep up the great work!",
      icon: (
        <div className="bg-cyan-500 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      ),
      time: "Last week"
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-1"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center flex-1">
            <img 
              src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
              alt="Logo"
              className="h-8 mx-auto"
            />
          </div>
          
          <button className="text-yellow-400">
            <Trophy size={24} />
          </button>
        </div>
      </div>
      
      {/* Notification Content */}
      <div className="flex-1 bg-white px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <button className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
          </button>
        </div>
        
        {/* Today's Notifications */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Today</h2>
          
          {todayNotifications.map((notification) => (
            <div key={notification.id} className="flex py-4 border-b border-gray-100">
              {notification.icon}
              
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
              </div>
              
              <button className="p-1 self-start">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Yesterday's Notifications */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Yesterday</h2>
          
          {yesterdayNotifications.map((notification) => (
            <div key={notification.id} className="flex py-4 border-b border-gray-100">
              {notification.icon}
              
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
              </div>
              
              <button className="p-1 self-start">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Last Week's Notifications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Last week</h2>
          
          {lastWeekNotifications.map((notification) => (
            <div key={notification.id} className="flex py-4 border-b border-gray-100">
              {notification.icon}
              
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
              </div>
              
              <button className="p-1 self-start">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
