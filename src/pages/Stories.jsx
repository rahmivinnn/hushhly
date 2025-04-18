import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Moon } from 'lucide-react';

const Stories = () => {
  const navigate = useNavigate();

  // Sample story data
  const stories = [
    {
      id: 1,
      title: 'The Whispering Forest',
      description: 'A walk through a magical, quiet woodland.',
      duration: '15 min',
      image: '/lovable-uploads/whispering-forest.svg',
      category: 'featured'
    },
    {
      id: 2,
      title: 'Starlit Dreams',
      description: 'Journey through the stars in a peaceful night.',
      duration: '15 min',
      image: '/lovable-uploads/starlit-dreams.svg',
      category: 'featured'
    },
    {
      id: 3,
      title: 'Ocean Whispers',
      description: 'Relax to the gentle sounds of ocean waves.',
      duration: '15 min',
      image: '/lovable-uploads/ocean-whispers.svg',
      category: 'short'
    },
    {
      id: 4,
      title: 'Mountain Serenity',
      description: 'Find peace in the majestic mountains.',
      duration: '15 min',
      image: '/lovable-uploads/mountain-serenity.svg',
      category: 'short'
    },
    {
      id: 5,
      title: 'Desert Journey',
      description: 'A calming trek through peaceful desert landscapes.',
      duration: '30 min',
      image: '/lovable-uploads/desert-journey.svg',
      category: 'long'
    },
    {
      id: 6,
      title: 'Rainforest Adventure',
      description: 'Explore the sounds and sensations of a rainforest.',
      duration: '30 min',
      image: '/lovable-uploads/rainforest-adventure.svg',
      category: 'long'
    },
    {
      id: 7,
      title: 'The Friendly Dragon',
      description: 'A heartwarming tale for parents and children.',
      duration: '20 min',
      image: '/lovable-uploads/friendly-dragon.svg',
      category: 'family'
    },
    {
      id: 8,
      title: 'Magical Garden',
      description: 'Discover the wonders of a magical garden together.',
      duration: '20 min',
      image: '/lovable-uploads/magical-garden.svg',
      category: 'family'
    }
  ];

  // Filter stories by category
  const featuredStories = stories.filter(story => story.category === 'featured');
  const shortStories = stories.filter(story => story.category === 'short');
  const longStories = stories.filter(story => story.category === 'long');
  const familyStories = stories.filter(story => story.category === 'family');

  // Handle story click
  const handleStoryClick = (story) => {
    navigate('/story-detail', { state: { story } });
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
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800"></div>
            </button>

            <div className="flex items-center">
              <img
                src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
                alt="Shh Logo"
                className="h-8 brightness-0 invert"
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
          />
        </div>

        {/* Featured Story */}
        <div
          className="relative h-48 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-cyan-500 to-blue-500"
          onClick={() => handleStoryClick(featuredStories[0])}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white">
              <img
                src={featuredStories[0].image}
                alt={featuredStories[0].title}
                className="w-full h-full object-cover"
              />
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
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {featuredStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-blue-500">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{story.title}</h3>
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
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {shortStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-purple-500">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{story.title}</h3>
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
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {longStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-amber-500">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{story.title}</h3>
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
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {familyStories.map(story => (
              <div
                key={story.id}
                className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-pink-500">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{story.title}</h3>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center p-2">
            <span className="text-gray-500 text-xl">🏠</span>
            <span className="text-xs text-gray-500">Home</span>
          </button>
          <button className="flex flex-col items-center p-2">
            <span className="text-gray-500 text-xl">📚</span>
            <span className="text-xs text-gray-500">Library</span>
          </button>
          <button className="flex flex-col items-center p-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white -mt-5">
              ▶
            </div>
          </button>
          <button className="flex flex-col items-center p-2">
            <span className="text-blue-500 text-xl">🌙</span>
            <span className="text-xs text-blue-500">Stories</span>
          </button>
          <button className="flex flex-col items-center p-2">
            <span className="text-gray-500 text-xl">👤</span>
            <span className="text-xs text-gray-500">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stories;
