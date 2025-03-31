
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  useEffect(() => {
    // Auto advance animation steps
    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Navigate to main page after animation completes
        navigate('/meditation');
      }
    }, 1500); // 1.5 seconds per step

    return () => clearTimeout(timer);
  }, [currentStep, navigate]);

  // Handle manual step advancement on click/touch
  const handleAdvance = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/meditation');
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-meditation-lightBlue to-meditation-darkBlue"
      onClick={handleAdvance}
    >
      {/* First step: Bear appears */}
      <div className={`transition-all duration-700 ${
        currentStep >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}>
        <img 
          src="/lovable-uploads/6406cb8f-7e3b-40c1-9558-ab53228aa839.png" 
          alt="Meditation Bear" 
          className="w-60 h-60 mb-8 animate-pulse-light"
        />
      </div>

      {/* Second step: Logo appears */}
      <div className={`transition-all duration-700 transform ${
        currentStep >= 1 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}>
        <img 
          src="/lovable-uploads/e58f1270-59e3-4ee3-973d-f1c45cb79dee.png" 
          alt="Hushhly Logo" 
          className="h-16 mb-6"
        />
      </div>

      {/* Third step: Tagline appears */}
      <div className={`transition-all duration-700 ${
        currentStep >= 2 ? 'opacity-100' : 'opacity-0'
      }`}>
        <p className="text-white text-xl font-light">Find your inner peace</p>
      </div>

      {/* Progress indicators */}
      <div className="flex space-x-2 mt-16">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'bg-white scale-125' 
                : index < currentStep 
                  ? 'bg-white opacity-70' 
                  : 'bg-white opacity-30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
