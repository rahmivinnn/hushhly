// reminderService.ts
// This service handles reminders for scheduled meditation sessions

// Check for permissions to show notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show a notification
export const showNotification = (title: string, options: NotificationOptions = {}) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png',
      ...options
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// Schedule a reminder for a meditation session
export const scheduleReminder = (
  id: string,
  title: string,
  timeString: string,
  dateString: string,
  duration: string
) => {
  // Parse the time string (format: "12:30 PM")
  const [timeValue, period] = timeString.split(' ');
  const [hourStr, minuteStr] = timeValue.split(':');
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  // Convert to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  // Create date object for the reminder time
  const now = new Date();
  const reminderDate = new Date();

  // Set the date based on dateString
  if (dateString === 'Tomorrow') {
    reminderDate.setDate(now.getDate() + 1);
  } else if (dateString === 'Next Week') {
    reminderDate.setDate(now.getDate() + 7);
  }

  // Set the time
  reminderDate.setHours(hour, minute, 0, 0);

  // Calculate time until reminder in milliseconds
  const timeUntilReminder = reminderDate.getTime() - now.getTime();

  // Only schedule if the time is in the future
  if (timeUntilReminder > 0) {
    // Store the reminder in localStorage
    const reminders = JSON.parse(localStorage.getItem('meditation_reminders') || '[]');
    reminders.push({
      id,
      title,
      time: timeString,
      date: dateString,
      duration,
      reminderTime: reminderDate.getTime(),
    });
    localStorage.setItem('meditation_reminders', JSON.stringify(reminders));

    // Set a timeout to show the notification
    setTimeout(() => {
      showNotification(`Time for your meditation: ${title}`, {
        body: `Your ${duration} meditation session is scheduled to start now.`,
        tag: id,
      });

      // Remove the reminder from storage after it's triggered
      const currentReminders = JSON.parse(localStorage.getItem('meditation_reminders') || '[]');
      const updatedReminders = currentReminders.filter((reminder: any) => reminder.id !== id);
      localStorage.setItem('meditation_reminders', JSON.stringify(updatedReminders));
    }, timeUntilReminder);

    // Also set a reminder 5 minutes before
    if (timeUntilReminder > 5 * 60 * 1000) {
      setTimeout(() => {
        showNotification(`Meditation reminder: ${title}`, {
          body: `Your ${duration} meditation session starts in 5 minutes.`,
          tag: `${id}-pre`,
        });
      }, timeUntilReminder - 5 * 60 * 1000);
    }

    return true;
  }

  return false;
};

// Check for upcoming reminders and schedule them
export const initializeReminders = () => {
  const reminders = JSON.parse(localStorage.getItem('meditation_reminders') || '[]');
  const now = new Date().getTime();

  reminders.forEach((reminder: any) => {
    const timeUntilReminder = reminder.reminderTime - now;
    
    if (timeUntilReminder > 0) {
      // Reschedule the reminder
      setTimeout(() => {
        showNotification(`Time for your meditation: ${reminder.title}`, {
          body: `Your ${reminder.duration} meditation session is scheduled to start now.`,
          tag: reminder.id,
        });

        // Remove the reminder from storage after it's triggered
        const currentReminders = JSON.parse(localStorage.getItem('meditation_reminders') || '[]');
        const updatedReminders = currentReminders.filter((r: any) => r.id !== reminder.id);
        localStorage.setItem('meditation_reminders', JSON.stringify(updatedReminders));
      }, timeUntilReminder);

      // Also set a reminder 5 minutes before if there's enough time
      if (timeUntilReminder > 5 * 60 * 1000) {
        setTimeout(() => {
          showNotification(`Meditation reminder: ${reminder.title}`, {
            body: `Your ${reminder.duration} meditation session starts in 5 minutes.`,
            tag: `${reminder.id}-pre`,
          });
        }, timeUntilReminder - 5 * 60 * 1000);
      }
    } else {
      // Remove expired reminders
      const currentReminders = JSON.parse(localStorage.getItem('meditation_reminders') || '[]');
      const updatedReminders = currentReminders.filter((r: any) => r.id !== reminder.id);
      localStorage.setItem('meditation_reminders', JSON.stringify(updatedReminders));
    }
  });
};

// Check for inactivity and show a reminder
let inactivityTimer: NodeJS.Timeout | null = null;
const INACTIVITY_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const startInactivityTracking = () => {
  // Clear any existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Set last activity time
  localStorage.setItem('last_activity_time', Date.now().toString());

  // Set a timer to check for inactivity
  inactivityTimer = setTimeout(checkInactivity, INACTIVITY_THRESHOLD);

  // Reset the timer on user activity
  const resetTimer = () => {
    localStorage.setItem('last_activity_time', Date.now().toString());
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(checkInactivity, INACTIVITY_THRESHOLD);
  };

  // Add event listeners for user activity
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  window.addEventListener('touchstart', resetTimer);
  window.addEventListener('scroll', resetTimer);
};

const checkInactivity = () => {
  const lastActivityTime = parseInt(localStorage.getItem('last_activity_time') || '0');
  const now = Date.now();
  const inactiveTime = now - lastActivityTime;

  if (inactiveTime >= INACTIVITY_THRESHOLD) {
    showNotification('Missing your meditation?', {
      body: 'It\'s been a while since your last meditation. Take a moment to center yourself today.',
      tag: 'inactivity-reminder',
    });
  }

  // Reset the timer
  inactivityTimer = setTimeout(checkInactivity, INACTIVITY_THRESHOLD);
};

// Initialize the reminder service
export const initializeReminderService = () => {
  requestNotificationPermission();
  initializeReminders();
  startInactivityTracking();
};

const reminderService = {
  requestNotificationPermission,
  showNotification,
  scheduleReminder,
  initializeReminders,
  startInactivityTracking,
  initializeReminderService
};

export default reminderService;
