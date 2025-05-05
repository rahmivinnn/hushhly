import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Clock, Medal, Trophy, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface MeditationDashboardProps {
  onStartMeditation: () => void;
}

const MeditationDashboard: React.FC<MeditationDashboardProps> = ({ onStartMeditation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const currentDate = new Date();

  // Format the current time and date
  const currentTime = format(currentDate, 'hh:mm a');
  const currentDay = format(currentDate, 'EEEE, MMM d');

  // Mock data for stats
  const stats = {
    minutes: 0,
    sessions: 0,
    streak: 0
  };

  // Mock data for today's schedule
  const todaySchedule = [
    {
      id: 1,
      title: 'Enhance your productivity and focus.',
      time: '10:00 AM',
      icon: <Sparkles className="text-yellow-400" size={20} />
    }
  ];

  const handleResetStats = () => {
    // In a real app, this would reset the user's stats
    console.log('Stats reset requested');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 via-purple-300 to-pink-300 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/30 p-2 rounded-full"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{currentTime}</h1>
          <p className="text-white/80">{currentDay}</p>
        </div>

        <button className="bg-white/30 p-2 rounded-full">
          <Sparkles size={24} className="text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search meditation sessions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/70 backdrop-blur-sm border-none rounded-full py-6 pl-12 pr-4 text-gray-700 placeholder-gray-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </form>

      {/* Activity Stats */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Your Activity Stats</h2>
          <button
            onClick={handleResetStats}
            className="text-blue-600 text-sm font-medium"
          >
            Reset Stats
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-300 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="bg-white/30 p-2 rounded-full mb-2">
              <Clock className="text-white" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{stats.minutes}</span>
            <span className="text-white/80 text-sm">min</span>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-300 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="bg-white/30 p-2 rounded-full mb-2">
              <Briefcase className="text-white" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{stats.sessions}</span>
            <span className="text-white/80 text-sm">Sessions</span>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="bg-white/30 p-2 rounded-full mb-2">
              <Trophy className="text-white" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{stats.streak}</span>
            <span className="text-white/80 text-sm">days</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h2>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center justify-center">
          <p className="text-gray-600">No meditation activity yet.</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
          <span className="text-blue-600 text-sm font-medium">Today ({format(currentDate, 'MMM d')})</span>
        </div>

        {todaySchedule.length > 0 ? (
          <div>
            {todaySchedule.map(item => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={onStartMeditation}
                className="bg-white/30 backdrop-blur-sm rounded-xl p-4 mb-3 flex items-center cursor-pointer"
              >
                <div className="mr-3">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-blue-700 font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center justify-center">
            <p className="text-gray-600">No scheduled sessions for today.</p>
          </div>
        )}


      </div>
    </div>
  );
};

export default MeditationDashboard;
