
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface QuizStep {
  title: string;
  question: string;
  options?: string[];
  multiSelect?: boolean;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [animating, setAnimating] = useState(false);
  
  // Define quiz steps
  const quizSteps: QuizStep[] = [
    {
      title: "Personalize Your Experience",
      question: "What brings you to Hushhly?",
      options: [
        "Reduce stress & anxiety",
        "Improve focus & productivity",
        "Better sleep quality",
        "Develop mindfulness practice",
        "Spiritual growth"
      ]
    },
    {
      title: "Experience Level",
      question: "What's your meditation experience level?",
      options: [
        "Complete beginner",
        "Some experience",
        "Regular meditator",
        "Advanced practitioner"
      ]
    },
    {
      title: "Time Preference",
      question: "When do you prefer to meditate?",
      options: [
        "Morning",
        "Afternoon",
        "Evening",
        "Before bed",
        "No preference"
      ]
    },
    {
      title: "Session Length",
      question: "How long would you like your sessions to be?",
      options: [
        "5 minutes",
        "10 minutes",
        "15 minutes",
        "20+ minutes",
        "Varying lengths"
      ]
    },
    {
      title: "Additional Interests",
      question: "Select any topics you're interested in:",
      options: [
        "Guided visualization",
        "Breathing techniques",
        "Body scan meditation",
        "Loving-kindness meditation",
        "Walking meditation",
        "Sound healing"
      ],
      multiSelect: true
    }
  ];
  
  // Handle radio button selection
  const handleSingleSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentStep]: value
    });
  };
  
  // Handle checkbox selection for multi-select questions
  const handleMultiSelect = (option: string) => {
    const currentSelections = (answers[currentStep] as string[]) || [];
    
    if (currentSelections.includes(option)) {
      // Remove option if already selected
      setAnswers({
        ...answers,
        [currentStep]: currentSelections.filter(item => item !== option)
      });
    } else {
      // Add option if not already selected
      setAnswers({
        ...answers,
        [currentStep]: [...currentSelections, option]
      });
    }
  };
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (quizSteps[currentStep].multiSelect) {
      const selections = (answers[currentStep] as string[]) || [];
      return selections.length > 0;
    }
    return !!answers[currentStep];
  };
  
  // Go to next step
  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      toast({
        title: "Please make a selection",
        description: "Please select at least one option to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < quizSteps.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimating(false);
      }, 300);
    } else {
      // Final step - complete the quiz
      setAnimating(true);
      setTimeout(() => {
        // Save quiz answers to localStorage
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        
        // Show completion toast
        toast({
          title: "Quiz completed!",
          description: "Your meditation experience has been personalized.",
        });
        
        // Navigate to meditation page
        navigate('/meditation');
      }, 500);
    }
  };
  
  // Go to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimating(false);
      }, 300);
    } else {
      // If on first step, go back to sign-up
      navigate('/sign-up');
    }
  };
  
  // Skip the quiz
  const handleSkip = () => {
    toast({
      title: "Quiz skipped",
      description: "You can take the quiz later from your profile settings.",
    });
    navigate('/meditation');
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / quizSteps.length) * 100;
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
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
      
      {/* Logo */}
      <div className="flex justify-center mt-2 mb-4">
        <img 
          src="/lovable-uploads/cc8b384e-95bb-4fbf-af3b-70bbc53bfd59.png" 
          alt="Hushhly Logo" 
          className="w-32 h-auto" 
        />
      </div>
      
      {/* Progress bar */}
      <div className="w-full px-8 mb-8">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-meditation-lightBlue transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Question {currentStep + 1} of {quizSteps.length}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col px-8">
        <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-xl font-semibold text-meditation-darkBlue mb-2">
            {quizSteps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-8">
            {quizSteps[currentStep].question}
          </p>
          
          {/* Options */}
          {quizSteps[currentStep].multiSelect ? (
            <div className="space-y-4">
              {quizSteps[currentStep].options?.map((option, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start space-x-3 p-4 border rounded-xl hover:border-meditation-lightBlue transition-all cursor-pointer"
                  onClick={() => handleMultiSelect(option)}
                >
                  <Checkbox 
                    id={`option-${idx}`} 
                    checked={(answers[currentStep] as string[] || []).includes(option)}
                    onCheckedChange={() => handleMultiSelect(option)}
                    className="mt-0.5"
                  />
                  <Label 
                    htmlFor={`option-${idx}`}
                    className="font-medium cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup 
              value={answers[currentStep] as string || ""}
              onValueChange={handleSingleSelect} 
              className="space-y-4"
            >
              {quizSteps[currentStep].options?.map((option, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start space-x-3 p-4 border rounded-xl hover:border-meditation-lightBlue transition-all cursor-pointer ${
                    answers[currentStep] === option ? 'border-meditation-lightBlue bg-blue-50' : ''
                  }`}
                  onClick={() => handleSingleSelect(option)}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${idx}`} 
                    className="mt-0.5"
                  />
                  <Label 
                    htmlFor={`option-${idx}`}
                    className="font-medium cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>
      
      {/* Bottom button */}
      <div className="px-8 py-6">
        <Button 
          onClick={handleNext}
          className="w-full h-12 bg-gradient-to-r from-meditation-lightBlue to-meditation-mediumBlue hover:bg-meditation-mediumBlue text-white font-medium rounded-xl flex items-center justify-center"
        >
          {currentStep < quizSteps.length - 1 ? (
            <>Continue <ChevronRight className="ml-1 h-4 w-4" /></>
          ) : (
            "Finish"
          )}
        </Button>
      </div>
      
      {/* Wave bottom decoration */}
      <div className="relative h-24">
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
  );
};

export default Quiz;
