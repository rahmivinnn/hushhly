import React from 'react';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderWithLogoProps {
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showNotificationButton?: boolean;
  title?: string;
  onMenuToggle?: () => void;
  bgColor?: string;
  textColor?: string;
  logoColor?: 'blue' | 'white' | 'original';
  rightElement?: React.ReactNode;
}

/**
 * A reusable header component with properly centered logo
 * Ensures the "shh" logo is perfectly centered on all screen sizes
 */
const HeaderWithLogo: React.FC<HeaderWithLogoProps> = ({
  showBackButton = false,
  showMenuButton = false,
  showNotificationButton = false,
  title,
  onMenuToggle,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
  logoColor = 'blue',
  rightElement
}) => {
  const navigate = useNavigate();

  // Determine logo filter based on color prop
  const getLogoFilter = () => {
    switch (logoColor) {
      case 'blue':
        return { filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' };
      case 'white':
        return { filter: 'brightness(0) invert(1)' };
      default:
        return {};
    }
  };

  return (
    <header className={`${bgColor} py-3 px-4 flex items-center justify-between`}>
      {/* Left side */}
      <div className="w-10 flex items-center">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className={`${textColor} p-1 rounded-full hover:bg-gray-100`}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className={`${textColor} p-1 rounded-full hover:bg-gray-100`}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Center - Logo and optional title */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
          alt="Shh Logo"
          className="h-8 w-auto"
          style={getLogoFilter()}
        />
        {title && <h1 className={`text-sm font-medium mt-1 ${textColor}`}>{title}</h1>}
      </div>

      {/* Right side */}
      <div className="w-10 flex items-center justify-end">
        {showNotificationButton && (
          <button
            className={`${textColor} p-1 rounded-full hover:bg-gray-100`}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
        )}
        
        {rightElement && rightElement}
      </div>
    </header>
  );
};

export default HeaderWithLogo;
