import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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
        }, 400); // Faster fade-out animation
      }, currentScreen === 0 ? 1000 : 1500); // Faster delays
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setAnimating(false);
      }, 300); // Even faster transition for manual navigation
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/sign-up');
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentScreen > 2) { // Only allow going back after the intro screens
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 300);
  };

  // Define the content for each screen
  const screens = [
    // Screen 1: Blue gradient background with the Hushhly white text logo only
    <div 
      key="screen-1" 
      className={`flex flex-col h-full relative overflow-hidden ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-500 ease-in-out`}
    >
      {/* Blue gradient background (using the exact gradient from the reference) */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-800 overflow-hidden"
      >
        {/* No cloud decorations, just the gradient background */}
      </div>
      
      {/* Center Hushhly logo - using the white version */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        <img 
          src="/lovable-uploads/e9395b45-6afe-48dc-8187-561a5538e0f9.png" 
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
      } transition-all duration-500 ease-in-out`}
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
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
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
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          A smarter way to experience <br /> the benefits of daily meditation <br /> and mindfulness
        </p>
        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,
    
    // Screen 4: Personalized Meditation Plans
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
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
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Tailored meditations based on your <br /> goals, mood, and schedule to <br /> maximize benefits
        </p>
        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,
    
    // Screen 5: AI Enhanced Experience
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
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
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Our AI learns your preferences to <br /> improve your mindfulness journey <br /> over time
        </p>
        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>,
    
    // Screen 6: Progress Tracking & Insights
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Back button and Skip text in the header */}
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleSkip} className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors">
          Skip for now
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
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
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-10 animate-slide-up">
          Track your meditation journey and <br /> get personalized insights to <br /> improve
        </p>
        <Button 
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 rounded-full flex items-center animate-scale-in mb-6"
        >
          Get Started <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
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
                  ? 'bg-blue-500 scale-125' 
                  : index + 2 < currentScreen 
                    ? 'bg-blue-400 opacity-70' 
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
