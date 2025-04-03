
import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationProps {
  onClose: () => void;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartMeditation = () => {
    navigate('/meditation');
    toast({
      title: "Starting Meditation",
      description: "Initiating your personalized AI-recommended session",
    });
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={onClose}
            className="text-white p-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-semibold">AI Recommendation</h1>
          <div className="w-8"></div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-grow px-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-semibold mb-3">Your Personalized Recommendation</h2>
            <p className="text-white/90 mb-6">
              Based on your mood patterns and meditation history, we recommend a mindfulness session focused on stress reduction and present-moment awareness.
            </p>
            
            <div className="flex items-center justify-between bg-white/20 rounded-xl p-4 mb-6">
              <div>
                <h3 className="text-white font-medium">Mindfulness Meditation</h3>
                <p className="text-white/80 text-sm">15 minutes • Guided</p>
              </div>
              <div>
                <img src="/lovable-uploads/5fb79525-1502-45a7-993c-fd3ee0eafc90.png" alt="Meditation" className="w-12 h-12" />
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-white text-left text-sm font-medium mb-2">Why this works for you:</h4>
              <ul className="text-white/80 text-left text-sm space-y-2">
                <li>• Matches your recent stress patterns</li>
                <li>• Aligns with your preferred meditation length</li>
                <li>• Includes your favorite ambient sounds</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleStartMeditation}
              className="w-full bg-white text-blue-600 hover:bg-white/90 rounded-full py-3 mt-4 flex items-center justify-center"
            >
              <Play size={18} className="mr-2" />
              Start Session Now
            </Button>
          </div>
        </div>
        
        {/* Audio wave visualization */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">08:00</span>
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
