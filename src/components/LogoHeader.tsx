
import React from 'react';
import { Bell, Trophy } from 'lucide-react';

const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full px-4 py-3">
      {/* Left empty space */}
      <div className="w-8"></div>
      
      {/* Logo - perfectly centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/lovable-uploads/74349607-c389-44c3-bc1c-5adeb6c0a9df.png" alt="Hushhly logo" className="h-8" />
      </div>
      
      {/* Right side buttons */}
      <div className="flex space-x-4 ml-auto">
        <button className="text-white hover:opacity-80 transition-opacity">
          <Bell size={24} />
        </button>
        <button className="text-amber-400 hover:opacity-80 transition-opacity">
          <Trophy size={24} />
        </button>
      </div>
    </div>
  );
};

export default LogoHeader;
