// Sample ward boundary data for demonstration
// In production, this would come from your backend API

export const sampleWardBoundaries = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Ward 1 - Central",
        population: 45000,
        area: 12.5,
        density: 3600,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.08, 21.14],
          [79.09, 21.14],
          [79.09, 21.15],
          [79.08, 21.15],
          [79.08, 21.14],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Ward 2 - North",
        population: 38000,
        area: 15.2,
        density: 2500,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.09, 21.15],
          [79.10, 21.15],
          [79.10, 21.16],
          [79.09, 21.16],
          [79.09, 21.15],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Ward 3 - South",
        population: 52000,
        area: 18.7,
        density: 2780,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.08, 21.13],
          [79.09, 21.13],
          [79.09, 21.14],
          [79.08, 21.14],
          [79.08, 21.13],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Ward 4 - East",
        population: 41000,
        area: 14.3,
        density: 2867,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.10, 21.14],
          [79.11, 21.14],
          [79.11, 21.15],
          [79.10, 21.15],
          [79.10, 21.14],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Ward 5 - West",
        population: 35000,
        area: 16.8,
        density: 2083,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.07, 21.14],
          [79.08, 21.14],
          [79.08, 21.15],
          [79.07, 21.15],
          [79.07, 21.14],
        ]],
      },
    },
  ],
};

export const samplePopulationData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        density: 8500,
        total: 45000,
        area: 5.3,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.085, 21.145],
          [79.090, 21.145],
          [79.090, 21.150],
          [79.085, 21.150],
          [79.085, 21.145],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        density: 3200,
        total: 28000,
        area: 8.75,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.090, 21.145],
          [79.095, 21.145],
          [79.095, 21.150],
          [79.090, 21.150],
          [79.090, 21.145],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        density: 12000,
        total: 60000,
        area: 5.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [79.085, 21.140],
          [79.090, 21.140],
          [79.090, 21.145],
          [79.085, 21.145],
          [79.085, 21.140],
        ]],
      },
    },
  ],
};

export const sampleInfrastructureData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        type: "road",
        name: "Main Street",
        status: "Good",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [79.08, 21.14],
          [79.09, 21.145],
          [79.10, 21.15],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "water",
        name: "Water Pipeline - Zone A",
        status: "Operational",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [79.085, 21.14],
          [79.090, 21.142],
          [79.095, 21.145],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "power",
        name: "Power Line - Grid 1",
        status: "Operational",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [79.08, 21.145],
          [79.085, 21.148],
          [79.09, 21.150],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "sewer",
        name: "Sewer Line - District 2",
        status: "Needs Maintenance",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [79.087, 21.14],
          [79.092, 21.143],
          [79.097, 21.146],
        ],
      },
    },
  ],
};
