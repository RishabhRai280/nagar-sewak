"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, MapPin, Calendar, User, Star, MessageCircle, ThumbsUp, ThumbsDown, Share2, Flag, CheckCircle, Clock, FileText } from "lucide-react";
import { fetchComplaintDetails } from "@/lib/api/api";

interface Complaint {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: string;
  lat?: number;
  lng?: number;
  photoUrls?: string[];
  createdAt?: string; // Made optional to match API
  updatedAt?: string; // Made optional to match API
  citizenName: string;
  wardLabel?: string;
  category: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  comments: Comment[];
  assignedContractor?: {
    id: number;
    companyName: string;
    rating: number;
  };
  resolution?: {
    description: string;
    resolvedAt: string;
    resolvedBy: string;
    rating?: number;
  };
}

interface Comment {
  id: number;
  text: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  likes: number;
}

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const complaintId = params.id as string;
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadComplaint() {
      if (!complaintId) return;
      try {
        setLoading(true);
        const data = await fetchComplaintDetails(parseInt(complaintId));
        const apiData = data as any; // Cast to any to handle missing fields gracefully

        setComplaint({
          ...apiData,
          // Fallbacks for missing optional data from basic API response to satisfy strictly typed UI
          citizenName: apiData.citizenName || apiData.userFullName || "Concerned Citizen",
          wardLabel: apiData.wardLabel || "General Ward",
          category: apiData.category || "General",
          votes: apiData.votes || { upvotes: 0, downvotes: 0, userVote: null },
          comments: apiData.comments || [],
          assignedContractor: apiData.assignedContractor,
          photoUrls: apiData.photoUrls || (apiData.photoUrl ? [apiData.photoUrl] : [])
        });
      } catch (err) {
        console.error("Failed to fetch complaint details", err);
        // Fallback to error UI handled by !complaint check
      } finally {
        setLoading(false);
      }
    }

    loadComplaint();
  }, [complaintId]);

  const handleVote = (type: 'up' | 'down') => {
    if (!complaint) return;

    // Mock vote handling - replace with actual API call
    const newVote = complaint.votes.userVote === type ? null : type;
    const updatedVotes = { ...complaint.votes };

    // Remove previous vote
    if (complaint.votes.userVote === 'up') updatedVotes.upvotes--;
    if (complaint.votes.userVote === 'down') updatedVotes.downvotes--;

    // Add new vote
    if (newVote === 'up') updatedVotes.upvotes++;
    if (newVote === 'down') updatedVotes.downvotes++;

    updatedVotes.userVote = newVote;

    setComplaint({ ...complaint, votes: updatedVotes });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !complaint) return;

    setSubmittingComment(true);

    // Mock comment submission - replace with actual API call
    const newCommentObj: Comment = {
      id: complaint.comments.length + 1,
      text: newComment,
      authorName: "Current User",
      authorRole: "Citizen",
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setTimeout(() => {
      setComplaint({
        ...complaint,
        comments: [...complaint.comments, newCommentObj]
      });
      setNewComment("");
      setSubmittingComment(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "text-red-600";
    if (severity >= 3) return "text-orange-600";
    return "text-yellow-600";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-slate-300"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="bg-white rounded-xl p-8 space-y-6">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 bg-slate-200 rounded"></div>
                <div className="h-48 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <AlertTriangle className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Complaint not found</h3>
          <p className="text-slate-600 mb-4">The complaint you're looking for doesn't exist or has been removed.</p>
          <Link href="/map">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Back to Map
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/map" className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-blue-800 font-bold mb-4 transition-colors">
            <ArrowLeft size={20} />
            Back to Map
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] via-[#f97316] to-[#166534]"></div>

          {/* Status and Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`flex items-center gap-1 text-sm font-bold ${getSeverityColor(complaint.severity)}`}>
              <AlertTriangle size={16} />
              Severity {complaint.severity}/5
            </span>
            <span className="text-sm text-slate-500 font-mono">#{complaint.id}</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-sm font-medium border border-slate-200">{complaint.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{complaint.title}</h1>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Reported by {complaint.citizenName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Unknown'}</span>
            </div>
            {complaint.wardLabel && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{complaint.wardLabel}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Updated {complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
            <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Photos */}
          {complaint.photoUrls && complaint.photoUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Evidence Photos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaint.photoUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
                    <img
                      src={url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Contractor */}
          {complaint.assignedContractor && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Assigned Contractor</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{complaint.assignedContractor.companyName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {renderStars(complaint.assignedContractor.rating)}
                    </div>
                    <span className="text-sm text-slate-600">{complaint.assignedContractor.rating.toFixed(1)}</span>
                  </div>
                </div>
                <Link href={`/contractors/${complaint.assignedContractor.id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Voting */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${complaint.votes.userVote === 'up'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                  }`}
              >
                <ThumbsUp size={16} />
                <span>{complaint.votes.upvotes}</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${complaint.votes.userVote === 'down'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-red-50'
                  }`}
              >
                <ThumbsDown size={16} />
                <span>{complaint.votes.downvotes}</span>
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
              <Share2 size={16} />
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
              <Flag size={16} />
              Report
            </button>
          </div>

          {/* Location */}
          {complaint.lat && complaint.lng && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="text-[#f97316]" size={20} /> Location Details
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-mono">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{complaint.lat.toFixed(6)}, {complaint.lng.toFixed(6)}</span>
                </div>
                <Link href={`/map?complaintId=${complaint.id}`}>
                  <button className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-sm">
                    View on Map
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a]"></div>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle size={20} className="text-[#1e3a8a]" />
            Comments ({complaint.comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3 text-slate-900"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {complaint.comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{comment.authorName}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${comment.authorRole === 'Admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                      }`}>
                      {comment.authorRole}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 mb-2">{comment.text}</p>
                <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition">
                  <ThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
              </motion.div>
            ))}
          </div>

          {complaint.comments.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <MessageCircle className="mx-auto mb-2 opacity-50" size={32} />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link href={`/complaints/${complaint.id}/tenders`}>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
              <FileText size={20} />
              View Tenders
            </button>
          </Link>
          {complaint.status.toLowerCase() === 'resolved' && (
            <Link href={`/rate/${complaint.id}`}>
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                <Star size={20} />
                Rate Resolution
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}