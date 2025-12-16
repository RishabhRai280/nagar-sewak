"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { submitComplaint, Token } from "@/lib/api/api";
import { validateComplaint, sanitizeInput } from "@/lib/utils/validation";
import { translateToHindi, translateToEnglish } from "@/lib/utils/translation";
import { useTranslations } from "next-intl";
import {
  MapPin, Upload, AlertCircle, Loader, CheckCircle,
  FileText, X, ChevronRight,
  Navigation, Languages, AlertTriangle
} from 'lucide-react';
import { StatusAnnouncement } from '../shared/AccessibilityUtils';

const MiniMap = dynamic(() => import("../shared/MiniMap"), { ssr: false });
const LocationPicker = dynamic(() => import("../shared/LocationPicker"), { ssr: false });

export default function CitizenComplaintForm() {
  const t = useTranslations('report');
  const tGlobal = useTranslations();
  const router = useRouter();

  // Bilingual states
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [languageWarning, setLanguageWarning] = useState<string | null>(null);

  const [severity, setSeverity] = useState(1);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "success" | "error">("idle");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Token.get();
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError(t('messages.geoUnsupported'));
      setLocationStatus("error");
      return;
    }
    setLocationStatus("fetching");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationStatus("success");
        setError(null);
      },
      (err) => {
        let errorMessage = t('messages.geoError') + " ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = t('messages.geoPermission');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = t('messages.geoUnavailable');
            break;
          case err.TIMEOUT:
            errorMessage = t('messages.geoTimeout');
            break;
          default:
            errorMessage = t('messages.geoError');
        }
        setError(errorMessage);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000
      }
    );
  };

  // Detect if text is in Hindi (Devanagari script)
  const isHindiText = (text: string): boolean => {
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text);
  };

  // Detect if text is in English (Latin script)
  const isEnglishText = (text: string): boolean => {
    const latinRegex = /[a-zA-Z]/;
    return latinRegex.test(text) && !isHindiText(text);
  };

  // Auto-translate title from English to Hindi
  const handleTitleEnChange = async (value: string) => {
    setTitleEn(value);
    setLanguageWarning(null);

    if (value.trim() && !isTranslating) {
      // Check if user is typing Hindi in English box
      if (isHindiText(value)) {
        setLanguageWarning("Please write Hindi text in the Hindi box (हिंदी)");
        setTitleHi(value);
        setTitleEn("");
        return;
      }

      setIsTranslating(true);
      const translated = await translateToHindi(value);
      setTitleHi(translated);
      setIsTranslating(false);
    } else if (!value.trim()) {
      setTitleHi("");
    }
  };

  // Auto-translate title from Hindi to English
  const handleTitleHiChange = async (value: string) => {
    setTitleHi(value);
    setLanguageWarning(null);

    if (value.trim() && !isTranslating) {
      // Check if user is typing English in Hindi box
      if (isEnglishText(value)) {
        setLanguageWarning("Please write English text in the English box");
        setTitleEn(value);
        setTitleHi("");
        return;
      }

      setIsTranslating(true);
      const translated = await translateToEnglish(value);
      setTitleEn(translated);
      setIsTranslating(false);
    } else if (!value.trim()) {
      setTitleEn("");
    }
  };

  // Auto-translate description from English to Hindi
  const handleDescriptionEnChange = async (value: string) => {
    setDescriptionEn(value);
    setLanguageWarning(null);

    if (value.trim() && !isTranslating) {
      if (isHindiText(value)) {
        setLanguageWarning("Please write Hindi text in the Hindi box (हिंदी)");
        setDescriptionHi(value);
        setDescriptionEn("");
        return;
      }

      setIsTranslating(true);
      const translated = await translateToHindi(value);
      setDescriptionHi(translated);
      setIsTranslating(false);
    } else if (!value.trim()) {
      setDescriptionHi("");
    }
  };

  // Auto-translate description from Hindi to English
  const handleDescriptionHiChange = async (value: string) => {
    setDescriptionHi(value);
    setLanguageWarning(null);

    if (value.trim() && !isTranslating) {
      if (isEnglishText(value)) {
        setLanguageWarning("Please write English text in the English box");
        setDescriptionEn(value);
        setDescriptionHi("");
        return;
      }

      setIsTranslating(true);
      const translated = await translateToEnglish(value);
      setDescriptionEn(translated);
      setIsTranslating(false);
    } else if (!value.trim()) {
      setDescriptionEn("");
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationStatus("success");
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 6) {
      setError(t('messages.maxFiles'));
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);

    // Use English version for submission, fallback to Hindi if English is empty
    const title = titleEn.trim() || titleHi.trim();
    const description = descriptionEn.trim() || descriptionHi.trim();

    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);

    const validation = validateComplaint({
      title: sanitizedTitle,
      description: sanitizedDescription,
      severity,
      lat: latitude,
      lng: longitude,
      file: selectedFiles.length > 0 ? selectedFiles[0] : null,
    }, tGlobal);

    if (!validation.valid) {
      // Note: validation.errors might still be hardcoded strings from the validation util.
      // Ideally we should internationalize validation util too, but for now we set a generic error message.
      setValidationErrors(validation.errors);
      setError(t('messages.requiredFields'));
      return;
    }

    if (selectedFiles.length === 0) {
      setError(t('messages.evidenceRequired'));
      return;
    }

    setLoading(true);
    try {
      await submitComplaint(
        {
          title: sanitizedTitle,
          description: sanitizedDescription,
          severity,
          lat: latitude!,
          lng: longitude!
        },
        selectedFiles
      );
      router.push("/dashboard/citizen?submission=success");
    } catch (err: any) {
      setError(err?.message ?? t('messages.submitError'));
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      {/* Go Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors mb-6 group font-medium"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:bg-blue-50 transition-all">
          <ChevronRight size={16} className="rotate-180 text-slate-400 group-hover:text-blue-600" />
        </div>
        <span>Back to Home</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        {/* --- LEFT SIDE BANNER --- */}
        <div className="lg:w-1/3 bg-[#1e3a8a] text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -ml-16 -mb-16"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex flex-col items-start gap-4 mb-10">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 p-2 shadow-lg">
                {/* Ashoka Emblem */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Satyamev Jayate"
                  className="w-full h-full object-contain drop-shadow-md invert brightness-0"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight leading-none">NAGAR<br />SEWAK</h3>
                <p className="text-[10px] font-medium tracking-widest opacity-70 mt-1 uppercase">{t('banner.portalName')}</p>
              </div>
            </div>

            {/* --- Process Visualization --- */}
            <div className="flex-1 flex flex-col justify-center py-8">
              <div className="space-y-8 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-2 bottom-8 w-0.5 bg-blue-400/30"></div>

                {/* Step 1 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText size={18} className="text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">{t('banner.steps.filed.title')}</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      {t('banner.steps.filed.desc')}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 delay-100">
                    <Navigation size={18} className="text-blue-200" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">{t('banner.steps.onsite.title')}</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      {t('banner.steps.onsite.desc')}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4 group">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-emerald-500 border-4 border-[#1e3a8a] flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform duration-300 delay-200">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">{t('banner.steps.resolution.title')}</h4>
                    <p className="text-blue-200/80 text-xs leading-relaxed max-w-[200px]">
                      {t('banner.steps.resolution.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto mb-12">
              <h2 className="text-3xl font-black leading-tight mb-4 whitespace-pre-line">
                {t('banner.slogan.title')}
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                {t('banner.slogan.desc')}
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium text-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>{t('banner.features.geo')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>{t('banner.features.escalation')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center"><CheckCircle size={12} /></div>
                <span>{t('banner.features.tracking')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE FORM --- */}
        <div className="flex-1 bg-white relative">
          {/* Tricolor Top Bar (Mobile Only) */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/3 bg-[#f97316]"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-[#166534]"></div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 h-full overflow-y-auto custom-scrollbar">

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('form.header')}</h1>
              <p className="text-slate-500 text-sm">{t('form.subHeader')}</p>
            </div>

            {/* Error Notification */}
            {(error || validationErrors.length > 0) && (
              <div
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-md flex items-start gap-3 animate-pulse"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="text-red-600 mt-0.5" size={20} aria-hidden="true" />
                <div>
                  <h4 className="text-red-800 font-bold text-sm">{t('form.failed')}</h4>
                  {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
                  {validationErrors.length > 0 && (
                    <ul className="list-disc list-inside text-red-700 text-xs mt-2 pl-1" aria-label="Validation errors">
                      {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* INPUTS */}
              <div className="space-y-6">
                {/* Language Warning */}
                <AnimatePresence>
                  {languageWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r flex items-start gap-3"
                    >
                      <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-bold text-amber-800 text-sm">Language Detected</h4>
                        <p className="text-amber-700 text-sm">{languageWarning}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bilingual Title Inputs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {t('form.subject')} <span className="text-red-500">*</span>
                    </label>
                    {isTranslating && (
                      <div className="flex items-center gap-1 text-blue-600 text-xs">
                        <Languages size={14} className="animate-pulse" />
                        <span>Translating...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* English Title */}
                    <div className="relative group">
                      <label htmlFor="title-en" className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">
                        English
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                        <input
                          id="title-en"
                          type="text"
                          value={titleEn}
                          onChange={(e) => handleTitleEnChange(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="Water Leakage in Sector 4"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Hindi Title */}
                    <div className="relative group">
                      <label htmlFor="title-hi" className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">
                        हिंदी (Hindi)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                        <input
                          id="title-hi"
                          type="text"
                          value={titleHi}
                          onChange={(e) => handleTitleHiChange(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="सेक्टर 4 में पानी का रिसाव"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bilingual Description Inputs */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {t('form.description')} <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* English Description */}
                    <div>
                      <label htmlFor="desc-en" className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">
                        English
                      </label>
                      <textarea
                        id="desc-en"
                        rows={5}
                        value={descriptionEn}
                        onChange={(e) => handleDescriptionEnChange(e.target.value)}
                        className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900 resize-none placeholder:text-slate-400"
                        placeholder="Provide detailed information..."
                        disabled={loading}
                      />
                    </div>

                    {/* Hindi Description */}
                    <div>
                      <label htmlFor="desc-hi" className="text-[10px] font-semibold text-slate-400 uppercase mb-1.5 block">
                        हिंदी (Hindi)
                      </label>
                      <textarea
                        id="desc-hi"
                        rows={5}
                        value={descriptionHi}
                        onChange={(e) => handleDescriptionHiChange(e.target.value)}
                        className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900 resize-none placeholder:text-slate-400"
                        placeholder="विस्तृत जानकारी प्रदान करें..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <fieldset>
                  <legend className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wide">
                    {t('form.urgency')}
                  </legend>
                  <div className="flex gap-3" role="radiogroup" aria-labelledby="urgency-legend" aria-describedby="urgency-help">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all transform active:scale-95 min-h-[44px] ${severity === lvl
                          ? lvl <= 2 ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-lg'
                            : lvl <= 3 ? 'bg-amber-500 border-amber-500 text-white shadow-amber-200 shadow-lg'
                              : 'bg-red-600 border-red-600 text-white shadow-red-200 shadow-lg'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        role="radio"
                        aria-checked={severity === lvl}
                        aria-label={`Urgency level ${lvl} of 5${lvl <= 2 ? ' - Low priority' : lvl <= 3 ? ' - Medium priority' : ' - High priority'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase px-1">
                    <span>{t('form.routine')}</span>
                    <span>{t('form.immediate')}</span>
                  </div>
                  <div id="urgency-help" className="sr-only">
                    Select urgency level from 1 (routine) to 5 (immediate attention required)
                  </div>
                </fieldset>
              </div>

              {/* LOCATION & EVIDENCE - VERTICAL STACK */}
              <div className="space-y-6 pt-6 mt-2 border-t border-slate-100">

                {/* Location - Full Width */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label
                      htmlFor="location-map"
                      className="text-xs font-bold text-slate-500 uppercase block tracking-wide"
                    >
                      {t('form.location.label')}
                    </label>
                    {latitude && (
                      <span
                        className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"
                        role="status"
                        aria-label="Location has been set"
                      >
                        <CheckCircle size={10} aria-hidden="true" /> {t('form.location.gpsLocked')}
                      </span>
                    )}
                  </div>

                  <button
                    id="location-map"
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="relative h-40 w-full bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-100 group cursor-pointer shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    aria-label={latitude && longitude ? `Location set at coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Click to change location.` : "Click to set location on map"}
                    aria-describedby="location-help"
                  >
                    {latitude && longitude ? (
                      <MiniMap lat={latitude} lng={longitude} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <MapPin size={32} className="mb-2 opacity-50" aria-hidden="true" />
                        <span className="text-sm font-bold text-slate-500">{t('form.location.tapToSet')}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </button>

                  <div id="location-help" className="sr-only">
                    Set the location where the issue occurred. You can use GPS detection or manually select on the map.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={getLocation}
                      className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-sm uppercase tracking-wider min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      aria-label="Detect current location using GPS"
                      disabled={locationStatus === "fetching"}
                    >
                      <Navigation size={14} aria-hidden="true" />
                      {locationStatus === "fetching" ? "Detecting..." : t('form.location.detect')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-sm uppercase tracking-wider min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      aria-label="Select location manually on map"
                    >
                      <MapPin size={14} aria-hidden="true" /> {t('form.location.pin')}
                    </button>
                  </div>
                </div>

                {/* File Upload - Adaptive sizing */}
                <div className="space-y-3">
                  <label
                    htmlFor="file-upload"
                    className="text-xs font-bold text-slate-500 uppercase block tracking-wide"
                  >
                    {t('form.evidence.label')} ({selectedFiles.length}/6)
                  </label>

                  <div className={selectedFiles.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "block"}>
                    {/* Dropzone - Resizes based on state */}
                    <label
                      htmlFor="file-upload"
                      className={`
                          flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-500 transition group bg-slate-50/50 relative overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
                          ${selectedFiles.length === 0 ? "h-64 border-spacing-4" : "h-40"}
                      `}
                      aria-describedby="file-upload-help"
                    >
                      <div className={`
                            rounded-full bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors
                            ${selectedFiles.length === 0 ? "w-20 h-20" : "w-12 h-12"}
                        `}>
                        <Upload className="text-slate-400 group-hover:text-blue-600" size={selectedFiles.length === 0 ? 32 : 20} aria-hidden="true" />
                      </div>
                      <span className={`font-bold text-slate-500 group-hover:text-blue-700 uppercase ${selectedFiles.length === 0 ? "text-lg" : "text-xs"}`}>
                        {selectedFiles.length === 0 ? t('form.evidence.clickToUpload') : t('form.evidence.addMore')}
                      </span>
                      {selectedFiles.length === 0 && (
                        <p className="text-slate-400 text-xs mt-2">{t('form.evidence.supports')}</p>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        aria-describedby="file-upload-help"
                        aria-label="Upload evidence files (images or videos)"
                      />
                    </label>

                    <div id="file-upload-help" className="sr-only">
                      Upload up to 6 image or video files as evidence for your complaint. Supported formats include JPG, PNG, MP4, and other common media formats.
                    </div>

                    {/* Side Previews */}
                    {selectedFiles.length > 0 && (
                      <div
                        className="grid grid-cols-3 gap-3 h-40 overflow-y-auto custom-scrollbar content-start"
                        role="list"
                        aria-label="Uploaded evidence files"
                      >
                        {selectedFiles.map((file, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm group h-full"
                            role="listitem"
                          >
                            {file.type.startsWith('image') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover"
                                alt={`Evidence image: ${file.name}`}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                                <FileText size={20} className="text-slate-400 mb-1" aria-hidden="true" />
                                <span className="text-[8px] text-slate-500 truncate w-full">{file.name}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); removeFile(i); }}
                                className="bg-red-600 text-white rounded-full p-1.5 hover:scale-110 transition min-h-[44px] min-w-[44px] focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 outline-none"
                                aria-label={`Remove ${file.name} from evidence`}
                              >
                                <X size={14} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || (!titleEn.trim() && !titleHi.trim()) || (!descriptionEn.trim() && !descriptionHi.trim())}
                className="w-full py-4 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                aria-describedby="submit-help"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} aria-hidden="true" />
                    <span>Submitting complaint...</span>
                  </>
                ) : (
                  <>
                    {t('form.submit')}
                    <ChevronRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
              <div id="submit-help" className="sr-only">
                Submit your complaint. Make sure to fill in the title and description before submitting.
              </div>
            </div>

            {/* Status announcements for screen readers */}
            {loading && (
              <StatusAnnouncement
                message="Submitting your complaint, please wait..."
                priority="polite"
              />
            )}

            {locationStatus === "fetching" && (
              <StatusAnnouncement
                message="Detecting your current location..."
                priority="polite"
              />
            )}

            {locationStatus === "success" && latitude && longitude && (
              <StatusAnnouncement
                message="Location detected successfully"
                priority="polite"
              />
            )}

            {locationStatus === "error" && (
              <StatusAnnouncement
                message="Unable to detect location. Please set location manually."
                priority="assertive"
              />
            )}
          </form>
        </div>
      </div >

      {/* Map Picker Modal */}
      <AnimatePresence>
        {
          showMapPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowMapPicker(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200"
              >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{t('form.location.modalTitle')}</h3>
                  <button
                    onClick={() => setShowMapPicker(false)}
                    className="w-8 h-8 rounded hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="h-[500px] relative">
                  <LocationPicker
                    lat={latitude}
                    lng={longitude}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(false)}
                    className="px-6 py-2 bg-slate-800 text-white text-xs font-bold uppercase rounded hover:bg-slate-900 transition"
                  >
                    {t('form.location.confirm')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

    </motion.div >
  );
}