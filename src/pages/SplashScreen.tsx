
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

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
      }, currentScreen === 0 ? 3000 : 5000); // 3 seconds for first screen, 5 seconds for second screen
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
    // Screen 1: Blue gradient background with the Hushhly logo and an attractive design
    <div 
      key="screen-1" 
      className={`flex flex-col h-full relative overflow-hidden ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-800 ease-in-out`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-meditation-lightBlue via-meditation-mediumBlue to-meditation-darkBlue overflow-hidden">
        {/* Animated patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M0,0 L100,0 L100,100 L0,100 Z" 
                fill="none" 
                stroke="white" 
                strokeWidth="0.5"
                strokeDasharray="5,5"
                className="animate-spin-slow"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="30" 
                fill="none" 
                stroke="white" 
                strokeWidth="0.5" 
                className="animate-pulse-subtle"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="20" 
                fill="none" 
                stroke="white" 
                strokeWidth="0.3" 
                className="animate-pulse-subtle"
                style={{animationDelay: '1s'}}
              />
            </svg>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="flex-grow flex items-center justify-center relative z-10">
        <img 
          src="/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-pulse"
        />
      </div>
    </div>,
    
    // Screen 2: White background with purple Hushhly logo
    <div 
      key="screen-2" 
      className={`flex flex-col h-full bg-white ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-800 ease-in-out`}
    >
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
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
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Welcome to Hushhly</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 animate-slide-up">
        A smarter way to experience <br /> the benefits of daily meditation <br /> and mindfulness
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center animate-scale-in"
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
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Personalized Meditation Plans</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 animate-slide-up">
        Tailored meditations based on your <br /> goals, mood, and schedule to <br /> maximize benefits
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center animate-scale-in"
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
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">AI Enhanced Experience</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 animate-slide-up">
        Our AI learns your preferences to <br /> improve your mindfulness journey <br /> over time
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center animate-scale-in"
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
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-40 h-auto"
        />
      </div>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8 animate-fade-in">Progress Tracking & Insights</h2>
      <div>
        <img 
          src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
          alt="Meditation Bear" 
          className="w-48 h-auto mb-8"
        />
      </div>
      <p className="text-sm text-gray-600 mb-10 animate-slide-up">
        Track your meditation journey and <br /> get personalized insights to <br /> improve
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center animate-scale-in"
      >
        Get Started <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  ];

  // Progress indicators - only show for content screens (screens 2-6)
  const renderProgressIndicators = () => {
    if (currentScreen >= 2) {
      return (
        <div className="flex space-x-2 absolute bottom-10 left-1/2 transform -translate-x-1/2">
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
