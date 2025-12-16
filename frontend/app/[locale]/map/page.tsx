// app/map/page.tsx

import MapClientWrapper from "./MapClientWrapper";

export default function MapPage() {
  // Map takes full viewport height minus header, with top margin to clear the fixed header
  return (
    <div className="w-full bg-slate-50 overflow-hidden" style={{ height: '100vh', paddingTop: '68px' }}>
      {/* Map Container - MapClientWrapper is correctly marked 'use client' and handles map logic */}
      <div className="w-full overflow-hidden relative" style={{ height: 'calc(100vh - 68px)' }}>
        <MapClientWrapper />
      </div>
    </div>
  );
}