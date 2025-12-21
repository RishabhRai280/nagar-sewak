"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations('dashboard.citizen.privacy');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [preserveRecords, setPreserveRecords] = useState(true);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/compliance/export/my-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `user_data_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/compliance/delete/my-account?preserveAnonymizedRecords=${preserveRecords}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear local storage and redirect to home
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
              <p className="text-slate-600">{t('subtitle')}</p>
            </div>
          </div>

          {/* Data Export Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-start gap-4">
              <Download className="text-blue-600 mt-1" size={24} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t('export.title')}</h2>
                <p className="text-slate-700 mb-4">{t('export.description')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={16} />
                    <span className="text-sm text-slate-600">{t('export.includes.profile')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={16} />
                    <span className="text-sm text-slate-600">{t('export.includes.complaints')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={16} />
                    <span className="text-sm text-slate-600">{t('export.includes.security')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={16} />
                    <span className="text-sm text-slate-600">{t('export.includes.preferences')}</span>
                  </div>
                </div>

                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      {t('export.exporting')}
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {t('export.button')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Data Retention Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-start gap-4">
              <Clock className="text-green-600 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t('retention.title')}</h2>
                <p className="text-slate-700 mb-4">{t('retention.description')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-slate-600">{t('retention.auditLogs')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-slate-600">{t('retention.emailHistory')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-slate-600">{t('retention.loginAttempts')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-sm text-slate-600">{t('retention.deviceData')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Deletion Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-red-50 rounded-xl border border-red-200"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-600 mt-1" size={24} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t('deletion.title')}</h2>
                <p className="text-slate-700 mb-4">{t('deletion.description')}</p>
                
                <div className="mb-4 p-4 bg-white rounded-lg border border-red-200">
                  <h3 className="font-semibold text-slate-900 mb-2">{t('deletion.options.title')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deleteOption"
                        checked={preserveRecords}
                        onChange={() => setPreserveRecords(true)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">{t('deletion.options.anonymize')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deleteOption"
                        checked={!preserveRecords}
                        onChange={() => setPreserveRecords(false)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">{t('deletion.options.complete')}</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {t('deletion.button')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="text-xl font-bold text-slate-900">{t('deletion.confirm.title')}</h3>
            </div>
            
            <p className="text-slate-700 mb-6">{t('deletion.confirm.message')}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t('deletion.confirm.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {t('deletion.confirm.deleting')}
                  </>
                ) : (
                  t('deletion.confirm.delete')
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}