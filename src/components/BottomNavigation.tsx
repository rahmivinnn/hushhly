
import React from 'react';
import { Home, Briefcase, Users, Moon, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string, label: string) => {
    navigate(path);
    toast({
      title: `${label} Section`,
      description: `Welcome to the ${label.toLowerCase()} section.`,
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-6 z-30">
      <div className="mx-auto w-11/12 max-w-md bg-gradient-to-r from-blue-500 to-blue-600 rounded-full py-3 px-4 shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleNavigation('/home', 'Home')}
            className={`transition-transform flex flex-col items-center relative ${isActive('/home') ? 'text-white scale-110' : 'text-white/80 hover:text-white'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
            {isActive('/home') && <div className="absolute -bottom-2 w-12 h-0.5 bg-white rounded-full"></div>}
          </button>

          <button
            onClick={() => handleNavigation('/meditation-dashboard', 'Meditation')}
            className={`transition-transform flex flex-col items-center relative ${isActive('/meditation-dashboard') ? 'text-white scale-110' : 'text-white/80 hover:text-white'}`}
          >
            <Briefcase size={24} />
            <span className="text-xs mt-1 font-medium">Meditation</span>
            {isActive('/meditation-dashboard') && <div className="absolute -bottom-2 w-12 h-0.5 bg-white rounded-full"></div>}
          </button>

          <button
            onClick={() => handleNavigation('/community', 'Community')}
            className={`transition-transform flex flex-col items-center relative ${isActive('/community') ? 'text-white scale-110' : 'text-white/80 hover:text-white'}`}
          >
            <Users size={24} />
            <span className="text-xs mt-1 font-medium">Community</span>
            {isActive('/community') && <div className="absolute -bottom-2 w-12 h-0.5 bg-white rounded-full"></div>}
          </button>

          <button
            onClick={() => handleNavigation('/stories', 'Stories')}
            className={`transition-transform flex flex-col items-center relative ${isActive('/stories') || isActive('/sleep-stories') ? 'text-white scale-110' : 'text-white/80 hover:text-white'}`}
          >
            <Moon size={24} />
            <span className="text-xs mt-1 font-medium">Stories</span>
            {(isActive('/stories') || isActive('/sleep-stories')) && <div className="absolute -bottom-2 w-12 h-0.5 bg-white rounded-full"></div>}
          </button>

          <button
            onClick={() => handleNavigation('/profile', 'Profile')}
            className={`transition-transform flex flex-col items-center relative ${isActive('/profile') ? 'text-white scale-110' : 'text-white/80 hover:text-white'}`}
          >
            <User size={24} />
            <span className="text-xs mt-1 font-medium">Profile</span>
            {isActive('/profile') && <div className="absolute -bottom-2 w-12 h-0.5 bg-white rounded-full"></div>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
