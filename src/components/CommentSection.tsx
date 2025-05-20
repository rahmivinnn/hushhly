import React, { useState } from 'react';
import { Heart, Send, MessageCircle, MoreHorizontal, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export interface CommentType {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: CommentType[];
}

interface CommentSectionProps {
  postId: number;
  comments: CommentType[];
  onAddComment: (postId: number, comment: string) => void;
  onLikeComment: (postId: number, commentId: number) => void;
  onReplyToComment: (postId: number, commentId: number, reply: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onAddComment,
  onLikeComment,
  onReplyToComment
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(postId, newComment);
    setNewComment('');
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully",
    });
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  const submitReply = (commentId: number) => {
    if (!replyText.trim()) return;
    
    onReplyToComment(postId, commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
    
    toast({
      title: "Reply Added",
      description: "Your reply has been added successfully",
    });
  };

  const renderComment = (comment: CommentType, isReply = false) => (
    <div key={comment.id} className={`flex mb-3 ${isReply ? 'ml-8' : ''}`}>
      <img
        src={comment.userAvatar}
        alt={comment.userName}
        className="w-8 h-8 rounded-full mr-2 mt-1"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-2">
          <p className="text-xs font-medium">{comment.userName}</p>
          <p className="text-xs text-gray-800">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <button
            onClick={() => onLikeComment(postId, comment.id)}
            className="mr-3 flex items-center"
          >
            <Heart 
              size={12} 
              className={comment.isLiked ? "text-red-500 fill-current mr-1" : "text-gray-500 mr-1"} 
            />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => handleReply(comment.id)}
            className="mr-3 flex items-center"
          >
            <MessageCircle size={12} className="text-gray-500 mr-1" />
            <span>Reply</span>
          </button>
          <span>{comment.timestamp}</span>
        </div>
        
        {/* Reply input */}
        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs py-1 px-2 h-8"
                />
                <Button
                  size="sm"
                  onClick={() => submitReply(comment.id)}
                  className="ml-2 h-8 bg-blue-500 hover:bg-blue-600 text-white px-2"
                >
                  <Send size={14} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Nested replies */}
        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      {/* Comments list */}
      <div className="mb-3">
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <p className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first to comment!</p>
        )}
      </div>
      
      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="flex items-center">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`}
          alt="Your avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="pr-8 py-1 text-sm"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <Smile size={18} />
          </button>
        </div>
        <Button
          type="submit"
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
          disabled={!newComment.trim()}
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
