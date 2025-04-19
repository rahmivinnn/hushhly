import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, X, Check, Calendar, Bell, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { reminderService } from '@/services/reminderService';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  meditationTitle: string;
  meditationDuration: string;
  onScheduled: (date: Date, time: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  meditationTitle,
  meditationDuration,
  onScheduled
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [remindMe, setRemindMe] = useState<boolean>(true);
  const [addToCalendar, setAddToCalendar] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(false);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Start from the current hour if today is selected
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const startHour = isToday ? currentHour : 6; // Start from 6 AM if not today
    
    for (let hour = startHour; hour < 24; hour++) {
      const isPM = hour >= 12;
      const hour12 = hour % 12 || 12;
      
      // For the current hour, only show future time slots
      const startMinute = (isToday && hour === currentHour) ? Math.ceil(currentMinute / 15) * 15 : 0;
      
      for (let minute = startMinute; minute < 60; minute += 15) {
        if (isToday && hour === currentHour && minute <= currentMinute) continue;
        
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeString = `${hour12}:${formattedMinute} ${isPM ? 'PM' : 'AM'}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Set default time to 30 minutes from now
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      const hour = now.getHours() % 12 || 12;
      const minute = Math.ceil(now.getMinutes() / 15) * 15;
      const formattedMinute = (minute % 60).toString().padStart(2, '0');
      const period = now.getHours() >= 12 ? 'PM' : 'AM';
      
      setSelectedTime(`${hour}:${formattedMinute} ${period}`);
      
      // Check notification permission
      if ('Notification' in window) {
        setHasNotificationPermission(Notification.permission === 'granted');
      }
    }
  }, [isOpen]);

  // Handle date selection
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
    
    // Reset time slots when date changes
    setSelectedTime('');
  };

  // Handle time selection
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasNotificationPermission(permission === 'granted');
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive reminders for your scheduled meditations.",
        });
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You won't receive reminders for your scheduled meditations.",
        });
      }
    }
  };

  // Add to Google Calendar
  const addToGoogleCalendar = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Parse the selected time
    const [timeStr, period] = selectedTime.split(' ');
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    // Create start and end dates
    const startDate = new Date(selectedDate);
    startDate.setHours(hour, minute, 0, 0);
    
    // Parse duration (e.g., "15 Min" -> 15)
    const durationMinutes = parseInt(meditationDuration.split(' ')[0]);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);
    
    // Format dates for Google Calendar URL
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Create Google Calendar URL
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Hushhly: ${meditationTitle}`)}&details=${encodeURIComponent(`${meditationDuration} meditation session`)}&dates=${startDateStr}/${endDateStr}&ctz=${encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)}`;
    
    // Open Google Calendar in a new tab
    window.open(url, '_blank');
  };

  // Handle schedule submission
  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your meditation.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the selected time
      const [timeStr, period] = selectedTime.split(' ');
      const [hourStr, minuteStr] = timeStr.split(':');
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      // Create a date object for the scheduled time
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hour, minute, 0, 0);
      
      // Format date and time for display
      const formattedDate = scheduledDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
      // Generate a unique ID for this meditation session
      const sessionId = `meditation-${Date.now()}`;
      
      // Save to local storage
      const savedSessions = localStorage.getItem('scheduled_meditations') || '[]';
      const sessions = JSON.parse(savedSessions);
      
      sessions.push({
        id: sessionId,
        title: meditationTitle,
        duration: meditationDuration,
        date: formattedDate,
        time: formattedTime,
        timestamp: scheduledDate.getTime(),
        completed: false,
      });
      
      localStorage.setItem('scheduled_meditations', JSON.stringify(sessions));
      
      // Schedule reminder if enabled
      if (remindMe && hasNotificationPermission) {
        reminderService.scheduleReminder(
          sessionId,
          meditationTitle,
          formattedTime,
          formattedDate,
          meditationDuration
        );
      }
      
      // Add to Google Calendar if enabled
      if (addToCalendar) {
        addToGoogleCalendar();
      }
      
      // Call the onScheduled callback
      onScheduled(scheduledDate, formattedTime);
      
      // Show success toast
      toast({
        title: "Meditation Scheduled",
        description: `${meditationTitle} scheduled for ${formattedDate} at ${formattedTime}.`,
      });
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error scheduling meditation:', error);
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your meditation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Schedule Meditation</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Meditation Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-700">{meditationTitle}</h3>
            <p className="text-sm text-blue-600">{meditationDuration} session</p>
          </div>
          
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon size={16} className="text-gray-500" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              />
            </div>
          </div>
          
          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelection(time)}
                  className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          {/* Options */}
          <div className="space-y-4 mb-6">
            {/* Reminder Option */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell size={18} className="text-gray-700 mr-2" />
                <span className="text-sm text-gray-700">Remind me</span>
              </div>
              <button
                onClick={() => {
                  if (!hasNotificationPermission && !remindMe) {
                    requestNotificationPermission();
                  }
                  setRemindMe(!remindMe);
                }}
                className={`w-12 h-6 rounded-full transition-colors ${
                  remindMe ? 'bg-blue-500' : 'bg-gray-300'
                } relative`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                    remindMe ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Google Calendar Option */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-700 mr-2" />
                <span className="text-sm text-gray-700">Add to Google Calendar</span>
              </div>
              <button
                onClick={() => setAddToCalendar(!addToCalendar)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  addToCalendar ? 'bg-blue-500' : 'bg-gray-300'
                } relative`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                    addToCalendar ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  <span>Scheduling...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check size={16} className="mr-2" />
                  <span>Schedule</span>
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleModal;
