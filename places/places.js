const place_labels_country = {
  "id": "place_labels_country",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["==", "place", "country"],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Bold"],
    "text-size": 14,
    "text-transform": "uppercase",
  },
  "paint": {
    "text-color": "#333333",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};

const place_labels_state = {
  "id": "place_labels_state",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["==", "place", "state"],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Italic"],
    "text-size": 12,
    "text-transform": "uppercase",
  },
  "paint": {
    "text-color": "#666666",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};

const place_labels_city_town = {
  "id": "place_labels_city_town",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "places",
  "filter": ["in", "place", "city", "town"],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": [
      "match",
      ["get", "place"],
      "city",
      ["literal", ["Noto Sans SemiCondensed Bold"]],
      ["literal", ["Noto Sans SemiCondensed Regular"]],
    ],
    "text-size": ["interpolate", ["linear"], ["zoom"], 4, 8, 10, ["log2", ["get", "population"]]],
  },
  "paint": {
    "text-color": "#000000",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};

export const PLACES = [place_labels_city_town, place_labels_state, place_labels_country];
