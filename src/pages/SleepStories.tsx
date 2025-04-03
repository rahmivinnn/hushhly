
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Star, Play, Heart, User, BookmarkPlus } from 'lucide-react';
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
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string, videoId?: string}>({title: "", duration: ""});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [likedStories, setLikedStories] = useState<string[]>([]);
  
  const storyImages = {
    "whispering": "/lovable-uploads/22d3aeff-cdab-4eb2-bf79-20758a4f67e5.png",
    "starlit": "/lovable-uploads/f4201790-0560-4528-a07c-82d09d7d8c95.png",
    "painting": "/lovable-uploads/dd78a943-7740-468a-906f-4bbf388b15c5.png",
    "gentle": "/lovable-uploads/ed40a4ff-9341-40c0-be34-87734a264cb6.png",
    "forest": "/lovable-uploads/c069a9b6-64bb-4c12-8919-cac5a122d8c4.png"
  };
  
  const originalStories: StoryItem[] = [
    {
      id: "1",
      title: "The Whispering Forest",
      description: "A walk through a magical, quiet woodland.",
      duration: "15 Min",
      listeners: "59899",
      image: storyImages.whispering
    },
    {
      id: "2",
      title: "Starlit Dreams",
      duration: "15 Min",
      listeners: "39084",
      image: storyImages.starlit
    },
    {
      id: "3",
      title: "Painting Forest",
      duration: "15 Min",
      listeners: "59899",
      image: storyImages.painting
    },
    {
      id: "4",
      title: "The Gentle Night",
      duration: "15 Min",
      listeners: "39099",
      image: storyImages.gentle
    }
  ];
  
  const [featuredStories, setFeaturedStories] = useState<StoryItem[]>([...originalStories]);
  const [shortStories, setShortStories] = useState<StoryItem[]>([...originalStories]);
  const [relaxingTales, setRelaxingTales] = useState<StoryItem[]>([...originalStories]);
  const [parentChildStories, setParentChildStories] = useState<StoryItem[]>([...originalStories]);

  // YouTube video IDs for each story
  const storyVideoIds = {
    "The Whispering Forest": "U5o8UiYxfeY",
    "Starlit Dreams": "rnDiXEhkBd8",
    "Painting Forest": "nRkP3lKj_lY",
    "The Gentle Night": "XqeAt45goBI",
    "default": "nRkP3lKj_lY"
  };
  
  useEffect(() => {
    // Load liked stories from localStorage
    const savedLikes = localStorage.getItem('likedStories');
    if (savedLikes) {
      setLikedStories(JSON.parse(savedLikes));
    }
  }, []);
  
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
  
  const shuffleArray = (array: StoryItem[]): StoryItem[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const handleLikeStory = (id: string) => {
    let newLikedStories: string[];
    
    if (likedStories.includes(id)) {
      newLikedStories = likedStories.filter(storyId => storyId !== id);
      toast({
        title: "Removed from Favorites",
        description: "Story removed from your favorites"
      });
    } else {
      newLikedStories = [...likedStories, id];
      toast({
        title: "Added to Favorites",
        description: "Story added to your favorites"
      });
    }
    
    setLikedStories(newLikedStories);
    localStorage.setItem('likedStories', JSON.stringify(newLikedStories));
  };
  
  const handlePlayNow = (title: string, duration: string) => {
    const videoId = storyVideoIds[title as keyof typeof storyVideoIds] || storyVideoIds.default;
    setCurrentVideo({title, duration, videoId});
    setShowVideoPopup(true);
  };
  
  const handleBackButton = () => {
    navigate(-1);
  };
  
  const handleViewMore = (section: string) => {
    toast({
      title: `More ${section}`,
      description: `Loading more ${section.toLowerCase()}...`,
    });
    
    // Dynamically add more stories
    const additionalStories = shuffleArray([...originalStories]);
    
    switch(section) {
      case "Featured Sleep Stories":
        setFeaturedStories(prev => [...prev, ...additionalStories]);
        break;
      case "Short Stories":
        setShortStories(prev => [...prev, ...additionalStories]);
        break;
      case "Relaxing Tales":
        setRelaxingTales(prev => [...prev, ...additionalStories]);
        break;
      case "Parent & Child Stories":
        setParentChildStories(prev => [...prev, ...additionalStories]);
        break;
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    if (e.target.value) {
      const query = e.target.value.toLowerCase();
      const filtered = originalStories.filter(story => 
        story.title.toLowerCase().includes(query) || 
        (story.description && story.description.toLowerCase().includes(query))
      );
      
      setFeaturedStories(filtered);
      setShortStories(filtered);
      setRelaxingTales(filtered);
      setParentChildStories(filtered);
    } else {
      // Reset to original stories if search is cleared
      setFeaturedStories([...originalStories]);
      setShortStories([...originalStories]);
      setRelaxingTales([...originalStories]);
      setParentChildStories([...originalStories]);
    }
  };
  
  const handleInvite = () => {
    toast({
      title: "Invite Friends",
      description: "Share this meditation story with friends via email or SMS",
    });
    
    // Simulated share dialog
    setTimeout(() => {
      const confirmed = window.confirm("Share this story with your friends via email or message?");
      if (confirmed) {
        toast({
          title: "Invite Sent",
          description: "Invitation has been sent to your friends",
        });
      }
    }, 500);
  };
  
  const StoryCard = ({ story, isFeatured = false }: { story: StoryItem, isFeatured?: boolean }) => (
    <div className={`flex ${isFeatured ? 'flex-col h-48 rounded-xl overflow-hidden relative mb-4' : 'items-center mb-4'}`}>
      {isFeatured ? (
        <>
          <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-xl"></div>
          <div className="mt-auto p-4 z-10 text-white">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p className="text-sm opacity-90">{story.description}</p>
            
            <button 
              onClick={() => handlePlayNow(story.title, story.duration)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm flex items-center"
            >
              Play Now <Play size={16} className="ml-2" fill="white" />
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
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
          >
            <Play size={18} fill="white" />
          </button>
        </>
      )}
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <header className="px-4 pt-4 pb-2 flex justify-between items-center">
        <button onClick={handleBackButton} className="p-2 text-black">
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="text-lg font-semibold flex items-center">
          Sleep Stories <Star size={16} fill="gold" className="ml-1 text-yellow-400" />
        </h1>
        
        <button onClick={handleInvite} className="p-2 text-blue-500">
          <User size={20} className="mr-1" /> 
          <span className="text-xs">Invite</span>
        </button>
      </header>
      
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
      
      <div className="px-4 mb-6">
        {featuredStories.length > 0 && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={storyImages.forest} 
              alt="Featured Story" 
              className="w-full h-48 object-cover"
            />
            <div className="relative -mt-48 h-48 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
              <div className="absolute bottom-0 p-4 text-white">
                <h2 className="text-xl font-semibold">The Whispering Forest</h2>
                <p className="text-sm mb-3">A walk through a magical, quiet woodland.</p>
                <button 
                  onClick={() => handlePlayNow("The Whispering Forest", "15 Min")}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm flex items-center"
                >
                  Play Now <Play size={16} className="ml-2" fill="white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
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
            <div key={story.id} className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
                <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
              </div>
              <button 
                onClick={() => handlePlayNow(story.title, story.duration)}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Featured Sleep Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 mt-4 text-sm flex items-center justify-center"
        >
          View More
        </button>
      </section>
      
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Short Stories for Quick Sleep</h2>
        
        <div className="space-y-3">
          {shortStories.map(story => (
            <div key={story.id} className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
                <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
              </div>
              <button 
                onClick={() => handlePlayNow(story.title, story.duration)}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Short Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 mt-4 text-sm flex items-center justify-center"
        >
          View More
        </button>
      </section>
      
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Long Relaxing Tales</h2>
        
        <div className="space-y-3">
          {relaxingTales.map(story => (
            <div key={story.id} className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
                <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
              </div>
              <button 
                onClick={() => handlePlayNow(story.title, story.duration)}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Relaxing Tales")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 mt-4 text-sm flex items-center justify-center"
        >
          View More
        </button>
      </section>
      
      <section className="px-4 mb-20">
        <h2 className="text-lg font-semibold mb-4">Parent & Child Bonding Stories</h2>
        
        <div className="space-y-3">
          {parentChildStories.map(story => (
            <div key={story.id} className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
                <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
              </div>
              <button 
                onClick={() => handlePlayNow(story.title, story.duration)}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleViewMore("Parent & Child Bonding Stories")} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 mt-4 text-sm flex items-center justify-center"
        >
          View More
        </button>
      </section>
      
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          videoId={currentVideo.videoId}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default SleepStories;
