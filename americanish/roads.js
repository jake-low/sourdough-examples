import roadzilla from "roadzilla";
import { BACKGROUND_FILL } from "./colors.js";
import { IS_BRIDGE, IS_LINE, IS_SURFACE, IS_TUNNEL } from "./utils.js";

const IS_TOLL = ["==", ["get", "toll"], "yes"];
const IS_EXPRESSWAY = ["==", ["get", "expressway"], "yes"];

const TUNNEL_CASE = ["case", IS_TOLL, "hsl(48, 41%, 80%)", "hsl(0, 41%, 80%)"];
const MOTORWAY_TUNNEL_CORE = ["case", IS_TOLL, "hsl(48, 71%, 90%)", "hsl(0, 71%, 90%)"];
const TRUNK_TUNNEL_CORE = ["case", IS_TOLL, "hsl(48, 77%, 90%)", "hsl(0, 77%, 90%)"];

const MOTORWAY_CORE = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  4,
  ["case", IS_TUNNEL, "hsl(0, 71%, 90%)", "hsl(0, 70%, 76%)"],
  6,
  ["case", IS_TUNNEL, "hsl(0, 71%, 90%)", "hsl(0, 70%, 66%)"],
  8,
  ["case", IS_TUNNEL, "hsl(0, 71%, 90%)", "hsl(0, 70%, 63.9%)"],
  9,
  ["case", IS_TUNNEL, MOTORWAY_TUNNEL_CORE, IS_TOLL, "hsl(48, 70%, 62.6%)", "hsl(0, 70%, 62.6%)"],
  10.5,
  ["case", IS_TUNNEL, MOTORWAY_TUNNEL_CORE, IS_TOLL, "hsl(48, 70%, 60%)", "hsl(0, 70%, 60%)"],
  14,
  ["case", IS_TUNNEL, MOTORWAY_TUNNEL_CORE, IS_TOLL, "hsl(48, 71%, 45%)", "hsl(0, 71%, 35%)"],
];

const MOTORWAY_CASE = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  4,
  ["case", IS_TUNNEL, "hsl(0, 41%, 80%)", "hsl(0, 10%, 85%)"],
  6,
  ["case", IS_TUNNEL, "hsl(0, 41%, 80%)", "hsl(0, 60%, 50%)"],
  8,
  ["case", IS_TUNNEL, "hsl(0, 41%, 80%)", "hsl(0, 63.3%, 46.5%)"],
  9,
  ["case", IS_TUNNEL, TUNNEL_CASE, IS_TOLL, "hsl(48, 65.7%, 44.3%)", "hsl(0, 65.7%, 44.3%)"],
  10.5,
  ["case", IS_TUNNEL, TUNNEL_CASE, IS_TOLL, "hsl(48, 71%, 40%)", "hsl(0, 71%, 40%)"],
  14,
  ["case", IS_TUNNEL, TUNNEL_CASE, IS_TOLL, "hsl(48, 51%, 9%)", "hsl(0, 51%, 9%)"],
];

const TRUNK_CORE = [
  "case",
  IS_TUNNEL,
  TRUNK_TUNNEL_CORE,
  IS_EXPRESSWAY,
  ["case", IS_TOLL, "hsl(48, 95%, 95%)", "hsl(0, 95%, 95%)"],
  IS_TOLL,
  "hsl(48, 77%, 50%)",
  "hsl(0, 77%, 50%)",
];

const TRUNK_CASE = [
  "interpolate",
  ["exponential", 1.2],
  ["zoom"],
  5,
  ["case", IS_TUNNEL, TUNNEL_CASE, IS_TOLL, "hsl(48, 77%, 50%)", "hsl(0, 77%, 50%)"],
  9,
  ["case", IS_TUNNEL, TUNNEL_CASE, IS_TOLL, "hsl(48, 77%, 50%)", "hsl(0, 77%, 50%)"],
  15,
  [
    "case",
    IS_TUNNEL,
    TUNNEL_CASE,
    IS_EXPRESSWAY,
    ["case", IS_TOLL, "hsl(48, 77%, 50%)", "hsl(0, 77%, 50%)"],
    IS_TOLL,
    "hsl(48, 70%, 18%)",
    "hsl(0, 70%, 18%)",
  ],
];

// How far along a base-1.2 exponential ramp spanning `from` to `to` a given
// zoom sits, clamped so stops past the end hold the ramp's final value.
const rampProgress = (zoom, from, to) =>
  Math.min(1, (1.2 ** (zoom - from) - 1) / (1.2 ** (to - from) - 1));

const mix = (from, to, t) => Math.round((from + (to - from) * t) * 10) / 10;

// gray line that darkens to black as you zoom in, then inverts to white at z15
function minorCoreColor(minzoom, darkzoom = 15) {
  const TUNNEL = ["case", IS_TOLL, "hsl(48, 100%, 95%)", "hsl(0, 0%, 95%)"];
  const EXPRESSWAY = ["case", IS_TOLL, "hsl(48, 100%, 75%)", "hsl(0, 100%, 100%)"];

  const ramp = (zoom) => {
    const t = rampProgress(zoom + 0.5, minzoom, darkzoom);
    return [
      "case",
      IS_TUNNEL,
      TUNNEL,
      IS_EXPRESSWAY,
      EXPRESSWAY,
      IS_TOLL,
      `hsl(48, 100%, ${mix(75, 40, t)}%)`,
      `hsl(0, 0%, ${mix(75, 23, t)}%)`,
    ];
  };

  const lastStop = Math.min(darkzoom, 14);
  const stops = [];
  for (let zoom = minzoom + 1; zoom <= lastStop; zoom++) {
    stops.push(zoom, ramp(zoom));
  }
  return ["step", ["zoom"], ramp(minzoom), ...stops, 15, ["case", IS_TUNNEL, TUNNEL, EXPRESSWAY]];
}

function minorCaseColor(minzoom) {
  const TUNNEL = "hsl(0, 0%, 80%)";

  const ramp = (zoom) => {
    const t = rampProgress(zoom + 0.5, minzoom, minzoom + 2);
    return [
      "case",
      IS_TUNNEL,
      TUNNEL,
      IS_EXPRESSWAY,
      `hsl(0, 0%, ${mix(75, 23, t)}%)`,
      "hsl(0, 0%, 90%)",
    ];
  };

  const stops = [];
  for (let zoom = minzoom + 1; zoom <= minzoom + 2; zoom++) {
    stops.push(zoom, ramp(zoom));
  }
  return [
    "step",
    ["zoom"],
    ramp(minzoom),
    ...stops,
    15,
    ["case", IS_TUNNEL, TUNNEL, "hsl(0, 0%, 23%)"],
  ];
}

const BUSWAY_CORE = [
  "step",
  ["zoom"],
  ["case", IS_TUNNEL, "hsl(322, 25%, 93%)", "hsl(322, 25%, 75%)"],
  12,
  ["case", IS_TUNNEL, "hsl(322, 25%, 93%)", "hsl(322, 25%, 63.6%)"],
  13,
  ["case", IS_TUNNEL, "hsl(322, 25%, 93%)", "hsl(322, 25%, 50%)"],
  15,
  ["case", IS_TUNNEL, "hsl(322, 25%, 93%)", "hsl(322, 25%, 80%)"],
];

// discard _link suffix when choosing line colors (link roads always match their parent class)
const parentClass = (highway) => highway.replace(/_link$/, "");

function coreColor(highway) {
  switch (parentClass(highway)) {
    case "motorway":
      return MOTORWAY_CORE;
    case "trunk":
      return TRUNK_CORE;
    case "primary":
      return minorCoreColor(7, 9);
    case "secondary":
      return minorCoreColor(9, 11);
    case "tertiary":
      return minorCoreColor(11, 13);
    case "busway":
      return BUSWAY_CORE;
    default:
      return minorCoreColor(12);
  }
}

function caseColor(highway) {
  switch (parentClass(highway)) {
    case "motorway":
      return MOTORWAY_CASE;
    case "trunk":
      return TRUNK_CASE;
    case "primary":
      return minorCaseColor(7);
    case "secondary":
      return minorCaseColor(9);
    case "tertiary":
    case "busway":
      return minorCaseColor(11);
    default:
      return minorCaseColor(12);
  }
}

const WIDTH_FACTORS = {
  "motorway": 1.0,
  "trunk": 1.0,
  "motorway_link": 0.5,
  "trunk_link": 0.5,
  "primary": 0.9,
  "primary_link": 0.45,
  "secondary": 0.6,
  "secondary_link": 0.3,
  "tertiary": 0.5,
  "tertiary_link": 0.25,
  "busway": 0.5,
  "residential": 0.3,
  "unclassified": 0.3,
  "living_street": 0.3,
  "pedestrian": 0.3,
  "service": 0.2,
};

const isMotorway = (highway) => highway == "motorway" || highway == "motorway_link";

// Americana draws cases as fat lines beneath cores; Roadzilla draws them as thin
// lines with a line-gap-width equal to the core line-width. The ramp below tries
// to achieve roughly the same visual effect in spite of this difference.
function caseWidth(highway) {
  const factor = WIDTH_FACTORS[highway] ?? 0.3;
  const scale = (width) => Math.round(width * factor * 1000) / 1000;
  const byExpressway = (expressway, plain) => [
    "case",
    IS_EXPRESSWAY,
    scale(expressway),
    scale(plain),
  ];
  return [
    "interpolate",
    ["exponential", 1.2],
    ["zoom"],
    4,
    isMotorway(highway) ? scale(0.5) : 0,
    9,
    isMotorway(highway) ? scale(1) : byExpressway(1, 0.1),
    12,
    isMotorway(highway) ? scale(0.9) : byExpressway(1.75, 0.5),
    16,
    byExpressway(3, 1),
    20,
    byExpressway(24, 8),
  ];
}

function coreWidth(highway) {
  const factor = WIDTH_FACTORS[highway] ?? 0.3;
  const scale = (width) => Math.round(width * factor * 1000) / 1000;
  const byExpressway = (expressway, plain) => [
    "case",
    IS_EXPRESSWAY,
    scale(expressway),
    scale(plain),
  ];
  return [
    "interpolate",
    ["exponential", 1.2],
    ["zoom"],
    4,
    scale(0.5),
    9,
    scale(1),
    12,
    isMotorway(highway) ? scale(3.2) : byExpressway(3.5, 4),
    16,
    byExpressway(8, 9),
    20,
    byExpressway(64, 72),
  ];
}

const KINDS = {
  "service": { minor: 13 },
  "busway": { minor: 11 },
  "living_street": { minor: 12, major: 14 },
  "pedestrian": { minor: 12, major: 14 },
  "unclassified": { minor: 12, major: 14 },
  "residential": { minor: 12, major: 14 },
  "tertiary_link": { major: 11 },
  "secondary_link": { minor: 9, major: 10 },
  "primary_link": { minor: 7, major: 9 },
  "trunk_link": { arterial: 7 },
  "motorway_link": { arterial: 7 },
  "tertiary": { major: 11 },
  "secondary": { minor: 9, major: 10 },
  "primary": { minor: 7, major: 9 },
  "trunk": { arterial: 4 },
  "motorway": { arterial: 4 },
};

const roads = roadzilla({
  "layers": [-1, 0, 1, 2, 3, 4],
  "coreColor": coreColor,
  "caseColor": caseColor,
  "caseWidth": caseWidth,
  "coreWidth": coreWidth,
  "kinds": KINDS,
});

// Americana blurs every road layer by half a pixel, which helps hairline cases
// look better (e.g. service roads around z15). Roadzilla doesn't expose an option
// for this so monkeypatch it in afterwards
export const ROADS = roads.map((bucket) =>
  bucket.map((layer) =>
    layer.type === "line" ? { ...layer, "paint": { ...layer.paint, "line-blur": 0.5 } } : layer,
  ),
);

const ROAD_TYPES = Object.keys(WIDTH_FACTORS).filter((kind) => !kind.endsWith("_link"));
const LINK_TYPES = Object.keys(WIDTH_FACTORS).filter((kind) => kind.endsWith("_link"));

const UNPAVED_SURFACES = [
  "unpaved",
  "compacted",
  "dirt",
  "earth",
  "fine_gravel",
  "grass",
  "gravel",
  "ground",
  "mud",
  "pebblestone",
  "rock",
  "sand",
  "woodchips",
];

// Roadzilla emits one layer per road kind and can scale each one's width in
// plain JavaScript. Unpaved roads use a single style layer so they need the
// same factors as a data-driven expression instead.
const WIDTH_FACTOR_BY_HIGHWAY = [
  "match",
  ["get", "highway"],
  ...Object.entries(WIDTH_FACTORS).flat(),
  0.3,
];

// Dashed overlay marking unpaved roads (matched to roadzilla's core width ramp)
const road_unpaved = {
  "id": "road_unpaved",
  "type": "line",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 11,
  "filter": [
    "all",
    IS_LINE,
    ["in", ["get", "highway"], ["literal", ROAD_TYPES]],
    ["in", ["get", "surface"], ["literal", UNPAVED_SURFACES]],
  ],
  "layout": {
    "line-cap": "butt",
  },
  "paint": {
    "line-dasharray": [4, 4],
    "line-color": [
      "match",
      ["get", "highway"],
      "motorway",
      ["case", IS_TOLL, "hsl(48, 50%, 70%)", "hsl(0, 50%, 70%)"],
      "trunk",
      ["case", IS_TOLL, "hsl(48, 95%, 80%)", "hsl(0, 95%, 80%)"],
      ["case", IS_TOLL, "hsl(48, 100%, 40%)", "hsl(0, 0%, 80%)"],
    ],
    "line-width": [
      "interpolate",
      ["exponential", 1.5],
      ["zoom"],
      11,
      ["*", WIDTH_FACTOR_BY_HIGHWAY, 0.5],
      18,
      ["*", WIDTH_FACTOR_BY_HIGHWAY, 20],
    ],
  },
};

const IS_MAJOR_CONSTRUCTION = ["in", ["get", "construction"], ["literal", ["motorway", "trunk"]]];

const road_construction = {
  "id": "road_construction",
  "type": "line",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 9,
  "filter": ["all", IS_LINE, ["==", ["get", "highway"], "construction"]],
  "paint": {
    "line-color": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      10,
      ["case", IS_MAJOR_CONSTRUCTION, "lightcoral", "lightslategray"],
      15,
      ["case", IS_MAJOR_CONSTRUCTION, "maroon", "slategray"],
    ],
    "line-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 11, 1],
    "line-dasharray": [2.5, 1.25],
    "line-width": 1,
    "line-gap-width": ["interpolate", ["linear"], ["zoom"], 11, 0, 20, 2],
    "line-blur": 0.75,
  },
};

function onewayLayer(id, brunnel, opacity) {
  return {
    "id": id,
    "type": "symbol",
    "source": "sourdough",
    "source-layer": "highways",
    "minzoom": 15,
    "filter": [
      "all",
      IS_LINE,
      ["in", ["get", "highway"], ["literal", ROAD_TYPES]],
      ["in", ["get", "oneway"], ["literal", ["yes", "-1"]]],
      brunnel,
    ],
    "layout": {
      "symbol-placement": "line",
      "symbol-spacing": ["interpolate", ["exponential", 1.5], ["zoom"], 15, 75, 19, 300],
      "icon-image": [
        "case",
        ["any", IS_TUNNEL, IS_TOLL, ["!=", ["get", "highway"], "motorway"]],
        "oneway_black",
        "oneway_white",
      ],
      "icon-rotate": ["case", ["==", ["get", "oneway"], "-1"], 180, 0],
      "icon-size": [
        "interpolate",
        ["exponential", 1.2],
        ["zoom"],
        15,
        ["match", ["get", "highway"], ["motorway", "trunk", "primary"], 0.5, 0.3],
        19,
        ["match", ["get", "highway"], ["motorway", "trunk", "primary"], 1, "secondary", 0.8, 0.6],
      ],
      "icon-rotation-alignment": "map",
      "icon-padding": 2,
    },
    "paint": {
      "icon-opacity": opacity,
    },
  };
}

export const ROAD_ONEWAY_TUNNEL = [onewayLayer("oneway_tunnel", IS_TUNNEL, 0.2)];
export const ROAD_ONEWAY_SURFACE = [onewayLayer("oneway_surface", IS_SURFACE, 0.5)];
export const ROAD_ONEWAY_BRIDGE = [onewayLayer("oneway_bridge", IS_BRIDGE, 0.5)];

const road_label = {
  "id": "road_label",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 8,
  "filter": [
    "all",
    IS_LINE,
    ["in", ["get", "highway"], ["literal", [...ROAD_TYPES, ...LINK_TYPES]]],
    ["has", "name"],
  ],
  "layout": {
    "symbol-placement": "line",
    "text-field": ["get", "name"],
    "text-font": ["Americana-Regular"],
    "text-size": [
      "step",
      ["zoom"],
      12,
      16,
      ["match", ["get", "highway"], ["motorway", "trunk"], 10, 12],
      17,
      ["match", ["get", "highway"], ["secondary", "tertiary", "busway"], 10, 12],
      18,
      ["match", ["get", "highway"], ["motorway", "trunk", "primary"], 12, 10],
    ],
    "text-anchor": "bottom",
    "text-max-angle": 20,
    "symbol-sort-key": [
      "match",
      ["get", "highway"],
      "motorway",
      1,
      "trunk",
      2,
      "primary",
      3,
      "secondary",
      4,
      ["tertiary", "busway"],
      5,
      6,
    ],
  },
  "paint": {
    "text-color": "#333",
    "text-halo-color": BACKGROUND_FILL,
    "text-halo-width": 2,
    "text-halo-blur": 0.5,
    "text-opacity": [
      "step",
      ["zoom"],
      ["match", ["get", "highway"], "motorway", 1, 0],
      10,
      ["match", ["get", "highway"], ["motorway", "trunk"], 1, 0],
      11,
      ["match", ["get", "highway"], ["motorway", "trunk", "primary"], 1, 0],
      12,
      [
        "match",
        ["get", "highway"],
        ["motorway", "trunk", "primary", "secondary", "tertiary", "busway"],
        1,
        0,
      ],
      13,
      ["match", ["get", "highway"], ["service"], 0, 1],
      14,
      1,
    ],
  },
};

export const ROAD_CONSTRUCTION = [road_construction];
export const ROAD_UNPAVED = [road_unpaved];
export const ROAD_LABELS = [road_label];
