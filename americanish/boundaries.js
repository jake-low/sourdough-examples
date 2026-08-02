import { BORDER, BORDER_CASING } from "./colors.js";
import { IS_LINE } from "./utils.js";

const ADMINISTRATIVE = ["==", ["get", "boundary"], "administrative"];
const NOT_DISPUTED = ["!=", ["get", "disputed"], true];

const adminLevel = (...levels) =>
  levels.length === 1
    ? ["==", ["get", "admin_level"], levels[0]]
    : ["in", ["get", "admin_level"], ["literal", levels]];

const adminBoundary = (levels, { includeDisputed = false } = {}) => [
  "all",
  IS_LINE,
  ADMINISTRATIVE,
  adminLevel(...levels),
  ...(includeDisputed ? [] : [NOT_DISPUTED]),
];

const boundary_county_casing = {
  "id": "boundary_county_casing",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": adminBoundary([6]),
  "minzoom": 11,
  "layout": {
    "line-join": "round",
  },
  "paint": {
    "line-color": BORDER_CASING,
    "line-width": ["interpolate", ["linear"], ["zoom"], 11, 5, 12, 6],
  },
};

const boundary_region_casing = {
  ...boundary_county_casing,
  "id": "boundary_region_casing",
  "filter": adminBoundary([5]),
  "minzoom": 8,
  "paint": {
    ...boundary_county_casing.paint,
    "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 9, 6],
  },
};

const boundary_state_casing = {
  "id": "boundary_state_casing",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": adminBoundary([3, 4], { includeDisputed: true }),
  "minzoom": 3,
  "layout": {
    "line-join": "round",
    "line-cap": "round",
  },
  "paint": {
    "line-color": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      3,
      "hsl(251, 25%, 94%)",
      7,
      "hsl(281, 30%, 90%)",
    ],
    "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 3, 4, 12, 20, 16, 30],
  },
};

const boundary_country_casing = {
  ...boundary_state_casing,
  "id": "boundary_country_casing",
  "filter": adminBoundary([2], { includeDisputed: true }),
  "minzoom": 2,
  "paint": {
    "line-color": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      3,
      "hsl(251, 35%, 86%)",
      7,
      "hsl(281, 35%, 86%)",
    ],
    "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.4, 4, 1],
    "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 2, 4, 12, 25, 16, 50],
  },
};

export const BOUNDARY_CASINGS = [
  boundary_county_casing,
  boundary_region_casing,
  boundary_state_casing,
  boundary_country_casing,
];

const boundary_city = {
  "id": "boundary_city",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": adminBoundary([8]),
  "minzoom": 11,
  "layout": {
    "line-join": "round",
  },
  "paint": {
    "line-color": BORDER,
    "line-dasharray": [2, 4],
    "line-width": 1,
  },
};

const boundary_county = {
  ...boundary_city,
  "id": "boundary_county",
  "filter": adminBoundary([6]),
  "minzoom": 9,
  "paint": {
    ...boundary_city.paint,
    "line-dasharray": [3, 3],
  },
};

const boundary_region = {
  ...boundary_city,
  "id": "boundary_region",
  "filter": adminBoundary([5]),
  "minzoom": 6,
  "paint": {
    ...boundary_city.paint,
    "line-dasharray": [5, 4],
  },
};

const boundary_state = {
  "id": "boundary_state",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": adminBoundary([3, 4], { includeDisputed: true }),
  "minzoom": 3,
  "layout": {
    "line-join": "round",
    "line-cap": "round",
  },
  "paint": {
    "line-color": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      3,
      "hsl(0, 2%, 60%)",
      7,
      "hsl(0, 2%, 48%)",
    ],
    "line-dasharray": [
      "step",
      ["zoom"],
      ["literal", [4, 4, 4, 4, 12, 4]],
      6,
      ["literal", [3.5, 3, 3.5, 3, 20, 3]],
      8,
      ["literal", [2.5, 2.5, 2.5, 2.5, 20, 2.5]],
      10,
      ["literal", [2, 2.5, 2, 2.5, 12, 2.5]],
    ],
    "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.5, 10, 1.5],
  },
};

const boundary_country = {
  "id": "boundary_country",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": adminBoundary([2]),
  "layout": {
    "line-join": "round",
  },
  "paint": {
    "line-color": [
      "interpolate",
      ["exponential", 1.2],
      ["zoom"],
      3,
      "hsl(0, 2%, 47%)",
      7,
      "hsl(0, 2%, 37%)",
    ],
    "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.4, 4, 1, 5, 0.8],
    "line-width": ["interpolate", ["linear"], ["zoom"], 2, 1, 4, 1.5, 10, 2.25],
    "line-dasharray": [10, 1, 3, 1],
  },
};

export const BOUNDARIES = [
  boundary_city,
  boundary_county,
  boundary_region,
  boundary_state,
  boundary_country,
];
