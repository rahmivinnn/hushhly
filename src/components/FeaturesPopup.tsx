import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeaturesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesPopup: React.FC<FeaturesPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md mx-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl overflow-hidden shadow-xl">
        <div className="relative p-6 text-white">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mt-4 mb-2">
            Free
          </h2>
          
          {/* Description */}
          <p className="text-center mb-6">
            Discover new daily meditations and soothing bedtime stories tailored to your journey.
          </p>

          {/* Tabs */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 rounded-full mb-6">
              <TabsTrigger 
                value="features" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all"
              >
                Pricing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-0">
              <div className="space-y-4">
                {/* Feature 1 */}
                <div className="bg-white/10 rounded-lg p-4 flex items-start">
                  <div className="bg-yellow-300 p-2 rounded-full mr-3">
                    <span className="text-yellow-600">★</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Daily Meditations</h3>
                    <p className="text-white/90 text-sm">New content added every day</p>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="bg-white/10 rounded-lg p-4 flex items-start">
                  <div className="bg-blue-300 p-2 rounded-full mr-3">
                    <span className="text-blue-600">✦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Personalized Journey</h3>
                    <p className="text-white/90 text-sm">Content tailored to your needs</p>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="bg-white/10 rounded-lg p-4 flex items-start">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <span className="text-blue-600">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Premium Audio Quality</h3>
                    <p className="text-white/90 text-sm">High-quality sound for immersion</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0">
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-1">Free Plan</h3>
                  <p className="text-white/90 text-sm mb-2">Access to limited content</p>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Basic meditations
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Limited sleep stories
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Community access
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4 border border-white/30">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-white">Premium Plan</h3>
                    <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Recommended</span>
                  </div>
                  <p className="text-white/90 text-sm mb-2">Full access to all features</p>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> All premium meditations
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Complete sleep story library
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Personalized recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span> Offline downloads
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24">
                <path fill="rgba(255,255,255,0.1)" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                <path fill="rgba(255,255,255,0.1)" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                <path fill="rgba(255,255,255,0.1)" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <div className="bg-white p-4 flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-2 font-medium"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPopup;
