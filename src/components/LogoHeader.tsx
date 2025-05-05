
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

      {/* Center logo with shh text */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
          alt="Shh"
          className="h-8 mb-1" style={{ filter: 'invert(30%) sepia(36%) saturate(1137%) hue-rotate(210deg) brightness(94%) contrast(85%)' }}
        />
        <img
          src="/lovable-uploads/d7f6d4c3-32de-4014-bb61-67da79c5aeef.png"
          alt="Hushhly"
          className="h-6"
        />
      </div>

      {/* Right side - empty for now to maintain spacing */}
      <div className="w-6"></div>
    </div>
  );
};

export default LogoHeader;
