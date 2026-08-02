import { AIRPORT_FILL, AIRPORT_LABEL, AIRPORT_OUTLINE, AIRPORT_RUNWAY, POI } from "./colors.js";
import { IS_LINE, IS_POINT, IS_POLYGON, poiIcon } from "./utils.js";

const IS_AIRPORT = ["in", ["get", "aeroway"], ["literal", ["aerodrome", "airstrip"]]];

// An airport is "minor" if it lacks IATA or ICAO codes, or is private.
const MINOR_AIRPORT = [
  "any",
  ["!", ["has", "iata"]],
  ["!", ["has", "icao"]],
  ["==", ["get", "aerodrome:type"], "private"],
];
const MAJOR_AIRPORT = ["!", MINOR_AIRPORT];

const PLANE_ICON = poiIcon(
  ["case", ["has", "military"], "poi_military_plane", "poi_plane"],
  POI.airport,
);

const airport_fill = {
  "id": "airport_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": IS_AIRPORT,
  "paint": {
    "fill-color": AIRPORT_FILL,
  },
};

const airport_outline = {
  "id": "airport_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": IS_AIRPORT,
  "paint": {
    "line-color": AIRPORT_OUTLINE,
  },
};

const airport_runway = {
  "id": "airport_runway",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", ["get", "aeroway"], "runway"], IS_LINE],
  "layout": {
    "line-cap": "butt",
  },
  "paint": {
    "line-color": AIRPORT_RUNWAY,
    "line-width": ["interpolate", ["exponential", 1.7], ["zoom"], 12, 3, 15, 15, 17, 30],
  },
};

// Runways and taxiways mapped as areas (area=yes) rather than centerlines.
// NOTE: Sourdough does not currently support prefixed form (area:aeroway=runway etc)
const airport_runway_area = {
  "id": "airport_runway_area",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", ["get", "aeroway"], "runway"], IS_POLYGON],
  "paint": {
    "fill-color": AIRPORT_RUNWAY,
  },
};

const airport_taxiway = {
  "id": "airport_taxiway",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "minzoom": 12,
  "filter": ["all", ["==", ["get", "aeroway"], "taxiway"], IS_LINE],
  "layout": {
    "line-cap": "butt",
  },
  "paint": {
    "line-color": AIRPORT_RUNWAY,
    "line-width": ["interpolate", ["exponential", 1.7], ["zoom"], 12, 1, 15, 5],
  },
};

const airport_taxiway_area = {
  ...airport_runway_area,
  "id": "airport_taxiway_area",
  "minzoom": 12,
  "filter": ["all", ["==", ["get", "aeroway"], "taxiway"], IS_POLYGON],
};

const AIRPORT_LABEL_LAYOUT = {
  "text-font": ["Americana-Bold"],
  "text-size": 10,
};

const AIRPORT_ICON_LAYOUT = {
  "icon-image": PLANE_ICON,
  "text-anchor": "bottom",
  "text-variable-anchor": ["bottom", "bottom-right", "bottom-left", "right", "left"],
  "text-padding": 8,
  "icon-allow-overlap": false,
};

const AIRPORT_LABEL_PAINT = {
  "text-color": AIRPORT_LABEL,
  "text-halo-color": "#ffffff",
  "text-halo-width": 1,
  "text-halo-blur": 1,
};

const airport_ref_label = {
  "id": "airport_ref_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "minzoom": 9,
  "maxzoom": 15,
  "filter": ["all", IS_POINT, ["==", ["get", "aeroway"], "aerodrome"], MAJOR_AIRPORT],
  "layout": {
    "text-field": ["coalesce", ["get", "iata"], ["get", "icao"]],
    ...AIRPORT_LABEL_LAYOUT,
    ...AIRPORT_ICON_LAYOUT,
  },
  "paint": AIRPORT_LABEL_PAINT,
};

const airport_ref_label_minor = {
  ...airport_ref_label,
  "id": "airport_ref_label_minor",
  "minzoom": 13,
  "filter": ["all", IS_POINT, ["==", ["get", "aeroway"], "aerodrome"], MINOR_AIRPORT],
  "layout": {
    "text-field": ["coalesce", ["get", "iata"], ["get", "icao"]],
    ...AIRPORT_LABEL_LAYOUT,
  },
};

const airport_label = {
  ...airport_ref_label,
  "id": "airport_label",
  "minzoom": 11,
  "layout": {
    "text-field": ["get", "name"],
    ...AIRPORT_LABEL_LAYOUT,
    ...AIRPORT_ICON_LAYOUT,
  },
};

const airport_label_minor = {
  ...airport_ref_label_minor,
  "id": "airport_label_minor",
  "layout": {
    "text-field": ["get", "name"],
    ...AIRPORT_LABEL_LAYOUT,
  },
};

const airport_gate_label = {
  "id": "airport_gate_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "minzoom": 15,
  "filter": ["all", IS_POINT, ["==", ["get", "aeroway"], "gate"]],
  "layout": {
    "text-field": ["get", "ref"],
    ...AIRPORT_LABEL_LAYOUT,
  },
  "paint": AIRPORT_LABEL_PAINT,
};

export const AEROWAY_FILLS = [airport_fill];
export const AEROWAY_OUTLINES = [airport_outline];
export const AEROWAYS = [
  airport_runway,
  airport_runway_area,
  airport_taxiway,
  airport_taxiway_area,
];
export const AEROWAY_LABELS = [
  airport_ref_label,
  airport_ref_label_minor,
  airport_label,
  airport_label_minor,
  airport_gate_label,
];
