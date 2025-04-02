
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Moon, User, Settings, Heart, Info, LogOut, Home, Award, Users, Briefcase, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white shadow-xl animate-slide-in-left p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-blue-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white">{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">Welcome, {userName}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleNavigation('/home')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Home size={20} className="text-blue-500" />
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/profile')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <User size={20} className="text-blue-500" />
            <span>Profile</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/community')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Users size={20} className="text-blue-500" />
            <span>Community</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/work')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Briefcase size={20} className="text-blue-500" />
            <span>Work Meditation</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/sleep-stories')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Moon size={20} className="text-blue-500" />
            <span>Sleep Stories</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/meditation')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Heart size={20} className="text-blue-500" />
            <span>Meditation</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/notifications')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Bell size={20} className="text-blue-500" />
            <span>Notifications</span>
          </button>
          
          <button 
            onClick={() => {
              toast({
                title: "About",
                description: "Hushhly is a meditation and mindfulness app designed to help you find inner peace.",
              });
            }}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-blue-50"
          >
            <Info size={20} className="text-blue-500" />
            <span>About</span>
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
