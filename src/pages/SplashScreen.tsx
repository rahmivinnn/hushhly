
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import StatusBar from '@/components/StatusBar';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 6; // Initial screens (2) + content screens (4)
  const [animating, setAnimating] = useState(false);

  // Auto advance only for the first two screens after a short delay
  useEffect(() => {
    if (currentScreen < 2) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(currentScreen + 1);
          setAnimating(false);
        }, 800); // Duration for fade-out animation
      }, 1800); // Delay before transition
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setAnimating(false);
      }, 500);
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/meditation');
      }, 500);
    }
  };

  // Define the content for each screen
  const screens = [
    // Screen 1: White background with blue gradient Hushhly logo
    <div 
      key="screen-1" 
      className={`flex flex-col h-full bg-white ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-800 ease-in-out`}
    >
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/b2f61b89-81b9-4e9d-985a-6bb3d0097476.png" 
          alt="Hushhly Logo" 
          className="w-60 h-auto animate-pulse"
        />
      </div>
    </div>,
    
    // Screen 2: Blue gradient background with white Hushhly logo
    <div 
      key="screen-2" 
      className={`flex flex-col h-full bg-gradient-to-b from-meditation-lightBlue via-meditation-mediumBlue to-meditation-darkBlue ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-800 ease-in-out`}
    >
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/0981a356-f652-4bd3-92d9-eb41d75469be.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-pulse"
        />
      </div>
    </div>,
    
    // Screen 3: Welcome to Hushhly
    <div 
      key="screen-3" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-500 ease-in-out`}
    >
      <div className="mb-2">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Welcome to Hushhly</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10">
        A smarter way to experience <br /> the benefits of daily meditation <br /> and mindfulness
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 4: Personalized Meditation Plans
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-500 ease-in-out`}
    >
      <div className="mb-2">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Personalized Meditation Plans</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10">
        Tailored meditations based on your <br /> goals, mood, and schedule to <br /> maximize benefits
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 5: AI Enhanced Experience
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-500 ease-in-out`}
    >
      <div className="mb-2">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">AI Enhanced Experience</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10">
        Our AI learns your preferences to <br /> improve your mindfulness journey <br /> over time
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 6: Progress Tracking & Insights
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-500 ease-in-out`}
    >
      <div className="mb-2">
        <img 
          src="/lovable-uploads/609e29e9-6bb1-4851-801e-fad263fee6c4.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Progress Tracking & Insights</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10">
        Track your meditation journey and <br /> get personalized insights to <br /> improve
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center"
      >
        Get Started <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  ];

  // Progress indicators - only show for content screens (screens 2-6)
  const renderProgressIndicators = () => {
    if (currentScreen >= 2) {
      return (
        <div className="flex space-x-2 absolute bottom-10">
          {[...Array(totalScreens - 2)].map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 2 === currentScreen 
                  ? 'bg-meditation-lightBlue scale-125' 
                  : index + 2 < currentScreen 
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
