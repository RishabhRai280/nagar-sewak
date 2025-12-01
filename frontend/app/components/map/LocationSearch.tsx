"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

interface LocationResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    geojson?: any;
}

interface LocationSearchProps {
    onLocationSelect: (lat: number, lng: number, zoom?: number, geojson?: any) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
    const t = useTranslations('map');
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 2) {
                searchLocation(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchLocation = async (q: string) => {
        setLoading(true);
        try {
            // Use internal API route to avoid CORS/User-Agent issues with Nominatim
            const response = await fetch(
                `/api/geocode?q=${encodeURIComponent(q)}`
            );
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Error searching location:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (result: LocationResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Determine zoom level based on type
        let zoom = 13;
        if (result.type === "city" || result.type === "administrative") zoom = 12;
        if (result.type === "state") zoom = 7;
        if (result.type === "country") zoom = 5;

        onLocationSelect(lat, lng, zoom, result.geojson);
        setQuery(result.display_name.split(",")[0]); // Show short name
        setShowResults(false);
        setResults([]);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setShowResults(false);
    };

    return (
        // UPDATED: Changed top-4 to top-24 to avoid header overlap
        <div ref={searchRef} className="absolute top-24 left-4 z-[1000] w-full max-w-xs sm:max-w-md">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loading ? (
                        <Loader2 className="animate-spin text-blue-500" size={18} />
                    ) : (
                        <Search className="text-slate-400 group-focus-within:text-blue-500 transition" size={18} />
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length > 0) setShowResults(true);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                    placeholder={t('searchLocation')}
                    className="block w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-md border border-white/50 rounded-xl leading-5 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm shadow-lg transition-all"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showResults && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        <ul className="py-1">
                            {results.map((result) => (
                                <li key={result.place_id}>
                                    <button
                                        onClick={() => handleSelect(result)}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 group"
                                    >
                                        <MapPin className="mt-0.5 text-slate-400 group-hover:text-blue-500 flex-shrink-0" size={16} />
                                        <div>
                                            <span className="block text-sm font-medium text-slate-800 group-hover:text-blue-700">
                                                {result.display_name.split(",")[0]}
                                            </span>
                                            <span className="block text-xs text-slate-500 truncate max-w-[250px]">
                                                {result.display_name}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
