
import React from 'react';

interface MoodIconProps {
  iconType: 'calm' | 'relax' | 'focus' | 'anxious';
}

const MoodIcon: React.FC<MoodIconProps> = ({ iconType }) => {
  switch (iconType) {
    case 'calm':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12C12 9.23858 13.7909 7 16 7C18.2091 7 20 9.23858 20 12C20 14.7614 18.2091 17 16 17C13.7909 17 12 14.7614 12 12Z" fill="currentColor"/>
          <path d="M12 12C12 14.7614 10.2091 17 8 17C5.79086 17 4 14.7614 4 12C4 9.23858 5.79086 7 8 7C10.2091 7 12 9.23858 12 12Z" fill="currentColor"/>
          <circle cx="8" cy="10" r="1" fill="white"/>
          <circle cx="16" cy="14" r="1" fill="white"/>
        </svg>
      );
    case 'relax':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C13.3132 4 14.6136 4.25866 15.8268 4.7612C17.0401 5.26375 18.1425 6.00035 19.0711 6.92893C19.9997 7.85752 20.7362 8.95991 21.2388 10.1732C21.7413 11.3864 22 12.6868 22 14C22 15.3132 21.7413 16.6136 21.2388 17.8268C20.7362 19.0401 19.9997 20.1425 19.0711 21.0711C18.1425 21.9997 17.0401 22.7362 15.8268 23.2388C14.6136 23.7413 13.3132 24 12 24C9.34784 24 6.8043 22.9464 4.92893 21.0711C3.05357 19.1957 2 16.6522 2 14C2 11.3478 3.05357 8.8043 4.92893 6.92893C6.8043 5.05357 9.34784 4 12 4Z" fill="currentColor"/>
          <path d="M8 8C10.2091 8 12 9.79086 12 12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12C4 9.79086 5.79086 8 8 8Z" fill="white"/>
          <path d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8Z" fill="white"/>
          <path d="M12 16C14.2091 16 16 17.7909 16 20C16 22.2091 14.2091 24 12 24C9.79086 24 8 22.2091 8 20C8 17.7909 9.79086 16 12 16Z" fill="white"/>
        </svg>
      );
    case 'focus':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
          <path d="M12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7Z" fill="currentColor"/>
          <path d="M17 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7956 4 19V17C4 16.2044 4.31607 15.4413 4.87868 14.8787C5.44129 14.3161 6.20435 14 7 14H17C17.7956 14 18.5587 14.3161 19.1213 14.8787C19.6839 15.4413 20 16.2044 20 17V19C20 19.7956 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7956 22 17 22Z" fill="currentColor"/>
          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="currentColor"/>
        </svg>
      );
    case 'anxious':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 19L19 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5 15.5L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="currentColor"/>
          <path d="M5 22V19C5 17.9391 5.42143 16.9217 6.17157 16.1716C6.92172 15.4214 7.93913 15 9 15H15C16.0609 15 17.0783 15.4214 17.8284 16.1716" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

export default MoodIcon;
