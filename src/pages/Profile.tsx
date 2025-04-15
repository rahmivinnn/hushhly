import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Lock, ChevronRight, Award, Clock, Calendar, BarChart2, Edit2, LogOut, Camera, Plus, Shield, Star, HelpCircle, X, CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { paymentService, SubscriptionDetails, PaymentMethod } from '@/services/paymentService';

interface UserProfile {
  fullName: string;
  email: string;
  avatar: string;
  joined: string;
  isPremium?: boolean;
  subscription?: SubscriptionDetails;
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

interface RecentSession {
  id: number;
  title: string;
  date: string;
  duration: string;
  type: string;
  completed: boolean;
}

const generateRandomIncrease = (): number => {
  return Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showRateReviewModal, setShowRateReviewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Katif",
    email: "KatifDesigns@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Katif&background=random",
    joined: "April 2023",
    stats: {
      sessionsCompleted: 42,
      streak: 7,
      totalMinutes: 630,
      longestSession: 30,
    }
  });

  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([
    {
      id: 1,
      title: "Morning Meditation",
      date: "Today, 6:30 AM",
      duration: "15 min",
      type: "Meditation",
      completed: true
    },
    {
      id: 2,
      title: "Stress Relief",
      date: "Yesterday, 7:15 PM",
      duration: "10 min",
      type: "Breathing",
      completed: true
    },
    {
      id: 3,
      title: "Deep Sleep",
      date: "May 12, 9:45 PM",
      duration: "20 min",
      type: "Sleep Story",
      completed: true
    },
    {
      id: 4,
      title: "Focus Session",
      date: "May 10, 2:30 PM",
      duration: "15 min",
      type: "Meditation",
      completed: true
    },
    {
      id: 5,
      title: "Anxiety Relief",
      date: "May 8, 10:15 AM",
      duration: "12 min",
      type: "Breathing",
      completed: true
    }
  ]);

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
          avatar: userData.avatar || 'https://ui-avatars.com/api/?name=Katif&background=random',
          subscription: userData.subscription || null,
        }));

        // Check if user has active subscription
        const hasActiveSubscription = paymentService.hasActiveSubscription(userData.email);
        setIsPremium(hasActiveSubscription);

        // Get subscription details
        const subDetails = paymentService.getSubscriptionDetails(userData.email);
        setSubscriptionDetails(subDetails);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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
    navigate('/edit-profile');
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

  const handleUpgrade = () => {
    if (isPremium && subscriptionDetails) {
      // If already premium, show subscription management options
      navigate('/subscription-management');
    } else {
      // If not premium, show payment modal
      setShowPaymentModal(true);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }

      const user = JSON.parse(userData);
      const canceled = await paymentService.cancelSubscription(user.email);

      if (canceled) {
        toast({
          title: "Subscription Canceled",
          description: "Your subscription has been canceled. You'll still have access until the end of your billing period."
        });

        // Update subscription details
        const subDetails = paymentService.getSubscriptionDetails(user.email);
        setSubscriptionDetails(subDetails);
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while canceling your subscription",
        variant: "destructive"
      });
    }
  };

  const handlePasswordSettings = () => {
    toast({
      title: "Password Settings",
      description: "Password change functionality will be available soon",
    });
  };

  const handleNotificationSettings = () => {
    navigate('/notifications');
  };

  const handlePrivacyPolicy = () => {
    setShowPrivacyModal(true);
  };

  const handleRateReview = () => {
    setShowRateReviewModal(true);
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  const processPayment = async (method: PaymentMethod = 'credit_card') => {
    setIsProcessingPayment(true);

    try {
      // Get user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }

      const user = JSON.parse(userData);

      // Process payment
      const paymentResult = await paymentService.processPayment(
        'monthly', // Default to monthly plan
        { method }
      );

      if (paymentResult.success && paymentResult.subscriptionDetails) {
        // Verify payment
        const isVerified = await paymentService.verifyPayment(paymentResult.paymentId || '');

        if (isVerified) {
          // Save subscription to user profile
          const saved = paymentService.saveSubscription(
            user.email,
            paymentResult.subscriptionDetails
          );

          if (saved) {
            setPaymentSuccess(true);
            setIsPremium(true);
            setSubscriptionDetails(paymentResult.subscriptionDetails);

            // Close modal after success messaging
            setTimeout(() => {
              setShowPaymentModal(false);
              setPaymentSuccess(false);

              toast({
                title: "Premium Activated",
                description: "Welcome to Hushhly Premium! Enjoy all features.",
              });
            }, 2000);
          } else {
            throw new Error('Failed to save subscription');
          }
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment processing",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
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

    // Add new recent session
    const now = new Date();
    const formattedDate = `Today, ${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const sessionTypes = ["Meditation", "Breathing", "Sleep Story", "Focus"];
    const sessionTitles = [
      "Morning Calm", "Stress Relief", "Deep Focus", "Evening Wind Down",
      "Anxiety Relief", "Energy Boost", "Sleep Preparation", "Quick Reset"
    ];

    const newSession: RecentSession = {
      id: Date.now(),
      title: sessionTitles[Math.floor(Math.random() * sessionTitles.length)],
      date: formattedDate,
      duration: `${Math.floor(Math.random() * 20) + 5} min`,
      type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
      completed: true
    };

    setRecentSessions(prev => [newSession, ...prev]);

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
      description: `Added a new meditation session!`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white py-3 px-4 flex items-center justify-between border-b border-gray-200">
        <button className="text-gray-600">
          <Settings size={20} />
        </button>

        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Shh"
            className="h-6"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
          </button>
          <button className="text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-6 flex items-center">
        <div className="mr-4 relative">
          <Avatar className="h-20 w-20 border-2 border-white" onClick={handleAvatarClick}>
            <AvatarImage src={userProfile.avatar} alt={userProfile.fullName} />
            <AvatarFallback>{userProfile.fullName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{userProfile.fullName}</h2>
          <p className="text-gray-600">{userProfile.email}</p>
        </div>
      </div>

      {/* Premium Membership */}
      <div className="mx-6 mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
        {isPremium && subscriptionDetails ? (
          <>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold mb-1">Premium Member</h3>
                <p className="opacity-90">{subscriptionDetails.plan === 'annual' ? 'Annual' : 'Monthly'} Plan</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {subscriptionDetails.status === 'active' ? 'Active' : 'Canceled'}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm opacity-90 mb-1">
                <span>Next billing date:</span>
                <span>{new Date(subscriptionDetails.endDate).toLocaleDateString()}</span>
              </div>
              {subscriptionDetails.status === 'canceled' && (
                <div className="text-sm bg-white/20 p-2 rounded mt-2">
                  Your subscription is canceled but remains active until the end of the billing period.
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleUpgrade}
                className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full hover:bg-blue-50 transition-colors flex-1 flex items-center justify-center"
              >
                <CreditCard size={16} className="mr-1" />
                Manage
              </button>

              {subscriptionDetails.status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  className="bg-white/20 text-white font-semibold py-2 px-4 rounded-full hover:bg-white/30 transition-colors flex-1"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-1">Premium Membership</h3>
            <p className="mb-4 opacity-90">Upgrade for more features</p>

            <button
              onClick={handleUpgrade}
              className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-blue-50 transition-colors"
            >
              Upgrade
            </button>
          </>
        )}
      </div>

      {/* Settings Section */}
      <div className="px-6 mb-4">
        <h3 className="text-xl font-bold mb-4">Setting</h3>

        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handleEditProfile}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <User size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Profile</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handlePasswordSettings}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <Lock size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Password</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handleNotificationSettings}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
              </div>
              <span className="ml-3 font-medium">Notifications</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* More Section */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-bold mb-4">More</h3>

        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handlePrivacyPolicy}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <Shield size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Privacy & Policy</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handleRateReview}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <Star size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Rate & Review</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handleHelp}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <HelpCircle size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Help</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full">
                <LogOut size={24} className="text-gray-800" />
              </div>
              <span className="ml-3 font-medium">Log out</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Recent Sessions - Added to match the request for more session data */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Recent Sessions</h3>
          <button className="text-blue-500 text-sm">View All</button>
        </div>

        <div className="space-y-3">
          {recentSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  {session.type === "Meditation" && <User size={20} className="text-blue-600" />}
                  {session.type === "Breathing" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>}
                  {session.type === "Sleep Story" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M17.5 12.5 15 15l2.5 2.5M2 20h20M2 4h20M4 8h10M4 12h6M4 16h6"></path></svg>}
                  {session.type === "Focus" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
                </div>
                <div className="ml-3">
                  <span className="font-medium">{session.title}</span>
                  <p className="text-xs text-gray-500">{session.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{session.duration}</span>
                {session.completed && (
                  <p className="text-xs text-green-500">Completed</p>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleIncreaseSessions}
            className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Start New Session
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upgrade to Premium</h2>
              <button
                onClick={() => {
                  if (!isProcessingPayment) {
                    setShowPaymentModal(false);
                  }
                }}
                className={`text-gray-500 ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isProcessingPayment}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Welcome to Hushhly Premium. You now have access to all premium features.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-blue-600 mb-1">$7.99<span className="text-gray-500 text-base font-normal">/month</span></h3>
                  <p className="text-gray-600">Get access to all premium features</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Premium includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Sleep Stories for Parents &amp; Kids
                    </li>
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      AI-Personalized Meditation Plan
                    </li>
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Mood Tracking &amp; Insights
                    </li>
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Background Sounds &amp; Music
                    </li>
                    <li className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Offline Access
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => processPayment('credit_card')}
                    disabled={isProcessingPayment}
                    className={`w-full bg-blue-600 text-white rounded-full py-3 font-medium flex items-center justify-center ${isProcessingPayment ? 'opacity-70' : 'hover:bg-blue-700'}`}
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>

                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => processPayment('apple_pay')}
                      disabled={isProcessingPayment}
                      className="flex-1 bg-black text-white rounded-full py-2 font-medium flex items-center justify-center hover:bg-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1"><path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.23 3.06-2.45a11 11 0 0 0 1.38-2.85 4.41 4.41 0 0 1-2.68-4.04z"></path></svg>
                      Apple Pay
                    </button>
                    <button
                      onClick={() => processPayment('google_pay')}
                      disabled={isProcessingPayment}
                      className="flex-1 bg-blue-500 text-white rounded-full py-2 font-medium flex items-center justify-center hover:bg-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1"><path d="M12 24c6.624 0 12-5.376 12-12s-5.376-12-12-12-12 5.376-12 12 5.376 12 12 12zm0-22.5c5.799 0 10.5 4.701 10.5 10.5s-4.701 10.5-10.5 10.5-10.5-4.701-10.5-10.5 4.701-10.5 10.5-10.5z"/><path d="M15.75 12c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-1.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z"/></svg>
                      Google Pay
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    You can cancel your subscription anytime. No refunds for partial months.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="font-semibold mb-2">1. Information We Collect</h3>
              <p className="text-sm text-gray-600 mb-4">
                We collect personal information that you provide directly to us, such as when you create an account, subscribe to our services, or contact us for support. This may include your name, email address, and payment information.
              </p>

              <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                We use the information we collect to provide, maintain, and improve our services, to process your payments, to communicate with you, and to personalize your experience.
              </p>

              <h3 className="font-semibold mb-2">3. Sharing Your Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. This does not include trusted third parties who assist us in operating our service.
              </p>

              <h3 className="font-semibold mb-2">4. Data Security</h3>
              <p className="text-sm text-gray-600 mb-4">
                We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
              </p>

              <h3 className="font-semibold mb-2">5. Your Rights</h3>
              <p className="text-sm text-gray-600 mb-4">
                You have the right to access, update, or delete your personal information at any time. You can do this by accessing your account settings or contacting us directly.
              </p>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-[#0098c1] hover:bg-[#0086ab] text-white rounded-full py-3 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate & Review Modal */}
      {showRateReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Rate & Review</h2>
              <button
                onClick={() => setShowRateReviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Enjoying Hushhly?</h3>
                <p className="text-gray-600">Let us know what you think about our app.</p>
              </div>

              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="text-yellow-400 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <textarea
                  className="w-full h-32 rounded-lg border border-gray-300 p-3 resize-none"
                  placeholder="Tell us what you like or what we could improve..."
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRateReviewModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full py-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast({
                      title: "Thank You!",
                      description: "Your review has been submitted successfully.",
                    });
                    setShowRateReviewModal(false);
                  }}
                  className="flex-1 bg-[#0098c1] hover:bg-[#0086ab] text-white rounded-full py-3 text-sm"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Help & Support</h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>

              <div className="mb-4">
                <h4 className="font-medium mb-1">How do I start a meditation session?</h4>
                <p className="text-sm text-gray-600">
                  You can start a meditation session from the Home screen by selecting any meditation card and tapping "Start Meditation", or from the Meditation tab at the bottom navigation.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-1">How do I track my progress?</h4>
                <p className="text-sm text-gray-600">
                  Your meditation progress, streaks, and stats are all available on your Profile page under the "Stats" tab.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-1">Can I download meditations for offline use?</h4>
                <p className="text-sm text-gray-600">
                  Yes, with a Premium subscription you can download meditations and sleep stories for offline listening.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-1">How do I cancel my subscription?</h4>
                <p className="text-sm text-gray-600">
                  You can manage your subscription through your app store account settings on your device.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you need further assistance, please contact our support team:
                </p>
                <p className="text-sm font-medium">support@hushhly.com</p>
              </div>
            </div>
            <div className="p-4 border-t flex space-x-3">
              <button
                onClick={() => setShowHelpModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full py-3 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast({
                    title: "Support Request Sent",
                    description: "Our team will contact you soon.",
                  });
                  setShowHelpModal(false);
                }}
                className="flex-1 bg-[#0098c1] hover:bg-[#0086ab] text-white rounded-full py-3 text-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Profile;
