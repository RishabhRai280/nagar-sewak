// app/map/MapClientWrapper.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import LoadingState from "@/app/components/map/LoadingState";

const Map = dynamic(() => import("@/app/components/map/Map"), { ssr: false });

export default function MapClientWrapper() {
  return (
    <div className="w-full h-[70vh] md:h-[78vh]">
      <Suspense fallback={<LoadingState />}>
        <Map />
      </Suspense>
    </div>
  );
}
