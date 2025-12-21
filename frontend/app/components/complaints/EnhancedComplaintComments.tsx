'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Edit2, Trash2, X, ThumbsUp, ThumbsDown,
  Heart, Paperclip, Image, FileText, Download, AtSign, Users, Smile, ChevronDown, Check
} from 'lucide-react';
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
  reactionCounts?: { [key: string]: number };
  userReaction?: string;
  attachments?: Attachment[];
  mentionedUsernames?: string[];
}

interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface ComplaintCommentsProps {
  complaintId: number;
}

export default function EnhancedComplaintComments({ complaintId }: ComplaintCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
    fetchUsers();
  }, [complaintId]);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await fetch('${API_BASE_URL}/auth/me', {
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('${API_BASE_URL}/admin/users', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const users = await res.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments`);
      if (res.ok) {
        const data = await res.json();
        // Fetch reactions for each comment
        const commentsWithReactions = await Promise.all(
          data.map(async (comment: Comment) => {
            const reactions = await fetchReactions(comment.id);
            return { ...comment, ...reactions };
          })
        );
        setComments(commentsWithReactions);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const fetchReactions = async (commentId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}/reactions`);
      if (res.ok) {
        const reactionCounts = await res.json();
        return { reactionCounts };
      }
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
    }
    return { reactionCounts: {} };
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

        // Upload attachments if any
        if (uploadingFiles.length > 0) {
          await uploadAttachments(comment.id);
        }

        setComments([comment, ...comments]);
        setNewComment('');
        setUploadingFiles([]);
      } else if (res.status === 401) {
        console.error('Authentication failed');
        alert('Authentication failed. Please try logging in again.');
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
      } else {
        const errorText = await res.text();
        console.error('Comment failed:', res.status, errorText);
        alert('Failed to add comment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (commentId: number) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    for (const file of uploadingFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}/attachments`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      } catch (error) {
        console.error('Failed to upload attachment:', error);
      }
    }
  };

  const handleReaction = async (commentId: number, type: string) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login to react');
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId);
      let res;

      if (comment?.userReaction === type) {
        // Remove reaction
        res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}/reactions`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Add/update reaction
        res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${commentId}/reactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ type })
        });
      }

      if (res.ok) {
        // Refresh comments
        fetchComments();
      } else if (res.status === 401) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
      } else {
        console.error('Reaction failed:', res.status);
        alert('Failed to react. Please try again.');
      }
    } catch (error) {
      console.error('Failed to react:', error);
      alert('Network error. Please check your connection.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadingFiles([...uploadingFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(uploadingFiles.filter((_, i) => i !== index));
  };

  const insertMention = (username: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = newComment.substring(0, cursorPos);
    const textAfter = newComment.substring(cursorPos);

    // Find the last @ symbol
    const lastAtIndex = textBefore.lastIndexOf('@');
    const beforeMention = textBefore.substring(0, lastAtIndex);

    setNewComment(`${beforeMention}@${username} ${textAfter}`);
    setShowMentions(false);
    setMentionSearch('');

    // Focus back on textarea
    setTimeout(() => textarea.focus(), 0);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mentions
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(mentionSearch.toLowerCase())
  ).slice(0, 5);

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
      <form onSubmit={handleAddComment} className="space-y-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={handleTextChange}
            placeholder="Add a comment... (Use @ to mention someone)"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-900"
            rows={3}
            disabled={loading}
          />

          {/* Mention Dropdown */}
          {showMentions && filteredUsers.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => insertMention(user.username)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName?.charAt(0) || user.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{user.fullName || user.username}</div>
                    <div className="text-xs text-slate-500">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File Attachments Preview */}
        {uploadingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadingFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm">
                <Paperclip size={14} className="text-slate-600" />
                <span className="text-slate-700">{file.name}</span>
                <span className="text-slate-500">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Paperclip size={16} />
            Attach
          </button>
          <button
            type="button"
            onClick={() => {
              const textarea = textareaRef.current;
              if (textarea) {
                const cursorPos = textarea.selectionStart;
                const textBefore = newComment.substring(0, cursorPos);
                const textAfter = newComment.substring(cursorPos);
                setNewComment(`${textBefore}@${textAfter}`);
                textarea.focus();
                textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
              }
            }}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <AtSign size={16} />
            Mention
          </button>
          <div className="flex-1"></div>
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
        </div>
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
                      onClick={async () => {
                        if (!confirm('Delete this comment?')) return;
                        const token = localStorage.getItem('jwtToken');
                        if (!token) return;
                        try {
                          const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${comment.id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            setComments(comments.filter(c => c.id !== comment.id));
                          }
                        } catch (error) {
                          console.error('Failed to delete comment:', error);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    autoFocus
                  />
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem('jwtToken');
                      if (!token || !editContent.trim()) return;

                      try {
                        const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/${comment.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ content: editContent })
                        });

                        if (res.ok) {
                          const updated = await res.json();
                          setComments(comments.map(c => c.id === comment.id ? { ...c, content: updated.content, edited: true } : c));
                          setEditingId(null);
                          setEditContent('');
                        }
                      } catch (error) {
                        console.error('Failed to edit comment:', error);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {comment.content}
                </p>
              )}

              {/* Attachments */}
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {comment.attachments.map(attachment => (
                    <a
                      key={attachment.id}
                      href={`${API_BASE_URL}${attachment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm group"
                    >
                      {attachment.fileType?.startsWith('image/') ? (
                        <Image size={16} className="text-blue-600" />
                      ) : (
                        <FileText size={16} className="text-slate-600" />
                      )}
                      <span className="flex-1 text-slate-700 group-hover:text-blue-600">
                        {attachment.fileName}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {formatFileSize(attachment.fileSize)}
                      </span>
                      <Download size={14} className="text-slate-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              )}

              {/* Reactions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleReaction(comment.id, 'LIKE')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-colors ${comment.userReaction === 'LIKE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <ThumbsUp size={14} />
                  {comment.reactionCounts?.like || 0}
                </button>
                <button
                  onClick={() => handleReaction(comment.id, 'HEART')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-colors ${comment.userReaction === 'HEART'
                    ? 'bg-red-100 text-red-700'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Heart size={14} />
                  {comment.reactionCounts?.heart || 0}
                </button>
                <button
                  onClick={() => handleReaction(comment.id, 'THUMBS_DOWN')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-colors ${comment.userReaction === 'THUMBS_DOWN'
                    ? 'bg-slate-200 text-slate-700'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <ThumbsDown size={14} />
                  {comment.reactionCounts?.thumbs_down || 0}
                </button>
              </div>
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
