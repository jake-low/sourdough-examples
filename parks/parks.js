const IS_PROTECTED_AREA = [
  "in",
  ["get", "boundary"],
  ["literal", ["national_park", "protected_area"]],
];
const IS_PARK = ["in", ["get", "leisure"], ["literal", ["park", "nature_reserve"]]];

const protected_area_fill = {
  "id": "protected_area_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": IS_PROTECTED_AREA,
  "paint": { "fill-color": "#dfeab8" },
};

const protected_area_outline = {
  "id": "protected_area_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "boundaries",
  "filter": IS_PROTECTED_AREA,
  "paint": { "line-color": "#a8c075", "line-width": 1 },
};

const park_fill = {
  "id": "park_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "leisure",
  "filter": IS_PARK,
  "paint": { "fill-color": "#dfeab8" },
};

const park_outline = {
  "id": "park_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "leisure",
  "filter": IS_PARK,
  "paint": { "line-color": "#a8c075", "line-width": 1 },
};

const labelPaint = {
  "icon-color": "#2b5e22",
  "icon-halo-color": "#ffffff",
  "icon-halo-width": 1.75,
  "icon-halo-blur": 1,
  "text-color": "#2b5e22",
  "text-halo-color": "#ffffff",
  "text-halo-width": 1.5,
};

const labelLayout = {
  "icon-image": ["image", "temaki-vertex"],
  "icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.7, 18, 1],
  "text-field": ["get", "name"],
  "text-optional": true,
  "text-size": 11,
  "text-line-height": 1.1,
  "text-font": ["Noto Sans Bold"],
  "text-variable-anchor": ["top", "bottom", "left", "right"],
  "text-padding": 5,
  "text-offset": [
    "interpolate",
    ["linear"],
    ["zoom"],
    12,
    ["literal", [0.5, 0.5]],
    22,
    ["literal", [1, 1]],
  ],
  "text-justify": "auto",
  "symbol-sort-key": ["get", "_reczoom"],
};

const park_label = {
  "id": "park_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "leisure",
  "minzoom": 8,
  "filter": [
    "all",
    ["==", ["geometry-type"], "Point"],
    ["in", ["get", "leisure"], ["literal", ["park", "nature_reserve"]]],
    ["has", "name"],
    [">=", ["zoom"], ["+", ["get", "_reczoom"], -1]],
  ],
  "layout": labelLayout,
  "paint": labelPaint,
};

const protected_area_label = {
  "id": "protected_area_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "boundaries",
  "minzoom": 4,
  "filter": [
    "all",
    ["==", ["geometry-type"], "Point"],
    ["in", ["get", "boundary"], ["literal", ["national_park", "protected_area"]]],
    ["has", "name"],
    [">=", ["zoom"], ["+", ["get", "_reczoom"], -1]],
  ],
  "layout": labelLayout,
  "paint": labelPaint,
};

export const PARK_AREAS = [protected_area_fill, park_fill, protected_area_outline, park_outline];
export const PARK_LABELS = [park_label, protected_area_label];
