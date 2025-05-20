import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Filter, Search, Lock, Play, Heart, X, ChevronUp } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { getAllStories } from '@/data/sleepStories';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

const StoryList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [likedStories, setLikedStories] = useState([]);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get category from location state if available
  const categoryFromState = location.state?.category;

  // Get all stories
  const allStories = getAllStories();

  useEffect(() => {
    // Set initial filter based on location state
    if (categoryFromState) {
      setActiveFilter(categoryFromState);
    }

    // Load liked stories from localStorage
    const savedLikes = localStorage.getItem('likedStories');
    if (savedLikes) {
      setLikedStories(JSON.parse(savedLikes));
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Show scroll to top button on scroll
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrollToTop(true);
      } else {
        setScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [categoryFromState]);

  // Filter stories based on search term and active filter
  const filteredStories = allStories.filter(story => {
    // Apply search filter
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply category filter
    const matchesCategory =
      activeFilter === 'all' ||
      story.category === activeFilter;

    // Apply premium filter
    const matchesPremium =
      activeFilter === 'premium' ? story.isPremium :
      activeFilter === 'free' ? !story.isPremium :
      true;

    return matchesSearch && matchesCategory && matchesPremium;
  });

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
      // Navigate to story meditation with story details
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
                  filter === 'premium' ? "Showing premium stories only" :
                  `Showing ${filter} stories only`,
      duration: 2000,
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Scroll to top
  const scrollToTopHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
              <h1 className="text-lg font-semibold">All Stories</h1>
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
              activeFilter === 'featured'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('featured')}
          >
            Featured
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'short'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('short')}
          >
            Short Stories
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'long'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('long')}
          >
            Long Stories
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'family'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('family')}
          >
            Family
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'free'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('free')}
          >
            Free
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeFilter === 'premium'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            onClick={() => applyFilter('premium')}
          >
            Premium
          </button>
        </div>

        {/* All Stories */}
        <section className="mb-20">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex items-center bg-white p-3 rounded-lg shadow-sm animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {activeFilter === 'all' ? 'All Sleep Stories' :
                   activeFilter === 'featured' ? 'Featured Stories' :
                   activeFilter === 'short' ? 'Short Stories' :
                   activeFilter === 'long' ? 'Long Stories' :
                   activeFilter === 'family' ? 'Family Stories' :
                   activeFilter === 'free' ? 'Free Stories' :
                   'Premium Stories'} ({filteredStories.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredStories.length} stories found
                </div>
              </div>

              {filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {filteredStories.map(story => (
                    <motion.div
                      key={story.id}
                      className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => handleStoryClick(story)}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-12 h-12 rounded-lg overflow-hidden mr-3 flex items-center justify-center text-white ${
                        story.category === 'featured' ? 'bg-blue-500' :
                        story.category === 'short' ? 'bg-purple-500' :
                        story.category === 'long' ? 'bg-amber-500' :
                        'bg-pink-500'
                      }`}>
                        <span className="text-xl">{story.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="font-medium truncate mr-2">{story.title}</h3>
                          {story.isPremium && (
                            <Lock size={14} className="flex-shrink-0 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">{story.description}</p>
                        <p className="text-xs text-gray-500">{story.duration}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                          onClick={(e) => handleLikeStory(e, story.id)}
                          aria-label={likedStories.includes(story.id) ? "Unlike story" : "Like story"}
                        >
                          <Heart size={18} className={likedStories.includes(story.id) ? "text-red-500 fill-red-500" : ""} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Play size={16} fill="white" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-500">No stories found matching your criteria</p>
                  <button
                    className="mt-3 text-blue-500 font-medium"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {scrollToTop && (
            <motion.button
              className="fixed bottom-24 right-4 w-10 h-10 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center z-10"
              onClick={scrollToTopHandler}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <ChevronUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

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
                    onClick={() => applyFilter('featured')}
                  >
                    <span className="font-medium">Featured Stories</span>
                    {activeFilter === 'featured' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>

                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('short')}
                  >
                    <span className="font-medium">Short Stories</span>
                    {activeFilter === 'short' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>

                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('long')}
                  >
                    <span className="font-medium">Long Stories</span>
                    {activeFilter === 'long' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                  </button>

                  <button
                    className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                    onClick={() => applyFilter('family')}
                  >
                    <span className="font-medium">Family Stories</span>
                    {activeFilter === 'family' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
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

export default StoryList;
