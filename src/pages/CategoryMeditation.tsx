import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Trophy, Play, Pause, SkipBack, SkipForward, Shuffle, Clock, RefreshCw } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { audioService } from '@/services/audioService';
import { useToast } from "@/hooks/use-toast";

// Define category-specific tracks
const getCategoryTracks = (category: string) => {
  switch (category) {
    case 'Quick Reset':
      return [
        {
          title: "5-Minute Breath Focus",
          duration: "5 Min",
          listeners: "62547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🧠"
        },
        {
          title: "Instant Calm",
          duration: "3 Min",
          listeners: "58932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "🧠"
        },
        {
          title: "Mindful Minute",
          duration: "1 Min",
          listeners: "45678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "🧠"
        }
      ];
    case 'Mindful Parenting':
      return [
        {
          title: "Patience Practice",
          duration: "10 Min",
          listeners: "42547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "💞"
        },
        {
          title: "Emotional Regulation",
          duration: "12 Min",
          listeners: "38932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "💞"
        },
        {
          title: "Present Moment Parenting",
          duration: "15 Min",
          listeners: "35678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "💞"
        }
      ];
    case 'Deep Sleep Recovery':
      return [
        {
          title: "Bedtime Wind-Down",
          duration: "20 Min",
          listeners: "52547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🌙"
        },
        {
          title: "Racing Thoughts Relief",
          duration: "15 Min",
          listeners: "48932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "🌙"
        },
        {
          title: "Night Waking Rescue",
          duration: "10 Min",
          listeners: "45678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "🌙"
        }
      ];
    case 'Start Your Day Calm':
      return [
        {
          title: "Morning Affirmations",
          duration: "8 Min",
          listeners: "42547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "☀️"
        },
        {
          title: "Grounding Practice",
          duration: "10 Min",
          listeners: "38932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "☀️"
        },
        {
          title: "Intention Setting",
          duration: "12 Min",
          listeners: "35678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "☀️"
        }
      ];
    case 'Parent–Child Bonding':
      return [
        {
          title: "Shared Breathing",
          duration: "5 Min",
          listeners: "32547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🧸"
        },
        {
          title: "Mindful Listening",
          duration: "8 Min",
          listeners: "28932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "🧸"
        },
        {
          title: "Bedtime Connection",
          duration: "10 Min",
          listeners: "25678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "🧸"
        }
      ];
    case 'Emotional First Aid':
      return [
        {
          title: "Anxiety Relief",
          duration: "7 Min",
          listeners: "42547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🛠"
        },
        {
          title: "Mom Guilt Antidote",
          duration: "12 Min",
          listeners: "38932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "🛠"
        },
        {
          title: "Frustration Release",
          duration: "8 Min",
          listeners: "35678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "🛠"
        }
      ];
    case 'Affirmations & Mantras':
      return [
        {
          title: "Self-Worth Affirmations",
          duration: "10 Min",
          listeners: "42547 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🌺"
        },
        {
          title: "Calming Mantras",
          duration: "8 Min",
          listeners: "38932 Listening",
          image: "/lovable-uploads/601731bf-474a-425f-a8e9-132cd7ffa027.png",
          icon: "🌺"
        },
        {
          title: "Confidence Boosters",
          duration: "12 Min",
          listeners: "35678 Listening",
          image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
          icon: "🌺"
        }
      ];
    default:
      return [
        {
          title: "Painting Forest",
          duration: "15 Min",
          listeners: "59899 Listening",
          image: "/lovable-uploads/0f00c731-51b5-47e8-8604-6a9fbde4fe91.png",
          icon: "🧘"
        },
        {
          title: "The Whispering Forest",
          duration: "15 Min",
          listeners: "48750 Listening",
          image: "/lovable-uploads/f3796138-3de0-44f8-9fab-6a71b48c7632.png",
          icon: "🧘"
        },
        {
          title: "Starlit Dreams",
          duration: "15 Min",
          listeners: "39084 Listening",
          image: "/lovable-uploads/97bc74f2-226d-4977-aa93-9b0d386fca75.png",
          icon: "🧘"
        },
        {
          title: "The Gentle Night",
          duration: "15 Min",
          listeners: "42568 Listening",
          image: "/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png",
          icon: "🧘"
        }
      ];
  }
};

// Define gradient colors for different categories
const categoryColors: Record<string, { from: string, to: string }> = {
  'Quick Reset': { from: 'from-blue-400', to: 'to-blue-600' },
  'Mindful Parenting': { from: 'from-pink-400', to: 'to-purple-500' },
  'Deep Sleep Recovery': { from: 'from-indigo-400', to: 'to-blue-700' },
  'Start Your Day Calm': { from: 'from-amber-400', to: 'to-orange-500' },
  'Parent–Child Bonding': { from: 'from-green-400', to: 'to-teal-500' },
  'Emotional First Aid': { from: 'from-red-400', to: 'to-pink-600' },
  'Affirmations & Mantras': { from: 'from-purple-400', to: 'to-indigo-600' },
  'default': { from: 'from-cyan-500', to: 'to-blue-600' }
};

interface CategoryMeditationProps {
  title?: string;
  category?: string;
  duration?: string;
}

const CategoryMeditation: React.FC<CategoryMeditationProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get category and meditation info from location state or props
  const state = location.state as { title?: string; category?: string; duration?: string } | null;
  const title = props.title || state?.title || "Meditation";
  const category = props.category || state?.category || "default";
  const duration = props.duration || state?.duration || "15 Min";

  // Get the numeric duration
  const initialDuration = parseInt(duration.split(' ')[0]) || 15;

  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionLength, setSessionLength] = useState(initialDuration);
  const [remainingTime, setRemainingTime] = useState(initialDuration * 60); // in seconds
  // Get tracks for this category
  const availableTracks = getCategoryTracks(category);
  const [selectedTrack, setSelectedTrack] = useState(availableTracks[0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get the gradient colors for the category
  const gradientColors = categoryColors[category] || categoryColors.default;
  const gradientClass = `${gradientColors.from} ${gradientColors.to}`;

  // Initialize timer when session starts
  useEffect(() => {
    if (isPlaying) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            toast({
              title: "Meditation Complete",
              description: `Your ${sessionLength} minute meditation session is complete.`
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, sessionLength, toast]);

  // Reset timer when session length changes
  useEffect(() => {
    setRemainingTime(sessionLength * 60);
  }, [sessionLength]);

  const handleBack = () => {
    // Stop audio and timer before navigating away
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    navigate(-1);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Audio Error",
            description: "There was an error playing the audio. Please try again."
          });
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      // If audio isn't loaded yet, just toggle the state
      setIsPlaying(!isPlaying);
    }
  };

  const adjustSessionLength = () => {
    // Cycle through common meditation lengths: 5, 10, 15, 20, 30 minutes
    const lengths = [5, 10, 15, 20, 30];
    const currentIndex = lengths.indexOf(sessionLength);
    const nextIndex = (currentIndex + 1) % lengths.length;
    const newLength = lengths[nextIndex];

    setSessionLength(newLength);
    setRemainingTime(newLength * 60);

    toast({
      title: "Session Length Updated",
      description: `Meditation session set to ${newLength} minutes.`
    });
  };

  const handleSkipBack = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === selectedTrack.title);
    const prevIndex = (currentIndex - 1 + availableTracks.length) % availableTracks.length;
    setSelectedTrack(availableTracks[prevIndex]);

    toast({
      title: "Previous Track",
      description: `Now playing: ${availableTracks[prevIndex].title}`,
      duration: 2000,
    });
  };

  const handleSkipForward = () => {
    const currentIndex = availableTracks.findIndex(t => t.title === selectedTrack.title);
    const nextIndex = (currentIndex + 1) % availableTracks.length;
    setSelectedTrack(availableTracks[nextIndex]);

    toast({
      title: "Next Track",
      description: `Now playing: ${availableTracks[nextIndex].title}`,
      duration: 2000,
    });
  };

  const handleShuffle = () => {
    // Get random track different from current
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * availableTracks.length);
    } while (availableTracks[randomIndex].title === selectedTrack.title && availableTracks.length > 1);

    setSelectedTrack(availableTracks[randomIndex]);

    toast({
      title: "Track Shuffled",
      description: `Now playing: ${availableTracks[randomIndex].title}`,
      duration: 2000,
    });
  };

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br ${gradientClass} text-white`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button className="text-white" onClick={handleBack}>
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Hushhly Logo"
            className="h-8 brightness-0 invert"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Bell size={24} />
          <Trophy size={24} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 pt-4 pb-12">
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        <p className="text-lg mb-8">Tap the start button when ready</p>

        {/* Start Button */}
        <div className="relative mb-6">
          <div className="w-64 h-64 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-white/20 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg transition-all hover:shadow-xl active:scale-95`}
              >
                <span className="text-4xl font-bold">{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-center mb-6">
          <Clock size={20} className="mr-2" />
          <span className="text-lg">{sessionLength} Min</span>
        </div>

        {/* Background Music Section */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Background Music</h2>

          {/* Music Selection */}
          <div className="bg-white/10 rounded-xl p-3 mb-6">
            <div className="flex items-center mb-2">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mr-3 flex-shrink-0`}>
                <span className="text-4xl">{selectedTrack.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {selectedTrack.title}
                </h3>
                <p className="text-sm text-white/80 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {selectedTrack.duration} • {selectedTrack.listeners}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-between items-center mt-4 mb-4">
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
                onClick={handleShuffle}
              >
                <Shuffle size={20} />
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
                onClick={handleSkipBack}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlayPause}
                className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-colors active:scale-95`}
              >
                {isPlaying ?
                  <Pause size={24} fill="white" /> :
                  <Play size={24} fill="white" className="ml-1" />
                }
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
                onClick={handleSkipForward}
              >
                <SkipForward size={20} />
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
                onClick={handleShuffle}
              >
                <RefreshCw size={20} />
              </button>
            </div>

            {/* Session Length Adjustment */}
            <div className="flex justify-center mt-2">
              <button
                onClick={adjustSessionLength}
                className={`bg-gradient-to-br ${gradientClass} hover:opacity-90 text-white border border-white/20 rounded-full px-4 py-2 text-sm flex items-center justify-center transition-colors active:scale-95`}
              >
                <Clock size={14} className="mr-2" />
                Adjust Session Length
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} loop>
        <source src="/meditation-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CategoryMeditation;
