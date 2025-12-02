'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Milestone {
  id: number;
  percentage: number;
  notes: string;
  photoUrls: string[];
  status: string;
  completedAt: string | null;
  updatedBy: string | null;
}

interface ProjectProgressTimelineProps {
  projectId: number;
}

export default function ProjectProgressTimeline({ projectId }: ProjectProgressTimelineProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
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

  const downloadProgressReport = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${projectId}/progress-report`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Project_${projectId}_Progress_Report.pdf`;
      a.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading progress timeline...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Progress Timeline</h2>
        <button
          onClick={downloadProgressReport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>📄</span>
          Download Report
        </button>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative mb-8 pl-20">
            {/* Milestone Dot */}
            <div
              className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                milestone.status === 'COMPLETED'
                  ? 'bg-green-500 text-white'
                  : milestone.status === 'IN_PROGRESS'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {getMilestoneIcon(milestone.percentage)}
            </div>

            {/* Milestone Content */}
            <div
              className={`border-2 rounded-lg p-4 ${
                milestone.status === 'COMPLETED'
                  ? 'border-green-500 bg-green-50'
                  : milestone.status === 'IN_PROGRESS'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {milestone.percentage}% - {getMilestoneLabel(milestone.percentage)}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      milestone.status === 'COMPLETED'
                        ? 'bg-green-200 text-green-800'
                        : milestone.status === 'IN_PROGRESS'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>
                {milestone.completedAt && (
                  <span className="text-sm text-gray-600">
                    {new Date(milestone.completedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>

              {milestone.notes && (
                <p className="text-gray-700 mb-3">{milestone.notes}</p>
              )}

              {milestone.updatedBy && (
                <p className="text-sm text-gray-600 mb-3">
                  Updated by: <span className="font-semibold">{milestone.updatedBy}</span>
                </p>
              )}

              {/* Photo Gallery */}
              {milestone.photoUrls && milestone.photoUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Progress Photos ({milestone.photoUrls.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {milestone.photoUrls.map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                        onClick={() => setSelectedPhoto(`http://localhost:8080/uploads/projects/${photo}`)}
                      >
                        <Image
                          src={`http://localhost:8080/uploads/projects/${photo}`}
                          alt={`Progress photo ${photoIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <Image
              src={selectedPhoto}
              alt="Full size"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
