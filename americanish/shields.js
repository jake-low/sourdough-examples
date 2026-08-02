import { IS_POINT } from "./utils.js";

// HACK: we need a rough way to determine a route's importance so we can delay
// rendering minor road shields until higher zooms (which avoids needing to
// generate their shields at low zooms, greatly improving performance), and also
// so we can break ties when shield placements overlap. OMT does this at build
// time and bakes the info into the tiles; we do it at runtime instead. The
// rules below are an incomplete list targeting US and Canadian highways,
// and meant only as a proof of concept.

const NETWORK = ["coalesce", ["get", "network"], ""];
const REF = ["coalesce", ["get", "ref"], ""];

const IS_ONTARIO_FREEWAY = [
  "any",
  ["==", REF, "QEW"],
  ["all", ["==", ["length", REF], 3], ["==", ["slice", REF, 0, 1], "4"]],
];

const SHIELD_TIER = [
  "case",
  ["==", NETWORK, "CA:ON:primary"],
  ["case", IS_ONTARIO_FREEWAY, 0, 1],
  [
    "match",
    NETWORK,
    [
      "US:I",
      "CA:transcanada",
      "CA:transcanada:namedRoute",
      "CA:QC:A",
      "CA:ON:primary:Toll",
      "CA:ON:private_toll",
    ],
    0,
    [
      "US:US",
      "CA:BC",
      "CA:AB:primary",
      "CA:MB:PTH",
      "CA:NB:primary",
      "CA:NL",
      "CA:NS:H",
      "CA:NS:T",
      "CA:PE",
      "CA:QC:R",
      "CA:SK:primary",
      "CA:YT",
      "CA:NT",
    ],
    1,
    [
      "CA:AB:secondary",
      "CA:MB:PR",
      "CA:NB:secondary",
      "CA:NB:tertiary",
      "CA:NS:R",
      "CA:NS:S",
      "CA:ON:secondary",
      "CA:ON:tertiary",
      "CA:SK:secondary",
      "CA:SK:tertiary",
    ],
    2,
    // Render US:<state> and CA:<province> (state/provincial highways) over others (county/municipal)
    [
      "case",
      [
        "all",
        ["in", ["slice", NETWORK, 0, 3], ["literal", ["US:", "CA:"]]],
        ["==", ["index-of", ":", NETWORK, 3], -1],
      ],
      2,
      3,
    ],
  ],
];

// Reveal route shields by rank as you zoom in, which helps performance. every
// route that might appear needs its shield image generated, even if it doesn't
// end up getting rendered. For Sourdough tiles, this can be hundreds of shields
// per tile at z6.
const SHIELD_MAX_TIER = ["step", ["zoom"], 0, 8, 1, 10, 2, 12, 3];

const highway_shield = {
  "id": "highway_shield",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "routes",
  "minzoom": 6,
  "filter": [
    "all",
    ["==", ["get", "route"], "road"],
    ["any", ["has", "network"], ["has", "ref"]],
    ["<=", SHIELD_TIER, SHIELD_MAX_TIER],
  ],
  "layout": {
    "symbol-placement": "line",
    "symbol-spacing": 250,
    "text-rotation-alignment": "viewport-glyph",
    "text-pitch-alignment": "viewport",
    "text-font": ["Americana-Regular"],
    "text-letter-spacing": 0.7,
    "text-max-angle": 180,
    "symbol-sort-key": SHIELD_TIER,
    "text-field": [
      "format",
      [
        "image",
        [
          "concat",
          "shield\n",
          ["coalesce", ["get", "network"], ""],
          "\n",
          ["coalesce", ["get", "ref"], ""],
          "\n",
          ["coalesce", ["get", "name"], ""],
          "\n",
          ["coalesce", ["get", "colour"], ""],
        ],
      ],
    ],
  },
};

const highway_exit = {
  "id": "highway_exit",
  "type": "symbol",
  "source": "sourdough",
  "source-layer": "highways",
  "minzoom": 14,
  "filter": ["all", IS_POINT, ["==", ["get", "highway"], "motorway_junction"], ["has", "ref"]],
  "layout": {
    "text-field": ["get", "ref"],
    "text-font": ["Americana-Bold"],
    "text-size": 9,
    "text-line-height": 1,
  },
  "paint": {
    "text-color": "hsl(60, 100%, 50%)",
    "text-halo-color": "black",
    "text-halo-width": 0.75,
  },
};

export const SHIELDS = [highway_shield, highway_exit];
