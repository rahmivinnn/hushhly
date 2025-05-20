import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Moon, Lock, Play, Heart, Filter, X, ChevronRight } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { sleepStories, getStoriesByCategory } from '@/data/sleepStories';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

const Stories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeatured, setFilteredFeatured] = useState([]);
  const [filteredShort, setFilteredShort] = useState([]);
  const [filteredLong, setFilteredLong] = useState([]);
  const [filteredFamily, setFilteredFamily] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedStories, setLikedStories] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Get stories by category
  const allFeaturedStories = getStoriesByCategory('featured');
  const allShortStories = getStoriesByCategory('short');
  const allLongStories = getStoriesByCategory('long');
  const allFamilyStories = getStoriesByCategory('family');

  // Apply filters and search
  useEffect(() => {
    // Load liked stories from localStorage
    const savedLikes = localStorage.getItem('likedStories');
    if (savedLikes) {
      setLikedStories(JSON.parse(savedLikes));
    }

    // Apply filters
    let featured = [...allFeaturedStories];
    let short = [...allShortStories];
    let long = [...allLongStories];
    let family = [...allFamilyStories];

    // Apply search filter if search term exists
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();

      featured = featured.filter(story =>
        story.title.toLowerCase().includes(term) ||
        story.description.toLowerCase().includes(term)
      );

      short = short.filter(story =>
        story.title.toLowerCase().includes(term) ||
        story.description.toLowerCase().includes(term)
      );

      long = long.filter(story =>
        story.title.toLowerCase().includes(term) ||
        story.description.toLowerCase().includes(term)
      );

      family = family.filter(story =>
        story.title.toLowerCase().includes(term) ||
        story.description.toLowerCase().includes(term)
      );

      // Combine all results for search results view
      const allResults = [...featured, ...short, ...long, ...family];
      setSearchResults(allResults);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    // Apply premium filter
    if (activeFilter === 'free') {
      featured = featured.filter(story => !story.isPremium);
      short = short.filter(story => !story.isPremium);
      long = long.filter(story => !story.isPremium);
      family = family.filter(story => !story.isPremium);
    } else if (activeFilter === 'premium') {
      featured = featured.filter(story => story.isPremium);
      short = short.filter(story => story.isPremium);
      long = long.filter(story => story.isPremium);
      family = family.filter(story => story.isPremium);
    }

    // Limit to 5 stories per category for display
    setFilteredFeatured(featured.slice(0, 5));
    setFilteredShort(short.slice(0, 5));
    setFilteredLong(long.slice(0, 5));
    setFilteredFamily(family.slice(0, 5));
  }, [searchTerm, activeFilter, allFeaturedStories, allShortStories, allLongStories, allFamilyStories]);

  // Handle story click
  const handleStoryClick = (story) => {
    if (story.isPremium) {
      // Navigate to subscription page for premium stories
      navigate('/subscription');

      toast({
        title: "Premium Content",
        description: "Subscribe to access this premium story.",
        duration: 3000,
      });
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

      toast({
        title: "Starting Story",
        description: `${story.title} is loading...`,
        duration: 2000,
      });
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Toggle like for a story
  const handleLikeStory = (e, storyId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick

    let updatedLikes = [...likedStories];

    if (updatedLikes.includes(storyId)) {
      // Unlike the story
      updatedLikes = updatedLikes.filter(id => id !== storyId);

      toast({
        title: "Removed from Favorites",
        description: "Story removed from your favorites.",
        duration: 2000,
      });
    } else {
      // Like the story
      updatedLikes.push(storyId);

      toast({
        title: "Added to Favorites",
        description: "Story added to your favorites.",
        duration: 2000,
      });
    }

    setLikedStories(updatedLikes);
    localStorage.setItem('likedStories', JSON.stringify(updatedLikes));
  };

  // Apply filter
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilterModal(false);

    toast({
      title: `Filter Applied: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`,
      description: filter === 'all' ? "Showing all stories" :
                  filter === 'free' ? "Showing free stories only" :
                  "Showing premium stories only",
      duration: 2000,
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 max-w-screen-lg">
        {/* Header */}
        <header className="px-2 sm:px-4 pt-4 pb-2 safe-top">
          <div className="flex justify-between items-center">
            <button
              className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex flex-col items-center">
              <img
                src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
                alt="Shh Logo"
                className="h-8 w-auto"
                style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }}
              />
              <h1 className="text-lg font-semibold">Stories</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate('/notifications')}
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
              <button
                className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
                onClick={() => setShowFilterModal(true)}
                aria-label="Filter stories"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6 mt-2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Stories"
            className="w-full py-3 pl-10 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search stories"
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('all')}
          >
            All Stories
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'free'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('free')}
          >
            Free Stories
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'premium'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('premium')}
          >
            Premium Stories
          </button>
        </div>

        {/* Search Results View */}
        {isSearching ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Search Results ({searchResults.length})</h2>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map(story => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => handleStoryClick(story)}
                    onLike={(e) => handleLikeStory(e, story.id)}
                    isLiked={likedStories.includes(story.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg text-center">
                <p className="text-gray-500">No stories found matching "{searchTerm}"</p>
                <button
                  className="mt-3 text-blue-500 font-medium"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured Story */}
            {filteredFeatured.length > 0 && (
              <motion.div
                className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md"
                onClick={() => handleStoryClick(filteredFeatured[0])}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white bg-blue-600 flex items-center justify-center">
                    <span className="text-6xl text-white">{filteredFeatured[0].icon}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold">{filteredFeatured[0].title}</h2>
                    {filteredFeatured[0].isPremium && (
                      <Lock size={16} className="ml-2 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-sm opacity-90 line-clamp-2">{filteredFeatured[0].description}</p>
                </div>
                <button
                  className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full"
                  onClick={(e) => handleLikeStory(e, filteredFeatured[0].id)}
                  aria-label={likedStories.includes(filteredFeatured[0].id) ? "Unlike story" : "Like story"}
                >
                  <Heart
                    size={20}
                    className={likedStories.includes(filteredFeatured[0].id) ? "text-red-500 fill-red-500" : "text-white"}
                  />
                </button>
              </motion.div>
            )}

            {/* StoryCard Component */}
            {/* Featured Stories Section */}
            {filteredFeatured.length > 0 && (
              <section className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Featured Stories</h2>
                  <button
                    className="text-blue-500 text-sm flex items-center"
                    onClick={() => navigate('/story-list', { state: { category: 'featured' } })}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredFeatured.slice(1).map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      color="bg-blue-500"
                      onClick={() => handleStoryClick(story)}
                      onLike={(e) => handleLikeStory(e, story.id)}
                      isLiked={likedStories.includes(story.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Short Stories Section */}
            {filteredShort.length > 0 && (
              <section className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Short Stories for Quick Sleep</h2>
                  <button
                    className="text-blue-500 text-sm flex items-center"
                    onClick={() => navigate('/story-list', { state: { category: 'short' } })}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredShort.map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      color="bg-purple-500"
                      onClick={() => handleStoryClick(story)}
                      onLike={(e) => handleLikeStory(e, story.id)}
                      isLiked={likedStories.includes(story.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Long Stories Section */}
            {filteredLong.length > 0 && (
              <section className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Long Relaxing Tales</h2>
                  <button
                    className="text-blue-500 text-sm flex items-center"
                    onClick={() => navigate('/story-list', { state: { category: 'long' } })}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredLong.map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      color="bg-amber-500"
                      onClick={() => handleStoryClick(story)}
                      onLike={(e) => handleLikeStory(e, story.id)}
                      isLiked={likedStories.includes(story.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Family Stories Section */}
            {filteredFamily.length > 0 && (
              <section className="mb-20">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Parent & Child Bonding Stories</h2>
                  <button
                    className="text-blue-500 text-sm flex items-center"
                    onClick={() => navigate('/story-list', { state: { category: 'family' } })}
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {filteredFamily.map(story => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      color="bg-pink-500"
                      onClick={() => handleStoryClick(story)}
                      onLike={(e) => handleLikeStory(e, story.id)}
                      isLiked={likedStories.includes(story.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
            >
              <motion.div
                className="bg-white rounded-t-2xl w-full max-w-md p-5"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filter Stories</h3>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setShowFilterModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('all')}
                  >
                    <span className="font-medium">All Stories</span>
                    {activeFilter === 'all' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>

                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('free')}
                  >
                    <span className="font-medium">Free Stories Only</span>
                    {activeFilter === 'free' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>

                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('premium')}
                  >
                    <span className="font-medium">Premium Stories Only</span>
                    {activeFilter === 'premium' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

// StoryCard Component
const StoryCard = ({ story, color = "bg-blue-500", onClick, onLike, isLiked }) => {
  return (
    <motion.div
      className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 rounded-lg overflow-hidden mr-3 ${color} flex items-center justify-center text-white`}>
        <span className="text-xl">{story.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <h3 className="font-medium truncate mr-2">{story.title}</h3>
          {story.isPremium && (
            <Lock size={14} className="flex-shrink-0 text-amber-500" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{story.description}</p>
        <p className="text-xs text-gray-400">{story.duration}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
          onClick={onLike}
          aria-label={isLiked ? "Unlike story" : "Like story"}
        >
          <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : ""} />
        </button>
        <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <Play size={16} fill="white" />
        </button>
      </div>
    </motion.div>
  );
};

export default Stories;
