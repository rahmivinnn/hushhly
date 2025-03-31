
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Bell, Trophy, Home, Briefcase, Users, Moon, User } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface SessionData {
  name: string;
  date: string;
  duration: string;
}

interface GroupData {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Guest",
    email: "guest@example.com",
    avatar: "/lovable-uploads/6906fa52-fa6b-4a6a-b897-1ef2906b0def.png",
    hours: "128h",
    streak: "15",
    badges: "8"
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          ...userData,
          name: user.fullName || user.name || "Guest",
          email: user.email || "guest@example.com"
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const recentSessions: SessionData[] = [
    {
      name: "Morning Calm",
      date: "Feb 15, 8:30 AM",
      duration: "10 min"
    },
    {
      name: "Sleep Well",
      date: "Feb 14, 10:15 PM",
      duration: "20 min"
    },
    {
      name: "Stress Relief",
      date: "Feb 14, 3:45 PM",
      duration: "07 min"
    }
  ];
  
  const joinedGroups: GroupData[] = [
    {
      name: "Mindful Parenting",
      description: "Gentle parenting, emotional regulation, and fostering deep connections with your child.",
      icon: <Users size={24} className="text-white" />
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/home')}
            className="p-2"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
          
          <div className="text-center flex-1">
            <img 
              src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
              alt="Logo"
              className="h-10 mx-auto"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/notifications')}
              className="text-white"
            >
              <Bell size={24} />
            </button>
            <button className="text-yellow-400">
              <Trophy size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button 
            className="flex items-center text-white"
            onClick={() => navigate('/edit-profile')}
          >
            <Edit size={24} className="mr-2" />
            <span className="text-xl">Edit</span>
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <img 
              src={userData.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-white"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <p className="text-white/90">{userData.email}</p>
          </div>
        </div>
      </div>
      
      {/* Profile stats */}
      <div className="bg-white -mt-10 rounded-t-3xl px-6 py-8">
        <div className="flex justify-between mb-10">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-cyan-500">{userData.hours}</h3>
            <p className="text-gray-600">Total Hours</p>
          </div>
          
          <div className="text-center">
            <h3 className="text-4xl font-bold text-cyan-500">{userData.streak}</h3>
            <p className="text-gray-600">Day Streak</p>
          </div>
          
          <div className="text-center">
            <h3 className="text-4xl font-bold text-cyan-500">{userData.badges}</h3>
            <p className="text-gray-600">Badges</p>
          </div>
        </div>
        
        {/* Recent Sessions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Sessions</h3>
          
          {recentSessions.map((session, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{session.name}</h4>
                  <p className="text-gray-500">{session.date}</p>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium">{session.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Groups Joined */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Groups Joined</h3>
          
          {joinedGroups.map((group, index) => (
            <div key={index} className="flex items-start mb-4">
              <div className="bg-cyan-500 rounded-full p-3 mr-3">
                {group.icon}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{group.name}</h4>
                <p className="text-gray-600">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
