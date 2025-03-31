
import React from 'react';
import { Bell, Trophy, AlignLeft } from 'lucide-react';

const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full px-4 py-3">
      <button className="text-white">
        <AlignLeft size={28} />
      </button>
      <div className="text-white text-4xl font-bold italic">
        <img src="/lovable-uploads/2a293d49-f787-45c8-b809-f4315bc615a0.png" alt="shh logo" className="h-12" />
      </div>
      <div className="flex space-x-4">
        <button className="text-white">
          <Bell size={24} />
        </button>
        <button className="text-amber-400">
          <Trophy size={24} />
        </button>
      </div>
    </div>
  );
};

export default LogoHeader;
