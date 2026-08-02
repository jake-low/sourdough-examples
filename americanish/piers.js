import { BACKGROUND_FILL } from "./colors.js";
import { IS_LINE, IS_POLYGON } from "./utils.js";

const IS_PIER = ["==", ["get", "man_made"], "pier"];

const pier_area = {
  "id": "pier_area",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "man_made",
  "filter": ["all", IS_PIER, IS_POLYGON],
  "paint": {
    "fill-color": BACKGROUND_FILL,
  },
};

const pier_line = {
  "id": "pier_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "man_made",
  "filter": ["all", IS_PIER, IS_LINE],
  "layout": {
    "line-cap": "butt",
  },
  "paint": {
    "line-color": BACKGROUND_FILL,
    "line-width": ["interpolate", ["exponential", 1.7], ["zoom"], 14, 1, 20, 20],
  },
};

export const PIERS = [pier_area, pier_line];
