import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Search, Lock } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { getAllStories } from '@/data/sleepStories';

const StoryList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all stories
  const allStories = getAllStories();
  
  // Filter stories based on search term
  const filteredStories = allStories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle story click
  const handleStoryClick = (story) => {
    if (story.isPremium) {
      // Navigate to subscription page for premium stories
      navigate('/subscription');
    } else {
      // Navigate to story detail page for free stories
      navigate('/story-detail', { state: { story } });
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="px-4 pt-4 pb-2">
          <div className="flex justify-between items-center">
            <button
              className="p-2 text-gray-800"
              onClick={handleBack}
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex items-center">
              <img
                src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
                alt="Shh Logo"
                className="h-8" style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="text-gray-800"
                onClick={() => navigate('/notifications')}
              >
                <Bell size={20} />
              </button>
              <button
                className="text-yellow-500"
                onClick={() => navigate('/stories')}
              >
                <Moon size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Stories"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* All Stories */}
        <section className="mb-20">
          <h2 className="text-lg font-semibold mb-4">All Sleep Stories ({filteredStories.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {filteredStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className={`w-12 h-12 rounded-lg overflow-hidden mr-3 flex items-center justify-center text-white ${story.category === 'featured' ? 'bg-blue-500' : story.category === 'short' ? 'bg-purple-500' : story.category === 'long' ? 'bg-amber-500' : 'bg-pink-500'}`}>
                  <span className="text-xl">{story.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.isPremium && (
                      <Lock size={14} className="ml-2 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1">{story.description}</p>
                  <p className="text-xs text-gray-500">{story.duration}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  ▶
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default StoryList;
