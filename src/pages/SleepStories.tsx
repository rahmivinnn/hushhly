
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Moon, Play, Clock, Heart, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const storyCategories = [
  { name: "Popular", active: true },
  { name: "New", active: false },
  { name: "Ambient", active: false },
  { name: "Nature", active: false },
  { name: "Classics", active: false },
];

interface StoryCard {
  id: number;
  title: string;
  narrator: string;
  duration: string;
  category: string;
  favoriteCount: string;
  listeningCount: string;
  image: string;
  featured?: boolean;
}

const SleepStories: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("Popular");
  
  const handleBack = () => {
    navigate('/home');
  };
  
  const stories: StoryCard[] = [
    {
      id: 1,
      title: "The Whispering Forest",
      narrator: "Sarah Johnson",
      duration: "25 min",
      category: "Nature",
      favoriteCount: "1.2k",
      listeningCount: "2.8k",
      image: "/lovable-uploads/d2c727d8-9d1c-40a7-9db8-1b7e09ed0c16.png",
      featured: true
    },
    {
      id: 2,
      title: "Mountain Serenity",
      narrator: "David Miller",
      duration: "18 min",
      category: "Nature",
      favoriteCount: "985",
      listeningCount: "1.5k",
      image: "/lovable-uploads/cdadef88-9349-4762-ba8f-24391780ef14.png"
    },
    {
      id: 3,
      title: "Lakeside Twilight",
      narrator: "Emily Parker",
      duration: "22 min",
      category: "Ambient",
      favoriteCount: "732",
      listeningCount: "1.2k",
      image: "/lovable-uploads/45f2540b-c903-465a-8b60-b9f76c3ea7b1.png"
    },
    {
      id: 4,
      title: "Tropical Journey",
      narrator: "Michael Zhang",
      duration: "20 min",
      category: "Nature",
      favoriteCount: "546",
      listeningCount: "934",
      image: "/lovable-uploads/a9d4e711-e3ac-454e-9545-5ad8b4f4044d.png"
    }
  ];
  
  const handlePreview = (story: StoryCard) => {
    toast({
      title: `${story.title}`,
      description: `Preview started. Narrated by ${story.narrator}`,
    });
    
    if (story.title === "The Whispering Forest") {
      navigate('/sleep-story-preview');
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    toast({
      title: `Category: ${category}`,
      description: "Showing sleep stories in this category",
    });
  };
  
  const handleFavorite = (story: StoryCard) => {
    toast({
      title: "Added to Favorites",
      description: `${story.title} has been added to your favorites`,
    });
  };
  
  const featuredStory = stories.find(s => s.featured);
  const regularStories = stories.filter(s => !s.featured);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white pb-16">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="p-2 text-white"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Sleep Stories</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <Search size={20} />
            </button>
            <button className="text-yellow-400">
              <Moon size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="overflow-x-auto hide-scrollbar px-4 py-2">
        <div className="flex space-x-4">
          {storyCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === category.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Featured Story */}
      {featuredStory && (
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold mb-3">Featured Story</h2>
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src={featuredStory.image} 
              alt={featuredStory.title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-xl font-semibold mb-1">{featuredStory.title}</h3>
              <div className="flex items-center text-sm text-gray-300 mb-2">
                <span>{featuredStory.narrator}</span>
                <div className="w-1 h-1 rounded-full bg-gray-400 mx-2"></div>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {featuredStory.duration}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePreview(featuredStory)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1.5 text-sm flex items-center"
                >
                  <Play size={14} className="mr-1" />
                  Preview
                </button>
                <button 
                  onClick={() => handleFavorite(featuredStory)}
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-4 py-1.5 text-sm flex items-center"
                >
                  <Heart size={14} className="mr-1" />
                  Favorite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Popular Stories */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Popular Stories</h2>
          <button className="text-blue-400 text-sm flex items-center">
            See All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          {regularStories.map((story) => (
            <HoverCard key={story.id}>
              <HoverCardTrigger asChild>
                <div className="flex bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-3">
                    <h3 className="font-medium mb-1">{story.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{story.narrator}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {story.duration}
                      </span>
                      <span className="flex items-center">
                        <Heart size={12} className="mr-1" />
                        {story.favoriteCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pr-3">
                    <button 
                      onClick={() => handlePreview(story)}
                      className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Play size={16} />
                    </button>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-gray-800 border-gray-700 text-white p-4">
                <div className="flex flex-col">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold">{story.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Journey into a peaceful {story.category.toLowerCase()} experience narrated by {story.narrator}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {story.duration}
                    </span>
                    <button 
                      onClick={() => handlePreview(story)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-xs flex items-center"
                    >
                      <Play size={12} className="mr-1" />
                      Listen Now
                    </button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SleepStories;
