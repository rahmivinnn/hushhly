
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 6;

  // Auto advance only for the first screen after a short delay
  useEffect(() => {
    if (currentScreen === 0) {
      const timer = setTimeout(() => {
        setCurrentScreen(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigate('/meditation');
    }
  };

  // Define the content for each screen
  const screens = [
    // Screen 1: Simple logo splash
    <div key="screen-1" className="flex flex-col items-center justify-center h-full">
      <h1 className="text-white text-4xl font-semibold">Hushhly</h1>
    </div>,
    
    // Screen 2: Welcome to Hushhly
    <div key="screen-2" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <h1 className="text-meditation-lightBlue text-2xl font-semibold mb-2">Hushhly</h1>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Welcome to Hushhly</h2>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
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
    
    // Screen 3: Personalized Meditation Plans
    <div key="screen-3" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <h1 className="text-meditation-lightBlue text-2xl font-semibold mb-2">Hushhly</h1>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Personalized Meditation Plans</h2>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
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
    
    // Screen 4: AI Enhanced Experience
    <div key="screen-4" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <h1 className="text-meditation-lightBlue text-2xl font-semibold mb-2">Hushhly</h1>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">AI Enhanced Experience</h2>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
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
    
    // Screen 5: Guided Meditation Sessions
    <div key="screen-5" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <h1 className="text-meditation-lightBlue text-2xl font-semibold mb-2">Hushhly</h1>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Guided Meditation Sessions</h2>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        Expert-led sessions to help you <br /> focus, relax, and enhance your <br /> wellbeing
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-mediumBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 6: Progress Tracking & Insights
    <div key="screen-6" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <h1 className="text-meditation-lightBlue text-2xl font-semibold mb-2">Hushhly</h1>
      <h2 className="text-meditation-lightBlue text-lg font-medium mb-8">Progress Tracking & Insights</h2>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
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

  // Render background gradient based on the current screen
  const getBackgroundStyle = () => {
    // First screen has full gradient, others have white background
    if (currentScreen === 0) {
      return "bg-gradient-to-br from-[#00AEEF] to-[#0072BC]";
    }
    return "bg-white";
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center h-screen ${getBackgroundStyle()} transition-colors duration-500`}
    >
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
