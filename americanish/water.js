import {
  BACKGROUND_FILL,
  WATER_FILL,
  WATER_FILL_TRANSLUCENT,
  WATER_INTERMITTENT_FILL,
  WATER_INTERMITTENT_OUTLINE,
  WATER_LABEL,
  WATER_LINE,
  WATER_LINE_BOLD,
} from "./colors.js";
import { IS_LINE, IS_POINT, IS_POLYGON, reczoomGate } from "./utils.js";

const NOT_INTERMITTENT = ["!=", ["get", "intermittent"], "yes"];
const IS_INTERMITTENT = ["==", ["get", "intermittent"], "yes"];

// Shoreline outline for permanent water. Drawn beneath the water fill so that
// only the portion of the stroke outside the polygon boundary remains visible.
const water_line = {
  "id": "water_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "water",
  "filter": [
    "all",
    NOT_INTERMITTENT,
    [
      "match",
      ["get", "water"],
      ["river", "canal"],
      [">=", ["zoom"], 8],
      ["stream"],
      [">=", ["zoom"], 16],
      ["lake"],
      [">=", ["zoom"], 8],
      true,
    ],
  ],
  "layout": {
    "line-cap": "round",
    "line-join": "round",
  },
  "paint": {
    "line-color": WATER_LINE_BOLD,
  },
};

const water_line_intermittent = {
  "id": "water_line_intermittent",
  "type": "line",
  "source": "sourdough",
  "source-layer": "water",
  "minzoom": 8,
  "filter": IS_INTERMITTENT,
  "layout": {
    "line-cap": "round",
    "line-join": "round",
  },
  "paint": {
    "line-color": WATER_INTERMITTENT_OUTLINE,
    "line-dasharray": [10, 6],
    "line-width": 0.5,
  },
};

// Drawn below the water fill so rivers running into lakes don't overdraw them.
const waterway = {
  "id": "waterway",
  "type": "line",
  "source": "sourdough",
  "source-layer": "waterways",
  "filter": ["all", IS_LINE, NOT_INTERMITTENT],
  "layout": {
    "line-cap": "round",
    "line-join": "round",
  },
  "paint": {
    "line-color": ["interpolate", ["exponential", 0.5], ["zoom"], 13, WATER_LINE, 15, WATER_FILL],
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      3,
      0.5,
      16,
      ["match", ["get", "waterway"], ["river", "canal"], 10, ["stream"], 6, 2],
    ],
    "line-opacity": ["case", ["has", "tunnel"], 0.3, 1],
  },
};

const waterway_intermittent = {
  ...waterway,
  "id": "waterway_intermittent",
  "filter": ["all", IS_LINE, IS_INTERMITTENT],
  "paint": {
    ...waterway.paint,
    "line-dasharray": [2, 3],
  },
};

const water = {
  "id": "water",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "water",
  "paint": {
    "fill-color": ["case", IS_INTERMITTENT, WATER_INTERMITTENT_FILL, WATER_FILL],
    "fill-outline-color": WATER_FILL_TRANSLUCENT,
  },
};

// OpenMapTiles files docks under its "water" layer, so Americana fills them
// like any other waterbody; Sourdough keeps them in "waterways" instead.
const water_dock = {
  "id": "water_dock",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "waterways",
  "filter": ["all", ["==", ["get", "waterway"], "dock"], IS_POLYGON],
  "paint": {
    "fill-color": WATER_FILL,
    "fill-outline-color": WATER_FILL_TRANSLUCENT,
  },
};

export const WATER = [
  water_line,
  water_line_intermittent,
  waterway,
  waterway_intermittent,
  water,
  water_dock,
];

const ferry = {
  "id": "ferry",
  "type": "line",
  "source": "sourdough",
  "source-layer": "routes",
  "filter": ["==", ["get", "route"], "ferry"],
  "paint": {
    "line-color": WATER_LINE_BOLD,
    "line-dasharray": [7, 5],
    "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 0.55, 12, 1],
  },
};

export const FERRIES = [ferry];

const WATER_LABEL_PAINT = {
  "text-color": WATER_LABEL,
  "text-halo-color": BACKGROUND_FILL,
  "text-halo-width": 0.75,
  "text-halo-blur": 0.25,
};

const waterway_label = {
  "id": "waterway_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "waterways",
  "filter": ["all", IS_LINE, ["has", "name"], ["!", ["has", "tunnel"]]],
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "name"],
    "text-font": ["Americana-Italic"],
    "text-letter-spacing": 0.15,
    "text-max-angle": 55,
    "text-size": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      3,
      8,
      12,
      ["match", ["get", "waterway"], ["river", "canal"], 14, 10],
      20,
      ["match", ["get", "waterway"], ["river", "canal"], 40, ["stream"], 20, 15],
    ],
  },
  "paint": WATER_LABEL_PAINT,
};

// The "water" source-layer has no water_name equivalent, so lake/pond names
// are placed on the centroid points Sourdough emits alongside each waterbody
// polygon. Gate by _reczoom so small ponds don't label until the map is zoomed
// in on them.
const water_label = {
  "id": "water_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "water",
  "filter": ["all", IS_POINT, ["has", "name"], reczoomGate()],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Americana-Italic"],
    "text-letter-spacing": 0.25,
    "text-size": ["interpolate", ["exponential", 2], ["zoom"], 3, 11, 12, 18, 20, 40],
  },
  "paint": WATER_LABEL_PAINT,
};

const water_point_label = {
  "id": "water_point_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["in", ["get", "place"], ["literal", ["ocean", "sea"]]]],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Americana-Bold-Italic"],
    "text-letter-spacing": 0.25,
    "text-size": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      3,
      ["match", ["get", "place"], "ocean", 16, "sea", 12, 8],
      12,
      ["match", ["get", "place"], "ocean", 28, "sea", 21, 14],
    ],
  },
  "paint": {
    ...WATER_LABEL_PAINT,
    "text-halo-color": WATER_FILL,
  },
};

// Americana labels waterways alongside road names, but places waterbody labels
// after the landuse labels so that park and protected-area names win collisions
// against lake names. Exported separately so style.js can match that ordering.
export const WATERWAY_LABELS = [waterway_label];
export const WATER_LABELS = [water_label, water_point_label];
