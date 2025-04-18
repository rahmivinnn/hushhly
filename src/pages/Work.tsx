import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, Search, Clock, Calendar, Play, Trophy, User, Plus, X, BarChart, Activity, Timer, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';
import { useAuth } from '@/hooks/useAuth';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { activityTrackingService } from '@/services/activityTrackingService';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  time?: string;
  date?: string;
  image: string;
  videoId?: string;
  completed?: boolean;
}

const Work: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const activityTracking = useActivityTracking();

  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string, videoId?: string}>({title: "", duration: ""});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calendarEvents, setCalendarEvents] = useState<WorkSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<WorkSession[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [todayDateString, setTodayDateString] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [newSession, setNewSession] = useState<Partial<WorkSession>>({
    title: "",
    description: "",
    duration: "15",
    time: "",
    date: "",
    image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
  });

  // Activity stats
  const [activityStats, setActivityStats] = useState({
    totalTimeToday: "0 min",
    totalSessions: 0,
    currentStreak: 0
  });

  const [recentActivity, setRecentActivity] = useState<{path: string, title: string, time: string}[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate 100 work sessions for demonstration
  const generateWorkSessions = (): WorkSession[] => {
    const sessions: WorkSession[] = [];
    const sessionTypes = [
      "Focus Meditation",
      "Stress Relief Break",
      "Midday Mindfulness",
      "End of Workday",
      "Morning Routine",
      "Productivity Boost",
      "Meeting Preparation",
      "Anxiety Relief",
      "Deep Work Session",
      "Team Collaboration"
    ];

    const descriptions = [
      "Enhance your productivity and focus",
      "Quick break to reduce work stress",
      "Recharge your mental energy",
      "Transition from work to home",
      "Start your day with clarity",
      "Improve your output and efficiency",
      "Prepare mentally for important discussions",
      "Reduce feelings of workplace anxiety",
      "Get into flow state for complex tasks",
      "Improve team communication skills"
    ];

    const images = [
      "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
      "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
      "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    ];

    const videoIds = [
      "nRkP3lKj_lY",
      "U5o8UiYxfeY",
      "rnDiXEhkBd8",
      "XqeAt45goBI"
    ];

    const durations = ["5 Min", "10 Min", "15 Min", "20 Min", "30 Min"];

    const now = new Date();
    let time = new Date(now);
    time.setHours(8, 0, 0, 0); // Start at 8:00 AM

    for (let i = 0; i < 100; i++) {
      // Format time as h:mm AM/PM
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

      // Add 30 minutes for the next session
      time = new Date(time.getTime() + 30 * 60000);

      // Generate a session
      const typeIndex = i % sessionTypes.length;
      sessions.push({
        id: `ws-${i}`,
        title: sessionTypes[typeIndex],
        description: descriptions[typeIndex],
        duration: durations[i % durations.length],
        time: timeString,
        date: todayDateString,
        image: images[i % images.length],
        videoId: videoIds[i % videoIds.length],
        completed: false
      });
    }

    return sessions;
  };

  // Update clock and activity stats in real-time
  useEffect(() => {
    const updateClockAndStats = () => {
      const now = new Date();

      // Format time as h:mm AM/PM
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

      // Format date as Day, Month Date
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dayOfWeek = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const dateString = `${dayOfWeek}, ${month} ${date}`;
      const todayString = `Today (${month} ${date})`;

      setCurrentTime(timeString);
      setCurrentDate(dateString);
      setTodayDateString(todayString);

      // Update activity stats
      const stats = activityTracking.getFormattedActivitySummary();
      setActivityStats(stats);

      // Get recent activity
      const recentPageVisits = activityTracking.getRecentPageVisits(5);
      const formattedVisits = recentPageVisits.map(visit => {
        const visitDate = new Date(visit.visitTime);
        const visitHours = visitDate.getHours();
        const visitMinutes = visitDate.getMinutes();
        const visitAmpm = visitHours >= 12 ? 'PM' : 'AM';
        const visitFormattedHours = visitHours % 12 || 12;
        const visitFormattedMinutes = visitMinutes < 10 ? `0${visitMinutes}` : visitMinutes;
        const visitTimeString = `${visitFormattedHours}:${visitFormattedMinutes} ${visitAmpm}`;

        return {
          path: visit.path,
          title: visit.title,
          time: visitTimeString
        };
      });

      setRecentActivity(formattedVisits);

      // Check for scheduled sessions that need notifications
      calendarEvents.forEach(event => {
        const eventTime = event.time;
        if (eventTime && !event.completed) {
          // Create times for comparison, ignoring seconds
          const eventTimeObj = new Date();
          const [timeStr, period] = eventTime.split(' ');
          const [hourStr, minuteStr] = timeStr.split(':');
          let hour = parseInt(hourStr);
          if (period === 'PM' && hour < 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          const minute = parseInt(minuteStr);

          eventTimeObj.setHours(hour, minute, 0, 0);

          // Create a comparison time for current time minus 1 minute to
          // show notification for sessions coming up
          const compareTime = new Date();
          compareTime.setMinutes(compareTime.getMinutes() - 1);

          // If the event time is within the past minute
          if (eventTimeObj > compareTime && eventTimeObj <= now) {
            toast({
              title: "Meditation Reminder",
              description: `${event.title} is scheduled for now`,
            });

            // Mark as completed so we don't get repeated notifications
            const updatedEvents = calendarEvents.map(e =>
              e.id === event.id ? { ...e, completed: true } : e
            );
            setCalendarEvents(updatedEvents);
            localStorage.setItem('workCalendarEvents', JSON.stringify(updatedEvents));
          }
        }
      });
    };

    // Update immediately and then every minute
    updateClockAndStats();
    timerRef.current = setInterval(updateClockAndStats, 10000); // Update every 10 seconds for more responsive stats

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [calendarEvents, toast, activityTracking]);

  useEffect(() => {
    // Initialize filtered sessions with generated sessions
    const generatedSessions = generateWorkSessions();
    setFilteredSessions(generatedSessions);

    // Load calendar events from localStorage
    const savedEvents = localStorage.getItem('workCalendarEvents');
    if (savedEvents) {
      try {
        setCalendarEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Error loading calendar events:", error);
      }
    }
  }, [todayDateString]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlaySession = (title: string, duration: string, videoId?: string) => {
    // Track meditation session start
    const sessionId = `session_${Date.now()}`;
    activityTracking.startMeditationSession(sessionId, title);

    // Extract category from title if possible
    const categoryMatch = title.match(/^([\w\s]+) Meditation/);
    const category = categoryMatch ? categoryMatch[1] : 'default';

    // If it has a videoId, show video popup, otherwise go to meditation screen
    if (videoId) {
      setCurrentVideo({title, duration, videoId});
      setShowVideoPopup(true);
      // Store session ID to end tracking when popup closes
      localStorage.setItem('current_meditation_session', sessionId);
    } else {
      // Navigate to category meditation
      navigate('/category-meditation', {
        state: {
          title: title,
          category: category,
          duration: duration
        }
      });
    }
  };

  const handleAddToCalendar = (session: WorkSession) => {
    const sessionWithId = {
      ...session,
      id: `ws-custom-${Date.now()}`
    };

    const newCalendarEvents = [...calendarEvents, sessionWithId];
    setCalendarEvents(newCalendarEvents);

    // Save to localStorage
    localStorage.setItem('workCalendarEvents', JSON.stringify(newCalendarEvents));

    toast({
      title: "Added to Calendar",
      description: `${session.title} scheduled for ${session.time}`,
    });
  };

  const handleRemoveFromCalendar = (id: string) => {
    const updatedEvents = calendarEvents.filter(event => event.id !== id);
    setCalendarEvents(updatedEvents);

    // Save to localStorage
    localStorage.setItem('workCalendarEvents', JSON.stringify(updatedEvents));

    toast({
      title: "Removed from Calendar",
      description: "Session has been removed from your schedule",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredSessions(generateWorkSessions());
    } else {
      const allSessions = generateWorkSessions();
      const filtered = allSessions.filter(session =>
        session.title.toLowerCase().includes(query.toLowerCase()) ||
        session.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  };

  const handleNewSessionInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleNew = () => {
    setShowScheduleModal(true);
  };

  const handleSaveNewSession = () => {
    if (!newSession.title || !newSession.time) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and time",
      });
      return;
    }

    const completeSession: WorkSession = {
      id: `ws-${Date.now()}`,
      title: newSession.title || "Untitled Session",
      description: newSession.description || "No description provided",
      duration: `${newSession.duration || "15"} Min`,
      time: newSession.time,
      date: newSession.date || todayDateString,
      image: newSession.image || "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
      completed: false
    };

    const newCalendarEvents = [...calendarEvents, completeSession];
    setCalendarEvents(newCalendarEvents);

    // Save to localStorage
    localStorage.setItem('workCalendarEvents', JSON.stringify(newCalendarEvents));

    toast({
      title: "New Session Scheduled",
      description: `${completeSession.title} scheduled for ${completeSession.time}`,
    });

    // Reset form and close modal
    setNewSession({
      title: "",
      description: "",
      duration: "15",
      time: "",
      date: "",
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
    });

    setShowScheduleModal(false);
  };

  // Reset activity stats
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetStats = () => {
    setShowResetConfirm(true);
  };

  const confirmResetStats = () => {
    // Get user ID
    const userId = user?.id || 'guest';

    // Create a fresh activity record
    const freshActivity = {
      userId,
      sessionStartTime: Date.now(),
      totalTimeToday: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      pagesVisited: [],
      meditationSessions: []
    };

    // Get existing data from localStorage
    const storedData = localStorage.getItem('hushhly_user_activity');
    const activities = storedData ? JSON.parse(storedData) : {};

    // Update user's activity data
    activities[userId] = freshActivity;

    // Save back to localStorage
    localStorage.setItem('hushhly_user_activity', JSON.stringify(activities));

    // Update the stats in the UI
    setActivityStats({
      totalTimeToday: "0 min",
      totalSessions: 0,
      currentStreak: 0
    });

    // Clear recent activity
    setRecentActivity([]);

    toast({
      title: "Stats Reset",
      description: "Your activity statistics have been reset.",
    });

    setShowResetConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0098c1] to-[#4c5ab3] pt-4 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center">
            Your Guided Day <Briefcase size={18} className="ml-2" />
          </h1>
          <button
            onClick={handleScheduleNew}
            className="p-2 text-white"
          >
            <Calendar size={20} />
          </button>
        </div>

        {/* Current time display */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">{currentTime}</h2>
          <p className="text-white/80 text-sm">{currentDate}</p>
        </div>

        {/* Search box */}
        <div className="px-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meditation sessions"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        className="px-4 pt-6 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Your Activity Stats</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleResetStats}
              className="flex items-center text-xs text-gray-500 hover:text-red-500 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
            >
              <RefreshCw size={12} className="mr-1" />
              Reset Stats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">App Usage</p>
                <p className="text-xl font-semibold">{activityStats.totalTimeToday} hrs</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Timer size={20} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                <p className="text-xl font-semibold">{activityStats.totalSessions}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <Activity size={20} className="text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Streak</p>
                <p className="text-xl font-semibold">{activityStats.currentStreak} days</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <Trophy size={20} className="text-amber-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="px-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center p-3 hover:bg-gray-50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                    {activity.path === '/work' ? 'Current' : 'Visited'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">No recent activity</p>
          )}
        </div>
      </motion.div>

      {/* Today's schedule */}
      <motion.div
        className="px-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{todayDateString}</span>
        </div>

        {filteredSessions.length > 0 ? (
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-blue-600 text-lg">🧘</span>
                      </div>
                      <h3 className="font-medium">{session.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{session.description}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      <span className="mr-3">{session.time}</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handlePlaySession(session.title, session.duration, session.videoId)}
                      className="w-9 h-9 bg-[#0098c1] hover:bg-[#0086ab] rounded-full flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={15} fill="white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleAddToCalendar(session)}
                      className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar size={15} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-2">No sessions found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </motion.div>

      {/* Your scheduled sessions */}
      {calendarEvents.length > 0 && (
        <motion.div
          className="px-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your Scheduled Sessions</h2>
            <span className="text-xs text-gray-500">{calendarEvents.length} sessions</span>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {calendarEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 + (index * 0.05) }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                        <Calendar size={15} className="text-blue-600" />
                      </div>
                      <h3 className="font-medium">{event.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{event.description}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      <span className="mr-3">{event.time}</span>
                      <span>{event.duration}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handlePlaySession(event.title, event.duration, event.videoId)}
                      className="w-9 h-9 bg-[#0098c1] hover:bg-[#0086ab] rounded-full flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={15} fill="white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleRemoveFromCalendar(event.id)}
                      className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={15} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* New Session Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Schedule New Session</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newSession.title}
                    onChange={handleNewSessionInput}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Session Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newSession.description}
                    onChange={handleNewSessionInput}
                    className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Brief description"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={newSession.time?.split(' ')[0] || ""}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (timeValue) {
                          // Convert 24h format to 12h format with AM/PM
                          const [hourStr, minuteStr] = timeValue.split(':');
                          const hour = parseInt(hourStr);
                          const minute = parseInt(minuteStr);
                          const period = hour >= 12 ? 'PM' : 'AM';
                          const hour12 = hour % 12 || 12;
                          const formattedTime = `${hour12}:${minuteStr} ${period}`;

                          setNewSession(prev => ({
                            ...prev,
                            time: formattedTime
                          }));
                        }
                      }}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      max="60"
                      value={newSession.duration}
                      onChange={handleNewSessionInput}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <select
                    name="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value={todayDateString}>{todayDateString}</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-3 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewSession}
                    className="flex-1 bg-[#0098c1] hover:bg-[#0086ab] text-white rounded-full py-3 text-sm transition-colors flex items-center justify-center"
                  >
                    <Calendar size={16} className="mr-2" />
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Stats Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-sm shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 size={24} className="text-red-500" />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">Reset Activity Stats?</h2>
                <p className="text-gray-600 text-center mb-6">
                  This will reset all your activity statistics including app usage time, session count, and streak. This action cannot be undone.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full py-3 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmResetStats}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full py-3 text-sm transition-colors"
                  >
                    Reset Stats
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Popup */}
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          videoId={currentVideo.videoId}
          onClose={() => setShowVideoPopup(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Work;
