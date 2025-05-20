import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share, MessageSquare, Bookmark, Search, CalendarIcon, Clock, User, MapPin, Menu, Send, Copy, X, MessageCircle, Share2, ChevronUp, ChevronDown, UserPlus, Users } from 'lucide-react';
import SideMenu from '@/components/SideMenu';
import BottomNavigation from '@/components/BottomNavigation';
import HeaderWithLogo from '@/components/HeaderWithLogo';
import PostCard, { PostType } from '@/components/PostCard';
import UserProfileCard, { UserProfileData } from '@/components/UserProfileCard';

interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

interface Post {
  id: number;
  user: string;
  userId: number;
  avatar: string;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: string;
  createdAt: Date;
  isLiked: boolean;
  commentsList: Comment[];
  showComments: boolean;
}

// Sample user names for creating demo data
const userNames = [
  "Sarah Johnson", "Mike Peterson", "Emma Williams", "David Chen",
  "Lisa Rodriguez", "Kevin Patel", "Jessica Kim", "Robert Wilson",
  "Olivia Garcia", "Thomas Brown", "Sophia Nguyen", "Daniel Jackson"
];

// Some sample post content
const postContents = [
  "Just completed a 20-minute meditation session. Feeling so much better!",
  "Has anyone tried the new sleep story? It's amazing 💤",
  "Meditation has completely changed my approach to stressful situations at work.",
  "Looking for recommendations for morning meditation routines?",
  "30 days of consistent meditation and I'm seeing real benefits in my focus and energy levels.",
  "What time of day do you prefer to meditate? Morning or evening?",
  "The breathing exercises in this app have helped my anxiety so much!",
  "Trying to build a meditation habit. Any tips from the community?",
  "Just had the most peaceful meditation session with the sound of rain in the background.",
  "Does anyone else feel like their sleep has improved since starting meditation?",
  "The guided meditations for stress relief are exactly what I needed today.",
  "Celebrating 100 days of meditation streak! 🎉"
];

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'individuals' | 'groups'>('individuals');
  const [isLoading, setIsLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<number[]>([1, 3]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupCreationSuccess, setGroupCreationSuccess] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupPrivacy, setGroupPrivacy] = useState('public');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [communityMembers, setCommunityMembers] = useState<{id: number, name: string, avatar: string, isActive: boolean}[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Generate random timestamps within the last week
  const getRandomDate = (): Date => {
    const now = new Date();
    const randomMinutes = Math.floor(Math.random() * 10080); // Minutes in a week
    return new Date(now.getTime() - randomMinutes * 60000);
  };

  // Format timestamps in a human-readable way
  const getTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      // For older posts, show actual date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Generate sample comments for posts
  const generateComments = (postId: number, count: number): Comment[] => {
    const comments: Comment[] = [];
    for (let i = 0; i < count; i++) {
      const randomUser = Math.floor(Math.random() * userNames.length);
      const userId = randomUser + 1;
      const commentDate = getRandomDate();

      comments.push({
        id: postId * 100 + i,
        userId,
        userName: userNames[randomUser],
        userAvatar: `https://ui-avatars.com/api/?name=${userNames[randomUser].replace(' ', '+')}&background=random`,
        content: [
          "This is so helpful, thanks for sharing!",
          "I've had a similar experience with meditation.",
          "Great insight! 👏",
          "I'm going to try this approach tomorrow.",
          "Has this been working consistently for you?",
          "Thanks for the motivation!",
          "I needed to hear this today.",
          "Agreed 100%.",
          "What app are you using for this?",
          "This community is so supportive! ❤️"
        ][Math.floor(Math.random() * 10)],
        timestamp: getTimestamp(commentDate),
        likes: Math.floor(Math.random() * 10),
        isLiked: Math.random() > 0.7,
        createdAt: commentDate
      });
    }
    return comments;
  };

  // Initialize posts
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const posts: Post[] = [];
      for (let i = 0; i < 12; i++) {
        const userIndex = i % userNames.length;
        const createdAt = getRandomDate();
        posts.push({
          id: i + 1,
          user: userNames[userIndex],
          userId: userIndex + 1,
          avatar: `https://ui-avatars.com/api/?name=${userNames[userIndex].replace(' ', '+')}&background=random`,
          content: postContents[i % postContents.length],
          likes: Math.floor(Math.random() * 20) + 1,
          shares: Math.floor(Math.random() * 5),
          comments: Math.floor(Math.random() * 8),
          timestamp: getTimestamp(createdAt),
          createdAt,
          isLiked: Math.random() > 0.5,
          commentsList: generateComments(i + 1, Math.floor(Math.random() * 5) + 1),
          showComments: false
        });
      }
      setAllPosts(posts);
      setIsLoading(false);
    }, 500);
  }, []);

  // Generate community members
  useEffect(() => {
    const members = userNames.map((name, index) => ({
      id: index + 1,
      name,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
      isActive: Math.random() > 0.3, // Randomly set some users as active
    }));
    setCommunityMembers(members);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLike = (id: number) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );

    toast({
      title: "Post Liked",
      description: "Your appreciation has been recorded.",
    });
  };

  const handleLikeComment = (postId: number, commentId: number) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              commentsList: post.commentsList.map(comment =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                    }
                  : comment
              )
            }
          : post
      )
    );
  };

  const handleComment = (id: number) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );

    // Just toggle comments visibility without setting active post for replies
    if (activePostId === id) {
      setActivePostId(null);
    } else {
      setActivePostId(id);
    }

    // Show toast when viewing comments
    toast({
      title: "Comments",
      description: "Viewing post comments. Reply feature has been disabled.",
    });
  };

  const handleShare = (id: number) => {
    toast({
      title: "Share Post",
      description: "Sharing options would appear here.",
    });

    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post
      )
    );
  };

  const handleFollow = (userId: number) => {
    setFollowedUsers(prev => {
      if (prev.includes(userId)) {
        toast({
          title: "Unfollowed",
          description: `You are no longer following this user.`,
        });
        return prev.filter(id => id !== userId);
      } else {
        toast({
          title: "Following",
          description: `You are now following this user.`,
        });
        return [...prev, userId];
      }
    });
  };

  const handleInvite = () => {
    setShowShareModal(true);
  };

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
  };

  const handleGroupSubmit = () => {
    if (!groupName.trim()) {
      toast({
        title: "Group Name Required",
        description: "Please provide a name for your group.",
      });
      return;
    }

    // Show success state
    setGroupCreationSuccess(true);

    // After showing success message, reset and close modal
    setTimeout(() => {
      setGroupCreationSuccess(false);
      setShowCreateGroupModal(false);
      setGroupName('');
      setGroupDescription('');
      setGroupPrivacy('public');

      // Update the active tab to show groups
      setActiveTab('groups');

      toast({
        title: "Group Created",
        description: `Your group "${groupName}" has been created successfully.`,
      });
    }, 2000);
  };

  const handleCopyLink = () => {
    // In a real app, this would copy the actual invite link
    navigator.clipboard.writeText("https://hushhly.com/invite/community?ref=user123");
    toast({
      title: "Link Copied",
      description: "Invite link has been copied to clipboard",
    });
  };

  const handleShareSocial = (platform: string) => {
    // In a real app, this would open the sharing dialog for the specific platform
    toast({
      title: `Share via ${platform}`,
      description: `Sharing to ${platform}...`,
    });
    setShowShareModal(false);
  };



  // Filter posts based on active tab and search term
  const getFilteredPosts = () => {
    // First apply search filter
    let filtered = allPosts.filter(post =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then apply tab-specific filters
    switch (activeTab) {
      case 'individuals':
        // Sort by timestamp (newest first)
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      case 'groups':
        // For the demo, just return a subset of posts as if they were from groups
        return filtered.filter(post => post.userId % 3 === 0)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      default:
        return filtered;
    }
  };

  const filteredPosts = getFilteredPosts();

  const isFollowing = (userId: number) => followedUsers.includes(userId);

  const handleViewProfile = (userId: number) => {
    // Find the user in community members
    const member = communityMembers.find(m => m.id === userId);

    if (member) {
      // Create a more detailed profile for the selected user
      const userProfile: UserProfileData = {
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        isActive: member.isActive,
        bio: `Hi, I'm ${member.name.split(' ')[0]}! I'm passionate about meditation and mindfulness.`,
        location: ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney'][Math.floor(Math.random() * 5)],
        joinDate: ['January 2023', 'March 2023', 'May 2023', 'July 2023', 'September 2023'][Math.floor(Math.random() * 5)],
        postsCount: Math.floor(Math.random() * 50) + 1,
        followersCount: Math.floor(Math.random() * 200) + 10,
        followingCount: Math.floor(Math.random() * 100) + 5,
        isFollowing: followedUsers.includes(userId),
        interests: [
          'Meditation', 'Mindfulness', 'Sleep', 'Anxiety Relief',
          'Stress Management', 'Focus', 'Productivity', 'Work-Life Balance'
        ].sort(() => 0.5 - Math.random()).slice(0, 4)
      };

      setSelectedUser(userProfile);
      setShowUserProfile(true);
    }
  };

  const handleAddComment = (postId: number, comment: string) => {
    if (!comment.trim()) return;

    const now = new Date();

    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [
                {
                  id: post.commentsList.length > 0
                    ? Math.max(...post.commentsList.map(c => c.id)) + 1
                    : postId * 100,
                  userId: 0, // Current user
                  userName: "You",
                  userAvatar: "https://ui-avatars.com/api/?name=You&background=random",
                  content: comment,
                  timestamp: "Just now",
                  likes: 0,
                  isLiked: false,
                  createdAt: now
                },
                ...post.commentsList
              ]
            }
          : post
      )
    );
  };

  const handleReplyToComment = (postId: number, commentId: number, reply: string) => {
    if (!reply.trim()) return;

    const now = new Date();

    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [
                {
                  id: post.commentsList.length > 0
                    ? Math.max(...post.commentsList.map(c => c.id)) + 1
                    : postId * 100,
                  userId: 0, // Current user
                  userName: "You",
                  userAvatar: "https://ui-avatars.com/api/?name=You&background=random",
                  content: reply,
                  timestamp: "Just now",
                  likes: 0,
                  isLiked: false,
                  createdAt: now
                },
                ...post.commentsList
              ]
            }
          : post
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB] pb-16">
      {/* Header with centered logo */}
      <HeaderWithLogo
        title="Community"
        logoColor="blue"
        bgColor="bg-white"
        textColor="text-gray-800"
        rightElement={
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 p-1" onClick={() => navigate('/notifications')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
            </button>
          </div>
        }
      />

      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} userName="User Name" />

      {/* Community header */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Hushhly Community</h1>
          <span className="ml-2 text-amber-500">🔒</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateGroup}
            className="text-blue-500 bg-blue-50 px-4 py-1 rounded-full text-sm font-medium flex items-center"
          >
            <Users size={14} className="mr-1" />
            Create Group
          </button>
          <button
            onClick={handleInvite}
            className="text-blue-500 bg-blue-50 px-4 py-1 rounded-full text-sm font-medium flex items-center"
          >
            <UserPlus size={14} className="mr-1" />
            Invite
          </button>
        </div>
      </div>

      {/* People in Community Section */}
      <div className="px-4 py-3 bg-white mb-2 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800">People in Community</h2>
          <button
            className="text-blue-500 text-sm"
            onClick={() => {
              toast({
                title: "Community Members",
                description: "View all members feature coming soon",
              });
            }}
          >
            See All
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
          {communityMembers.map(member => (
            <div
              key={member.id}
              className="flex flex-col items-center min-w-[60px] cursor-pointer"
              onClick={() => handleViewProfile(member.id)}
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-white hover:border-blue-300 transition-colors"
                />
                {member.isActive && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <span className="text-xs mt-1 text-center truncate w-full">{member.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Share Hushhly Community</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 truncate flex-1">https://hushhly.com/invite/community?ref=user123</div>
                <button
                  onClick={handleCopyLink}
                  className="ml-3 text-blue-500 hover:text-blue-600"
                >
                  <Copy size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Share via</p>

              <div className="grid grid-cols-4 gap-4">
                <button
                  onClick={() => handleShareSocial('WhatsApp')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Telegram')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.5 6.424-.709 8.526-.092.913-.325 1.219-.534 1.249-.457.066-.896-.318-1.39-.624a169.75 169.75 0 0 0-1.199-.744c-.923-.58-1.097-.934-.523-1.438.158-.139 2.09-1.914 2.148-2.077.007-.02.021-.147-.056-.209s-.236-.045-.335-.028c-.13.024-1.6 1.016-2.937 1.857a1.88 1.88 0 0 1-1.068.312 5.6 5.6 0 0 1-1.513-.308c-.611-.17-.919-.519-.888-.855.016-.167.176-.331.483-.478.883-.419 3.304-1.382 5.987-2.54.29-.125 2.661-1.106 2.878-1.131z"/></svg>
                  </div>
                  <span className="text-xs">Telegram</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Twitter')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </div>
                  <span className="text-xs">Twitter</span>
                </button>

                <button
                  onClick={() => handleShareSocial('Email')}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span className="text-xs">Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create New Group</h2>
              <button onClick={() => {
                if (!groupCreationSuccess) {
                  setShowCreateGroupModal(false);
                }
              }} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            {groupCreationSuccess ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Group Created!</h3>
                <p className="text-gray-600 mb-4">Your group has been created successfully.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name*</label>
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="rounded-lg"
                      placeholder="Enter a name for your group"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      className="w-full h-24 text-sm rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="What is this group about?"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="public"
                          name="privacy"
                          value="public"
                          checked={groupPrivacy === 'public'}
                          onChange={() => setGroupPrivacy('public')}
                          className="mr-2"
                        />
                        <label htmlFor="public" className="text-sm">Public</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="private"
                          name="privacy"
                          value="private"
                          checked={groupPrivacy === 'private'}
                          onChange={() => setGroupPrivacy('private')}
                          className="mr-2"
                        />
                        <label htmlFor="private" className="text-sm">Private</label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGroupSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium mt-2"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search topics"
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-full border-gray-200 bg-white pl-9 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setActiveTab('individuals')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === 'individuals'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            Individuals
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === 'groups'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            Groups
          </button>
        </div>

        <div className="mt-2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post as PostType}
                isFollowing={isFollowing}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onFollow={handleFollow}
                onViewProfile={handleViewProfile}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReplyToComment={handleReplyToComment}
                onSave={(id) => {
                  toast({
                    title: "Post Saved",
                    description: "This post has been saved to your collection",
                  });
                }}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === 'groups'
                  ? "No group posts found."
                  : "No posts found matching your search."}
              </p>
            </div>
          )}
        </div>
      </div>



      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileCard
          user={selectedUser}
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onFollow={(userId) => {
            handleFollow(userId);
            setSelectedUser(prev => prev ? {...prev, isFollowing: true} : null);
          }}
          onUnfollow={(userId) => {
            handleFollow(userId);
            setSelectedUser(prev => prev ? {...prev, isFollowing: false} : null);
          }}
          onMessage={(userId) => {
            toast({
              title: "Message",
              description: `Starting conversation with ${selectedUser.name}`,
            });
          }}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default Community;
