import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { activityTrackingService } from '../services/activityTrackingService';
import { useAuth } from './useAuth';

export const useActivityTracking = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userId = user?.id || 'guest';
  const isInitialMount = useRef(true);
  
  // Start session when component mounts
  useEffect(() => {
    if (isInitialMount.current) {
      activityTrackingService.startSession(userId);
      isInitialMount.current = false;
      
      // Set up event listener for when user leaves the page
      const handleBeforeUnload = () => {
        activityTrackingService.endSession(userId);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        activityTrackingService.endSession(userId);
      };
    }
  }, [userId]);
  
  // Track page visits
  useEffect(() => {
    // Get page title based on route
    let pageTitle = 'Unknown Page';
    
    switch (location.pathname) {
      case '/':
      case '/splash':
        pageTitle = 'Splash Screen';
        break;
      case '/home':
        pageTitle = 'Home';
        break;
      case '/meditation':
        pageTitle = 'Meditation';
        break;
      case '/meditation-101':
        pageTitle = 'Meditation 101';
        break;
      case '/sleep-stories':
        pageTitle = 'Sleep Stories';
        break;
      case '/work':
        pageTitle = 'Your Guided Day';
        break;
      case '/community':
        pageTitle = 'Community';
        break;
      case '/profile':
        pageTitle = 'Profile';
        break;
      default:
        // Try to extract page name from path
        const pathSegments = location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          pageTitle = pathSegments[pathSegments.length - 1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
    }
    
    activityTrackingService.trackPageVisit(userId, location.pathname, pageTitle);
  }, [location.pathname, userId]);
  
  // Return methods for tracking meditation sessions
  return {
    startMeditationSession: (sessionId: string, title: string) => 
      activityTrackingService.startMeditationSession(userId, sessionId, title),
    
    endMeditationSession: (sessionId: string, completed: boolean = true) => 
      activityTrackingService.endMeditationSession(userId, sessionId, completed),
    
    getActivitySummary: () => 
      activityTrackingService.getActivitySummary(userId),
    
    getFormattedActivitySummary: () => 
      activityTrackingService.getFormattedActivitySummary(userId),
    
    getRecentPageVisits: (limit?: number) => 
      activityTrackingService.getRecentPageVisits(userId, limit),
    
    getMeditationSessions: (limit?: number) => 
      activityTrackingService.getMeditationSessions(userId, limit)
  };
};
