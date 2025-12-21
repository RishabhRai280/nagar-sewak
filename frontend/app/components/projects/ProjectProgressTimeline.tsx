'use client';

import { useState, useEffect } from 'react';
import { Clock, User, Camera, Download, Calendar, FileText } from 'lucide-react';
import { API_BASE_URL, ProgressHistoryItem, fetchProgressHistory, fetchMilestones, downloadProgressReport } from '@/lib/api/api';

interface Milestone {
  id: number;
  percentage: number;
  notes: string;
  photoUrls: string[];
  status: string;
  completedAt: string | null;
  updatedBy: string | null;
  createdAt?: string;
}

interface ProgressUpdate {
  id: number;
  percentage: number;
  status: string;
  notes: string;
  photoUrls: string[];
  updatedAt: string;
  updatedBy: string;
  type: 'milestone' | 'progress';
}

interface ProjectProgressTimelineProps {
  projectId: number;
}

export default function ProjectProgressTimeline({ projectId }: ProjectProgressTimelineProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'history'>('timeline');

  useEffect(() => {
    loadProgressHistory();
  }, [projectId]);

  const loadProgressHistory = async () => {
    try {
      setLoading(true);
      // Use the API utility function
      const data = await fetchProgressHistory(projectId);

      // Convert the data to our expected format
      const progressUpdates: ProgressUpdate[] = data.map((item) => {
        // Handle date parsing - backend may return LocalDateTime as string or object
        let updatedAtStr = '';
        if (typeof item.updatedAt === 'string') {
          updatedAtStr = item.updatedAt;
        } else if (item.updatedAt && typeof item.updatedAt === 'object') {
          // Handle LocalDateTime object format from backend
          const dt = item.updatedAt as any;
          if (dt.year && dt.month && dt.dayOfMonth) {
            const month = String(dt.monthValue || dt.month).padStart(2, '0');
            const day = String(dt.dayOfMonth || dt.day).padStart(2, '0');
            const hour = String(dt.hour || 0).padStart(2, '0');
            const minute = String(dt.minute || 0).padStart(2, '0');
            const second = String(dt.second || 0).padStart(2, '0');
            updatedAtStr = `${dt.year}-${month}-${day}T${hour}:${minute}:${second}`;
          } else {
            updatedAtStr = new Date().toISOString();
          }
        } else {
          updatedAtStr = new Date().toISOString();
        }

        // Handle photoUrls - could be array or comma-separated string
        let photoUrlsArray: string[] = [];
        if (Array.isArray(item.photoUrls)) {
          photoUrlsArray = item.photoUrls;
        } else if (typeof item.photoUrls === 'string' && (item.photoUrls as string).trim()) {
          photoUrlsArray = (item.photoUrls as string).split(',').map((p: string) => p.trim()).filter((p: string) => p);
        }

        return {
          id: Number(item.id),
          percentage: item.percentage,
          status: item.status,
          notes: item.notes || '',
          photoUrls: photoUrlsArray,
          updatedAt: updatedAtStr,
          updatedBy: item.updatedBy || 'System',
          type: item.type || 'progress'
        };
      });

      setProgressHistory(progressUpdates);

      // Debug: Log photo URLs to see what we're getting
      if (progressUpdates.length > 0) {
        console.log('Progress updates photo URLs:', progressUpdates.map(u => ({
          id: u.id,
          photoUrls: u.photoUrls,
          type: u.type
        })));
      }

      // Also set milestones for timeline view
      const milestoneData = progressUpdates.filter(item => item.type === 'milestone');
      const milestonesForTimeline = milestoneData.map(item => ({
        id: typeof item.id === 'string' ? parseInt(String(item.id).replace('current-', '')) : Number(item.id),
        percentage: item.percentage,
        notes: item.notes || '',
        photoUrls: item.photoUrls,
        status: item.status,
        completedAt: item.updatedAt,
        updatedBy: item.updatedBy
      }));

      setMilestones(milestonesForTimeline);
    } catch (error) {
      console.error('Error fetching progress history:', error);
      // Fallback to milestones endpoint
      try {
        const milestonesData = await fetchMilestones(projectId);
        setMilestones(milestonesData.map(m => ({
          ...m,
          notes: m.notes || '',
          photoUrls: Array.isArray(m.photoUrls) ? m.photoUrls : (typeof m.photoUrls === 'string' ? (m.photoUrls as string).split(',') : [])
        })));

        // Convert milestones to progress updates format for history view
        const progressUpdates: ProgressUpdate[] = milestonesData.map((milestone) => ({
          id: milestone.id,
          percentage: milestone.percentage,
          status: milestone.status,
          notes: milestone.notes || '',
          photoUrls: Array.isArray(milestone.photoUrls) ? milestone.photoUrls :
            (milestone.photoUrls ? String(milestone.photoUrls).split(',') : []),
          updatedAt: milestone.completedAt || milestone.createdAt || new Date().toISOString(),
          updatedBy: milestone.updatedBy || 'System',
          type: 'milestone' as const
        }));

        setProgressHistory(progressUpdates);
      } catch (fallbackError) {
        console.error('Error fetching milestones fallback:', fallbackError);
        setProgressHistory([]);
        setMilestones([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneLabel = (percentage: number) => {
    switch (percentage) {
      case 0: return 'Project Started';
      case 25: return 'Foundation Work';
      case 50: return 'Halfway Complete';
      case 75: return 'Almost Done';
      case 100: return 'Project Finished';
      default: return `${percentage}% Complete`;
    }
  };

  const getMilestoneIcon = (percentage: number) => {
    switch (percentage) {
      case 0: return '🚀';
      case 25: return '🏗️';
      case 50: return '⚡';
      case 75: return '🎯';
      case 100: return '🎉';
      default: return '📍';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      // Handle various date formats from backend
      let date: Date;
      if (typeof dateString === 'string') {
        // Handle ISO format or LocalDateTime string format
        date = new Date(dateString);
        // If date is invalid, try parsing as LocalDateTime format
        if (isNaN(date.getTime()) && dateString.includes('T')) {
          date = new Date(dateString + 'Z'); // Add Z for UTC if missing
        }
        if (isNaN(date.getTime())) {
          date = new Date(); // Fallback to current date
        }
      } else {
        date = new Date();
      }

      return {
        date: date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      return {
        date: 'Invalid date',
        time: ''
      };
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await downloadProgressReport(projectId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Project_${projectId}_Progress_Report.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading progress history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Project Progress</h2>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'timeline'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              History View
            </button>
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        // Timeline View (Original)
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200"></div>

          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative mb-8 pl-20">
              <div
                className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center text-lg ${milestone.status === 'COMPLETED'
                  ? 'bg-green-500 text-white'
                  : milestone.status === 'IN_PROGRESS'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-slate-300 text-slate-600'
                  }`}
              >
                {getMilestoneIcon(milestone.percentage)}
              </div>

              <div
                className={`border-2 rounded-xl p-6 ${milestone.status === 'COMPLETED'
                  ? 'border-green-200 bg-green-50'
                  : milestone.status === 'IN_PROGRESS'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-slate-200 bg-slate-50'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {milestone.percentage}% - {getMilestoneLabel(milestone.percentage)}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${milestone.status === 'COMPLETED'
                        ? 'bg-green-200 text-green-800'
                        : milestone.status === 'IN_PROGRESS'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-slate-200 text-slate-800'
                        }`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  {milestone.completedAt && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {formatDateTime(milestone.completedAt).date}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDateTime(milestone.completedAt).time}
                      </div>
                    </div>
                  )}
                </div>

                {milestone.notes && (
                  <div className="mb-4">
                    <p className="text-slate-700 leading-relaxed">{milestone.notes}</p>
                  </div>
                )}

                {milestone.updatedBy && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                    <User size={14} />
                    <span>Updated by: <span className="font-semibold">{milestone.updatedBy}</span></span>
                  </div>
                )}

                {milestone.photoUrls && milestone.photoUrls.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Camera size={16} className="text-slate-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        Progress Photos ({milestone.photoUrls.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {milestone.photoUrls.map((photo, photoIndex) => {
                        const getImageUrl = () => {
                          // Handle both full paths and filenames
                          if (photo.startsWith('http')) return photo;
                          if (photo.startsWith('/uploads/')) return `${API_BASE_URL}${photo}`;
                          return `${API_BASE_URL}/uploads/projects/${photo}`;
                        };
                        const imageUrl = getImageUrl();
                        return (
                          <div
                            key={photoIndex}
                            className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border border-slate-200 bg-slate-100"
                            onClick={() => setSelectedPhoto(imageUrl)}
                          >
                            <img
                              src={imageUrl}
                              alt={`Progress photo ${photoIndex + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load image:', imageUrl, e);
                                // Show placeholder on error
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log('Successfully loaded image:', imageUrl);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // History View (Chronological)
        <div className="space-y-4">
          <div className="text-sm text-slate-600 mb-6">
            Showing all progress updates in chronological order (most recent first)
          </div>

          {progressHistory.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-600">No progress updates available yet.</p>
            </div>
          ) : (
            progressHistory.map((update, index) => {
              const dateTime = formatDateTime(update.updatedAt);
              return (
                <div key={`${update.type}-${update.id}-${index}`} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getMilestoneIcon(update.percentage)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Progress Updated to {update.percentage}%
                        </h3>
                        <p className="text-sm text-slate-600">
                          {getMilestoneLabel(update.percentage)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <Calendar size={14} />
                        {dateTime.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Clock size={12} />
                        {dateTime.time}
                      </div>
                    </div>
                  </div>

                  {update.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Update Description:</h4>
                      <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                        {update.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User size={14} />
                        <span>By: <span className="font-semibold">{update.updatedBy}</span></span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${update.status === 'COMPLETED'
                        ? 'bg-green-200 text-green-800'
                        : update.status === 'IN_PROGRESS'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-slate-200 text-slate-800'
                        }`}>
                        {update.status}
                      </span>
                    </div>

                    {update.photoUrls && update.photoUrls.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Camera size={14} />
                        <span>{update.photoUrls.length} photo{update.photoUrls.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {update.photoUrls && update.photoUrls.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {update.photoUrls.map((photo, photoIndex) => {
                          const getImageUrl = () => {
                            // Handle both full paths and filenames
                            if (photo.startsWith('http')) return photo;
                            if (photo.startsWith('/uploads/')) return `${API_BASE_URL}${photo}`;
                            return `${API_BASE_URL}/uploads/projects/${photo}`;
                          };
                          const imageUrl = getImageUrl();
                          return (
                            <div
                              key={photoIndex}
                              className="relative h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border border-slate-200 bg-slate-100"
                              onClick={() => setSelectedPhoto(imageUrl)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Progress photo ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Failed to load image:', imageUrl, e);
                                  // Show placeholder on error
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log('Successfully loaded image:', imageUrl);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <img
              src={selectedPhoto || ''}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => {
                console.error('Failed to load modal image:', e.currentTarget.src);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
