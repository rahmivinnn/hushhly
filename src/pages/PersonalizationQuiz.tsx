import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

const PersonalizationQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(4);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Mock questions
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "What brings you to Hushhly?",
      options: ["Reduce stress", "Sleep better", "Improve focus", "Spiritual growth", "Self-development"]
    },
    {
      id: 2,
      question: "What's your experience with meditation?",
      options: ["Complete beginner", "Some experience", "Regular meditator", "Advanced practitioner"]
    },
    {
      id: 3,
      question: "When do you prefer to meditate?",
      options: ["Morning", "Afternoon", "Evening", "Before bed", "No preference"]
    },
    {
      id: 4,
      question: "How long would you like your sessions to be?",
      options: ["5 minutes", "10 minutes", "15 minutes", "20+ minutes", "Varying lengths"]
    },
    {
      id: 5,
      question: "Do you want meditations for your child as well?",
      options: ["Yes", "No", "Maybe later"]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    } else {
      navigate(-1);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSaveResponse = () => {
    if (!selectedOption) {
      toast({
        title: "Please select an option",
        description: "Select one of the options to continue",
        variant: "destructive"
      });
      return;
    }

    // Save the response
    // In a real app, you'd save this to state/context/backend

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Last question, redirect to home or next screen
      toast({
        title: "Quiz completed!",
        description: "Your preferences have been saved.",
      });
      navigate("/home");
    }
  };

  const handleSkip = () => {
    toast({
      title: "Quiz skipped",
      description: "You can complete the quiz later from your profile.",
    });
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Top bar */}
      <div className="bg-blue-500 text-white h-14 flex items-center px-4">
        <div className="w-full text-center font-semibold text-lg">9:41</div>
        <div className="absolute right-4 flex items-center space-x-1">
          <svg className="w-4 h-4" viewBox="0 0 15 15" fill="none">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="white" />
            <rect x="4" y="1" width="3" height="13" rx="1" fill="white" />
            <rect x="8" y="5" width="3" height="7" rx="1" fill="white" />
            <rect x="12" y="7" width="3" height="5" rx="1" fill="white" />
          </svg>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6" fill="white"/>
          </svg>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="10" rx="2" stroke="white" strokeWidth="2" />
            <path d="M9 14h6v4H9z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-4 px-4">
        <button onClick={handleBack} className="p-2">
          <ArrowLeft className="text-black" size={24} />
        </button>
      </div>

      {/* Logo */}
      <div className="flex justify-center my-8">
        <img
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png"
          alt="Hushhly Logo"
          className="h-16"
        />
      </div>

      {/* Quiz content */}
      <div className="px-6 flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Personalization Quiz</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Q{currentQuestion.id}: {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedOption === option
                      ? 'border-blue-500 bg-white'
                      : 'border-gray-300 bg-white'
                  } flex items-center justify-center mr-3`}
                >
                  {selectedOption === option && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="text-lg">{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="px-4 mb-32">
        <button
          onClick={handleSaveResponse}
          className="w-full py-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white font-semibold text-lg"
        >
          Save My Response
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 mt-4 text-blue-500 font-medium"
        >
          Skip for Now
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4 mb-24">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-12 rounded-full ${
                index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wave and Shh logo */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-64 overflow-hidden">
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full">
            <path
              fill="url(#gradient1)"
              d="M0,224L60,208C120,192,240,160,360,149.3C480,139,600,149,720,176C840,203,960,245,1080,229.3C1200,213,1320,139,1380,101.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
            <path
              fill="url(#gradient2)"
              d="M0,224L60,240C120,256,240,288,360,272C480,256,600,192,720,176C840,160,960,192,1080,213.3C1200,235,1320,245,1380,250.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
            <path
              fill="url(#gradient3)"
              d="M0,288L60,261.3C120,235,240,181,360,176C480,171,600,213,720,218.7C840,224,960,192,1080,197.3C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
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
          </svg>
        </div>

        {/* Shh logo in white */}
        <div className="fixed bottom-4 left-4 z-20">
          <img
            src="/lovable-uploads/600dca76-c989-40af-876f-bd95270e81fc.png"
            alt="Shh"
            className="w-16 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalizationQuiz;