
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import StatusBar from '@/components/StatusBar';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 8; // Now we have 8 screens total (2 initial + 6 original)
  const [animating, setAnimating] = useState(false);

  // Auto advance only for the first few screens after a short delay
  useEffect(() => {
    if (currentScreen < 2) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(currentScreen + 1);
          setAnimating(false);
        }, 500); // Duration of fade-out animation
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setAnimating(false);
      }, 300);
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/meditation');
      }, 300);
    }
  };

  // Define the content for each screen
  const screens = [
    // Screen 1: White background with blue Hushhly logo (initial)
    <div 
      key="screen-1" 
      className={`flex flex-col items-center h-full bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
    >
      <StatusBar />
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto"
        />
      </div>
    </div>,
    
    // Screen 2: Blue gradient background with white Hushhly logo (second)
    <div 
      key="screen-2" 
      className={`flex flex-col items-center h-full bg-gradient-to-b from-meditation-lightBlue via-meditation-mediumBlue to-meditation-darkBlue ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
    >
      <StatusBar />
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/0981a356-f652-4bd3-92d9-eb41d75469be.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto"
        />
      </div>
    </div>,
    
    // Screen 3: Simple logo splash (formerly Screen 1)
    <div 
      key="screen-3" 
      className={`flex flex-col items-center justify-center h-full bg-gradient-to-b from-meditation-lightBlue via-meditation-mediumBlue to-meditation-darkBlue ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
    >
      <div className="animate-pulse-subtle">
        <img 
          src="/lovable-uploads/0981a356-f652-4bd3-92d9-eb41d75469be.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto"
        />
      </div>
    </div>,
    
    // Screen 4: Welcome to Hushhly (formerly Screen 2)
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 opacity-0 animate-slide-up-delay-1">Welcome to Hushhly</h2>
      <div className="animate-float opacity-0 animate-slide-up-delay-2">
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 opacity-0 animate-slide-up-delay-3">
        A smarter way to experience <br /> the benefits of daily meditation <br /> and mindfulness
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center opacity-0 animate-slide-up-delay-3"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 5: Personalized Meditation Plans (formerly Screen 3)
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 opacity-0 animate-slide-up-delay-1">Personalized Meditation Plans</h2>
      <div className="animate-float opacity-0 animate-slide-up-delay-2">
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 opacity-0 animate-slide-up-delay-3">
        Tailored meditations based on your <br /> goals, mood, and schedule to <br /> maximize benefits
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center opacity-0 animate-slide-up-delay-3"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 6: AI Enhanced Experience (formerly Screen 4)
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 opacity-0 animate-slide-up-delay-1">AI Enhanced Experience</h2>
      <div className="animate-float opacity-0 animate-slide-up-delay-2">
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 opacity-0 animate-slide-up-delay-3">
        Our AI learns your preferences to <br /> improve your mindfulness journey <br /> over time
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center opacity-0 animate-slide-up-delay-3"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 7: Guided Meditation Sessions (formerly Screen 5)
    <div 
      key="screen-7" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 opacity-0 animate-slide-up-delay-1">Guided Meditation Sessions</h2>
      <div className="animate-float opacity-0 animate-slide-up-delay-2">
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 opacity-0 animate-slide-up-delay-3">
        Expert-led sessions to help you <br /> focus, relax, and enhance your <br /> wellbeing
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center opacity-0 animate-slide-up-delay-3"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 8: Progress Tracking & Insights (formerly Screen 6)
    <div 
      key="screen-8" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 opacity-0 animate-slide-up-delay-1">Progress Tracking & Insights</h2>
      <div className="animate-float opacity-0 animate-slide-up-delay-2">
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 opacity-0 animate-slide-up-delay-3">
        Track your meditation journey and <br /> get personalized insights to <br /> improve
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center opacity-0 animate-slide-up-delay-3"
      >
        Get Started <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  ];

  // Progress indicators - only show for info screens (screens 3-8)
  const renderProgressIndicators = () => {
    if (currentScreen > 2) {
      return (
        <div className="flex space-x-2 absolute bottom-10">
          {[...Array(totalScreens - 3)].map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 3 === currentScreen 
                  ? 'bg-meditation-lightBlue scale-125' 
                  : index + 3 < currentScreen 
                    ? 'bg-meditation-lightBlue opacity-70' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Current screen content */}
      {screens[currentScreen]}
      
      {/* Progress indicators */}
      {renderProgressIndicators()}
    </div>
  );
};

export default SplashScreen;
