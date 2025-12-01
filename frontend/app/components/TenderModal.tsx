import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, FileText, Upload, File, Trash2 } from 'lucide-react';
import { submitTender, TenderSubmitData } from '@/lib/api';

interface TenderModalProps {
    complaintId: number;
    complaintTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TenderModal({ complaintId, complaintTitle, onClose, onSuccess }: TenderModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [formData, setFormData] = useState<TenderSubmitData>({
        quoteAmount: 0,
        estimatedDays: 0,
        description: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + documents.length > 5) {
            setError("Maximum 5 documents allowed");
            return;
        }
        setDocuments([...documents, ...files]);
        setError(null);
    };

    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await submitTender(complaintId, formData, documents);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to submit tender");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Submit Tender</h3>
                            <p className="text-sm text-slate-500 truncate max-w-xs">{complaintTitle}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Cost (₹)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium"
                                    placeholder="0.00"
                                    value={formData.quoteAmount || ''}
                                    onChange={e => setFormData({ ...formData, quoteAmount: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Duration (Days)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium"
                                    placeholder="Days to complete"
                                    value={formData.estimatedDays || ''}
                                    onChange={e => setFormData({ ...formData, estimatedDays: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Proposal Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium resize-none"
                                    placeholder="Describe your approach, materials, and timeline..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Supporting Documents ({documents.length}/5)
                            </label>
                            
                            {documents.length === 0 ? (
                                <label className="block cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={documents.length >= 5}
                                    />
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition">
                                        <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                                        <p className="text-sm font-medium text-slate-600">Click to upload documents</p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, Images, Blueprints (Max 5 files)</p>
                                    </div>
                                </label>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map((doc, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <File size={20} className="text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{(doc.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {documents.length < 5 && (
                                        <label className="block cursor-pointer">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center hover:border-blue-400 hover:bg-blue-50/50 transition">
                                                <p className="text-sm font-medium text-blue-600">+ Add More Documents</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Proposal"
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
