import { BACKGROUND_FILL, BACKGROUND_FILL_TRANSLUCENT, URBAN_SUB_AREA_LABEL } from "./colors.js";
import { IS_POINT, reczoomGate, reczoomSortKey } from "./utils.js";

const LABEL_HALO_COLOR = [
  "interpolate",
  ["linear"],
  ["zoom"],
  4,
  BACKGROUND_FILL_TRANSLUCENT,
  5,
  BACKGROUND_FILL,
];

const LABEL_HALO_BLUR = ["interpolate", ["linear"], ["zoom"], 4, 0.5, 5, 0];

const CITY_LABEL_PAINT = {
  "text-color": "#444",
  "text-halo-color": LABEL_HALO_COLOR,
  "text-halo-width": 2,
  "text-halo-blur": LABEL_HALO_BLUR,
};

const ICON_IMAGE = [
  "step",
  ["zoom"],
  ["match", ["get", "capital"], ["yes", "2"], "place_star_in_circle", "place_dot"],
  6,
  [
    "match",
    ["get", "capital"],
    ["yes", "2"],
    "place_star_in_circle",
    ["3", "4"],
    "place_star",
    ["5", "6"],
    "place_dot_in_circle",
    "place_dot",
  ],
];

const POPULATED_PLACE_LAYOUT = {
  "icon-image": ICON_IMAGE,
  "text-field": ["get", "name"],
  "text-font": ["Americana-Bold"],
  "text-anchor": "bottom",
  "text-variable-anchor": ["bottom", "bottom-right", "bottom-left", "right", "left"],
  "text-justify": "auto",
  "text-radial-offset": 0.5,
  "icon-optional": false,
  "text-max-width": 8,
  "icon-padding": 0,
  "text-padding": 1,
  "icon-allow-overlap": false,
  "symbol-sort-key": reczoomSortKey(),
};

const SUB_AREA_LAYOUT = {
  "text-field": ["get", "name"],
  "text-font": ["Americana-Regular"],
  "text-transform": "uppercase",
  "text-variable-anchor": ["center"],
  "text-max-width": 6,
  "text-padding": 1,
};

const SUB_AREA_PAINT = {
  "text-color": URBAN_SUB_AREA_LABEL,
  "text-halo-color": BACKGROUND_FILL,
  "text-halo-width": 2,
};

const place_neighborhood = {
  "id": "place_neighborhood",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "neighbourhood"]],
  "minzoom": 14,
  "maxzoom": 17,
  "layout": {
    ...SUB_AREA_LAYOUT,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 14, 12, 16, 14],
    "text-letter-spacing": ["interpolate", ["linear"], ["zoom"], 15, 0.08, 16, 0.2],
  },
  "paint": SUB_AREA_PAINT,
};

const place_quarter = {
  "id": "place_quarter",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "quarter"]],
  "minzoom": 13,
  "maxzoom": 16,
  "layout": {
    ...SUB_AREA_LAYOUT,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 13, 12, 14, 14, 16, 18],
    "text-letter-spacing": ["interpolate", ["linear"], ["zoom"], 14, 0.08, 15, 0.2],
  },
  "paint": SUB_AREA_PAINT,
};

const place_suburb = {
  "id": "place_suburb",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "suburb"]],
  "minzoom": 11,
  "maxzoom": 15,
  "layout": {
    ...SUB_AREA_LAYOUT,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 10, 12, 12, 15, 14, 18],
    "text-letter-spacing": [
      "interpolate",
      ["linear"],
      ["zoom"],
      11,
      0.04,
      12,
      0.08,
      13,
      0.2,
      14,
      0.4,
    ],
  },
  "paint": SUB_AREA_PAINT,
};

const place_village = {
  "id": "place_village",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "village"], reczoomGate()],
  "minzoom": 11,
  "maxzoom": 14,
  "layout": {
    ...POPULATED_PLACE_LAYOUT,
    "text-size": ["interpolate", ["linear"], ["zoom"], 5, 8, 8, 10, 12, 12],
    "icon-size": ["interpolate", ["linear"], ["zoom"], 4, 0.12, 7, 0.25, 11, 0.5],
  },
  "paint": CITY_LABEL_PAINT,
};

const place_town = {
  "id": "place_town",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": [
    "all",
    IS_POINT,
    ["==", ["get", "place"], "town"],
    [">=", ["zoom"], ["+", ["get", "_reczoom"], 2]],
  ],
  "minzoom": 4,
  "maxzoom": 13,
  "layout": {
    ...POPULATED_PLACE_LAYOUT,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 5, 8, 8, 10, 12, 18],
    "icon-size": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 0.25, 7, 0.35, 11, 0.7],
  },
  "paint": CITY_LABEL_PAINT,
};

const place_city = {
  "id": "place_city",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": [
    "all",
    IS_POINT,
    ["==", ["get", "place"], "city"],
    [">=", ["zoom"], ["+", ["get", "_reczoom"], 2]],
  ],
  "minzoom": 4,
  "maxzoom": 12,
  "layout": {
    ...POPULATED_PLACE_LAYOUT,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 11, 7, 14, 11, 24],
    "icon-size": ["interpolate", ["exponential", 1.2], ["zoom"], 4, 0.4, 7, 0.5, 11, 0.9],
    "text-radial-offset": ["match", ["get", "capital"], ["yes", "2"], 0.7, 0.5],
  },
  "paint": CITY_LABEL_PAINT,
};

const place_state = {
  "id": "place_state",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["in", ["get", "place"], ["literal", ["state", "province"]]]],
  "minzoom": 3,
  "maxzoom": 7,
  "layout": {
    "text-font": ["Americana-Regular"],
    "text-field": ["get", "name"],
    "text-transform": "uppercase",
    "text-letter-spacing": 0.04,
    "text-size": ["interpolate", ["exponential", 1.2], ["zoom"], 3, 8, 6, 14],
    "text-variable-anchor": ["center", "top", "bottom"],
    "text-radial-offset": ["interpolate", ["exponential", 1.6], ["zoom"], 3, 0.5, 7, 3],
    "text-max-width": 6,
    "text-padding": 1,
  },
  "paint": {
    "text-color": "hsl(45, 6%, 10%)",
    "text-halo-color": BACKGROUND_FILL,
    "text-halo-width": 2,
  },
};

const place_country = {
  "id": "place_country",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "country"], reczoomGate()],
  "layout": {
    "text-font": ["Americana-Regular"],
    "text-field": ["get", "name"],
    "text-max-width": 6.25,
    "text-size": ["interpolate", ["linear"], ["zoom"], 3, 14, 7, 17],
    "symbol-sort-key": reczoomSortKey(),
  },
  "paint": {
    "text-color": "#334",
    "text-halo-color": LABEL_HALO_COLOR,
    "text-halo-blur": LABEL_HALO_BLUR,
    "text-halo-width": ["interpolate", ["linear"], ["zoom"], 3, 1.5, 7, 2.5],
  },
};

const place_continent = {
  "id": "place_continent",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["all", IS_POINT, ["==", ["get", "place"], "continent"]],
  "maxzoom": 1,
  "layout": {
    "text-font": ["Americana-Regular"],
    "text-field": ["get", "name"],
    "text-justify": "center",
    "text-transform": "uppercase",
    "text-size": 13,
  },
  "paint": {
    "text-color": "#633",
    "text-halo-color": LABEL_HALO_COLOR,
    "text-halo-blur": LABEL_HALO_BLUR,
    "text-halo-width": 1,
  },
};

export const PLACES = [
  place_state,
  place_neighborhood,
  place_quarter,
  place_suburb,
  place_village,
  place_town,
  place_city,
  place_country,
  place_continent,
];
