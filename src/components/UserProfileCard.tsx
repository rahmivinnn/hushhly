import React, { useState } from 'react';
import { User, MapPin, Calendar, MessageSquare, UserPlus, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserProfileData {
  id: number;
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isActive?: boolean;
  interests?: string[];
}

interface UserProfileCardProps {
  user: UserProfileData;
  isOpen: boolean;
  onClose: () => void;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
  onMessage?: (userId: number) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isOpen,
  onClose,
  onFollow,
  onUnfollow,
  onMessage
}) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(true);
    if (onFollow) onFollow(user.id);
    toast({
      title: "Following",
      description: `You are now following ${user.name}`,
    });
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    if (onUnfollow) onUnfollow(user.id);
    toast({
      title: "Unfollowed",
      description: `You have unfollowed ${user.name}`,
    });
  };

  const handleMessage = () => {
    if (onMessage) onMessage(user.id);
    toast({
      title: "Message",
      description: `Starting conversation with ${user.name}`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24"></div>
              <button
                onClick={onClose}
                className="absolute top-2 right-2 bg-white/20 p-1 rounded-full text-white hover:bg-white/40"
              >
                <X size={18} />
              </button>
              <div className="absolute -bottom-12 left-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white"
                  />
                  {user.isActive && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-14 pb-4 px-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                  {user.location && (
                    <p className="text-gray-500 text-sm flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {user.location}
                    </p>
                  )}
                </div>
                <div>
                  {isFollowing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUnfollow}
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      <UserCheck size={14} className="mr-1" />
                      Following
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleFollow}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <UserPlus size={14} className="mr-1" />
                      Follow
                    </Button>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-700 text-sm mb-3">{user.bio}</p>
              )}

              {user.joinDate && (
                <p className="text-gray-500 text-xs flex items-center mb-4">
                  <Calendar size={12} className="mr-1" />
                  Joined {user.joinDate}
                </p>
              )}

              {/* Stats */}
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <p className="font-bold text-gray-800">{user.postsCount || 0}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">{user.followersCount || 0}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">{user.followingCount || 0}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
              </div>

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Button */}
              <Button
                onClick={handleMessage}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <MessageSquare size={16} className="mr-2" />
                Message
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileCard;
