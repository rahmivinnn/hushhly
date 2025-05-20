import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import CommentSection, { CommentType } from './CommentSection';
import { Button } from '@/components/ui/button';

export interface PostType {
  id: number;
  user: string;
  userId: number;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: string;
  createdAt: Date;
  isLiked: boolean;
  isSaved?: boolean;
  commentsList: CommentType[];
  showComments: boolean;
}

interface PostCardProps {
  post: PostType;
  isFollowing: (userId: number) => boolean;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
  onShare: (id: number) => void;
  onSave?: (id: number) => void;
  onFollow: (userId: number) => void;
  onViewProfile: (userId: number) => void;
  onAddComment: (postId: number, comment: string) => void;
  onLikeComment: (postId: number, commentId: number) => void;
  onReplyToComment: (postId: number, commentId: number, reply: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isFollowing,
  onLike,
  onComment,
  onShare,
  onSave,
  onFollow,
  onViewProfile,
  onAddComment,
  onLikeComment,
  onReplyToComment
}) => {
  const { toast } = useToast();
  const [showOptions, setShowOptions] = useState(false);
  const [saved, setSaved] = useState(post.isSaved || false);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    onComment(post.id);
  };

  const handleShare = () => {
    onShare(post.id);
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) onSave(post.id);
    
    toast({
      title: saved ? "Post Unsaved" : "Post Saved",
      description: saved ? "Post removed from your saved items" : "Post added to your saved items",
    });
  };

  const handleFollow = () => {
    onFollow(post.userId);
    
    toast({
      title: "Following",
      description: `You are now following ${post.user}`,
    });
  };

  const handleViewProfile = () => {
    onViewProfile(post.userId);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      {/* Post header with user info */}
      <div className="flex items-start mb-3">
        <img
          src={post.avatar}
          alt={post.user}
          className="w-10 h-10 rounded-full mr-2 cursor-pointer"
          onClick={handleViewProfile}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p 
                className="font-medium text-gray-800 cursor-pointer hover:underline"
                onClick={handleViewProfile}
              >
                {post.user}
              </p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
            <div className="flex items-center">
              {!isFollowing(post.userId) && (
                <Button
                  onClick={handleFollow}
                  size="sm"
                  variant="outline"
                  className="mr-2 text-xs h-7 px-2 text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <UserPlus size={14} className="mr-1" />
                  Follow
                </Button>
              )}
              <div className="relative">
                <button
                  onClick={toggleOptions}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <MoreHorizontal size={18} />
                </button>
                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg py-1 w-40 z-10"
                    >
                      <button
                        onClick={handleSave}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Bookmark size={14} className="mr-2" />
                        {saved ? 'Unsave post' : 'Save post'}
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setShowOptions(false);
                          toast({
                            title: "Report",
                            description: "This post has been reported",
                          });
                        }}
                      >
                        <span className="mr-2">🚩</span>
                        Report post
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm whitespace-pre-line">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="mt-2 rounded-lg w-full object-cover max-h-96"
          />
        )}
      </div>

      {/* Post stats */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div>
          {post.likes > 0 && (
            <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
          )}
        </div>
        <div>
          {post.comments > 0 && (
            <span className="mr-2">{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
          )}
          {post.shares > 0 && (
            <span>{post.shares} {post.shares === 1 ? 'share' : 'shares'}</span>
          )}
        </div>
      </div>

      {/* Post actions */}
      <div className="flex border-t border-b border-gray-100 py-1 mb-3">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md ${
            post.isLiked ? 'text-red-500' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Heart size={18} className={post.isLiked ? "fill-current mr-1" : "mr-1"} />
          Like
        </button>
        <button
          onClick={handleComment}
          className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
        >
          <MessageSquare size={18} className="mr-1" />
          Comment
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
        >
          <Share2 size={18} className="mr-1" />
          Share
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {post.showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CommentSection
              postId={post.id}
              comments={post.commentsList}
              onAddComment={onAddComment}
              onLikeComment={onLikeComment}
              onReplyToComment={onReplyToComment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
