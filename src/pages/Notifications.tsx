import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCircle, Calendar, Play, User, Heart, MessageSquare, Trophy, Clock, Users, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  category: 'today' | 'yesterday' | 'last_week';
  isRead: boolean;
  action?: {
    type: 'play' | 'view' | 'respond';
    label: string;
    data?: any;
  };
  image?: string;
  iconBg?: string;
  icon?: React.ReactNode;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: 'reminder',
      title: 'Take a Deep Breath!',
      message: 'Your 1-minute reset is ready. Refresh before picking up your kids.',
      category: 'today',
      timestamp: '1 hour ago',
      isRead: false,
      action: {
        type: 'play',
        label: 'Start Now',
        data: {
          title: 'Deep Breath Meditation',
          duration: '1 Min'
        }
      },
      iconBg: 'bg-blue-500',
      icon: <User className="text-white" size={20} />
    },
    {
      id: "2",
      type: 'reminder',
      title: 'Time to Unwind!',
      message: "Tonight's featured sleep story: The Whispering Forest 🌙 Tap to listen.",
      category: 'today',
      timestamp: '3 hours ago',
      isRead: false,
      action: {
        type: 'play',
        label: 'Listen Now',
        data: {
          title: 'The Whispering Forest',
          duration: '20 Min'
        }
      },
      iconBg: 'bg-blue-500',
      icon: <Clock className="text-white" size={20} />
    },
    {
      id: "3",
      type: 'reminder',
      title: 'Fresh Meditation Just for You!',
      message: 'Try our latest 5-Minute Morning Boost session and start your day right',
      category: 'today',
      timestamp: '5 hours ago',
      isRead: false,
      action: {
        type: 'play',
        label: 'Start Now',
        data: {
          title: 'Morning Boost',
          duration: '5 Min'
        }
      },
      iconBg: 'bg-blue-500',
      icon: <User className="text-white" size={20} />
    },
    {
      id: "4",
      type: 'achievement',
      title: "Don't Break Your Streak!",
      message: "You're on a 5-day meditation streak! Keep going strong.",
      category: 'yesterday',
      timestamp: 'Yesterday',
      isRead: true,
      iconBg: 'bg-blue-500',
      icon: <User className="text-white" size={20} />
    },
    {
      id: "5",
      type: 'social',
      title: 'Join the Conversation!',
      message: 'A new discussion has started in the Parent Mindfulness group. Share your thoughts!',
      category: 'last_week',
      timestamp: '3 days ago',
      isRead: true,
      iconBg: 'bg-blue-500',
      icon: <Users className="text-white" size={20} />
    },
    {
      id: "6",
      type: 'achievement',
      title: "Congrats! You've Earned a Badge!",
      message: "You just unlocked the Peaceful Parent badge. Keep up the great work!",
      category: 'last_week',
      timestamp: '5 days ago',
      isRead: true,
      iconBg: 'bg-blue-500',
      icon: <Star className="text-white" size={20} />
    }
  ]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handlePlay = (title: string, duration: string) => {
    setCurrentVideo({title, duration});
    setShowVideoPopup(true);
  };
  
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    
    toast({
      title: "All Notifications Read",
      description: "Marked all notifications as read",
    });
  };
  
  const handleAction = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? {...n, isRead: true} : n
    ));
    
    if (!notification.action) return;
    
    switch (notification.action.type) {
      case 'play':
        if (notification.action.data) {
          handlePlay(notification.action.data.title, notification.action.data.duration);
        }
        break;
      case 'view':
        toast({
          title: "View Content",
          description: "Viewing content coming soon",
        });
        break;
      case 'respond':
        toast({
          title: "Reply",
          description: "Reply feature coming soon",
        });
        break;
    }
  };
  
  // Group notifications by category
  const todayNotifications = notifications.filter(n => n.category === 'today');
  const yesterdayNotifications = notifications.filter(n => n.category === 'yesterday');
  const lastWeekNotifications = notifications.filter(n => n.category === 'last_week');
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-white py-3 px-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={handleBack} className="text-gray-600">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" 
            alt="Shh" 
            className="h-8"
          />
        </div>
        
        <button className="text-amber-500">
          <Trophy size={20} />
        </button>
      </div>
      
      {/* Title */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={handleMarkAllRead} className="text-sm text-gray-500">
          Clear All
        </button>
      </div>
      
      {/* Notifications List */}
      <div className="flex-1 px-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Notifications</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div>
            {/* Today's Notifications */}
            {todayNotifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Today</h2>
                <div className="space-y-4">
                  {todayNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="flex items-start"
                      onClick={() => handleAction(notification)}
                    >
                      <div className={`${notification.iconBg} w-14 h-14 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        {notification.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <button className="text-xs text-gray-500">
                            {notification.action?.label || "View"}
                          </button>
                          <button className="text-gray-400">
                            <span className="dots-menu"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Yesterday's Notifications */}
            {yesterdayNotifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Yesterday</h2>
                <div className="space-y-4">
                  {yesterdayNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="flex items-start"
                      onClick={() => handleAction(notification)}
                    >
                      <div className={`${notification.iconBg} w-14 h-14 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        {notification.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <button className="text-xs text-gray-500">
                            {notification.action?.label || "View"}
                          </button>
                          <button className="text-gray-400">
                            <span className="dots-menu"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Last Week's Notifications */}
            {lastWeekNotifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Last week</h2>
                <div className="space-y-4">
                  {lastWeekNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="flex items-start"
                      onClick={() => handleAction(notification)}
                    >
                      <div className={`${notification.iconBg} w-14 h-14 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        {notification.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <button className="text-xs text-gray-500">
                            {notification.action?.label || "View"}
                          </button>
                          <button className="text-gray-400">
                            <span className="dots-menu"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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

export default Notifications;
