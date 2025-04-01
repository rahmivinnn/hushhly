
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCircle, Calendar, Play, User, Heart, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    type: 'play' | 'view' | 'respond';
    label: string;
    data?: any;
  };
  image?: string;
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
      title: 'Meditation Reminder',
      message: 'Time for your daily meditation session',
      timestamp: '1 hour ago',
      isRead: false,
      action: {
        type: 'play',
        label: 'Start Now',
        data: {
          title: 'Daily Meditation',
          duration: '15 Min'
        }
      },
      image: "/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png"
    },
    {
      id: "2",
      type: 'achievement',
      title: 'New Achievement Unlocked',
      message: 'Congratulations! You completed a 7-day meditation streak',
      timestamp: '2 hours ago',
      isRead: true,
      image: "/lovable-uploads/b1f1e2a8-90e5-40f7-b499-00798b4a4ae9.png"
    },
    {
      id: "3",
      type: 'social',
      title: 'Sarah liked your post',
      message: 'Sarah Johnson liked your post about morning meditation',
      timestamp: 'Yesterday',
      isRead: false,
      image: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png"
    },
    {
      id: "4",
      type: 'system',
      title: 'New Sleep Story Added',
      message: 'Check out our new sleep story "Ocean Waves" to help you drift off',
      timestamp: '2 days ago',
      isRead: true,
      action: {
        type: 'play',
        label: 'Listen Now',
        data: {
          title: 'Ocean Waves',
          duration: '30 Min'
        }
      },
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    },
    {
      id: "5",
      type: 'social',
      title: 'Michael commented on your progress',
      message: 'Michael Chen: "Great job on maintaining your meditation routine!"',
      timestamp: '3 days ago',
      isRead: true,
      action: {
        type: 'respond',
        label: 'Reply'
      },
      image: "/lovable-uploads/e58f1270-59e3-4ee3-973d-f1c45cb79dee.png"
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
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="text-blue-500" />;
      case 'achievement':
        return <CheckCircle className="text-green-500" />;
      case 'social':
        return <Heart className="text-red-500" />;
      case 'system':
        return <Bell className="text-purple-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-4 pb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center">
            Notifications
          </h1>
          <button onClick={handleMarkAllRead} className="p-2 text-white text-xs">
            Mark All Read
          </button>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="flex-1 px-4 pt-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Notifications</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                  notification.isRead 
                    ? 'border-gray-200' 
                    : notification.type === 'reminder' 
                      ? 'border-blue-500' 
                      : notification.type === 'achievement'
                        ? 'border-green-500'
                        : notification.type === 'social'
                          ? 'border-red-500'
                          : 'border-purple-500'
                }`}
              >
                <div className="flex">
                  <div className="mr-3">
                    {notification.image ? (
                      <img 
                        src={notification.image} 
                        alt={notification.title} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-black'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                    
                    <p className={`text-sm my-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    {notification.action && (
                      <button 
                        onClick={() => handleAction(notification)}
                        className={`mt-2 text-sm font-medium flex items-center ${
                          notification.action.type === 'play' 
                            ? 'text-blue-500' 
                            : notification.action.type === 'view'
                              ? 'text-purple-500'
                              : 'text-green-500'
                        }`}
                      >
                        {notification.action.type === 'play' && <Play size={14} className="mr-1" />}
                        {notification.action.type === 'view' && <User size={14} className="mr-1" />}
                        {notification.action.type === 'respond' && <MessageSquare size={14} className="mr-1" />}
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
