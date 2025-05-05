import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Bell, Star, Play, Heart, User, BookmarkPlus, Calendar, X, Clock, Copy } from 'lucide-react';
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
  locked?: boolean;
  category?: string;
}

const SleepStories: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string, videoId?: string}>({title: "", duration: ""});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [likedStories, setLikedStories] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("21:00");
  const [scheduledStory, setScheduledStory] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [selectedLockedStory, setSelectedLockedStory] = useState<StoryItem | null>(null);

  const storyImages = {
    "whispering": "/lovable-uploads/f3796138-3de0-44f8-9fab-6a71b48c7632.png",
    "starlit": "/lovable-uploads/97bc74f2-226d-4977-aa93-9b0d386fca75.png",
    "painting": "/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png",
    "gentle": "/lovable-uploads/f2a6ea2d-db0c-4da6-ab79-4c8a4b158fff.png",
    "forest": "/lovable-uploads/79057e46-19a8-4c32-9d96-f637c4ac722c.png"
  };

  // Generate 100+ sleep stories with various categories and locked/unlocked status
  const generateStories = (): StoryItem[] => {
    const categories = ["nature", "fantasy", "meditation", "children", "adventure", "relaxation", "space", "ocean"];
    const natureStories = [
      "The Whispering Forest", "Mountain Serenity", "Gentle Rainfall", "Autumn Leaves", "Spring Meadow",
      "Flowing River", "Peaceful Garden", "Misty Morning", "Sunset Beach", "Desert Oasis",
      "Tropical Paradise", "Bamboo Grove", "Enchanted Waterfall", "Quiet Lake", "Ancient Redwoods"
    ];
    const fantasyStories = [
      "Starlit Dreams", "Fairy Kingdom", "Dragon's Lullaby", "Wizard's Tower", "Enchanted Castle",
      "Magical Journey", "Unicorn Meadow", "Mermaid Lagoon", "Elven Forest", "Crystal Caves",
      "Moonlight Magic", "Mythical Creatures", "Forgotten Realm", "Wizard's Apprentice", "Enchanted Mirror"
    ];
    const meditationStories = [
      "Painting Forest", "Inner Peace", "Mindful Moments", "Breath of Calm", "Tranquil Mind",
      "Healing Light", "Body Scan Journey", "Gratitude Path", "Stress Release", "Peaceful Awareness",
      "Loving Kindness", "Chakra Alignment", "Energy Cleanse", "Mindful Mountain", "Compassion Flow"
    ];
    const childrenStories = [
      "The Gentle Night", "Sleepy Teddy Bear", "Little Star's Journey", "Friendly Dragon", "Magic Treehouse",
      "Bedtime for Bunny", "Sleepy Puppy", "Goodnight Moon", "Dreamy Clouds", "Magical Pillow",
      "Sleepy Kitten", "Bedtime Train", "Floating Bubbles", "Counting Sheep", "Dreamy Carousel"
    ];
    const adventureStories = [
      "Pirate's Treasure", "Space Explorer", "Jungle Expedition", "Arctic Adventure", "Desert Caravan",
      "Underwater Discovery", "Mountain Climber", "Time Traveler", "Safari Journey", "Island Explorer",
      "Lost City", "Balloon Voyage", "Submarine Voyage", "Rainforest Trek", "Cave Explorer"
    ];
    const relaxationStories = [
      "Gentle Waves", "Floating Clouds", "Warm Sunshine", "Cozy Cabin", "Peaceful Hammock",
      "Soft Snowfall", "Quiet Library", "Candlelight", "Gentle Breeze", "Warm Bath",
      "Crackling Fireplace", "Rainy Day", "Quiet Bookshop", "Lazy Sunday", "Sunset Watching"
    ];
    const spaceStories = [
      "Cosmic Journey", "Stargazing", "Milky Way Dreams", "Planetary Voyage", "Meteor Shower",
      "Northern Lights", "Lunar Landscape", "Constellation Stories", "Solar System Tour", "Astronaut's View",
      "Cosmic Lullaby", "Galaxy Explorer", "Nebula Dreams", "Space Station", "Comet Chaser"
    ];
    const oceanStories = [
      "Ocean Depths", "Coral Reef", "Whale Songs", "Seaside Retreat", "Tidal Pools",
      "Sailing Adventure", "Dolphin Play", "Ocean Waves", "Underwater Cave", "Island Breeze",
      "Lighthouse Stories", "Seashell Whispers", "Mermaid Tales", "Calm Harbor", "Ocean Sunset"
    ];

    const allStoryTitles = {
      nature: natureStories,
      fantasy: fantasyStories,
      meditation: meditationStories,
      children: childrenStories,
      adventure: adventureStories,
      relaxation: relaxationStories,
      space: spaceStories,
      ocean: oceanStories
    };

    const stories: StoryItem[] = [];
    let id = 1;

    // Generate stories for each category
    categories.forEach(category => {
      const titles = allStoryTitles[category as keyof typeof allStoryTitles];
      titles.forEach(title => {
        // Generate random duration between 5-30 minutes
        const duration = `${Math.floor(Math.random() * 26) + 5} Min`;
        // Generate random number of listeners
        const listeners = (Math.floor(Math.random() * 90000) + 10000).toString();
        // Determine if story should be locked (approximately 60% unlocked, 40% locked)
        const locked = Math.random() > 0.6;

        // Select image based on category
        let image;
        switch(category) {
          case "nature":
            image = storyImages.whispering;
            break;
          case "fantasy":
            image = storyImages.starlit;
            break;
          case "meditation":
            image = storyImages.painting;
            break;
          default:
            image = storyImages.gentle;
        }

        // Create story object
        stories.push({
          id: id.toString(),
          title,
          description: `A ${category} story to help you relax and fall asleep.`,
          duration,
          listeners,
          image,
          locked,
          category
        });

        id++;
      });
    });

    // Ensure the original 4 stories are unlocked and at the beginning
    const originalTitles = ["The Whispering Forest", "Starlit Dreams", "Painting Forest", "The Gentle Night"];
    originalTitles.forEach(title => {
      const story = stories.find(s => s.title === title);
      if (story) {
        story.locked = false;
      }
    });

    return stories;
  };

  const originalStories: StoryItem[] = generateStories();

  const [featuredStories, setFeaturedStories] = useState<StoryItem[]>([...originalStories]);
  const [shortStories, setShortStories] = useState<StoryItem[]>([...originalStories]);
  const [relaxingTales, setRelaxingTales] = useState<StoryItem[]>([...originalStories]);
  const [parentChildStories, setParentChildStories] = useState<StoryItem[]>([...originalStories]);

  const storyVideoIds = {
    "The Whispering Forest": "U5o8UiYxfeY",
    "Starlit Dreams": "rnDiXEhkBd8",
    "Painting Forest": "nRkP3lKj_lY",
    "The Gentle Night": "XqeAt45goBI",
    "default": "nRkP3lKj_lY"
  };

  // Map sleep story titles to meditation indices for navigation
  const storyToMeditationMap: Record<string, number> = {
    "The Whispering Forest": 0,
    "Starlit Dreams": 1,
    "Painting Forest": 2,
    "The Gentle Night": 3
  };

  useEffect(() => {
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

  const handlePlayNow = (story: StoryItem) => {
    // Check if story is locked
    if (story.locked) {
      setSelectedLockedStory(story);
      setShowSubscriptionModal(true);
      return;
    }

    // Navigate to story meditation page
    navigate('/story-meditation', {
      state: {
        title: story.title,
        description: story.description,
        duration: story.duration,
        image: story.image,
        icon: getStoryIcon(story.title)
      }
    });

    toast({
      title: "Starting Story",
      description: `${story.title} is starting...`,
      duration: 3000
    });
  };

  // Get emoji icon based on story title
  const getStoryIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('forest') || lowerTitle.includes('tree')) {
      return '🌲';
    } else if (lowerTitle.includes('night') || lowerTitle.includes('star') || lowerTitle.includes('dream')) {
      return '✨';
    } else if (lowerTitle.includes('ocean') || lowerTitle.includes('sea') || lowerTitle.includes('water')) {
      return '🌊';
    } else if (lowerTitle.includes('mountain')) {
      return '🏔️';
    } else if (lowerTitle.includes('flower') || lowerTitle.includes('garden')) {
      return '🌸';
    } else if (lowerTitle.includes('rain')) {
      return '🌧️';
    } else if (lowerTitle.includes('sun') || lowerTitle.includes('morning')) {
      return '☀️';
    } else if (lowerTitle.includes('moon')) {
      return '🌙';
    } else if (lowerTitle.includes('child') || lowerTitle.includes('kid')) {
      return '👶';
    } else {
      return '🧘';
    }
  };

  const handleSubscribe = () => {
    // Navigate to subscription page
    navigate('/subscription');

    toast({
      title: "Subscription Required",
      description: "Please subscribe to unlock premium stories."
    });
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleViewMore = (section: string) => {
    toast({
      title: `More ${section}`,
      description: `Loading more ${section.toLowerCase()}...`,
    });

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
      setFeaturedStories([...originalStories]);
      setShortStories([...originalStories]);
      setRelaxingTales([...originalStories]);
      setParentChildStories([...originalStories]);
    }
  };

  const handleInvite = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    // In a real app, this would copy the actual invite link
    navigator.clipboard.writeText("https://hushhly.com/invite/sleep-stories?ref=user123");
    toast({
      title: "Link Copied",
      description: "Invite link has been copied to clipboard",
    });
  };

  const handleShareSocial = (platform: string) => {
    // In a real app, this would open the sharing dialog for the specific platform
    toast({
      title: `Share via ${platform}`,
      description: `Sharing to ${platform}...`,
    });
    setShowShareModal(false);
  };

  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleScheduleStory = (storyId: string) => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "You need to select a date to schedule this story."
      });
      return;
    }

    const story = originalStories.find(s => s.id === storyId);
    if (!story) {
      toast({
        title: "Story Not Found",
        description: "The selected story could not be found."
      });
      return;
    }

    // Check if story is locked
    if (story.locked) {
      setSelectedLockedStory(story);
      setShowSubscriptionModal(true);
      setShowCalendar(false);
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);

    setScheduledStory(story.title);
    setShowCalendar(false);

    // Format date for display
    const formattedDate = scheduledDateTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    toast({
      title: "Story Scheduled",
      description: `"${story.title}" has been scheduled for ${formattedDate}`,
    });

    // Show notification after a short delay to simulate system notification
    setTimeout(() => {
      const notificationElement = document.createElement('div');
      notificationElement.className = 'fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50 animate-slide-in';
      notificationElement.innerHTML = `
        <div class="flex">
          <div class="flex-shrink-0">
            <img src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" alt="Hushhly" class="h-6 w-auto">
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Story scheduled!</h3>
            <p class="mt-1 text-sm text-gray-500">"${story.title}" will start at ${formattedDate}</p>
          </div>
        </div>
      `;
      document.body.appendChild(notificationElement);

      // Remove notification after 5 seconds
      setTimeout(() => {
        notificationElement.classList.remove('animate-slide-in');
        notificationElement.classList.add('animate-slide-out');
        setTimeout(() => {
          document.body.removeChild(notificationElement);
        }, 300);
      }, 5000);
    }, 1000);
  };

  const StoryCard = ({ story, isFeatured = false }: { story: StoryItem, isFeatured?: boolean }) => (
    <div className={`flex ${isFeatured ? 'flex-col h-48 rounded-xl overflow-hidden relative mb-4' : 'items-center mb-4'}`}>
      {isFeatured ? (
        <>
          <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-xl"></div>
          {story.locked && (
            <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          )}
          <div className="mt-auto p-4 z-10 text-white">
            <h3 className="text-xl font-semibold">{story.title}</h3>
            <p className="text-sm opacity-90">{story.description}</p>

            <button
              onClick={() => handlePlayNow(story)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm flex items-center"
            >
              {story.locked ? 'Unlock' : 'Play Now'}
              {story.locked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              ) : (
                <Play size={16} className="ml-2" fill="white" />
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 relative">
            <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
            {story.locked && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">{story.title}</h3>
            <p className="text-xs text-gray-500">{story.duration} • {story.listeners} Listening</p>
          </div>
          <button
            onClick={() => handlePlayNow(story)}
            className={`w-10 h-10 ${story.locked ? 'bg-gray-400' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform`}
          >
            {story.locked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            ) : (
              <Play size={18} fill="white" />
            )}
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

        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Shh Logo"
            className="h-6 mb-1" style={{ filter: 'invert(45%) sepia(60%) saturate(2210%) hue-rotate(205deg) brightness(101%) contrast(101%)' }}
          />
          <h1 className="text-lg font-semibold">Stories</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCalendarClick}
            className="p-2 text-blue-500"
          >
            <Calendar size={20} />
          </button>
          <button onClick={handleInvite} className="p-2 text-blue-500">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Share Sleep Stories</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 truncate flex-1">https://hushhly.com/invite/sleep-stories?ref=user123</div>
                <button
                  onClick={handleCopyLink}
                  className="ml-3 text-blue-500 hover:text-blue-600"
                >
                  <Copy size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Share via</p>

              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handleShareSocial('WhatsApp')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Telegram')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.5 6.424-.709 8.526-.092.913-.325 1.219-.534 1.249-.457.066-.896-.318-1.39-.624a169.75 169.75 0 0 0-1.199-.744c-.923-.58-1.097-.934-.523-1.438.158-.139 2.09-1.914 2.148-2.077.007-.02.021-.147-.056-.209s-.236-.045-.335-.028c-.13.024-1.6 1.016-2.937 1.857a1.88 1.88 0 0 1-1.068.312 5.6 5.6 0 0 1-1.513-.308c-.611-.17-.919-.519-.888-.855.016-.167.176-.331.483-.478.883-.419 3.304-1.382 5.987-2.54.29-.125 2.661-1.106 2.878-1.131z"/></svg>
                  </div>
                  <span className="text-xs">Telegram</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Twitter')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </div>
                  <span className="text-xs">Twitter</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Email')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span className="text-xs">Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => {
                    const story = originalStories.find(s => s.title === "The Whispering Forest");
                    if (story) handlePlayNow(story);
                  }}
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
          <h2 className="text-lg font-semibold">Featured Stories</h2>
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
                onClick={() => handlePlayNow(story)}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 transform hover:scale-105 transition-transform"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleViewMore("Featured Stories")}
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
                onClick={() => handlePlayNow(story)}
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
                onClick={() => handlePlayNow(story)}
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
                onClick={() => handlePlayNow(story)}
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

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedLockedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Premium Content</h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 relative">
                  <img src={selectedLockedStory.image} alt={selectedLockedStory.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedLockedStory.title}</h3>
                  <p className="text-sm text-gray-500">{selectedLockedStory.duration} • Premium Content</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2 text-blue-800">Unlock Premium Stories</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Subscribe to Hushhly Premium to access all locked content including:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    100+ Premium Sleep Stories
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Exclusive Meditation Content
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Ad-free Experience
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Offline Listening
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 font-medium"
                >
                  Subscribe Now - $7.99/month
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full py-3"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Schedule Sleep Story</h2>
              <button
                onClick={handleCloseCalendar}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  className="w-full h-10 rounded-lg border border-gray-300 px-3"
                  onChange={(e) => handleDateSelection(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <input
                    type="time"
                    className="w-full h-10 rounded-lg border border-gray-300 px-3"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Story</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {originalStories.map(story => (
                    <div
                      key={story.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleScheduleStory(story.id)}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 relative">
                        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                        {story.locked && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{story.title}</h3>
                        <p className="text-xs text-gray-500">{story.duration} {story.locked && '• Premium'}</p>
                      </div>
                      {story.locked && (
                        <div className="text-gray-400 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleScheduleStory(originalStories[0].id)}
                disabled={!selectedDate}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 text-sm ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Schedule Story
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default SleepStories;
