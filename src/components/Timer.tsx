
import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in minutes
}

const Timer: React.FC<TimerProps> = ({ duration }) => {
  return (
    <div className="flex items-center justify-center mt-2 text-white space-x-1">
      <Clock size={14} />
      <span className="text-sm">{duration} Min</span>
    </div>
  );
};

export default Timer;
