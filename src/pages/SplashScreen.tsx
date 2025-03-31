import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 8; // Increased from 6 to 8 (added 2 new initial screens)
  const [animating, setAnimating] = useState(false);

  // Auto advance for the first two screens after a short delay
  useEffect(() => {
    if (currentScreen === 0) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(1);
          setAnimating(false);
        }, 500); // Duration of fade-out animation
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (currentScreen === 1) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(2);
          setAnimating(false);
        }, 500); // Duration of fade-out animation
      }, 1500);
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

  // StatusBar component for iOS-like status bar
  const StatusBar = () => (
    <div className="fixed top-0 left-0 right-0 h-10 bg-transparent flex items-center justify-between px-5 z-50">
      <div className="text-white text-sm font-semibold">9:41</div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M12.33 4.75c1.7.13 3.35.6 4.83 1.5.4.23.9-.1.79-.56-.43-1.93-2.28-3.36-4.31-3.69-1.85-.32-3.7.04-5.16 1.05-.4.28-.17.87.3.82 1.6-.15 2.84-.24 3.55-.12z" />
            <path d="M5.26 7.02c.96-1.51 2.45-2.63 4.18-3.17.43-.14.37-.76-.08-.8C7.3 2.8 5.29 3.55 3.71 5.01c-1.45 1.32-2.39 3.08-2.7 5.03-.08.43.55.61.77.25.75-1.22 2.05-2.43 3.48-3.27z" />
            <path d="M20.29 6.95c1.43.83 2.73 2.05 3.47 3.26.23.37.86.18.77-.25-.3-1.94-1.24-3.7-2.7-5.02C20.26 3.49 18.25 2.8 16.19 3.05c-.45.05-.5.67-.08.8 1.73.54 3.22 1.66 4.18 3.1z" />
            <path d="M20.4 11.94c.22-.65-.49-1.22-1.05-.83-3.25 2.24-7.18 3.24-10.98 2.76-.66-.08-1.09.65-.64 1.13 3.32 3.55 8.52 4.5 12.91 2.37.55-.27.85-.91.88-1.54.04-.82-.45-1.59-1.12-3.89z" />
          </svg>
        </div>
        <div className="w-4 h-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path fillRule="evenodd" clipRule="evenodd" d="M1 9l11 7 11-7v11H1V9zm0-2l11 7 11-7-11-7L1 7z" />
          </svg>
        </div>
        <div className="w-6 h-3">
          <div className="bg-white w-full h-full rounded-sm relative">
            <div className="absolute right-0 top-0 bottom-0 w-1/6 bg-white rounded-sm mr-px"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Define the content for each screen
  const screens = [
    // Screen 1: Blue gradient with Hushhly text (new)
    <div 
      key="blue-logo" 
      className={`flex flex-col items-center justify-center h-full ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={{ background: 'linear-gradient(to bottom, #00AEEF 0%, #3F64AF 100%)' }}
    >
      <StatusBar />
      <div className="flex items-center justify-center">
        <h1 className="text-white text-6xl font-bold font-script animate-fade-in">Hushhly</h1>
      </div>
    </div>,
    
    // Screen 2: White background with Hushhly text (new)
    <div 
      key="white-logo" 
      className={`flex flex-col items-center justify-center h-full bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <StatusBar />
      <div className="flex items-center justify-center">
        <h1 className="text-transparent bg-gradient-to-r from-meditation-darkBlue to-meditation-lightBlue bg-clip-text text-6xl font-bold font-script animate-fade-in">Hushhly</h1>
      </div>
    </div>,
    
    // Screen 3: Original first screen with logo splash
    <div 
      key="screen-1" 
      className={`flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#5b76c4] to-[#00AEEF] ${animating ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div className="animate-float">
        <img 
          src="/lovable-uploads/a54817e8-f472-4dff-8f63-5fe6b491becf.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-pulse-subtle"
        />
      </div>
      
      {/* Floating bubbles */}
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
    </div>,
    
    // Screen 4: Welcome to Hushhly (was screen 2)
    <div 
      key="screen-2" 
      className={`flex flex-col items-center justify-center h-full px-8 text-center bg-white ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
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
    
    // Remaining screens (5-8) - previously 3-6
    // Screen 5: Personalized Meditation Plans
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
    
    // Screen 6: AI Enhanced Experience
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
    
    // Screen 7: Guided Meditation Sessions
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
    
    // Screen 8: Progress Tracking & Insights
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
  
  // Combine the initial screens with the remaining screens
  const allScreens = [...screens.slice(0, 4), ...screens.slice(4)];

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen transition-colors duration-500"
    >
      {/* Current screen content */}
      {allScreens[currentScreen]}
      
      {/* Progress indicators - only show for screens 3-8 */}
      {currentScreen > 2 && (
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
      )}
    </div>
  );
};

export default SplashScreen;
