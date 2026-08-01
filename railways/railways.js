// Color a railway line based on its `railway` type and `usage`/`service`,
// matching the OpenRailwayMap "standard" palette.
const line_color = [
  "case",
  ["==", ["get", "railway"], "subway"],
  "#0300c3",
  ["==", ["get", "railway"], "tram"],
  "#d877b8",
  ["==", ["get", "railway"], "light_rail"],
  "#00bd14",
  ["==", ["get", "railway"], "monorail"],
  "#00bd8b",
  ["==", ["get", "railway"], "funicular"],
  "#d87777",
  ["==", ["get", "railway"], "narrow_gauge"],
  "#c0da00",
  ["==", ["get", "railway"], "preserved"],
  "#5b4d70",
  ["==", ["get", "usage"], "main"],
  "#ff8100",
  ["==", ["get", "usage"], "branch"],
  "#c4b600",
  ["==", ["get", "usage"], "industrial"],
  "#87491d",
  ["==", ["get", "usage"], "tourism"],
  "#5b4d70",
  ["==", ["get", "usage"], "military"],
  "#764765",
  ["==", ["get", "usage"], "test"],
  "#3d634e",
  // railway=rail with no usage: service tracks (spur/siding/yard/crossover)
  "#404040",
];

const line_width = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  5,
  ["case", ["==", ["get", "usage"], "main"], 1.0, 0.4],
  10,
  [
    "case",
    ["==", ["get", "usage"], "main"],
    2.0,
    ["==", ["get", "usage"], "branch"],
    1.5,
    [
      "in",
      ["get", "railway"],
      ["literal", ["subway", "light_rail", "tram", "monorail", "funicular", "narrow_gauge"]],
    ],
    1.5,
    1.0,
  ],
  16,
  ["case", ["==", ["get", "usage"], "main"], 4.0, ["==", ["get", "usage"], "branch"], 3.0, 2.0],
];

const railway_filter_base = [
  "in",
  "railway",
  "rail",
  "light_rail",
  "subway",
  "tram",
  "monorail",
  "funicular",
  "narrow_gauge",
  "preserved",
];

// Tunnel: lighter / faded color to suggest underground.
const railway_tunnel = {
  "id": "railway_tunnel",
  "type": "line",
  "source": "sourdough",
  "source-layer": "railways",
  "filter": ["all", railway_filter_base, ["==", "tunnel", "yes"]],
  "paint": {
    "line-color": line_color,
    "line-width": line_width,
    "line-opacity": 0.4,
    "line-dasharray": [3, 2],
  },
  "layout": {
    "line-cap": "butt",
  },
};

// At-grade: normal rendering. Excludes bridges and tunnels so the dedicated
// layers above/below can apply their own styling.
const railway_line = {
  "id": "railway_line",
  "type": "line",
  "source": "sourdough",
  "source-layer": "railways",
  "filter": ["all", railway_filter_base, ["!=", "tunnel", "yes"], ["!=", "bridge", "yes"]],
  "paint": {
    "line-color": line_color,
    "line-width": line_width,
  },
  "layout": {
    "line-cap": "round",
    "line-join": "round",
  },
};

// Bridge railings: thin black lines drawn just outside the rail line on each
// side, using line-gap-width to leave room for the rail itself in the middle.
const railway_bridge_railing = {
  "id": "railway_bridge_railing",
  "type": "line",
  "source": "sourdough",
  "source-layer": "railways",
  "filter": ["all", railway_filter_base, ["==", "bridge", "yes"]],
  "paint": {
    "line-color": "#222222",
    "line-width": 1,
    "line-gap-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 16, 6],
  },
};

const railway_bridge = {
  "id": "railway_bridge",
  "type": "line",
  "source": "sourdough",
  "source-layer": "railways",
  "filter": ["all", railway_filter_base, ["==", "bridge", "yes"]],
  "paint": {
    "line-color": line_color,
    "line-width": line_width,
  },
  "layout": {
    "line-cap": "butt",
    "line-join": "round",
  },
};

// Line label using the OSM `ref` tag (e.g. "NEC", "M2"). OpenRailwayMap also
// places these along railway lines.
const railway_ref = {
  "id": "railway_ref",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "railways",
  "minzoom": 11,
  "filter": ["all", railway_filter_base, ["has", "ref"]],
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "ref"],
    "text-font": ["Noto Sans Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 11, 9, 16, 12],
    "text-rotation-alignment": "map",
    "text-pitch-alignment": "viewport",
    "symbol-spacing": 400,
    "text-padding": 10,
  },
  "paint": {
    "text-color": "#ffffff",
    "text-halo-color": "#0c43a8",
    "text-halo-width": 2,
  },
};

// Line name labels (e.g. "Northeast Corridor"), shown at higher zooms.
const railway_name = {
  "id": "railway_name",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "railways",
  "minzoom": 13,
  "filter": ["all", railway_filter_base, ["has", "name"]],
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "name"],
    "text-font": ["Noto Sans Regular"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 18, 13],
    "text-letter-spacing": 0.05,
    "text-rotation-alignment": "map",
    "symbol-spacing": 500,
    "text-max-angle": 30,
  },
  "paint": {
    "text-color": "#444444",
    "text-halo-color": "#ffffff",
    "text-halo-width": 2,
  },
};

// Public-transport stations. ORM distinguishes major stations (filled circle)
// from minor halts/stops (outline circle).
const station_is_major = ["==", ["get", "railway"], "station"];

const station_minor = {
  "id": "station_minor",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "railways",
  "minzoom": 11,
  "filter": [
    "all",
    ["==", ["geometry-type"], "Point"],
    ["in", ["get", "railway"], ["literal", ["halt", "tram_stop", "stop"]]],
  ],
  "paint": {
    "circle-color": "#ffffff",
    "circle-stroke-color": "#0c43a8",
    "circle-stroke-width": 1.5,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 2, 16, 4],
  },
};

const station_major = {
  "id": "station_major",
  "type": "circle",
  "source": "sourdough",
  "source-layer": "railways",
  "minzoom": 8,
  "filter": ["all", ["==", ["geometry-type"], "Point"], station_is_major],
  "paint": {
    "circle-color": "#0c43a8",
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 1.5,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 16, 6],
  },
};

const station_label = {
  "id": "station_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "railways",
  "minzoom": 10,
  "filter": [
    "all",
    ["==", ["geometry-type"], "Point"],
    ["in", ["get", "railway"], ["literal", ["station", "halt", "tram_stop", "stop"]]],
    ["has", "name"],
  ],
  "layout": {
    "text-field": ["get", "name"],
    "text-font": [
      "case",
      station_is_major,
      ["literal", ["Noto Sans Bold"]],
      ["literal", ["Noto Sans Regular"]],
    ],
    "text-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      ["case", station_is_major, 11, 9],
      16,
      ["case", station_is_major, 14, 11],
    ],
    "text-anchor": "top",
    "text-offset": [0, 0.7],
    "text-max-width": 8,
    "text-padding": 4,
    "text-optional": true,
  },
  "paint": {
    "text-color": "#0c43a8",
    "text-halo-color": "#ffffff",
    "text-halo-width": 2,
  },
};

export const RAILWAYS = [
  railway_tunnel,
  railway_line,
  railway_bridge_railing,
  railway_bridge,
  railway_ref,
  railway_name,
];

export const STATIONS = [station_minor, station_major, station_label];
