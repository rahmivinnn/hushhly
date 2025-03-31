
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
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-16 animate-fade-in"
      />
    </div>,
    
    // Screen 2: Welcome to Hushhly
    <div key="screen-2" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-12 mb-8"
      />
      <h1 className="text-2xl font-semibold mb-8 text-meditation-darkBlue">Welcome to Hushhly</h1>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        A smarter way to experience the benefits of daily meditation and mindfulness
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-darkBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 3: Personalized Meditation Plans
    <div key="screen-3" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-12 mb-8"
      />
      <h1 className="text-xl font-semibold mb-4 text-meditation-darkBlue">Personalized Meditation Plans</h1>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        Tailored meditations based on your goals, mood, and schedule to maximize benefits
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-darkBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 4: AI Enhanced Experience
    <div key="screen-4" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-12 mb-8"
      />
      <h1 className="text-xl font-semibold mb-4 text-meditation-darkBlue">AI Enhanced Experience</h1>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        Our AI learns your preferences to improve your mindfulness journey over time
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-darkBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 5: Guided Meditation Sessions
    <div key="screen-5" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-12 mb-8"
      />
      <h1 className="text-xl font-semibold mb-4 text-meditation-darkBlue">Guided Meditation Sessions</h1>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        Expert-led sessions to help you focus, relax, and enhance your wellbeing
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-darkBlue text-white px-8 rounded-full flex items-center"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>,
    
    // Screen 6: Progress Tracking & Insights
    <div key="screen-6" className="flex flex-col items-center justify-center h-full px-8 text-center">
      <img 
        src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
        alt="Hushhly Logo" 
        className="h-12 mb-8"
      />
      <h1 className="text-xl font-semibold mb-4 text-meditation-darkBlue">Progress Tracking & Insights</h1>
      <img 
        src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
        alt="Meditation Bear" 
        className="w-48 h-48 mb-8"
      />
      <p className="text-sm text-gray-600 mb-10">
        Track your meditation journey and get personalized insights to improve
      </p>
      <Button 
        onClick={handleNext}
        className="bg-meditation-lightBlue hover:bg-meditation-darkBlue text-white px-8 rounded-full flex items-center"
      >
        Get Started <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  ];

  // Render background gradient based on the current screen
  const getBackgroundStyle = () => {
    // First screen has full gradient, others have white background with gradient header
    if (currentScreen === 0) {
      return "bg-gradient-to-br from-[#4361ee] to-[#4cc9f0]";
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
