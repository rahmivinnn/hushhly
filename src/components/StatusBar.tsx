
import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const StatusBar: React.FC = () => {
  // Get current time
  const [time, setTime] = React.useState('9:41');

  React.useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    // Update time initially and every minute
    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between px-4 py-2 text-white">
      <div className="font-semibold">{time}</div>
      <div className="flex items-center gap-1">
        <Signal size={16} className="fill-white" />
        <Wifi size={16} />
        <Battery size={18} />
      </div>
    </div>
  );
};

export default StatusBar;
