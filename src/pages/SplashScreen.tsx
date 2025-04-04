import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 8; // Updated to match the actual number of screens (0-7)
  const [animating, setAnimating] = useState(false);

  // Auto advance from first screen (blue gradient with hushhly blue logo) to second screen (white background)
  // and then from second screen to third screen (bear image)
  useEffect(() => {
    if (currentScreen < 2) { // Auto-advance for first and second screens
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setCurrentScreen(currentScreen + 1);
          setAnimating(false);
        }, 600); // Increase fade-out animation for more visible effect
      }, currentScreen === 0 ? 1800 : 1200); // Longer delays for better visibility
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setAnimating(false);
      }, 500); // Longer transition for manual navigation
    } else {
      setAnimating(true);
      setTimeout(() => {
        navigate('/sign-up');
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) { // Only allow going back after the intro screen
      setAnimating(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen - 1);
        setAnimating(false);
      }, 500);
    }
  };

  const handleSkip = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 300);
  };

  const handleLogin = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-in');
    }, 300);
  };

  const handleSignUp = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/sign-up');
    }, 300);
  };

  // Define the content for each screen
  const screens = [
    // Screen 0: White background with blue gradient Hushhly text but now with blue gradient background
    <div 
      key="screen-0" 
      className={`flex flex-col h-full ${
        animating 
          ? 'opacity-0 scale-90 rotate-3' 
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out`}
      style={{ 
        background: 'linear-gradient(180deg, #0098c1 0%, #2377b0 50%, #4c5ab3 100%)'
      }}
    >
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-float"
        />
      </div>
    </div>,

    // Screen 1: White background with Hushhly logo (second screen)
    <div 
      key="screen-1" 
      className={`flex flex-col h-full ${
        animating 
          ? 'opacity-0 scale-90 -rotate-3' 
          : 'opacity-100 scale-100 rotate-0'
      } transition-all duration-700 ease-in-out bg-white`}
    >
      <div className="flex-grow flex items-center justify-center">
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-pulse-subtle"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>,

    // Screen 2: Welcome to Hushhly with bear image
    <div 
      key="screen-2" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
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
    
    // Screen 3: Personalized Meditation Plans
    <div 
      key="screen-3" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
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
    
    // Screen 4: AI Enhanced Experience
    <div 
      key="screen-4" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
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
    
    // Screen 5: Progress Tracking & Insights
    <div 
      key="screen-5" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-white ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out`}
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
    </div>,

    // Screen 6: Get Started - Blue gradient background (NEW)
    <div 
      key="screen-6" 
      className={`flex flex-col items-center justify-between h-full px-8 text-center bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out relative`}
    >
      {/* Back button in the header */}
      <div className="w-full flex justify-start items-center pt-6 px-4">
        <button onClick={handleBack} className="p-2 text-white hover:bg-blue-600/50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* White Hushhly text logo */}
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto animate-float mb-6 brightness-0 invert"
        />
        <h2 className="text-white text-xl font-medium mb-6 animate-fade-in">Find Your Calm, Anytime, Anywhere</h2>
        <div>
          <img 
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
            alt="Meditation Bear" 
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-sm text-white mb-10 animate-slide-up">
          Your journey to mindfulness begins here
        </p>
        <Button 
          onClick={handleNext}
          className="bg-white text-blue-600 hover:bg-blue-50 px-16 py-6 rounded-full flex items-center justify-center animate-pulse-subtle w-full"
          style={{ animationDuration: '2s' }}
        >
          <span className="text-lg">Get Started</span>
        </Button>
      </div>
      
      {/* Empty div for spacing */}
      <div className="py-6"></div>
    </div>,
    
    // Screen 7: Login/Signup - Blue gradient background (NEW)
    <div 
      key="screen-7" 
      className={`flex flex-col items-center h-full px-8 text-center bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 overflow-auto ${
        animating 
          ? 'opacity-0 translate-x-20 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
      } transition-all duration-500 ease-out relative`}
    >
      {/* Back button in the header */}
      <div className="w-full flex justify-start items-center sticky top-0 pt-6 px-4 bg-gradient-to-b from-blue-400 to-blue-400/80 z-10">
        <button onClick={handleBack} className="p-2 text-white hover:bg-blue-600/50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full py-6">
        {/* White Hushhly text logo */}
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-64 h-auto mb-6 brightness-0 invert"
        />
        <h2 className="text-white text-xl font-medium mb-6 animate-fade-in">Find Your Calm, Anytime, Anywhere</h2>
        <div>
          <img 
            src="/lovable-uploads/cc30d1e6-ebff-46bd-9792-996ff84ec5cb.png" 
            alt="Meditation Bear" 
            className="w-48 h-auto mb-8 animate-pulse-subtle"
            style={{ animationDuration: '3s' }}
          />
        </div>
        
        <div className="w-full space-y-4 mt-4 mb-8">
          <Button 
            onClick={handleLogin}
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-full flex items-center justify-center w-full py-6 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-lg">Login</span>
          </Button>
          
          <Button 
            onClick={handleSignUp}
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-full flex items-center justify-center w-full py-6 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-lg">Sign up</span>
          </Button>
          
          <div className="flex items-center justify-center space-x-2 py-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px bg-white/30 flex-grow"></div>
            <span className="text-white/80">Or Continue with</span>
            <div className="h-px bg-white/30 flex-grow"></div>
          </div>
          
          <div className="flex justify-center space-x-4 pb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => {
                // Open Google authentication popup
                const width = 500;
                const height = 600;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                window.open(
                  'https://accounts.google.com/o/oauth2/auth?client_id=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com&redirect_uri=https://hushhly.vercel.app/auth/google/callback&response_type=code&scope=email%20profile',
                  'Google Login',
                  `width=${width},height=${height},left=${left},top=${top}`
                );
              }}
              className="bg-white p-4 rounded-xl flex items-center justify-center w-24 hover:bg-blue-50 transition-colors"
            >
              <FcGoogle size={24} />
            </button>
            <button 
              onClick={() => {
                // Open Apple authentication popup
                const width = 500;
                const height = 600;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                window.open(
                  'https://appleid.apple.com/auth/authorize?client_id=com.hushhly.service&redirect_uri=https://hushhly.vercel.app/auth/apple/callback&response_type=code&scope=name%20email',
                  'Apple Login',
                  `width=${width},height=${height},left=${left},top=${top}`
                );
              }}
              className="bg-white p-4 rounded-xl flex items-center justify-center w-24 hover:bg-blue-50 transition-colors"
            >
              <FaApple size={24} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ];

  // Progress indicators - only show for content screens (screens 2-5)
  const renderProgressIndicators = () => {
    if (currentScreen >= 2 && currentScreen <= 5) {
      return (
        <div className="flex space-x-2 absolute bottom-10 left-1/2 transform -translate-x-1/2">
          {[...Array(4)].map((_, index) => (
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

  // Update useEffect to navigate to quiz page after all screens
  useEffect(() => {
    if (currentScreen === totalScreens) {
      navigate('/quiz');
    }
  }, [currentScreen, navigate, totalScreens]);

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
