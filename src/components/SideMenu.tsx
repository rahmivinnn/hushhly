
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Moon, User, Settings, Heart, Info, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleNavigation = (path: string, name: string) => {
    if (path === '/profile' || path === '/meditation' || path === '/sleep-stories' || path === '/home' || path === '/community') {
      navigate(path);
    } else {
      toast({
        title: `${name} Coming Soon`,
        description: "This feature is under development.",
      });
    }
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    navigate('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-xl animate-slide-in-left p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Welcome, {userName}</h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleNavigation('/profile', 'Profile')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <User size={20} className="text-blue-500" />
            <span>Profile</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/settings', 'Settings')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Settings size={20} className="text-blue-500" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/sleep-stories', 'Sleep Stories')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Moon size={20} className="text-blue-500" />
            <span>Sleep Stories</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/meditation', 'Meditation')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Heart size={20} className="text-blue-500" />
            <span>Meditation</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/community', 'Community')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Info size={20} className="text-blue-500" />
            <span>Community</span>
          </button>
          
          <div className="border-t pt-4 mt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-50 text-red-500"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
