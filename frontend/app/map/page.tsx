// app/map/page.tsx
import MapClientWrapper from "./MapClientWrapper";

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Nagar Sewak – Live City Map
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Track progress of government projects and monitor citizen complaints
          in real time.
        </p>
      </div>

      {/* Map Container */}
      <div
        className="
        relative overflow-hidden rounded-2xl 
        bg-white/70 backdrop-blur-md 
        border border-gray-200 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all
      "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>

        <div className="h-[75vh]">
          <MapClientWrapper />
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center text-gray-500 text-sm mt-6">
        Real-time data is refreshed automatically every few seconds.
      </div>
    </div>
  );
}
