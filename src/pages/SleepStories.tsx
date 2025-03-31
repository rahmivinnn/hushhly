
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Star, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';

interface StoryItem {
  id: string;
  title: string;
  description?: string;
  duration: string;
  listeners: string;
  image: string;
}

const SleepStories: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Our original stories list
  const originalStories: StoryItem[] = [
    {
      id: "1",
      title: "The Whispering Forest",
      description: "A walk through a magical, quiet woodland.",
      duration: "15 Min",
      listeners: "59899",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
    },
    {
      id: "2",
      title: "Starlit Dreams",
      duration: "15 Min",
      listeners: "39084",
      image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png"
    },
    {
      id: "3",
      title: "Painting Forest",
      duration: "15 Min",
      listeners: "59899",
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png"
    },
    {
      id: "4",
      title: "The Gentle Night",
      duration: "15 Min",
      listeners: "39099",
      image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
    }
  ];
  
  // State for our shuffled lists
  const [featuredStories, setFeaturedStories] = useState<StoryItem[]>([...originalStories]);
  const [shortStories, setShortStories] = useState<StoryItem[]>([...originalStories]);
  const [relaxingTales, setRelaxingTales] = useState<StoryItem[]>([...originalStories]);
  const [parentChildStories, setParentChildStories] = useState<StoryItem[]>([...originalStories]);
  
  const shuffleArray = (array: StoryItem[]): StoryItem[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const handleReshuffleStories = () => {
    setFeaturedStories(shuffleArray([...originalStories]));
    setShortStories(shuffleArray([...originalStories]));
    setRelaxingTales(shuffleArray([...originalStories]));
    setParentChildStories(shuffleArray([...originalStories]));
    
    toast({
      title: "Stories Reshuffled",
      description: "We've found some new stories for you to enjoy.",
    });
  };
  
  const handlePlayNow = (title: string, duration: string) => {
    setCurrentVideo({title, duration});
    setShowVideoPopup(true);
  };
  
  const handleBackButton = () => {
    navigate(-1);
  };
  
  const handleViewMore = (section: string) => {
    toast({
      title: `View More - ${section}`,
      description: `More ${section} coming soon!`,
    });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const StoryCard = ({ story, isFeatured = false }: { story: StoryItem, isFeatured?: boolean }) => (
    <div className={`flex ${isFeatured ? 'flex-col h-48 rounded-xl overflow-hidden relative mb-4' : 'items-center mb-4'}`}>
      {isFeatured ? (
        <>
          <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="mt-auto p-4 z-10 text-white">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p className="text-sm opacity-90">{story.description}</p>
            
            <button 
              onClick={() => handlePlayNow(story.title, story.duration)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm flex items-center w-32"
            >
              Play Now <Play size={16} className="ml-2" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
            <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
            <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
          </div>
          <button 
            onClick={() => handlePlayNow(story.title, story.duration)}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2"
          >
            <Play size={16} />
          </button>
        </>
      )}
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <header className="px-4 pt-4 pb-2 flex justify-between items-center">
        <button onClick={handleBackButton} className="p-2 text-black">
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="text-lg font-semibold flex items-center">
          Sleep Stories <Star size={16} fill="gold" className="ml-1 text-yellow-400" />
        </h1>
        
        <button className="p-2 text-gray-800 opacity-0">
          <Bell size={20} />
        </button>
      </header>
      
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Stories"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Featured Story Banner */}
      <div className="px-4 mb-6">
        {featuredStories.length > 0 && (
          <StoryCard story={featuredStories[0]} isFeatured={true} />
        )}
      </div>
      
      {/* Featured Sleep Stories Section */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Featured Sleep Stories</h2>
          <button 
            onClick={handleReshuffleStories}
            className="text-blue-500 text-sm"
          >
            Reshuffle
          </button>
        </div>
        
        <div className="space-y-3">
          {featuredStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Featured Sleep Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 text-sm"
        >
          View More
        </button>
      </section>
      
      {/* Short Stories Section */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Short Stories for Quick Sleep</h2>
        
        <div className="space-y-3">
          {shortStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Short Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 text-sm"
        >
          View More
        </button>
      </section>
      
      {/* Long Relaxing Tales Section */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Long Relaxing Tales</h2>
        
        <div className="space-y-3">
          {relaxingTales.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Long Relaxing Tales")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 text-sm"
        >
          View More
        </button>
      </section>
      
      {/* Parent & Child Section */}
      <section className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-4">Parent & Child Bonding Stories</h2>
        
        <div className="space-y-3">
          {parentChildStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Parent & Child Bonding Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 text-sm"
        >
          View More
        </button>
      </section>
      
      {/* Video Popup */}
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SleepStories;
