import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Moon, Lock } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { sleepStories, getStoriesByCategory } from '@/data/sleepStories';

const Stories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter stories by category
  const featuredStories = getStoriesByCategory('featured');
  const shortStories = getStoriesByCategory('short');
  const longStories = getStoriesByCategory('long');
  const familyStories = getStoriesByCategory('family');

  // Handle story click
  const handleStoryClick = (story) => {
    if (story.isPremium) {
      // Navigate to subscription page for premium stories
      navigate('/subscription');
    } else {
      // Navigate directly to story meditation with story details
      navigate('/story-meditation', {
        state: {
          title: story.title,
          description: story.description,
          image: story.image,
          duration: story.duration || '15:00',
          icon: story.icon
        }
      });
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

        {/* Featured Story */}
        <div
          className="relative h-48 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-cyan-500 to-blue-500"
          onClick={() => handleStoryClick(featuredStories[0])}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white bg-blue-600 flex items-center justify-center">
              <span className="text-6xl text-white">{featuredStories[0].icon}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <h2 className="text-xl font-bold">{featuredStories[0].title}</h2>
            <p className="text-sm opacity-90">{featuredStories[0].description}</p>
          </div>
        </div>

        {/* Featured Stories Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Featured Stories</h2>
            <button
              className="text-blue-500 text-sm"
              onClick={() => navigate('/story-list')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {featuredStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-blue-500 flex items-center justify-center text-white">
                  <span className="text-xl">{story.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.isPremium && (
                      <Lock size={14} className="ml-2 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{story.duration}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  ▶
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Short Stories Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Short Stories for Quick Sleep</h2>
            <button
              className="text-blue-500 text-sm"
              onClick={() => navigate('/story-list')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {shortStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-purple-500 flex items-center justify-center text-white">
                  <span className="text-xl">{story.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.isPremium && (
                      <Lock size={14} className="ml-2 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{story.duration}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  ▶
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Long Stories Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Long Relaxing Tales</h2>
            <button
              className="text-blue-500 text-sm"
              onClick={() => navigate('/story-list', { state: { category: 'featured' } })}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {longStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-amber-500 flex items-center justify-center text-white">
                  <span className="text-xl">{story.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.isPremium && (
                      <Lock size={14} className="ml-2 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{story.duration}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  ▶
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Family Stories Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Parent & Child Bonding Stories</h2>
            <button
              className="text-blue-500 text-sm"
              onClick={() => navigate('/story-list', { state: { category: 'short' } })}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {familyStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-pink-500 flex items-center justify-center text-white">
                  <span className="text-xl">{story.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{story.title}</h3>
                    {story.isPremium && (
                      <Lock size={14} className="ml-2 text-amber-500" />
                    )}
                  </div>
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

export default Stories;
