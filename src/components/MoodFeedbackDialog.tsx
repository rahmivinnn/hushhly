
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MoodIcon from './MoodIcon';

interface MoodFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMood: 'calm' | 'relax' | 'focus' | 'anxious' | null;
}

const MoodFeedbackDialog: React.FC<MoodFeedbackDialogProps> = ({ isOpen, onClose, selectedMood }) => {
  if (!selectedMood) return null;
  
  const getFeedbackContent = () => {
    switch (selectedMood) {
      case 'calm':
        return {
          title: "Feeling Calm Today",
          description: "It's wonderful that you're feeling calm. This is a perfect state for mindfulness and reflection. Would you like to maintain this tranquility with a peaceful meditation?",
          color: "text-blue-500",
        };
      case 'relax':
        return {
          title: "Relaxed Mind, Happy Heart",
          description: "Relaxation is key to reducing stress and improving overall well-being. We have some perfect meditations to help you maintain this serene state.",
          color: "text-green-500",
        };
      case 'focus':
        return {
          title: "Sharp Focus Activated",
          description: "Your focused state is ideal for productivity and achievement. We can suggest some concentration exercises to help you maintain this clarity throughout the day.",
          color: "text-purple-500",
        };
      case 'anxious':
        return {
          title: "We're Here for You",
          description: "It's okay to feel anxious sometimes. Deep breathing and guided meditations can help calm your mind and restore your sense of peace and balance.",
          color: "text-amber-500",
        };
      default:
        return {
          title: "Thank You for Sharing",
          description: "Your emotional well-being matters to us. We'll tailor your experience based on how you're feeling.",
          color: "text-blue-500",
        };
    }
  };
  
  const content = getFeedbackContent();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <div className={`mx-auto p-3 rounded-full ${content.color} bg-opacity-10 mb-4`}>
            <MoodIcon iconType={selectedMood} />
          </div>
          <DialogTitle className={`text-center ${content.color} text-xl`}>
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoodFeedbackDialog;
