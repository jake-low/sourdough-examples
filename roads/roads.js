import roadzilla from "roadzilla";

const road_types = [
  "motorway",
  "trunk",
  "primary",
  "secondary",
  "tertiary",
  "residential",
  "unclassified",
  "track",
  "service",
  "pedestrian",
  "living_street",
];

const roads = roadzilla({ layers: [-1, 0, 1, 2, 3, 4] });

export const ROADS = roads;

const road_labels = {
  "id": "road_labels",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 13,
  "filter": [
    "all",
    ["in", "highway", ...road_types],
    ["==", "$type", "LineString"],
    ["has", "name"],
  ],
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Condensed Regular"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 13, 9, 18, 14],
    "text-letter-spacing": 0.05,
    "text-rotation-alignment": "map",
    "symbol-spacing": 300,
    "text-max-angle": 30,
  },
  "paint": {
    "text-color": "#666",
    "text-halo-color": "#fff",
    "text-halo-width": 2,
  },
};

const oneway_arrows = {
  "id": "road_oneway_arrows",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 15,
  "filter": [
    "all",
    ["in", "highway", ...road_types],
    ["==", "$type", "LineString"],
    ["has", "oneway"],
    ["in", "oneway", "yes", "1", "-1"],
  ],
  "layout": {
    "symbol-placement": "line",
    "symbol-spacing": ["interpolate", ["linear"], ["zoom"], 15, 100, 18, 200],
    "icon-image": "maki-arrow",
    "icon-rotate": ["case", ["==", ["get", "oneway"], "-1"], 180, 0],
    "icon-size": ["interpolate", ["linear"], ["zoom"], 15, 0.3, 18, 0.8],
    "icon-rotation-alignment": "map",
    "icon-overlap": "always",
    "icon-padding": 2,
  },
  "paint": {
    "icon-color": "#aaaaaa",
  },
};

export const ROAD_LABELS = [oneway_arrows, road_labels];
