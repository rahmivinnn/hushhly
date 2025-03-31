
import React from 'react';
import { Bell, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600">
      {/* Left empty space */}
      <div className="w-8"></div>
      
      {/* Logo - perfectly centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" alt="Hushhly logo" className="h-8" />
      </div>
      
      {/* Right side buttons */}
      <div className="flex space-x-4 ml-auto">
        <button 
          className="text-white hover:opacity-80 transition-opacity"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={24} />
        </button>
        <button 
          className="text-yellow-400 hover:opacity-80 transition-opacity"
          onClick={() => navigate('/profile')}
        >
          <Trophy size={24} />
        </button>
      </div>
    </div>
  );
};

export default LogoHeader;
