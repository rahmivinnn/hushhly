import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, Search, Clock, Calendar, Play, Trophy, User, Plus, X, BarChart, Activity, Timer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';
import { useAuth } from '@/hooks/useAuth';
import { useActivityTracking } from '@/hooks/useActivityTracking';

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

    setCurrentVideo({title, duration, videoId});
    setShowVideoPopup(true);

    // Store session ID to end tracking when popup closes
    localStorage.setItem('current_meditation_session', sessionId);
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
              placeholder="Search work sessions"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Your Activity Stats</h2>
          <span className="text-[#0098c1] text-sm">Today</span>
        </div>
        <div className="flex space-x-3">
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">App Usage</p>
                <p className="text-xl font-semibold">{activityStats.totalTimeToday} hrs</p>
              </div>
              <Timer size={24} className="text-[#0098c1]" />
            </div>
          </div>
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Sessions</p>
                <p className="text-xl font-semibold">{activityStats.totalSessions}</p>
              </div>
              <Activity size={24} className="text-[#0098c1]" />
            </div>
          </div>
          <div className="flex-1 bg-blue-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Streak</p>
                <p className="text-xl font-semibold">{activityStats.currentStreak} days</p>
              </div>
              <Trophy size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-xs text-blue-500">
                    {activity.path === '/work' ? 'Current' : 'Visited'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-3 text-sm">No recent activity</p>
          )}
        </div>
      </div>

      {/* Today's schedule */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule ({todayDateString})</h2>
        {filteredSessions.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pb-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
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
                      onClick={() => handlePlaySession(session.title, session.duration, session.videoId)}
                      className="w-10 h-10 bg-[#0098c1] hover:bg-[#0086ab] rounded-full flex items-center justify-center text-white transform hover:scale-105 transition-transform"
                    >
                      <Play size={16} fill="white" />
                    </button>
                    <button
                      onClick={() => handleAddToCalendar(session)}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transform hover:scale-105 transition-transform"
                    >
                      <Calendar size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No sessions found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-[#0098c1] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Your scheduled sessions */}
      {calendarEvents.length > 0 && (
        <div className="px-4 mb-20">
          <h2 className="text-lg font-semibold mb-4">Your Scheduled Sessions</h2>
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
            {calendarEvents.map((event) => (
              <div
                key={event.id}
                className="bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      <span className="mr-3">{event.time}</span>
                      <span>{event.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handlePlaySession(event.title, event.duration, event.videoId)}
                      className="w-10 h-10 bg-[#0098c1] hover:bg-[#0086ab] rounded-full flex items-center justify-center text-white transform hover:scale-105 transition-transform"
                    >
                      <Play size={16} fill="white" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromCalendar(event.id)}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transform hover:scale-105 transition-transform"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Schedule New Session</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-500"
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
                  className="w-full h-10 rounded-lg border border-gray-300 px-3"
                  placeholder="Session Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newSession.description}
                  onChange={handleNewSessionInput}
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2"
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
                    className="w-full h-10 rounded-lg border border-gray-300 px-3"
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
                    className="w-full h-10 rounded-lg border border-gray-300 px-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  name="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3"
                >
                  <option value={todayDateString}>{todayDateString}</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Next Week">Next Week</option>
                </select>
              </div>

              <button
                onClick={handleSaveNewSession}
                className="w-full bg-[#0098c1] hover:bg-[#0086ab] text-white rounded-full py-3 text-sm"
              >
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}

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
