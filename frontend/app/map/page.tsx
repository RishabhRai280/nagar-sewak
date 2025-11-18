// app/map/page.tsx

import MapClientWrapper from "./MapClientWrapper";

export default function MapPage() {
  // This structure ensures the map wrapper takes up the full remaining viewport height.
  // The header and footer are managed by the parent layout component.
  // To achieve a truly full-screen map experience, we will eliminate the layout's margin
  // by ensuring the containing div is maximized and removing the top header section.
  return (
    <div className="flex flex-col h-screen w-full p-0 m-0">
      {/* Map Container - MapClientWrapper is correctly marked 'use client' and handles map logic */}
      <div className="flex-1 w-full overflow-hidden">
        <MapClientWrapper />
      </div>
    </div>
  );
}