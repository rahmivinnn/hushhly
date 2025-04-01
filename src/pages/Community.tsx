
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Search, MessageSquare, Heart, Share2, BookmarkPlus, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LogoHeader from '@/components/LogoHeader';
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  meditation?: {
    title: string;
    duration: string;
  };
  likes: number;
  comments: number;
  image?: string;
  timestamp: string;
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string}>({title: "", duration: ""});
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>('feed');
  
  const posts: Post[] = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png"
      },
      content: "Just completed my 30-day meditation challenge! It's been amazing for my mental health and sleep quality. Anyone else doing regular meditation?",
      meditation: {
        title: "Morning Calm",
        duration: "15 Min"
      },
      likes: 42,
      comments: 8,
      image: "/lovable-uploads/4954d683-5247-4b61-889b-1baaa2eb1a0d.png",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      user: {
        name: "Michael Chen",
        avatar: "/lovable-uploads/b1f1e2a8-90e5-40f7-b499-00798b4a4ae9.png"
      },
      content: "Found this great sleep meditation. It helped me go from 6 hours of restless sleep to 8 hours of deep sleep. Highly recommend for those with insomnia!",
      meditation: {
        title: "Starlit Dreams",
        duration: "20 Min"
      },
      likes: 29,
      comments: 12,
      timestamp: "5 hours ago"
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar: "/lovable-uploads/e58f1270-59e3-4ee3-973d-f1c45cb79dee.png"
      },
      content: "I've been struggling with work stress, but the Focus Meditation sessions have been a game-changer. Anyone else using meditation at work?",
      likes: 18,
      comments: 5,
      timestamp: "Yesterday"
    }
  ];
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLike = (postId: string) => {
    toast({
      title: "Post Liked",
      description: "Your appreciation has been recorded",
    });
  };
  
  const handleComment = (postId: string) => {
    toast({
      title: "Comment",
      description: "Comments feature coming soon",
    });
  };
  
  const handleShare = (postId: string) => {
    toast({
      title: "Share Post",
      description: "Sharing options coming soon",
    });
  };
  
  const handleSave = (postId: string) => {
    toast({
      title: "Post Saved",
      description: "Added to your saved items",
    });
  };
  
  const handlePlayMeditation = (title: string, duration: string) => {
    setCurrentVideo({title, duration});
    setShowVideoPopup(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-4 pb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={handleBack} className="p-2 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center">
            Community <Users size={18} className="ml-2" />
          </h1>
          <div className="w-8"></div>
        </div>
        
        {/* Search box */}
        <div className="px-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts and people"
              className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 mt-4">
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'feed' ? 'text-white border-b-2 border-white' : 'text-white/70'}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'groups' ? 'text-white border-b-2 border-white' : 'text-white/70'}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'events' ? 'text-white border-b-2 border-white' : 'text-white/70'}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="flex-1 px-4 pt-4">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create post */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" 
                  alt="Your avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div 
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 text-sm"
                  onClick={() => toast({
                    title: "Create Post",
                    description: "Post creation coming soon",
                  })}
                >
                  Share your meditation journey...
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <button className="text-blue-500 text-sm flex items-center">
                  <Play size={14} className="mr-1" /> Meditation
                </button>
                <button className="text-blue-500 text-sm flex items-center">
                  <Heart size={14} className="mr-1" /> Feeling
                </button>
                <button className="text-blue-500 text-sm flex items-center">
                  <Share2 size={14} className="mr-1" /> Photo
                </button>
              </div>
            </div>
            
            {/* Posts */}
            {posts.map(post => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                {/* Post header */}
                <div className="flex items-start space-x-3 mb-3">
                  <img 
                    src={post.user.avatar} 
                    alt={post.user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{post.user.name}</h3>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                
                {/* Post content */}
                <p className="text-sm mb-3">{post.content}</p>
                
                {/* Post image if any */}
                {post.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img src={post.image} alt="Post" className="w-full h-auto" />
                  </div>
                )}
                
                {/* Meditation card if any */}
                {post.meditation && (
                  <div className="mb-3 bg-blue-50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{post.meditation.title}</p>
                      <p className="text-xs text-gray-500">{post.meditation.duration} meditation</p>
                    </div>
                    <button 
                      onClick={() => handlePlayMeditation(post.meditation!.title, post.meditation!.duration)}
                      className="bg-blue-500 text-white rounded-full p-2"
                    >
                      <Play size={16} />
                    </button>
                  </div>
                )}
                
                {/* Post stats */}
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <div>{post.likes} likes</div>
                  <div>{post.comments} comments</div>
                </div>
                
                {/* Post actions */}
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <Heart size={16} className="mr-1" /> Like
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <MessageSquare size={16} className="mr-1" /> Comment
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <Share2 size={16} className="mr-1" /> Share
                  </button>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className="flex items-center text-gray-600 text-sm"
                  >
                    <BookmarkPlus size={16} className="mr-1" /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'groups' && (
          <div className="py-4 text-center">
            <img 
              src="/lovable-uploads/b2f61b89-81b9-4e9d-985a-6bb3d0097476.png" 
              alt="Groups" 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium">Meditation Groups</h3>
            <p className="text-sm text-gray-600 mb-4">Join meditation groups with like-minded people</p>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm"
              onClick={() => toast({
                title: "Groups Feature",
                description: "Group functionality coming soon",
              })}
            >
              Browse Groups
            </button>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="py-4 text-center">
            <img 
              src="/lovable-uploads/b8c99ac8-9d66-4ede-a21c-323b3bdbdaa6.png" 
              alt="Events" 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium">Meditation Events</h3>
            <p className="text-sm text-gray-600 mb-4">Join virtual and local meditation events</p>
            <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm"
              onClick={() => toast({
                title: "Events Feature",
                description: "Events functionality coming soon",
              })}
            >
              Find Events
            </button>
          </div>
        )}
      </div>
      
      {/* Video Popup */}
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Community;
