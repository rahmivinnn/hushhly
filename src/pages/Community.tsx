
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Search, MessageSquare, Heart, Share2, BookmarkPlus, Play, Send, X, User, MoreHorizontal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from '@/components/BottomNavigation';
import VideoPopup from '@/components/VideoPopup';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    videoId?: string;
  };
  likes: number;
  comments: number;
  image?: string;
  timestamp: string;
  liked?: boolean;
  saved?: boolean;
  commentsList?: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }[];
}

interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  image: string;
  joined?: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  description: string;
  image: string;
  attending?: boolean;
}

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<{title: string, duration: string, videoId?: string}>({title: "", duration: ""});
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>('feed');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  
  const commentsRef = useRef<HTMLDivElement>(null);

  // Generate 100 posts based on the template
  const generatePosts = (): Post[] => {
    const basePosts: Post[] = [
      {
        id: "1",
        user: {
          name: "Sarah Johnson",
          avatar: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png"
        },
        content: "Just completed my 30-day meditation challenge! It's been amazing for my mental health and sleep quality. Anyone else doing regular meditation?",
        meditation: {
          title: "Morning Calm",
          duration: "15 Min",
          videoId: "nRkP3lKj_lY"
        },
        likes: 42,
        comments: 8,
        image: "/lovable-uploads/04addd5f-81b9-44e8-817f-927a5b187225.png",
        timestamp: "2 hours ago",
        commentsList: [
          {
            id: "c1",
            user: {
              name: "Michael Chen",
              avatar: "/lovable-uploads/b1f1e2a8-90e5-40f7-b499-00798b4a4ae9.png"
            },
            content: "I'm on day 20 of the same challenge! It's transformative!",
            timestamp: "1 hour ago"
          },
          {
            id: "c2",
            user: {
              name: "Emma Wilson",
              avatar: "/lovable-uploads/e58f1270-59e3-4ee3-973d-f1c45cb79dee.png"
            },
            content: "Could you share more about your routine?",
            timestamp: "45 minutes ago"
          }
        ]
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
          duration: "20 Min",
          videoId: "rnDiXEhkBd8"
        },
        likes: 29,
        comments: 12,
        image: "/lovable-uploads/b818fcbe-50cc-4c46-b707-dff61eab138c.png",
        timestamp: "5 hours ago",
        commentsList: [
          {
            id: "c3",
            user: {
              name: "Sarah Johnson",
              avatar: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png"
            },
            content: "I've been struggling with sleep. Will definitely try this!",
            timestamp: "4 hours ago"
          }
        ]
      },
      {
        id: "3",
        user: {
          name: "Emma Wilson",
          avatar: "/lovable-uploads/e58f1270-59e3-4ee3-973d-f1c45cb79dee.png"
        },
        content: "I've been struggling with work stress, but the Focus Meditation sessions have been a game-changer. Anyone else using meditation at work?",
        meditation: {
          title: "Focus Meditation",
          duration: "10 Min",
          videoId: "U5o8UiYxfeY"
        },
        likes: 18,
        comments: 5,
        image: "/lovable-uploads/f4201790-0560-4528-a07c-82d09d7d8c95.png",
        timestamp: "Yesterday",
        commentsList: []
      }
    ];
    
    // Generate 97 more posts based on the template
    const allPosts: Post[] = [...basePosts];
    for (let i = 4; i <= 100; i++) {
      const templatePost = basePosts[i % 3];
      allPosts.push({
        ...templatePost,
        id: `${i}`,
        timestamp: `${i % 24} hours ago`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        commentsList: []
      });
    }
    
    return allPosts;
  };
  
  const [posts, setPosts] = useState<Post[]>(generatePosts());
  
  const groups: Group[] = [
    {
      id: "1",
      name: "Mindful Morning Crew",
      members: 1248,
      description: "Join us for daily morning meditation sessions and discussions",
      image: "/lovable-uploads/dd78a943-7740-468a-906f-4bbf388b15c5.png",
      joined: false
    },
    {
      id: "2",
      name: "Anxiety Support Circle",
      members: 974,
      description: "A safe space to share anxiety experiences and meditation techniques",
      image: "/lovable-uploads/ed40a4ff-9341-40c0-be34-87734a264cb6.png",
      joined: false
    },
    {
      id: "3",
      name: "Sleep Better Together",
      members: 1593,
      description: "Community focused on improving sleep quality through meditation",
      image: "/lovable-uploads/c069a9b6-64bb-4c12-8919-cac5a122d8c4.png",
      joined: false
    },
    {
      id: "4",
      name: "Workplace Zen",
      members: 821,
      description: "Meditation techniques for busy professionals",
      image: "/lovable-uploads/22d3aeff-cdab-4eb2-bf79-20758a4f67e5.png",
      joined: false
    }
  ];
  
  const events: Event[] = [
    {
      id: "1",
      title: "Global Meditation Day",
      date: "May 21, 2023",
      time: "10:00 AM - 12:00 PM",
      participants: 327,
      description: "Join thousands worldwide for a synchronized meditation session",
      image: "/lovable-uploads/dd78a943-7740-468a-906f-4bbf388b15c5.png",
      attending: false
    },
    {
      id: "2",
      title: "Breathwork Workshop",
      date: "June 5, 2023",
      time: "2:00 PM - 3:30 PM",
      participants: 124,
      description: "Learn advanced breathing techniques for deeper meditation",
      image: "/lovable-uploads/ed40a4ff-9341-40c0-be34-87734a264cb6.png",
      attending: false
    },
    {
      id: "3",
      title: "Mindfulness Retreat (Virtual)",
      date: "June 17-19, 2023",
      time: "Full day",
      participants: 98,
      description: "Three-day virtual retreat focusing on mindfulness practices",
      image: "/lovable-uploads/c069a9b6-64bb-4c12-8919-cac5a122d8c4.png",
      attending: false
    }
  ];
  
  const [groupsList, setGroupsList] = useState<Group[]>(groups);
  const [eventsList, setEventsList] = useState<Event[]>(events);
  
  useEffect(() => {
    // Scroll to comments when they're opened
    if (showComments && commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showComments]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.liked || false;
        return { 
          ...post, 
          liked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1 
        };
      }
      return post;
    }));
    
    toast({
      title: "Post Liked",
      description: "Your appreciation has been recorded",
    });
  };
  
  const handleComment = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };
  
  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShowSharePopup(true);
  };
  
  const handleShareClose = () => {
    setShowSharePopup(false);
    setSharePostId(null);
  };
  
  const handleShareVia = (method: string) => {
    toast({
      title: `Share via ${method}`,
      description: `Post shared via ${method}`,
    });
    setShowSharePopup(false);
  };
  
  const handleSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
    
    toast({
      title: "Post Saved",
      description: "Added to your saved items",
    });
  };
  
  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return;
    
    const now = new Date();
    const newComment = {
      id: `c${Date.now()}`,
      user: {
        name: "You",
        avatar: "/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png"
      },
      content: commentText,
      timestamp: "Just now"
    };
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedCommentsList = [...(post.commentsList || []), newComment];
        return { 
          ...post, 
          comments: post.comments + 1,
          commentsList: updatedCommentsList
        };
      }
      return post;
    }));
    
    setCommentText("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
    });
  };
  
  const handlePlayMeditation = (title: string, duration: string, videoId?: string) => {
    setCurrentVideo({title, duration, videoId});
    setShowVideoPopup(true);
  };
  
  const handleJoinGroup = (groupId: string) => {
    setGroupsList(groupsList.map(group => {
      if (group.id === groupId) {
        return { ...group, joined: !group.joined };
      }
      return group;
    }));
    
    toast({
      title: "Group Joined",
      description: "You've successfully joined the group",
    });
  };
  
  const handleAttendEvent = (eventId: string) => {
    setEventsList(eventsList.map(event => {
      if (event.id === eventId) {
        return { ...event, attending: !event.attending };
      }
      return event;
    }));
    
    toast({
      title: "Event RSVP",
      description: "You're now attending this event",
    });
  };

  const handleCreatePost = () => {
    toast({
      title: "Create Post",
      description: "Opening post creator...",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 pt-4 pb-6">
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
                <Avatar>
                  <AvatarImage src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" alt="Your avatar" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div 
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 text-sm"
                  onClick={handleCreatePost}
                >
                  Share your meditation journey...
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <button 
                  className="text-blue-500 text-sm flex items-center"
                  onClick={handleCreatePost}
                >
                  <Play size={14} className="mr-1" /> Meditation
                </button>
                <button 
                  className="text-blue-500 text-sm flex items-center"
                  onClick={handleCreatePost}
                >
                  <Heart size={14} className="mr-1" /> Feeling
                </button>
                <button 
                  className="text-blue-500 text-sm flex items-center"
                  onClick={handleCreatePost}
                >
                  <Share2 size={14} className="mr-1" /> Photo
                </button>
              </div>
            </div>
            
            {/* Posts */}
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {/* Post header */}
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{post.user.name}</h3>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                    <button className="ml-auto text-gray-400">
                      <MoreHorizontal size={16} />
                    </button>
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
                        onClick={() => handlePlayMeditation(
                          post.meditation!.title, 
                          post.meditation!.duration,
                          post.meditation!.videoId
                        )}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                      >
                        <Play size={16} fill="white" />
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
                      className={`flex items-center text-sm ${post.liked ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart size={16} className="mr-1" fill={post.liked ? "currentColor" : "none"} /> Like
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
                      className={`flex items-center text-sm ${post.saved ? 'text-blue-500' : 'text-gray-600'}`}
                    >
                      <BookmarkPlus size={16} className="mr-1" fill={post.saved ? "currentColor" : "none"} /> Save
                    </button>
                  </div>
                  
                  {/* Comments section */}
                  {showComments === post.id && (
                    <div className="mt-4 border-t border-gray-100 pt-3" ref={commentsRef}>
                      <h4 className="text-sm font-medium mb-2">Comments</h4>
                      
                      {post.commentsList && post.commentsList.length > 0 ? (
                        <div className="space-y-3 mb-3">
                          {post.commentsList.map(comment => (
                            <div key={comment.id} className="flex space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium">{comment.user.name}</p>
                                  <p className="text-xs text-gray-500">{comment.timestamp}</p>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No comments yet. Be the first to comment!</p>
                      )}
                      
                      {/* Add comment input */}
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src="/lovable-uploads/df2bc0e8-7436-48b5-b6e7-d2d242a0136f.png" alt="Your avatar" />
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder="Write a comment..." 
                            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSubmitComment(post.id);
                              }
                            }}
                          />
                          <button 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
                            onClick={() => handleSubmitComment(post.id)}
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {groupsList.map(group => (
              <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                    <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{group.members} members</p>
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    <button 
                      onClick={() => handleJoinGroup(group.id)}
                      className={`${
                        group.joined 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-blue-500 text-white'
                      } px-4 py-1 rounded-full text-xs font-medium`}
                    >
                      {group.joined ? 'Joined' : 'Join Group'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 flex items-center justify-center"
              onClick={() => {
                toast({
                  title: "Discover More Groups",
                  description: "Exploring more meditation groups...",
                });
              }}
            >
              <span className="mr-2">Discover More Groups</span>
            </button>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="space-y-4">
            {eventsList.map(event => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="mb-3 rounded-lg overflow-hidden h-32">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium">{event.title}</h3>
                <div className="flex items-center text-sm text-gray-500 my-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock size={14} className="mr-1" />
                  <span>{event.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{event.participants} participants</p>
                  <button 
                    onClick={() => handleAttendEvent(event.id)}
                    className={`${
                      event.attending 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    } px-4 py-1 rounded-full text-xs font-medium`}
                  >
                    {event.attending ? 'Attending' : 'Attend'}
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4 flex items-center justify-center"
              onClick={() => {
                toast({
                  title: "Find More Events",
                  description: "Discovering meditation events near you...",
                });
              }}
            >
              <span className="mr-2">Find More Events</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Share Post</h3>
              <button onClick={handleShareClose} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={() => handleShareVia('WhatsApp')}
                className="w-full py-2 bg-green-500 text-white rounded-lg flex items-center justify-center"
              >
                WhatsApp
              </button>
              <button 
                onClick={() => handleShareVia('Facebook')}
                className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
              >
                Facebook
              </button>
              <button 
                onClick={() => handleShareVia('Twitter')}
                className="w-full py-2 bg-blue-400 text-white rounded-lg flex items-center justify-center"
              >
                Twitter
              </button>
              <button 
                onClick={() => handleShareVia('Email')}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center"
              >
                Email
              </button>
              <button 
                onClick={() => handleShareVia('Copy Link')}
                className="w-full py-2 bg-gray-800 text-white rounded-lg flex items-center justify-center"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Video Popup */}
      {showVideoPopup && (
        <VideoPopup
          title={currentVideo.title}
          duration={currentVideo.duration}
          videoId={currentVideo.videoId}
          onClose={() => setShowVideoPopup(false)}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Community;
