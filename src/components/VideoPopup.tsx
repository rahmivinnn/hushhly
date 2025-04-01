
import React from 'react';
import { X, Volume2, SkipBack, Play, SkipForward, Heart } from 'lucide-react';

interface VideoPopupProps {
  title: string;
  duration: string;
  videoId?: string;
  onClose: () => void;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ title, duration, videoId = 'nRkP3lKj_lY', onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-500">
          <h3 className="text-white font-medium">{title}</h3>
          <button onClick={onClose} className="text-white p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative pt-[56.25%] bg-black">
          {videoId && (
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>
        
        <div className="p-4 text-white space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-sm text-gray-300">{duration} meditation</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
              <Heart size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-around">
            <button className="p-3 hover:bg-white/10 rounded-full">
              <SkipBack size={24} />
            </button>
            <button className="p-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
              <Play size={28} fill="white" />
            </button>
            <button className="p-3 hover:bg-white/10 rounded-full">
              <SkipForward size={24} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Volume2 size={16} />
            <div className="flex-1 h-1 bg-white/30 rounded-full">
              <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
