"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Eye, EyeOff, Building2, FileText, Mail, Lock, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ContractorFormData {
    username: string;
    password: string;
    email: string;
    fullName: string;
    companyName: string;
    licenseNo: string;
}

interface ContractorManagementProps {
    onContractorCreated?: () => void;
}

export default function ContractorManagement({ onContractorCreated }: ContractorManagementProps) {
    const t = useTranslations('admin');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<ContractorFormData>({
        username: '',
        password: '',
        email: '',
        fullName: '',
        companyName: '',
        licenseNo: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) throw new Error('Authentication required');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/admin/contractors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to create contractor' }));
                throw new Error(errorData.message || 'Failed to create contractor');
            }

            setSuccess('Contractor account created successfully!');
            setFormData({
                username: '',
                password: '',
                email: '',
                fullName: '',
                companyName: '',
                licenseNo: ''
            });

            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(null);
                onContractorCreated?.();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Failed to create contractor account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
            >
                <UserPlus size={20} />
                Create Contractor Account
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Header */}
                                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Create Contractor Account</h2>
                                            <p className="text-blue-100 text-sm">Add a new contractor to the system</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Error/Success Messages */}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                                            {success}
                                        </div>
                                    )}

                                    {/* Account Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <User size={20} className="text-blue-600" />
                                            Account Information
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    Username *
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                        placeholder="contractor_username"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    Email *
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                        placeholder="contractor@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Password *
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    minLength={8}
                                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                    placeholder="Minimum 8 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Information */}
                                    <div className="space-y-4 pt-4 border-t border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Building2 size={20} className="text-blue-600" />
                                            Company Information
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Company Name *
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                    placeholder="ABC Construction Ltd."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                License Number *
                                            </label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="licenseNo"
                                                    value={formData.licenseNo}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                    placeholder="LIC-2025-12345"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Creating...' : 'Create Contractor'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
