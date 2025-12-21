"use client";

import { useState } from "react";
import { X, Upload, Camera, Percent } from "lucide-react";

interface ProjectProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    progress: number;
    status: string;
    notes: string;
    photos: File[];
  }) => Promise<void>;
  currentProgress: number;
  currentStatus: string;
}

export default function ProjectProgressUpdateModal({
  isOpen,
  onClose,
  onUpdate,
  currentProgress,
  currentStatus
}: ProjectProgressUpdateModalProps) {
  const [progress, setProgress] = useState(currentProgress);
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert("Please provide update notes");
      return;
    }

    setUpdating(true);
    try {
      await onUpdate({ progress, status, notes, photos });
      onClose();
      // Reset form
      setNotes("");
      setPhotos([]);
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Update Project Progress</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Progress Percentage */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Progress Percentage
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg">
                <Percent size={16} className="text-blue-600" />
                <span className="font-bold text-blue-900 min-w-[3ch]">{progress}</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-3">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Update Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Update Notes *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the work completed, challenges faced, next steps..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Progress Photos
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Camera size={24} className="text-blue-600" />
                  </div>
                  <p className="text-slate-600">
                    Click to upload progress photos
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !notes.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Update Progress
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}