
import React from 'react';
import { Home, Briefcase, Users, Moon, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-6">
      <div className="mx-auto w-11/12 max-w-md bg-meditation-gradient rounded-full py-4 px-6">
        <div className="flex justify-between items-center">
          <button className="text-white hover:text-white/80">
            <Home size={24} />
          </button>
          <button className="text-white hover:text-white/80">
            <Briefcase size={24} />
          </button>
          <button className="text-white hover:text-white/80">
            <Users size={24} />
          </button>
          <button className="text-white hover:text-white/80">
            <Moon size={24} />
          </button>
          <button className="text-white hover:text-white/80">
            <User size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
