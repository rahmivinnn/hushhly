
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
        }, 300); // Faster fade-out animation
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
      }, 200); // Even faster transition for manual navigation
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/sign-up');
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentScreen > 2) { // Only allow going back after the intro screens
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setAnimating(false);
      }, 200);
    }
  };

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 200);
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
      } transition-all duration-300 ease-in-out`}
    >
      {/* New background using the provided image */}
      <div 
        className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-800"
        style={{
          backgroundImage: "url('/lovable-uploads/826e7d87-ec17-4666-b1a2-5c9f443c8385.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-white rounded-full animate-float opacity-70" style={{animationDelay: '0.3s'}}></div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center relative z-10">
        {/* "shh." logo from the new image */}
        <div className="w-48 h-48 flex items-center justify-center">
          <img 
            src="/lovable-uploads/4f330210-bedd-48e1-82c5-3fbd5809d120.png" 
            alt="Hushhly Logo" 
            className="w-full h-auto"
          />
        </div>
        <h1 className="text-white text-4xl font-bold tracking-wider mt-6 animate-pulse-light">
          Hushhly
        </h1>
        <p className="text-white/80 text-lg mt-2">Find your inner peace</p>
      </div>
      
      {/* Wave animation at bottom */}
      <div className="relative h-24 mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="rgba(255,255,255,0.1)" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>,
    
    // Screen 2: White background with purple Hushhly logo
    <div 
      key="screen-2" 
      className={`flex flex-col h-full bg-white ${
        animating 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      } transition-all duration-300 ease-in-out`}
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
      } transition-all duration-200 ease-in-out`}
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
      
      {/* Wave bottom */}
      <div className="relative h-24 w-full mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="#33C3F0" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>,
    
    // Screen 4: Personalized Meditation Plans
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-200 ease-in-out`}
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
      
      {/* Wave bottom */}
      <div className="relative h-24 w-full mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="#33C3F0" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>,
    
    // Screen 5: AI Enhanced Experience
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-200 ease-in-out`}
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
      
      {/* Wave bottom */}
      <div className="relative h-24 w-full mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="#33C3F0" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>,
    
    // Screen 6: Progress Tracking & Insights
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-10' 
          : 'opacity-100 translate-x-0'
      } transition-all duration-200 ease-in-out`}
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
      
      {/* Wave bottom */}
      <div className="relative h-24 w-full mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path 
            fill="#33C3F0" 
            fillOpacity="0.2" 
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
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
