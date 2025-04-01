
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ArrowLeft, Award, Clock, Calendar, BarChart2, Edit2, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';

interface UserProfile {
  fullName: string;
  email: string;
  avatar: string;
  joined: string;
  stats: {
    sessionsCompleted: number;
    streak: number;
    totalMinutes: number;
    longestSession: number;
  }
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Guest User",
    email: "guest@example.com",
    avatar: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png",
    joined: "April 2023",
    stats: {
      sessionsCompleted: 42,
      streak: 7,
      totalMinutes: 630,
      longestSession: 30,
    }
  });
  
  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserProfile(prev => ({
          ...prev,
          fullName: userData.fullName || userData.name || prev.fullName,
          email: userData.email || prev.email,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing coming soon",
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    setTimeout(() => {
      navigate('/sign-in');
    }, 1000);
  };
  
  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings page coming soon",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-4 pb-16 rounded-b-[40px]">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center">
            Profile
          </h1>
          <button onClick={handleSettingsClick} className="p-2 text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="mr-4 relative">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.fullName} 
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
              <button 
                onClick={handleEditProfile}
                className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full text-white"
              >
                <Edit2 size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{userProfile.fullName}</h2>
              <p className="text-gray-500 text-sm">{userProfile.email}</p>
              <p className="text-gray-400 text-xs">Member since {userProfile.joined}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={handleEditProfile}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
            >
              <Edit2 size={14} className="mr-1" /> Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
            >
              <LogOut size={14} className="mr-1" /> Log Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold mb-3">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center text-blue-500 mb-1">
              <Award size={18} className="mr-2" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <p className="text-2xl font-semibold">{userProfile.stats.sessionsCompleted}</p>
            <p className="text-xs text-gray-500">Total sessions completed</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center text-green-500 mb-1">
              <BarChart2 size={18} className="mr-2" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-2xl font-semibold">{userProfile.stats.streak} days</p>
            <p className="text-xs text-gray-500">Current meditation streak</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center text-purple-500 mb-1">
              <Clock size={18} className="mr-2" />
              <span className="text-sm font-medium">Minutes</span>
            </div>
            <p className="text-2xl font-semibold">{userProfile.stats.totalMinutes}</p>
            <p className="text-xs text-gray-500">Total meditation time</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center text-amber-500 mb-1">
              <Calendar size={18} className="mr-2" />
              <span className="text-sm font-medium">Longest</span>
            </div>
            <p className="text-2xl font-semibold">{userProfile.stats.longestSession} min</p>
            <p className="text-xs text-gray-500">Longest meditation session</p>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="px-4 mt-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <button className="text-blue-500 text-sm">View All</button>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex space-x-4 overflow-x-auto py-2">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Award className="text-blue-500" size={28} />
              </div>
              <span className="text-xs text-gray-800 text-center">7 Day Streak</span>
            </div>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Clock className="text-green-500" size={28} />
              </div>
              <span className="text-xs text-gray-800 text-center">10 Hour Club</span>
            </div>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Calendar className="text-purple-500" size={28} />
              </div>
              <span className="text-xs text-gray-800 text-center">30 Day Journey</span>
            </div>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <User className="text-gray-400" size={28} />
              </div>
              <span className="text-xs text-gray-400 text-center">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
