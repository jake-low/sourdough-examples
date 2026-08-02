import {
  BACKGROUND_FILL,
  FUNICULAR_FILL,
  LIGHT_RAIL_FILL,
  MONORAIL_FILL,
  NARROW_GAUGE_FILL,
  RAIL_FILL,
  RAILWAY_TUNNEL_FILL,
  SUBWAY_FILL,
  TRAM_FILL,
} from "./colors.js";
import { IS_BRIDGE, IS_LINE, IS_SURFACE, IS_TUNNEL } from "./utils.js";

const IS_SIDING_SPUR_YARD = ["in", ["get", "service"], ["literal", ["siding", "spur", "yard"]]];
const IS_NOT_CROSSOVER = ["!=", ["get", "service"], "crossover"];

const LINE_COLOR = [
  "match",
  ["get", "railway"],
  "subway",
  SUBWAY_FILL,
  "light_rail",
  LIGHT_RAIL_FILL,
  "tram",
  TRAM_FILL,
  "monorail",
  MONORAIL_FILL,
  "funicular",
  FUNICULAR_FILL,
  "narrow_gauge",
  NARROW_GAUGE_FILL,
  RAIL_FILL,
];

const OPACITY = [
  "step",
  ["zoom"],
  ["match", ["get", "railway"], ["rail", "preserved", "narrow_gauge"], 1, 0],
  14,
  1,
];

function railFilter(brunnel, extra = []) {
  return ["all", IS_LINE, brunnel, ...extra];
}

function railLayer({ id, filter, minzoom, widthAt20, color, dasharray }) {
  // multiply the widthAt20 by a scale factor to use at lower zooms, either
  // at build time (if widthAt20 is a constant) or at runtime (if it's a
  // MapLibre expression).
  const scaled = (factor) =>
    typeof widthAt20 === "number" ? widthAt20 * factor : ["*", widthAt20, factor];

  return {
    "id": id,
    "type": "line",
    "source": "sourdough",
    "source-layer": "railways",
    "minzoom": minzoom,
    "filter": filter,
    "layout": {
      "line-cap": "butt",
      "line-join": "bevel",
    },
    "paint": {
      "line-color": color,
      "line-opacity": OPACITY,
      "line-width": [
        "interpolate",
        ["exponential", 1.2],
        ["zoom"],
        8,
        scaled(1 / 16),
        12,
        scaled(1 / 4),
        20,
        widthAt20,
      ],
      ...(dasharray && { "line-dasharray": dasharray }),
    },
  };
}

// Dash styles for each railway type. line-dasharray can't be data driven,
// so each variant is drawn by a separate layer with the appropriate filter.
const DASH_GROUPS = [
  {
    "group": "rail",
    "types": ["rail", "preserved"],
    "minzoom": 10,
    "variants": [
      { "service": false, "width": 4, "factor": 3, "pattern": [1, 25] },
      { "service": true, "width": 2, "factor": 4, "pattern": [1, 50] },
    ],
  },
  {
    "group": "narrow_gauge",
    "types": ["narrow_gauge"],
    "minzoom": 10,
    "variants": [
      { "service": false, "width": 4, "factor": 2, "pattern": [1, 1, 1, 15] },
      { "service": true, "width": 2, "factor": 3, "pattern": [1, 2, 1, 30] },
    ],
  },
  {
    "group": "light_rail_tram",
    "types": ["light_rail", "tram"],
    "minzoom": 14,
    "variants": [
      { "service": false, "width": 2.5, "factor": 2, "pattern": [1, 6] },
      { "service": true, "width": 1.25, "factor": 3, "pattern": [1, 12] },
    ],
  },
  {
    "group": "funicular",
    "types": ["funicular"],
    "minzoom": 14,
    "variants": [{ "service": null, "width": 2.5, "factor": 2.3, "pattern": [1, 2] }],
  },
];

function dashesLayers(bucket, brunnel, color) {
  return DASH_GROUPS.flatMap(({ group, types, minzoom, variants }) =>
    variants.map(({ service, width, factor, pattern }) =>
      railLayer({
        "id": `rail_dashes_${bucket}_${group}${service ? "_service" : ""}`,
        "filter": railFilter(brunnel, [
          ["in", ["get", "railway"], ["literal", types]],
          ...(service === null ? [] : [service ? IS_SIDING_SPUR_YARD : ["!", IS_SIDING_SPUR_YARD]]),
          IS_NOT_CROSSOVER,
        ]),
        minzoom,
        color,
        "widthAt20": width * factor,
        "dasharray": pattern.map((n) => n / 2 / factor),
      }),
    ),
  );
}

function railLayers(bucket, brunnel) {
  const color = bucket === "tunnel" ? RAILWAY_TUNNEL_FILL : LINE_COLOR;
  const fill = railLayer({
    "id": `rail_fill_${bucket}`,
    "filter": railFilter(brunnel),
    "minzoom": 10,
    "widthAt20": [
      "match",
      ["get", "railway"],
      ["rail", "preserved", "narrow_gauge", "subway"],
      ["case", IS_SIDING_SPUR_YARD, 2, 4],
      "monorail",
      ["case", IS_SIDING_SPUR_YARD, 1.6, 3.2],
      ["case", IS_SIDING_SPUR_YARD, 1.25, 2.5], // light_rail, tram, funicular
    ],
    color,
  });
  return [...dashesLayers(bucket, brunnel, color), fill];
}

const rail_bridge_casing = railLayer({
  "id": "rail_bridge-casing",
  "filter": railFilter(IS_BRIDGE),
  "minzoom": 13,
  "widthAt20": ["case", IS_SIDING_SPUR_YARD, 4, 6],
  "color": BACKGROUND_FILL,
});

export const RAIL_TUNNELS = railLayers("tunnel", IS_TUNNEL);

export const RAIL_SURFACE = railLayers("surface", IS_SURFACE);

export const RAIL_BRIDGES = [rail_bridge_casing, ...railLayers("bridge", IS_BRIDGE)];
