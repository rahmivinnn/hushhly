import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ArrowLeft, Award, Clock, Calendar, BarChart2, Edit2, LogOut, Camera, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface Achievement {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
  progress?: number;
  description: string;
}

const generateRandomIncrease = (): number => {
  return Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');

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

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "7day",
      title: "7 Day Streak",
      icon: <Award className="text-blue-500" size={28} />,
      color: "bg-blue-100",
      completed: true,
      description: "Complete meditation sessions 7 days in a row"
    },
    {
      id: "10hour",
      title: "10 Hour Club",
      icon: <Clock className="text-green-500" size={28} />,
      color: "bg-green-100",
      completed: true,
      progress: 100,
      description: "Complete 10 hours of meditation"
    },
    {
      id: "30day",
      title: "30 Day Journey",
      icon: <Calendar className="text-purple-500" size={28} />,
      color: "bg-purple-100",
      completed: false,
      progress: 23,
      description: "Complete a 30-day meditation program"
    },
    {
      id: "master",
      title: "Meditation Master",
      icon: <User className="text-amber-500" size={28} />,
      color: "bg-amber-100",
      completed: false,
      progress: 45,
      description: "Complete 100 meditation sessions"
    },
    {
      id: "night",
      title: "Night Owl",
      icon: <Clock className="text-indigo-500" size={28} />,
      color: "bg-indigo-100",
      completed: false,
      progress: 60,
      description: "Complete 10 evening meditation sessions"
    }
  ]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserProfile(prev => ({
          ...prev,
          fullName: userData.fullName || userData.name || prev.fullName,
          email: userData.email || prev.email,
          avatar: userData.avatar || prev.avatar,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatar = event.target?.result as string;
        setUserProfile(prev => ({
          ...prev,
          avatar: newAvatar
        }));
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            userData.avatar = newAvatar;
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (error) {
            console.error("Error updating avatar:", error);
          }
        }
        
        toast({
          title: "Profile Updated",
          description: "Your profile picture has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEditProfile = () => {
    const newName = prompt("Enter your new name:", userProfile.fullName);
    if (newName && newName.trim() !== "") {
      setUserProfile(prev => ({
        ...prev,
        fullName: newName
      }));
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userData.fullName = newName;
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("Error updating name:", error);
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    }
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

  const handleIncreaseStreak = () => {
    setUserProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        streak: prev.stats.streak + 1
      }
    }));
    
    toast({
      title: "Streak Increased!",
      description: `You're now on a ${userProfile.stats.streak + 1} day streak!`,
    });
  };

  const handleIncreaseSessions = () => {
    const increase = generateRandomIncrease();
    setUserProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        sessionsCompleted: prev.stats.sessionsCompleted + increase,
        totalMinutes: prev.stats.totalMinutes + (increase * 15)
      }
    }));
    
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === "master") {
          const newProgress = Math.min(100, (achievement.progress || 0) + 5);
          return { ...achievement, progress: newProgress, completed: newProgress >= 100 };
        }
        return achievement;
      })
    );
    
    toast({
      title: "Sessions Updated",
      description: `Added ${increase} new meditation sessions!`,
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 pt-4 pb-16 rounded-b-[40px]">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" 
              alt="Shh" 
              className="h-6 mb-1"
            />
            <h1 className="text-xl font-semibold text-white">Profile</h1>
          </div>
          
          <button onClick={handleSettingsClick} className="p-2 text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      <div className="px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="mr-4 relative">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full text-white"
              >
                <Camera size={14} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
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
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Edit2 size={14} className="mr-1" /> Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} className="mr-1" /> Log Out
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4 mt-6">
        <Tabs defaultValue="stats" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center text-blue-500 mb-1">
                  <Award size={18} className="mr-2" />
                  <span className="text-sm font-medium">Sessions</span>
                </div>
                <div className="flex items-end">
                  <p className="text-2xl font-semibold">{userProfile.stats.sessionsCompleted}</p>
                  <button 
                    onClick={handleIncreaseSessions}
                    className="ml-2 text-xs bg-blue-100 text-blue-500 p-1 rounded"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Total sessions completed</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center text-green-500 mb-1">
                  <BarChart2 size={18} className="mr-2" />
                  <span className="text-sm font-medium">Streak</span>
                </div>
                <div className="flex items-end">
                  <p className="text-2xl font-semibold">{userProfile.stats.streak} days</p>
                  <button 
                    onClick={handleIncreaseStreak}
                    className="ml-2 text-xs bg-green-100 text-green-500 p-1 rounded"
                  >
                    <Plus size={12} />
                  </button>
                </div>
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
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`bg-white p-4 rounded-xl shadow-sm ${achievement.completed ? 'border-2 border-green-500' : ''}`}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full ${achievement.color} flex items-center justify-center mb-2`}>
                    {achievement.icon}
                  </div>
                  <h3 className="text-center text-sm font-medium">{achievement.title}</h3>
                  
                  {achievement.progress !== undefined && achievement.progress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {achievement.completed ? (
                    <div className="mt-1 text-center text-xs text-green-500">Completed!</div>
                  ) : (
                    <div className="mt-1 text-center text-xs text-gray-500">
                      {achievement.progress ? `${achievement.progress}% complete` : 'In progress'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-medium mb-3">Recent Sessions</h3>
              
              <div className="space-y-3">
                <div className="flex items-center p-2 border-b border-gray-100">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Clock size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Morning Calm</p>
                    <p className="text-xs text-gray-500">Today, 8:15 AM • 15 min</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 border-b border-gray-100">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Clock size={16} className="text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Focus Time</p>
                    <p className="text-xs text-gray-500">Yesterday, 1:30 PM • 10 min</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 border-b border-gray-100">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Clock size={16} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sleep Meditation</p>
                    <p className="text-xs text-gray-500">Yesterday, 10:45 PM • 15 min</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 border-b border-gray-100">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Anxiety Relief</p>
                    <p className="text-xs text-gray-500">2 days ago, 4:20 PM • 20 min</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Clock size={16} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Deep Relaxation</p>
                    <p className="text-xs text-gray-500">3 days ago, 9:00 AM • 15 min</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                View All History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
