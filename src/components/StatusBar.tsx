
import React from 'react';

interface StatusBarProps {
  visible?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ visible = false }) => {
  if (!visible) return null;
  
  return (
    <div className="flex justify-between items-center bg-white h-8 px-4 text-black">
      {/* Time */}
      <div className="text-xs font-medium">9:41</div>
      
      {/* Signal, Wi-Fi, Battery icons */}
      <div className="flex items-center space-x-1">
        <div className="flex space-x-0.5">
          <div className="h-2 w-0.5 bg-black rounded-sm"></div>
          <div className="h-3 w-0.5 bg-black rounded-sm"></div>
          <div className="h-4 w-0.5 bg-black rounded-sm"></div>
          <div className="h-5 w-0.5 bg-black rounded-sm"></div>
        </div>
        <div className="ml-1.5">
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7.5 7.5L14 1" stroke="black" strokeWidth="2"/>
          </svg>
        </div>
        <div className="ml-1.5">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="black"/>
            <rect x="2" y="2" width="17" height="7.5" rx="1.5" fill="black"/>
            <rect x="22" y="3.5" width="1.5" height="5" rx="0.75" fill="black"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
