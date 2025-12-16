import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, DollarSign, User } from 'lucide-react';
import { fetchTendersForComplaint, acceptTender, TenderData } from '@/lib/api';

interface TenderReviewModalProps {
    complaintId: number;
    complaintTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TenderReviewModal({ complaintId, complaintTitle, onClose, onSuccess }: TenderReviewModalProps) {
    const [tenders, setTenders] = useState<TenderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadTenders();
    }, [complaintId]);

    const loadTenders = async () => {
        try {
            const data = await fetchTendersForComplaint(complaintId);
            setTenders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (tenderId: number) => {
        if (!confirm("Are you sure you want to accept this tender? This will create a project and reject other bids.")) return;

        setProcessingId(tenderId);
        try {
            await acceptTender(tenderId);
            onSuccess();
            onClose();
        } catch (err) {
            alert("Failed to accept tender");
            setProcessingId(null);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Review Tenders</h3>
                            <p className="text-sm text-slate-500 truncate max-w-md">For: {complaintTitle}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        ) : tenders.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                <p>No tenders submitted for this complaint yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tenders.map((tender) => (
                                    <div key={tender.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <User size={18} className="text-slate-400" />
                                                <span className="font-bold text-slate-900">{tender.contractorName}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${tender.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                                                    tender.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {tender.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quote Amount</p>
                                                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                                                    <DollarSign size={16} className="text-emerald-500" />
                                                    ₹{tender.quoteAmount?.toLocaleString() || '0'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Duration</p>
                                                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                                                    <Clock size={16} className="text-blue-500" />
                                                    {tender.estimatedDays} Days
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                {tender.description}
                                            </p>
                                        </div>

                                        {tender.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleAccept(tender.id)}
                                                disabled={processingId === tender.id}
                                                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {processingId === tender.id ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle size={18} /> Accept Tender
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
