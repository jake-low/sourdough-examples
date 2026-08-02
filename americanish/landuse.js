import {
  ABORIGINAL_LAND_FILL,
  ABORIGINAL_LAND_LABEL,
  ABORIGINAL_LAND_LABEL_HALO,
  ABORIGINAL_LAND_OUTLINE,
  BACKGROUND_FILL,
  CEMETERY_FILL,
  CEMETERY_OUTLINE,
  PARK_FILL,
  PARK_LABEL,
  PARK_LABEL_HALO,
  PARK_OUTLINE,
  PITCH_FILL,
  PITCH_OUTLINE,
} from "./colors.js";
import { IS_POINT, reczoomGate, reczoomSortKey } from "./utils.js";

const IS_ABORIGINAL_LAND = ["==", ["get", "boundary"], "aboriginal_lands"];
const IS_PROTECTED_AREA = [
  "in",
  ["get", "boundary"],
  ["literal", ["national_park", "protected_area"]],
];
const IS_PARK = [
  "in",
  ["get", "leisure"],
  ["literal", ["park", "garden", "recreation_ground", "nature_reserve"]],
];
const IS_PITCH = ["==", ["get", "leisure"], "pitch"];
const IS_CEMETERY = ["==", ["get", "landuse"], "cemetery"];

// FIXME: this is meant to approximate Americana's yellow fills for urban areas
// at low zoom. But the polygons in OpenMapTiles that drive these come from
// Natural Earth. Sourdough's only equivalent is the landuse polygons from OSM,
// which tend to be small individually. Planetiler attempts to merge nearby
// polygons when creating low zoom tiles, but this is imperfect and at low zooms
// like this we end up with little/no landuse features in the tiles, so this
// effect doesn't work as well with Sourdough data.
const urbanized_area = {
  "id": "urbanized_area",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "landuse",
  "minzoom": 1,
  "maxzoom": 6,
  "filter": [
    "in",
    ["get", "landuse"],
    ["literal", ["residential", "commercial", "retail", "industrial"]],
  ],
  "paint": {
    "fill-color": [
      "interpolate-lab",
      ["linear"],
      ["zoom"],
      4,
      "hsl(41, 90%, 85%)",
      5,
      "hsl(41, 90%, 80%)",
      5.5,
      "hsl(41, 90%, 80%)",
      6,
      BACKGROUND_FILL,
    ],
  },
};

const aboriginal_fill = {
  "id": "aboriginal_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "boundaries",
  "minzoom": 2,
  "filter": IS_ABORIGINAL_LAND,
  "paint": {
    "fill-color": ABORIGINAL_LAND_FILL,
  },
};

const protected_area_fill = {
  "id": "protected_area_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "boundaries",
  "minzoom": 2,
  "filter": IS_PROTECTED_AREA,
  "paint": {
    "fill-color": PARK_FILL,
  },
};

const park_fill = {
  "id": "park_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "leisure",
  "minzoom": 2,
  "filter": IS_PARK,
  "paint": {
    "fill-color": PARK_FILL,
  },
};

const pitch_fill = {
  ...park_fill,
  "id": "pitch_fill",
  "minzoom": 10,
  "filter": IS_PITCH,
  "paint": {
    "fill-color": PITCH_FILL,
  },
};

const cemetery_fill = {
  "id": "cemetery_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "landuse",
  "minzoom": 10,
  "filter": IS_CEMETERY,
  "paint": {
    "fill-color": CEMETERY_FILL,
  },
};

// group landuse fills into two groups so they can be inserted at different
// places in the stylesheet's layer stack
export const LANDUSE_FILLS_LOWER = [urbanized_area, aboriginal_fill, protected_area_fill];
export const LANDUSE_FILLS_UPPER = [cemetery_fill, park_fill, pitch_fill];

// Each outline can reuse the same source, minzoom, filter, etc of the
// corresponding fill layer; we only need to override the layer type and
// pain properties.
const outlineOf = (fill, id, color) => ({
  ...fill,
  "id": id,
  "type": "line",
  "paint": { "line-color": color },
});

const aboriginal_outline = outlineOf(
  aboriginal_fill,
  "aboriginal_outline",
  ABORIGINAL_LAND_OUTLINE,
);
const protected_area_outline = outlineOf(
  protected_area_fill,
  "protected_area_outline",
  PARK_OUTLINE,
);
const park_outline = outlineOf(park_fill, "park_outline", PARK_OUTLINE);
const pitch_outline = outlineOf(pitch_fill, "pitch_outline", PITCH_OUTLINE);
const cemetery_outline = outlineOf(cemetery_fill, "cemetery_outline", CEMETERY_OUTLINE);

// again, export two separate groups so other layer can be inserted between them
export const LANDUSE_OUTLINES_LOWER = [aboriginal_outline, protected_area_outline];
export const LANDUSE_OUTLINES_UPPER = [park_outline, cemetery_outline, pitch_outline];

const aboriginal_label = {
  "id": "aboriginal_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "boundaries",
  "minzoom": 2,
  "filter": ["all", IS_POINT, IS_ABORIGINAL_LAND, ["has", "name"], reczoomGate()],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Americana-Regular"],
    "text-size": ["interpolate", ["exponential", 10], ["zoom"], 6, 11, 10, 12, 12, 15, 14, 18],
    "text-padding": 1,
    "text-transform": "uppercase",
    "symbol-sort-key": reczoomSortKey(),
  },
  "paint": {
    "text-color": ABORIGINAL_LAND_LABEL,
    "text-halo-color": ABORIGINAL_LAND_LABEL_HALO,
    "text-halo-width": 1.5,
    "text-halo-blur": 1,
  },
};

const protected_area_label = {
  "id": "protected_area_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "boundaries",
  "minzoom": 2,
  "filter": ["all", IS_POINT, IS_PROTECTED_AREA, ["has", "name"], reczoomGate()],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Americana-Bold"],
    "text-size": 10,
    "symbol-sort-key": reczoomSortKey(),
  },
  "paint": {
    "text-color": PARK_LABEL,
    "text-halo-color": PARK_LABEL_HALO,
    "text-halo-width": 1,
    "text-halo-blur": 1,
  },
};

const park_label = {
  ...protected_area_label,
  "id": "park_label",
  "source-layer": "leisure",
  "filter": ["all", IS_POINT, IS_PARK, ["has", "name"], reczoomGate(15)],
};

export const LANDUSE_LABELS = [aboriginal_label, protected_area_label, park_label];
