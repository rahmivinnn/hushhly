
import React from 'react';

interface MoodIconProps {
  iconType: 'calm' | 'relax' | 'focus' | 'anxious';
}

const MoodIcon: React.FC<MoodIconProps> = ({ iconType }) => {
  switch (iconType) {
    case 'calm':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.5" fill="currentColor" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'relax':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
          <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" fill="currentColor" />
          <path d="M17 9C18.1046 9 19 8.10457 19 7C19 5.89543 18.1046 5 17 5C15.8954 5 15 5.89543 15 7C15 8.10457 15.8954 9 17 9Z" fill="currentColor" />
          <path d="M7 19C8.10457 19 9 18.1046 9 17C9 15.8954 8.10457 15 7 15C5.89543 15 5 15.8954 5 17C5 18.1046 5.89543 19 7 19Z" fill="currentColor" />
          <path d="M17 19C18.1046 19 19 18.1046 19 17C19 15.8954 18.1046 15 17 15C15.8954 15 15 15.8954 15 17C15 18.1046 15.8954 19 17 19Z" fill="currentColor" />
        </svg>
      );
    case 'focus':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'anxious':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M8 15C8.5 13.5 10 12 12 12C14 12 15.5 13.5 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7.5 9L9.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16.5 9L14.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 8V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

export default MoodIcon;
