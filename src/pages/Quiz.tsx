import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  
  const handleSingleSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentStep]: value
    });
  };
  
  const handleMultiSelect = (option: string) => {
    const currentSelections = (answers[currentStep] as string[]) || [];
    
    if (currentSelections.includes(option)) {
      setAnswers({
        ...answers,
        [currentStep]: currentSelections.filter(item => item !== option)
      });
    } else {
      setAnswers({
        ...answers,
        [currentStep]: [...currentSelections, option]
      });
    }
  };
  
  const isCurrentQuestionAnswered = () => {
    if (quizSteps[currentStep].multiSelect) {
      const selections = (answers[currentStep] as string[]) || [];
      return selections.length > 0;
    }
    return !!answers[currentStep];
  };
  
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
      setAnimating(true);
      setTimeout(() => {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        toast({
          title: "Quiz completed!",
          description: "Your meditation experience has been personalized.",
        });
        navigate('/home');
      }, 500);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimating(false);
      }, 300);
    } else {
      navigate('/sign-up');
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Quiz skipped",
      description: "You can take the quiz later from your profile settings.",
    });
    navigate('/home');
  };
  
  const progressPercentage = ((currentStep + 1) / quizSteps.length) * 100;
  
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
          <span>Question {currentStep + 1} of {quizSteps.length}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col px-8">
        <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-xl font-semibold text-meditation-darkBlue mb-2">
            {quizSteps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-8">
            {quizSteps[currentStep].question}
          </p>
          
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
      
      <div className="relative h-24">
        <div 
          className="absolute bottom-0 left-0 w-full h-24 overflow-hidden"
          style={{
            backgroundImage: "url('/lovable-uploads/667a882a-30fb-4cfa-81b1-3588db97d93d.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            clipPath: "ellipse(100% 55% at 48% 100%)"
          }}
        />
      </div>
    </div>
  );
};

export default Quiz;
