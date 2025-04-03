import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Settings, Maximize } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const Meditation101: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('1:40');
  const [totalTime, setTotalTime] = useState('4:00');
  const [progress, setProgress] = useState(41); // 41% of the progress bar (1:40 of 4:00)
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    // In a real app, this would navigate to the next meditation
    navigate('/meditation');
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      
      // Format time as m:ss
      const currentFormatted = `${Math.floor(current / 60)}:${String(Math.floor(current % 60)).padStart(2, '0')}`;
      const totalFormatted = `${Math.floor(total / 60)}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
      
      setCurrentTime(currentFormatted);
      setTotalTime(totalFormatted);
      setProgress((current / total) * 100);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      
      const newTime = clickPosition * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      
      setProgress(clickPosition * 100);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button onClick={handleBack} className="text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png" 
            alt="Hushhly Logo" 
            className="h-8 mb-2 brightness-0 invert"
          />
          <h1 className="text-2xl font-semibold">Meditation 101</h1>
        </div>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </header>

      {/* Subtitle */}
      <div className="text-center px-6 mb-8">
        <p className="text-xl">Learn How to meditate and practice</p>
      </div>

      {/* Video Player */}
      <div className="relative mx-6 rounded-xl overflow-hidden bg-black/30 aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/lovable-uploads/83b8c257-0ff1-41ee-a3df-f31bfbccb6a3.png"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoTimeUpdate}
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 flex flex-col">
          {/* Title */}
          <div className="p-4">
            <h2 className="text-xl font-medium">Meditation 101</h2>
          </div>

          {/* Controls */}
          <div className="mt-auto p-4 flex flex-col">
            {/* Progress bar */}
            <div 
              className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div 
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <button className="p-2">
                <Play size={24} fill="white" />
              </button>
              <button className="p-2">
                <Volume2 size={24} />
              </button>
              <div className="text-sm">
                {currentTime} / {totalTime}
              </div>
              <button className="p-2">
                <Settings size={24} />
              </button>
              <button className="p-2">
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center space-x-4 my-12">
        <button 
          onClick={handleBack}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Captions Section */}
      <div className="bg-white text-black rounded-t-[40px] flex-grow pt-8 px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-8">Captions</h2>
        <div className="space-y-4">
          <p>
            Lorem ipsum dolor sit amet consectetur. Turpis volutpat et sagittis augue duis vitae nisi. Vitae eget sit mi sed non tortor neque pretium.
          </p>
          <p>
            Donec sit bibendum viverra amet sed varius lacus. Scelerisque vel volutpat eu orci quis viverra fames id eget.
          </p>
          <p>
            Et mi sagittis ultricies dignissim ipsum dui a. Tortor congue in tristique velit.
          </p>
          <p>
            Et mi sagittis ultricies dignissim ipsum dui a. Tortor congue in tristique velit.Et mi sagittis ultricies
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Meditation101; 