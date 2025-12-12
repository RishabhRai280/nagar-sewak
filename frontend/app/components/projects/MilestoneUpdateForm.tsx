'use client';

import { useState } from 'react';

interface MilestoneUpdateFormProps {
  projectId: number;
  onSuccess?: () => void;
}

export default function MilestoneUpdateForm({ projectId, onSuccess }: MilestoneUpdateFormProps) {
  const [percentage, setPercentage] = useState<number>(25);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const milestones = [
    { value: 0, label: '0% - Project Started', icon: '🚀' },
    { value: 25, label: '25% - Foundation Work', icon: '🏗️' },
    { value: 50, label: '50% - Halfway Complete', icon: '⚡' },
    { value: 75, label: '75% - Almost Done', icon: '🎯' },
    { value: 100, label: '100% - Project Finished', icon: '🎉' }
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos(filesArray);

      // Create preview URLs
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('notes', notes);
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await fetch(
        `http://localhost:8080/projects/${projectId}/milestones/${percentage}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (response.ok) {
        alert('Milestone updated successfully!');
        setNotes('');
        setPhotos([]);
        setPreviewUrls([]);
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to update milestone');
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Error updating milestone');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Project Milestone</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Milestone Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Milestone
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {milestones.map((milestone) => (
              <button
                key={milestone.value}
                type="button"
                onClick={() => setPercentage(milestone.value)}
                className={`p-4 rounded-lg border-2 transition text-center ${
                  percentage === milestone.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">{milestone.icon}</div>
                <div className="text-sm font-semibold">{milestone.value}%</div>
                <div className="text-xs text-gray-600 mt-1">
                  {milestone.label.split(' - ')[1]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Progress Notes *
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
            placeholder="Describe the work completed at this milestone..."
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Progress Photos
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload photos showing the progress at this milestone
          </p>
        </div>

        {/* Photo Previews */}
        {previewUrls.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Photo Previews ({previewUrls.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {uploading ? 'Uploading...' : `Update ${percentage}% Milestone`}
        </button>
      </form>
    </div>
  );
}
