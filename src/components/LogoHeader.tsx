
import React from 'react';
import { Bell, Trophy, AlignLeft } from 'lucide-react';

const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full px-4 py-2">
      <button className="text-white">
        <AlignLeft size={28} />
      </button>
      <div className="text-white text-4xl font-bold italic">
        shh.
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
