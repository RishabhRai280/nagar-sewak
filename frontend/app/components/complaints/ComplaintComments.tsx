'use client';

import { useState, useEffect } from "react";
import { Send, Trash2, User, MessageCircle, Edit2, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api/api";
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: number;
  userId: number;
  username: string;
  userFullName: string;
  userRole: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  edited: boolean;
}

interface ComplaintCommentsProps {
  complaintId: number;
}

export default function ComplaintComments({ complaintId }: ComplaintCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [complaintId]);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    const token = localStorage.getItem('jwtToken');
    if (!token || !editContent.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editContent })
      });

      if (res.ok) {
        const updated = await res.json();
        setComments(comments.map(c => c.id === commentId ? updated : c));
        setEditingId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-700';
      case 'CONTRACTOR':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={20} className="text-slate-600" />
        <h3 className="text-lg font-bold text-slate-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send size={18} />
          Post
        </motion.button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {comment.userFullName?.charAt(0) || comment.username.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {comment.userFullName || comment.username}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getRoleBadgeColor(comment.userRole)}`}>
                        {comment.userRole}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.edited && ' (edited)'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {currentUserId === comment.userId && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed">
                  {comment.content}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-20" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
