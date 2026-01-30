const runway_fill = {
  "id": "runway_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "runway"]],
  "paint": {
    "fill-color": "#bbbbcc",
  },
};

const runway_outline = {
  "id": "runway_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "runway"]],
  "paint": {
    "line-color": "#ffffff",
    "line-width": 2,
  },
};

const runway_line = {
  "id": "runway_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "LineString"], ["==", "aeroway", "runway"]],
  "paint": {
    "line-color": "#bbbbcc",
    "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 10, 18, 60],
  },
};

const taxiway_fill = {
  "id": "taxiway_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "taxiway"]],
  "paint": {
    "fill-color": "#ccccdd",
  },
};

const taxiway_outline = {
  "id": "taxiway_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "taxiway"]],
  "paint": {
    "line-color": "#ffffff",
    "line-width": 1,
  },
};

const taxiway_line = {
  "id": "taxiway_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "LineString"], ["==", "aeroway", "taxiway"]],
  "paint": {
    "line-color": "#ccccdd",
    "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 14, 3, 18, 12],
  },
};

const apron_fill = {
  "id": "apron_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "apron"]],
  "paint": {
    "fill-color": "#ddddee",
  },
};

const apron_outline = {
  "id": "apron_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "apron"]],
  "paint": {
    "line-color": "#999999",
    "line-width": 1,
    "line-dasharray": [4, 2],
  },
};

const helipad_fill = {
  "id": "helipad_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "helipad"]],
  "paint": {
    "fill-color": "#bbbbcc",
    "fill-outline-color": "#666666",
  },
};

const helipad_circle = {
  "id": "helipad_circle",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "helipad"]],
  "paint": {
    "circle-color": "#bbbbcc",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 3, 16, 8],
    "circle-stroke-color": "#666666",
    "circle-stroke-width": 1,
  },
};

const parking_position = {
  "id": "parking_position",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "parking_position"]],
  "paint": {
    "circle-color": "#ffaa00",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 1, 18, 4],
  },
};

const gate = {
  "id": "gate",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "gate"]],
  "paint": {
    "circle-color": "#003366",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 2, 18, 5],
  },
};

const gate_label = {
  "id": "gate_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "gate"], ["has", "ref"]],
  "layout": {
    "text-field": ["get", "ref"],
    "text-font": ["Noto Sans Bold"],
    "text-size": 10,
  },
  "paint": {
    "text-color": "#ffffff",
    "text-halo-color": "#003366",
    "text-halo-width": 2,
  },
};

const terminal_fill = {
  "id": "terminal_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "terminal"]],
  "paint": {
    "fill-color": "#d4d4e8",
  },
};

const terminal_outline = {
  "id": "terminal_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "terminal"]],
  "paint": {
    "line-color": "#999999",
    "line-width": 1.0,
  },
};

const aerodrome_fill = {
  "id": "aerodrome_fill",
  "type": "fill",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "aerodrome"]],
  "paint": {
    "fill-color": "#e8e8f0",
    "fill-opacity": 0.3,
  },
};

const aerodrome_outline = {
  "id": "aerodrome_outline",
  "type": "line",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Polygon"], ["==", "aeroway", "aerodrome"]],
  "paint": {
    "line-color": "#8888aa",
    "line-width": 1,
    "line-dasharray": [6, 3],
  },
};

const aerodrome_label = {
  "id": "aerodrome_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "aerodrome"]],
  "layout": {
    "icon-image": "maki-airport",
    "icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 12, 1.0],
    "text-field": [
      "step",
      ["zoom"],
      ["coalesce", ["get", "iata"], ["get", "name"], ""],
      10,
      ["coalesce", ["get", "name"], ["get", "iata"], ""],
    ],
    "text-font": ["Noto Sans Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 12, 14],
    "text-max-width": 10,
    "text-padding": 5,
    "text-anchor": "top",
    "text-offset": [0, 1.2],
    "text-optional": false,
  },
  "paint": {
    "text-color": "#003366",
    "text-halo-color": "#ffffff",
    "text-halo-width": 2,
  },
};

const airfield_label = {
  "id": "airfield_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["==", "aeroway", "airstrip"]],
  "layout": {
    "icon-image": "maki-airfield",
    "icon-size": 0.8,
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Regular"],
    "text-size": 11,
    "text-max-width": 10,
    "text-padding": 5,
    "text-anchor": "top",
    "text-offset": [0, 1.0],
    "text-optional": true,
  },
  "paint": {
    "text-color": "#555555",
    "text-halo-color": "#ffffff",
    "text-halo-width": 1.5,
  },
};

const tower = {
  "id": "tower",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["in", "aeroway", "tower"]],
  "layout": {
    "icon-image": "temaki-tower",
    "icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 12, 1.0],
  },
};

const aeroway_minor_point = {
  "id": "aeroway_minor_point",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "aeroways",
  "filter": ["all", ["==", "$type", "Point"], ["in", "aeroway", "windsock", "navigationaid"]],
  "paint": {
    "circle-color": "#cccccc",
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 1.5, 18, 4],
  },
};

export const AERODROME_AREAS = [aerodrome_fill, aerodrome_outline];
export const AEROWAY_INFRASTRUCTURE = [
  apron_fill,
  apron_outline,
  terminal_fill,
  terminal_outline,
  taxiway_fill,
  taxiway_outline,
  taxiway_line,
  runway_fill,
  runway_outline,
  runway_line,
  helipad_fill,
  helipad_circle,
];
export const AEROWAY_DETAILS = [parking_position, gate, gate_label, aeroway_minor_point];
export const AEROWAY_LABELS = [tower, airfield_label, aerodrome_label];
export const AEROWAYS = [
  ...AERODROME_AREAS,
  ...AEROWAY_INFRASTRUCTURE,
  ...AEROWAY_DETAILS,
  ...AEROWAY_LABELS,
];
