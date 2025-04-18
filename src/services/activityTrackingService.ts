import { User } from '../types/user';

// Define interfaces for activity tracking
export interface UserActivity {
  userId: string;
  sessionStartTime: number;
  sessionEndTime?: number;
  totalTimeToday: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  pagesVisited: PageVisit[];
  meditationSessions: MeditationSession[];
}

export interface PageVisit {
  path: string;
  title: string;
  visitTime: number;
  duration?: number;
}

export interface MeditationSession {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  completed: boolean;
}

// Storage keys
const ACTIVITY_STORAGE_KEY = 'hushhly_user_activity';
const SESSION_START_KEY = 'hushhly_session_start';
const CURRENT_PAGE_KEY = 'hushhly_current_page';

// Helper functions
const getFormattedDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const getActivityData = (userId: string): UserActivity => {
  try {
    const storedData = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (storedData) {
      const activities = JSON.parse(storedData) as Record<string, UserActivity>;
      
      // If user activity exists, return it
      if (activities[userId]) {
        return activities[userId];
      }
    }
    
    // If no data exists, create new activity record
    return {
      userId,
      sessionStartTime: Date.now(),
      totalTimeToday: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: getFormattedDate(),
      pagesVisited: [],
      meditationSessions: []
    };
  } catch (error) {
    console.error('Error getting activity data:', error);
    
    // Return default activity data
    return {
      userId,
      sessionStartTime: Date.now(),
      totalTimeToday: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: getFormattedDate(),
      pagesVisited: [],
      meditationSessions: []
    };
  }
};

const saveActivityData = (userId: string, activityData: UserActivity): void => {
  try {
    // Get existing data
    const storedData = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const activities = storedData ? JSON.parse(storedData) as Record<string, UserActivity> : {};
    
    // Update user's activity data
    activities[userId] = activityData;
    
    // Save back to localStorage
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activity data:', error);
  }
};

// Main service
export const activityTrackingService = {
  // Start tracking a new session
  startSession(userId: string): void {
    const startTime = Date.now();
    localStorage.setItem(SESSION_START_KEY, startTime.toString());
    
    const activityData = getActivityData(userId);
    
    // Check if this is a new day
    const today = getFormattedDate();
    if (activityData.lastActiveDate !== today) {
      // It's a new day, reset daily counters
      activityData.totalTimeToday = 0;
      
      // Check streak
      const yesterday = getFormattedDate(new Date(Date.now() - 86400000)); // 24 hours ago
      if (activityData.lastActiveDate === yesterday) {
        // Consecutive day, increment streak
        activityData.currentStreak += 1;
        
        // Update longest streak if needed
        if (activityData.currentStreak > activityData.longestStreak) {
          activityData.longestStreak = activityData.currentStreak;
        }
      } else {
        // Streak broken, reset to 1 (today)
        activityData.currentStreak = 1;
      }
      
      activityData.lastActiveDate = today;
    }
    
    // Increment session count
    activityData.totalSessions += 1;
    activityData.sessionStartTime = startTime;
    
    saveActivityData(userId, activityData);
  },
  
  // End the current session
  endSession(userId: string): void {
    const endTime = Date.now();
    const startTimeStr = localStorage.getItem(SESSION_START_KEY);
    
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10);
      const sessionDuration = endTime - startTime;
      
      const activityData = getActivityData(userId);
      activityData.sessionEndTime = endTime;
      activityData.totalTimeToday += sessionDuration;
      
      saveActivityData(userId, activityData);
      
      // Clear session start time
      localStorage.removeItem(SESSION_START_KEY);
    }
  },
  
  // Track page visit
  trackPageVisit(userId: string, path: string, title: string): void {
    const visitTime = Date.now();
    
    // End previous page visit if exists
    const currentPageData = localStorage.getItem(CURRENT_PAGE_KEY);
    if (currentPageData) {
      try {
        const { userId: prevUserId, path: prevPath, startTime } = JSON.parse(currentPageData);
        
        if (prevUserId === userId && prevPath !== path) {
          const activityData = getActivityData(userId);
          const duration = visitTime - startTime;
          
          // Find and update the previous page visit
          const prevPageVisitIndex = activityData.pagesVisited.findIndex(
            visit => visit.path === prevPath && !visit.duration
          );
          
          if (prevPageVisitIndex !== -1) {
            activityData.pagesVisited[prevPageVisitIndex].duration = duration;
          }
          
          saveActivityData(userId, activityData);
        }
      } catch (error) {
        console.error('Error processing previous page visit:', error);
      }
    }
    
    // Record new page visit
    const activityData = getActivityData(userId);
    activityData.pagesVisited.push({
      path,
      title,
      visitTime
    });
    
    // Keep only the last 100 page visits to avoid localStorage size issues
    if (activityData.pagesVisited.length > 100) {
      activityData.pagesVisited = activityData.pagesVisited.slice(-100);
    }
    
    saveActivityData(userId, activityData);
    
    // Set as current page
    localStorage.setItem(CURRENT_PAGE_KEY, JSON.stringify({
      userId,
      path,
      startTime: visitTime
    }));
  },
  
  // Start meditation session
  startMeditationSession(userId: string, sessionId: string, title: string): void {
    const startTime = Date.now();
    
    const activityData = getActivityData(userId);
    activityData.meditationSessions.push({
      id: sessionId,
      title,
      startTime,
      completed: false
    });
    
    saveActivityData(userId, activityData);
  },
  
  // End meditation session
  endMeditationSession(userId: string, sessionId: string, completed: boolean = true): void {
    const endTime = Date.now();
    
    const activityData = getActivityData(userId);
    const sessionIndex = activityData.meditationSessions.findIndex(
      session => session.id === sessionId && !session.endTime
    );
    
    if (sessionIndex !== -1) {
      const session = activityData.meditationSessions[sessionIndex];
      session.endTime = endTime;
      session.duration = endTime - session.startTime;
      session.completed = completed;
      
      saveActivityData(userId, activityData);
    }
  },
  
  // Get user activity summary
  getActivitySummary(userId: string): {
    totalTimeToday: number;
    totalSessions: number;
    currentStreak: number;
    longestStreak: number;
  } {
    const activityData = getActivityData(userId);
    
    return {
      totalTimeToday: activityData.totalTimeToday,
      totalSessions: activityData.totalSessions,
      currentStreak: activityData.currentStreak,
      longestStreak: activityData.longestStreak
    };
  },
  
  // Get formatted activity summary
  getFormattedActivitySummary(userId: string): {
    totalTimeToday: string;
    totalSessions: number;
    currentStreak: number;
  } {
    const { totalTimeToday, totalSessions, currentStreak } = this.getActivitySummary(userId);
    
    // Format total time as hours and minutes
    const hours = Math.floor(totalTimeToday / 3600000);
    const minutes = Math.floor((totalTimeToday % 3600000) / 60000);
    const formattedTime = hours > 0 
      ? `${hours}.${Math.floor(minutes / 6)}` // Convert to decimal hours (e.g., 1.5 hrs)
      : `${minutes} min`;
    
    return {
      totalTimeToday: formattedTime,
      totalSessions,
      currentStreak
    };
  },
  
  // Get recent page visits
  getRecentPageVisits(userId: string, limit: number = 10): PageVisit[] {
    const activityData = getActivityData(userId);
    return activityData.pagesVisited.slice(-limit).reverse();
  },
  
  // Get meditation sessions
  getMeditationSessions(userId: string, limit: number = 10): MeditationSession[] {
    const activityData = getActivityData(userId);
    return activityData.meditationSessions.slice(-limit).reverse();
  }
};
