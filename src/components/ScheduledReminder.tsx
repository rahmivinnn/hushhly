import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Moon, Clock } from 'lucide-react';

interface ScheduledReminderProps {
  // Optional callback for when a reminder is shown
  onReminderShown?: () => void;
}

const ScheduledReminder: React.FC<ScheduledReminderProps> = ({ onReminderShown }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [lastUsedTime, setLastUsedTime] = useState<number | null>(null);
  const [lastReminderTime, setLastReminderTime] = useState<number | null>(null);

  useEffect(() => {
    // Load last used time from localStorage
    const storedLastUsedTime = localStorage.getItem('hushhly_last_used_time');
    if (storedLastUsedTime) {
      setLastUsedTime(parseInt(storedLastUsedTime, 10));
    }

    // Load last reminder time from localStorage
    const storedLastReminderTime = localStorage.getItem('hushhly_last_reminder_time');
    if (storedLastReminderTime) {
      setLastReminderTime(parseInt(storedLastReminderTime, 10));
    }

    // Update last used time
    const currentTime = Date.now();
    localStorage.setItem('hushhly_last_used_time', currentTime.toString());
    setLastUsedTime(currentTime);

    // Check if we should show bedtime story reminder
    checkBedtimeStoryReminder();
    
    // Check if we should show sleep reminder
    checkSleepReminder();
    
    // Check if we should show inactivity reminder
    checkInactivityReminder();

    // Set up interval to check reminders every minute
    const intervalId = setInterval(() => {
      checkBedtimeStoryReminder();
      checkSleepReminder();
    }, 60000); // Check every minute

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkBedtimeStoryReminder = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Check if it's around 7 PM (19:00)
    if (hours === 19 && minutes >= 0 && minutes <= 5) {
      // Check if we haven't shown this reminder in the last hour
      const lastReminderTimeForBedtime = localStorage.getItem('hushhly_last_bedtime_story_reminder');
      const currentTime = Date.now();
      
      if (!lastReminderTimeForBedtime || (currentTime - parseInt(lastReminderTimeForBedtime, 10)) > 3600000) {
        // Show bedtime story reminder
        const toastInstance = toast({
          title: "Bedtime Story Time",
          description: "It's time for your bedtime story. Would you like to listen now?",
          action: (
            <button 
              onClick={() => {
                navigate('/sleep-stories');
                toastInstance.dismiss();
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
            >
              Open Stories
            </button>
          ),
          duration: 10000, // 10 seconds
        });
        
        // Update last reminder time
        localStorage.setItem('hushhly_last_bedtime_story_reminder', currentTime.toString());
        
        // Call the callback if provided
        if (onReminderShown) {
          onReminderShown();
        }
      }
    }
  };

  const checkSleepReminder = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Check if it's around 8 PM (20:00)
    if (hours === 20 && minutes >= 0 && minutes <= 5) {
      // Check if we haven't shown this reminder in the last hour
      const lastReminderTimeForSleep = localStorage.getItem('hushhly_last_sleep_reminder');
      const currentTime = Date.now();
      
      if (!lastReminderTimeForSleep || (currentTime - parseInt(lastReminderTimeForSleep, 10)) > 3600000) {
        // Show sleep reminder
        const toastInstance = toast({
          title: "Time to Sleep",
          description: "It's getting late. Time to prepare for sleep and rest well.",
          action: (
            <button 
              onClick={() => {
                navigate('/sleep-stories');
                toastInstance.dismiss();
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
            >
              Sleep Stories
            </button>
          ),
          duration: 10000, // 10 seconds
        });
        
        // Update last reminder time
        localStorage.setItem('hushhly_last_sleep_reminder', currentTime.toString());
        
        // Call the callback if provided
        if (onReminderShown) {
          onReminderShown();
        }
      }
    }
  };

  const checkInactivityReminder = () => {
    if (!lastUsedTime) return;
    
    const currentTime = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    
    // If the user hasn't used the app for 2 days and we haven't shown a reminder in the last day
    if (
      currentTime - lastUsedTime > twoDaysInMs && 
      (!lastReminderTime || currentTime - lastReminderTime > 24 * 60 * 60 * 1000)
    ) {
      // Show inactivity reminder
      const toastInstance = toast({
        title: "We Miss You!",
        description: "It's been a while since your last meditation. Take a moment for yourself today.",
        action: (
          <button 
            onClick={() => {
              navigate('/meditation');
              toastInstance.dismiss();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
          >
            Meditate Now
          </button>
        ),
        duration: 0, // Don't auto-dismiss
      });
      
      // Update last reminder time
      const newReminderTime = Date.now();
      localStorage.setItem('hushhly_last_reminder_time', newReminderTime.toString());
      setLastReminderTime(newReminderTime);
      
      // Call the callback if provided
      if (onReminderShown) {
        onReminderShown();
      }
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default ScheduledReminder;
