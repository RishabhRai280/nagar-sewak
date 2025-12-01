'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplaintVotingProps {
  complaintId: number;
  initialVoteCount?: number;
  initialHasVoted?: boolean;
}

export default function ComplaintVoting({ 
  complaintId, 
  initialVoteCount = 0,
  initialHasVoted = false 
}: ComplaintVotingProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current vote status
    fetchVotes();
  }, [complaintId]);

  const fetchVotes = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`http://localhost:8080/complaints/${complaintId}/votes`, {
        headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setVoteCount(data.voteCount);
        setHasVoted(data.hasVoted);
      }
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    }
  };

  const handleVote = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login to vote');
      return;
    }

    setLoading(true);
    try {
      const method = hasVoted ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:8080/complaints/${complaintId}/vote`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setVoteCount(data.voteCount);
        setHasVoted(data.hasVoted);
      } else if (res.status === 401) {
        console.error('Authentication failed. Token:', token ? 'exists' : 'missing');
        const errorText = await res.text();
        console.error('Error response:', errorText);
        alert('Authentication failed. Please try logging in again.');
        // Clear invalid token
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
      } else {
        const errorText = await res.text();
        console.error('Vote failed:', res.status, errorText);
        alert('Failed to vote. Please try again.');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        hasVoted
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <ThumbsUp size={18} className={hasVoted ? 'fill-current' : ''} />
      <span>{voteCount}</span>
      <span className="text-sm">{hasVoted ? 'Voted' : 'Upvote'}</span>
    </motion.button>
  );
}
