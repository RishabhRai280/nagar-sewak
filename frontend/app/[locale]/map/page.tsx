// app/map/page.tsx

import MapClientWrapper from "./MapClientWrapper";

export default function MapPage() {
  // Map takes full viewport height minus header, with top margin to clear the fixed header
  return (
    <div className="flex flex-col w-full h-[calc(100vh-60px)] mt-[60px] bg-slate-50">
      {/* Map Container - MapClientWrapper is correctly marked 'use client' and handles map logic */}
      <div className="flex-1 w-full overflow-hidden relative">
        <MapClientWrapper />
      </div>
    </div>
  );
}