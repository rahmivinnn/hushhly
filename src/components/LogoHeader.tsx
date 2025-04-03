
import React from 'react';
import { Menu } from 'lucide-react';

interface LogoHeaderProps {
  onMenuToggle?: () => void;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ onMenuToggle }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Left side - menu button */}
      <button onClick={onMenuToggle} className="p-1">
        <Menu className="h-6 w-6 text-white" />
      </button>
      
      {/* Center logo */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/d7f6d4c3-32de-4014-bb61-67da79c5aeef.png" 
          alt="Hushhly" 
          className="h-10"
        />
        {/* Small "shh" text */}
        <img 
          src="/lovable-uploads/d21c0c25-8b92-4072-9b03-fcabb669b008.png"
          alt="Shh"
          className="h-4 mt-1"
        />
      </div>
      
      {/* Right side - empty for now to maintain spacing */}
      <div className="w-6"></div>
    </div>
  );
};

export default LogoHeader;
