import { AERIALWAY_LABEL, AERIALWAY_LINE, BACKGROUND_FILL } from "./colors.js";

const LIFT_TYPES = ["chair_lift", "cable_car", "gondola", "mixed_lift"];
const DRAG_TYPES = ["drag_lift", "platter", "j-bar", "t-bar"];

const IS_LIFT = ["in", ["get", "aerialway"], ["literal", LIFT_TYPES]];
const IS_DRAG_LIFT = ["in", ["get", "aerialway"], ["literal", DRAG_TYPES]];

const LINE_WIDTH = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  12,
  1.2,
  14.9999,
  2.4,
  15,
  1.2,
  16,
  1.2,
  20,
  2.4,
];
const LINE_GAP_WIDTH = ["interpolate", ["exponential", 1.2], ["zoom"], 12, 0, 15, 0, 16, 1, 20, 16];

const lift = {
  "id": "lift",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aerialways",
  "filter": IS_LIFT,
  "paint": {
    "line-color": AERIALWAY_LINE,
    "line-width": LINE_WIDTH,
    "line-gap-width": LINE_GAP_WIDTH,
  },
};

const drag_lift = {
  ...lift,
  "id": "drag_lift",
  "filter": IS_DRAG_LIFT,
  "paint": {
    ...lift.paint,
    "line-dasharray": [5, 1],
  },
};

const lift_casing = {
  ...lift,
  "id": "lift_casing",
  "paint": {
    "line-color": BACKGROUND_FILL,
    "line-width": ["interpolate", ["exponential", 1.2], ["zoom"], 12, 2, 15.9999, 4, 16, 2, 20, 4],
    "line-gap-width": ["interpolate", ["exponential", 1.2], ["zoom"], 12, 0, 16, 0, 20, 14.4],
  },
};

const lift_label = {
  "id": "lift_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aerialways",
  "minzoom": 14,
  "filter": IS_LIFT,
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "name"],
    "text-font": ["Americana-Italic"],
    "text-size": 12,
  },
  "paint": {
    "text-color": AERIALWAY_LABEL,
    "text-halo-color": BACKGROUND_FILL,
    "text-halo-width": 1,
  },
};

export const DRAG_LIFTS = [drag_lift];
export const LIFTS = [lift_casing, lift, lift_label];
