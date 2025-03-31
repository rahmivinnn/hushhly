
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 6;
  const [animating, setAnimating] = useState(false);

  // Auto advance only for the first screen after a short delay
  useEffect(() => {
    if (currentScreen === 0) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(1);
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
    // Screen 1: Simple logo splash
    <div 
      key="screen-1" 
      className={`flex flex-col items-center justify-center h-full ${animating ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div className="animate-float">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-pulse-subtle"
        />
      </div>
    </div>,
    
    // Screen 2: Welcome to Hushhly
    <div 
      key="screen-2" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
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
    
    // Screen 3: Personalized Meditation Plans
    <div 
      key="screen-3" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
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
    
    // Screen 4: AI Enhanced Experience
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
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
    
    // Screen 5: Guided Meditation Sessions
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
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
    
    // Screen 6: Progress Tracking & Insights
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className="mb-2 opacity-0 animate-slide-up">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
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

  // Render background gradient based on the current screen
  const getBackgroundStyle = () => {
    // First screen has full gradient, others have white background
    if (currentScreen === 0) {
      return "bg-gradient-to-br from-[#5b76c4] to-[#00AEEF]";
    }
    return "bg-white";
  };

  // Floating bubbles for the first screen
  const renderBubbles = () => {
    if (currentScreen === 0) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full bg-white opacity-${Math.floor(Math.random() * 3) + 1}/10 animate-float`} 
              style={{
                width: `${Math.floor(Math.random() * 30) + 10}px`,
                height: `${Math.floor(Math.random() * 30) + 10}px`,
                top: `${Math.floor(Math.random() * 100)}%`,
                left: `${Math.floor(Math.random() * 100)}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.floor(Math.random() * 5) + 3}s`
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center h-screen ${getBackgroundStyle()} transition-colors duration-500`}
    >
      {renderBubbles()}
      
      {/* Current screen content */}
      {screens[currentScreen]}
      
      {/* Progress indicators - only show for screens 1-6 */}
      {currentScreen > 0 && (
        <div className="flex space-x-2 absolute bottom-10">
          {[...Array(totalScreens - 1)].map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 === currentScreen 
                  ? 'bg-meditation-lightBlue scale-125' 
                  : index + 1 < currentScreen 
                    ? 'bg-meditation-lightBlue opacity-70' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
