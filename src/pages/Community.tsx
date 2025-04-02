import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share, MessageSquare, Bookmark, Search, CalendarIcon, Clock, User, Users, MapPin } from 'lucide-react';
import SideMenu from '@/components/SideMenu';
import LogoHeader from '@/components/LogoHeader';
import BottomNavigation from '@/components/BottomNavigation';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'User123',
      avatar: '/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png',
      content: 'Just finished a great meditation session! Feeling refreshed. #meditation #mindfulness',
      likes: 25,
      shares: 5,
      comments: 3,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'MindfulMaddy',
      avatar: '/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png',
      content: 'Sharing my favorite breathing technique for stress relief. Inhale for 4, hold for 7, exhale for 8. #breathingexercises #stressrelief',
      likes: 42,
      shares: 10,
      comments: 8,
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      user: 'ZenMaster',
      avatar: '/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png',
      content: 'Attended an amazing mindfulness workshop today. So much to learn and practice! #mindfulnessworkshop #zen',
      likes: 30,
      shares: 7,
      comments: 5,
      timestamp: '1 day ago'
    },
    {
      id: 4,
      user: 'CalmKate',
      avatar: '/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png',
      content: 'Starting my day with a peaceful meditation by the lake. Nature is the best therapy. #naturemeditation #peacefulmorning',
      likes: 55,
      shares: 15,
      comments: 12,
      timestamp: '2 days ago'
    },
  ]);

  useEffect(() => {
    // Simulate real-time updates (e.g., from a WebSocket)
    const interval = setInterval(() => {
      setPosts(prevPosts => {
        const newPost = {
          id: Date.now(),
          user: `User${Math.floor(Math.random() * 1000)}`,
          avatar: '/lovable-uploads/95bfc0b2-220c-4b1f-aa82-f8b84ee38695.png',
          content: `New post from the community! Feeling ${Math.random() > 0.5 ? 'happy' : 'calm'}. #community #meditation`,
          likes: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 5),
          timestamp: 'Just now'
        };
        return [newPost, ...prevPosts.slice(0, 9)]; // Limit to 10 posts for performance
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLike = (id: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleShare = (id: number) => {
    toast({
      title: "Share",
      description: "Post shared successfully!",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <LogoHeader onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} userName="User Name" />

      {/* Search Bar */}
      <div className="px-4 py-2 bg-gray-100">
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-full shadow-inner"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 mt-4">
        <TabsList>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="trending">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="flex items-center mb-2">
                <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full mr-2" />
                <span className="font-semibold">{post.user}</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 text-sm">{post.timestamp}</span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => handleShare(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
                    <Share size={16} />
                    <span>{post.shares}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-500">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="latest">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="flex items-center mb-2">
                <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full mr-2" />
                <span className="font-semibold">{post.user}</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 text-sm">{post.timestamp}</span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => handleShare(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
                    <Share size={16} />
                    <span>{post.shares}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-500">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="following">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="flex items-center mb-2">
                <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full mr-2" />
                <span className="font-semibold">{post.user}</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 text-sm">{post.timestamp}</span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                    <Heart size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <button onClick={() => handleShare(post.id)} className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
                    <Share size={16} />
                    <span>{post.shares}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-500">
                    <MessageSquare size={16} />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default Community;
