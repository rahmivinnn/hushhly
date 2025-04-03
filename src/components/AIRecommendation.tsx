
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Star, Clock, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AIRecommendationProps {
  onClose: () => void;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(1);
  
  // Automatically hide the intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);
  
  const handleStartMeditation = () => {
    navigate('/meditation');
    toast({
      title: "Starting Meditation",
      description: "Initiating your personalized AI-recommended session",
    });
  };

  const showNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 max-w-sm mx-auto text-center animate-scale-in">
          <img 
            src="/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png" 
            alt="AI" 
            className="w-20 h-20 mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold text-white mb-3">AI Powered Recommendation</h2>
          <p className="text-white/90 mb-4">
            Our advanced AI analyzes your meditation patterns and preferences to create the perfect meditation session just for you.
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: "0.2s"}}></div>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: "0.4s"}}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={onClose}
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-semibold">AI Recommendation</h1>
          <div className="w-8"></div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-grow px-6 text-center overflow-y-auto">
          {step === 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-white text-xl font-semibold mb-3">Your Personalized Recommendation</h2>
              <p className="text-white/90 mb-6">
                Based on your mood patterns and meditation history, we recommend a mindfulness session focused on stress reduction and present-moment awareness.
              </p>
              
              <div className="relative">
                <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-6">
                  <div>
                    <h3 className="text-white font-medium">Mindfulness Meditation</h3>
                    <p className="text-white/80 text-sm">15 minutes • Guided</p>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger>
                        <img src="/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png" alt="Meditation" className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white p-4 rounded-xl shadow-xl">
                        <div className="text-left">
                          <h4 className="font-semibold text-blue-600 mb-2">Mindfulness Meditation</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            This guided meditation focuses on bringing your attention to the present moment, reducing stress and enhancing mental clarity.
                          </p>
                          <div className="flex items-center text-yellow-500 mb-2">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" className="text-gray-300" />
                            <span className="ml-2 text-sm text-gray-700">4.2 (128 ratings)</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="absolute -right-3 -top-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AI Match: 95%
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-white text-left text-sm font-medium mb-2">Why this works for you:</h4>
                <ul className="text-white/80 text-left text-sm space-y-2">
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-300" />
                    Matches your recent stress patterns
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-300" />
                    Aligns with your preferred meditation length
                  </li>
                  <li className="flex items-center">
                    <Check size={16} className="mr-2 text-green-300" />
                    Includes your favorite ambient sounds
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={showNextStep}
                className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-full py-3 mt-4 flex items-center justify-center"
              >
                Tell Me More
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-white text-xl font-semibold mb-3">Session Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Clock size={24} className="mx-auto mb-2 text-white" />
                  <h4 className="text-white text-sm font-medium">Duration</h4>
                  <p className="text-white/80 text-sm">15 minutes</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <Calendar size={24} className="mx-auto mb-2 text-white" />
                  <h4 className="text-white text-sm font-medium">Best Time</h4>
                  <p className="text-white/80 text-sm">Morning</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <h3 className="text-white font-medium mb-2">What to expect</h3>
                <p className="text-white/80 text-sm text-left">
                  This session begins with deep breathing exercises, followed by a body scan 
                  to release tension, and ends with a period of open awareness meditation. 
                  Perfect for beginners and experienced meditators alike.
                </p>
              </div>
              
              <Button 
                onClick={showNextStep}
                className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-full py-3 mt-4 flex items-center justify-center"
              >
                View Benefits
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-white text-xl font-semibold mb-3">Expected Benefits</h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <h4 className="text-white text-sm font-medium mb-1">Reduced Stress & Anxiety</h4>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: "85%"}}></div>
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4">
                  <h4 className="text-white text-sm font-medium mb-1">Improved Focus</h4>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: "70%"}}></div>
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4">
                  <h4 className="text-white text-sm font-medium mb-1">Better Sleep Quality</h4>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: "60%"}}></div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleStartMeditation}
                className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-full py-3 mt-4 flex items-center justify-center"
              >
                <Play size={18} className="mr-2" />
                Start Session Now
              </Button>
            </div>
          )}
        </div>
        
        {/* Audio wave visualization */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">00:00</span>
            <img 
              src="/lovable-uploads/45c1427f-cca7-4c14-accd-61d713b7fe0f.png" 
              alt="Audio visualization" 
              className="h-12 mx-auto" 
            />
            <span className="text-white/70 text-sm">15:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
