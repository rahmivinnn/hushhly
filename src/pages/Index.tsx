import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, SkipBack, Pause, Play, SkipForward, Repeat, Menu, Bell, Trophy } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import SideMenu from '@/components/SideMenu';
import { useToast } from "@/hooks/use-toast";

// Define meditation tracks with nature scene images that match Sleep Stories
const meditationTracks = [
  {
    id: 1,
    title: "The Whispering Forest",
    description: "A walk through a magical, quiet woodland.",
    duration: "15:00",
    image: "/lovable-uploads/f3796138-3de0-44f8-9fab-6a71b48c7632.png" // whispering
  },
  {
    id: 2,
    title: "Starlit Dreams",
    description: "Find peace under a sky full of stars.",
    duration: "12:00",
    image: "/lovable-uploads/97bc74f2-226d-4977-aa93-9b0d386fca75.png" // starlit
  },
  {
    id: 3,
    title: "Painting Forest",
    description: "Relax among the colors of a painted forest.",
    duration: "10:00",
    image: "/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png" // painting
  },
  {
    id: 4,
    title: "The Gentle Night",
    description: "Calm your mind with gentle night sounds.",
    duration: "08:00",
    image: "/lovable-uploads/f2a6ea2d-db0c-4da6-ab79-4c8a4b158fff.png" // gentle
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const { toast } = useToast();

  // Get username from local storage
  const storedUser = localStorage.getItem('user');
  const userName = storedUser ? JSON.parse(storedUser).fullName || JSON.parse(storedUser).name || "Guest" : "Guest";

  // Current meditation info
  const currentTrack = meditationTracks[currentTrackIndex];

  // Check for selected meditation from Sleep Stories
  useEffect(() => {
    const selectedIndex = localStorage.getItem('selectedMeditationIndex');
    if (selectedIndex !== null) {
      const index = parseInt(selectedIndex, 10);
      if (!isNaN(index) && index >= 0 && index < meditationTracks.length) {
        setCurrentTrackIndex(index);
        // Auto-play if coming from sleep stories
        setIsPlaying(true);
      }
      // Clear the selection from localStorage
      localStorage.removeItem('selectedMeditationIndex');
    }
  }, []);

  // Initialize waveform data
  useEffect(() => {
    // Generate random initial waveform data
    const initialWaveform = Array.from({ length: 50 }, () =>
      Math.max(20, Math.min(90, 30 + Math.random() * 60))
    );
    setWaveformData(initialWaveform);

    // Start waveform animation
    startWaveformAnimation();

    return () => {
      if (waveformRef.current) {
        clearInterval(waveformRef.current);
      }
    };
  }, []);

  // Animate waveform
  const startWaveformAnimation = () => {
    if (waveformRef.current) {
      clearInterval(waveformRef.current);
    }

    waveformRef.current = setInterval(() => {
      setWaveformData(prevData => {
        const newData = [...prevData];
        // Animate the waveform with a more elegant, smooth transition
        for (let i = 0; i < newData.length; i++) {
          // Create smoother transitions between bars
          const change = Math.sin(Date.now() / 1000 + i * 0.2) * 5;
          newData[i] = Math.max(20, Math.min(90, newData[i] + change));
        }
        return newData;
      });
    }, 100);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Meditation paused" : "Meditation resumed",
      description: isPlaying ? "Take your time and resume when you're ready." : "Enjoy your meditation session."
    });
  };

  const handleStartMeditation = () => {
    setIsPlaying(true);
    toast({
      title: "Starting Meditation",
      description: "Your meditation session is beginning now."
    });
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % meditationTracks.length);
    if (isPlaying) {
      toast({
        title: "Track Changed",
        description: `Now playing: ${meditationTracks[(currentTrackIndex + 1) % meditationTracks.length].title}`
      });
    }
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? meditationTracks.length - 1 : prevIndex - 1
    );
    if (isPlaying) {
      const newIndex = currentTrackIndex === 0 ? meditationTracks.length - 1 : currentTrackIndex - 1;
      toast({
        title: "Track Changed",
        description: `Now playing: ${meditationTracks[newIndex].title}`
      });
    }
  };

  const handleShuffle = () => {
    let newIndex;
    // Make sure we don't get the same track again
    do {
      newIndex = Math.floor(Math.random() * meditationTracks.length);
    } while (newIndex === currentTrackIndex && meditationTracks.length > 1);

    setCurrentTrackIndex(newIndex);
    toast({
      title: "Random Track Selected",
      description: `Now playing: ${meditationTracks[newIndex].title}`
    });

    // Start playing the new track
    setIsPlaying(true);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleTrophyClick = () => {
    toast({
      title: "Achievements",
      description: "Your meditation achievements will be shown here.",
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications.",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Section with blue gradient background */}
      <div
        className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-b-[30%] pb-48 pt-0 relative overflow-visible"
        style={{ height: '60%' }}
      >
        {/* Header with menu, bell and trophy icons */}
        <div className="px-4 pt-4 pb-2 flex justify-between items-center">
          <button
            onClick={toggleSideMenu}
            className="p-2 text-white"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center">
            <img
              src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
              alt="Shh Logo"
              className="h-8" style={{ filter: 'invert(30%) sepia(36%) saturate(1137%) hue-rotate(210deg) brightness(94%) contrast(85%)' }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNotificationClick}
              className="text-white"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={handleTrophyClick}
              className="text-yellow-400"
            >
              <Trophy size={20} />
            </button>
          </div>
        </div>

        {/* Main Content - increased vertical spacing */}
        <div className="mt-8 flex flex-col items-center justify-center px-4">
          <h1 className="text-white text-xl font-semibold mb-1">{currentTrack.title}</h1>
          <p className="text-white text-sm mb-6">{currentTrack.description}</p>

          {/* Circular Image - adjusted to be fully visible */}
          <div className="relative mb-10">
            <div className="w-48 h-48 rounded-full bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  key={currentTrack.id} // Force re-render on image change
                  src={currentTrack.image}
                  alt="Meditation Visualization"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with white background - aligned to frequency visualization */}
      <div className="flex-1 bg-white rounded-t-[40px] pt-16 px-6 z-10 overflow-y-auto pb-24">
        {/* Waveform Visualization - adjusted position */}
        <div className="w-full mt-6">
          <div className="h-16 w-full">
            <div className="w-full h-full flex items-center justify-between">
              {waveformData.map((height, i) => {
                // Calculate if this bar is in the "active" section (first 40%)
                const isActive = i < waveformData.length * 0.4;
                return (
                  <div
                    key={i}
                    className="h-full flex items-center"
                    style={{ width: `${100 / waveformData.length}%` }}
                  >
                    <div
                      className={`w-full ${isActive ? 'bg-blue-400' : 'bg-gray-200'}`}
                      style={{
                        height: `${height}%`,
                        borderRadius: '2px',
                        transition: 'height 0.3s ease'
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="mt-8 flex justify-between items-center px-4">
          <button
            onClick={handleShuffle}
            className="text-gray-400 hover:text-gray-600 p-2 active:scale-95 transition-transform group"
            aria-label="Shuffle"
          >
            <Shuffle size={20} className="group-hover:text-blue-500 transition-colors" />
          </button>

          <button
            onClick={handlePrevious}
            className="text-gray-400 hover:text-gray-600 p-2 active:scale-95 transition-transform"
            aria-label="Previous"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={handlePlayPause}
            className="bg-blue-400 hover:bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="white" />
            ) : (
              <Play size={20} fill="white" className="ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-gray-600 p-2 active:scale-95 transition-transform"
            aria-label="Next"
          >
            <SkipForward size={24} />
          </button>

          <button
            className="text-gray-400 hover:text-gray-600 p-2 active:scale-95 transition-transform"
            aria-label="Repeat"
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Start Meditation Button */}
        <div className="mt-10 px-4 text-center">
          <button
            onClick={handleStartMeditation}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-6 w-full font-medium shadow-md active:scale-98 transition-transform"
          >
            Start Meditation
          </button>
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        userName={userName}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
