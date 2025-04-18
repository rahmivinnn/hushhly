import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      if (currentQuestion < quizQuestions.length - 1) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
          setAnimating(false);
        }, 300);
      } else {
        navigate('/home');
      }
    }
  };

  const title = "Personalization Quiz";

  const quizQuestions = [
    {
      question: "What's your main goal with meditation?",
      options: [
        "Reduce stress and anxiety",
        "Improve focus and concentration",
        "Better sleep quality",
        "Spiritual growth and self-discovery"
      ]
    },
    {
      question: "How would you describe your meditation experience?",
      options: [
        "Complete beginner",
        "Tried a few times",
        "Regular practice",
        "Experienced meditator"
      ]
    },
    {
      question: "How much time can you dedicate to meditation daily?",
      options: [
        "5 minutes or less",
        "5-10 minutes",
        "10-20 minutes",
        "More than 20 minutes"
      ]
    },
    {
      question: "What time of day do you prefer to meditate?",
      options: [
        "Morning",
        "Afternoon",
        "Evening",
        "Before bed"
      ]
    }
  ];

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full flex justify-between items-center pt-6 px-4">
        <button
          onClick={handleBack}
          className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleSkip}
          className="text-xs text-meditation-lightBlue hover:text-meditation-mediumBlue transition-colors"
        >
          Skip for now
        </button>
      </div>

      <div className="flex justify-center mt-2 mb-4">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="w-32 h-auto"
        />
      </div>

      <div className="w-full px-8 mb-8">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-meditation-lightBlue transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8">
        <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-xl font-semibold text-meditation-darkBlue mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-8">
            {quizQuestions[currentQuestion].question}
          </p>

          <div className="space-y-4 mb-8">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setSelectedOption(index)}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedOption === index
                    ? 'border-blue-500'
                    : 'border-gray-400'
                }`}>
                  {selectedOption === index && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="ml-3">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Button container with higher z-index */}
      <div className="px-8 py-6 z-20 relative">
        <Button
          onClick={handleNext}
          className="w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl flex items-center justify-center"
        >
          {currentQuestion < quizQuestions.length - 1 ? (
            <>Continue <ChevronRight className="ml-1 h-4 w-4" /></>
          ) : (
            "Finish"
          )}
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4 mb-20">
        <div className="flex space-x-2">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-12 rounded-full ${
                index === currentQuestion ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration with waves and SHH logo */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-48 overflow-hidden">
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#0077B6" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0096C7" />
                <stop offset="100%" stopColor="#023E8A" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#03045E" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient1)"
              d="M0,224L60,208C120,192,240,160,360,149.3C480,139,600,149,720,176C840,203,960,245,1080,229.3C1200,213,1320,139,1380,101.3L1440,64L1440,400L1380,400C1320,400,1200,400,1080,400C960,400,840,400,720,400C600,400,480,400,360,400C240,400,120,400,60,400L0,400Z"
            ></path>
            <path
              fill="url(#gradient2)"
              d="M0,224L60,240C120,256,240,288,360,272C480,256,600,192,720,176C840,160,960,192,1080,213.3C1200,235,1320,245,1380,250.7L1440,256L1440,400L1380,400C1320,400,1200,400,1080,400C960,400,840,400,720,400C600,400,480,400,360,400C240,400,120,400,60,400L0,400Z"
            ></path>
            <path
              fill="url(#gradient3)"
              d="M0,288L60,261.3C120,235,240,181,360,176C480,171,600,213,720,218.7C840,224,960,192,1080,197.3C1200,203,1320,245,1380,266.7L1440,288L1440,400L1380,400C1320,400,1200,400,1080,400C960,400,840,400,720,400C600,400,480,400,360,400C240,400,120,400,60,400L0,400Z"
            ></path>
          </svg>

          {/* Add the white SHH logo to bottom left */}
          <div className="fixed bottom-4 left-4 z-20">
            <img
              src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
              alt="Shh"
              className="w-16 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
