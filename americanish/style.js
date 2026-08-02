import { BACKGROUND_FILL, HILLSHADE_HIGHLIGHT, HILLSHADE_SHADOW } from "./colors.js";
import { WATER, FERRIES, WATERWAY_LABELS, WATER_LABELS } from "./water.js";
import {
  LANDUSE_FILLS_LOWER,
  LANDUSE_FILLS_UPPER,
  LANDUSE_OUTLINES_LOWER,
  LANDUSE_OUTLINES_UPPER,
  LANDUSE_LABELS,
} from "./landuse.js";
import { BOUNDARY_CASINGS, BOUNDARIES } from "./boundaries.js";
import { RAIL_TUNNELS, RAIL_SURFACE, RAIL_BRIDGES } from "./rail.js";
import { AEROWAY_FILLS, AEROWAY_OUTLINES, AEROWAYS, AEROWAY_LABELS } from "./aeroways.js";
import { BUILDINGS } from "./buildings.js";
import { DRAG_LIFTS, LIFTS } from "./aerialways.js";
import { PIERS } from "./piers.js";
import { POIS } from "./pois.js";
import { PLACES } from "./places.js";
import {
  ROADS,
  ROAD_CONSTRUCTION,
  ROAD_UNPAVED,
  ROAD_ONEWAY_TUNNEL,
  ROAD_ONEWAY_SURFACE,
  ROAD_ONEWAY_BRIDGE,
  ROAD_LABELS,
} from "./roads.js";
import { SHIELDS } from "./shields.js";

const HILLSHADING = {
  "id": "hillshading",
  "type": "hillshade",
  "source": "dem",
  "paint": {
    "hillshade-exaggeration": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 17, 0.3],
    "hillshade-shadow-color": HILLSHADE_SHADOW,
    "hillshade-highlight-color": HILLSHADE_HIGHLIGHT,
  },
};

export const style = {
  "version": 8,
  "name": "Americanish",
  "center": [-89.4, 43.09],
  "zoom": 11.5,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.openstreetmap.us/vector/sourdough.json",
    },
    "dem": {
      "type": "raster-dem",
      "tiles": ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
      "encoding": "terrarium",
      "tileSize": 256,
      "maxzoom": 13,
      "attribution":
        '<a target="_blank" rel="noopener" href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a>',
    },
  },
  "glyphs": "https://font.americanamap.org/{fontstack}/{range}.pbf",
  "sprite": "https://americanamap.org/sprites/sprite",
  "light": {
    "anchor": "viewport",
    "color": "white",
    "intensity": 0.12,
  },
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": BACKGROUND_FILL,
      },
    },
    ...LANDUSE_FILLS_LOWER,
    ...AEROWAY_FILLS,
    ...LANDUSE_FILLS_UPPER,
    ...BOUNDARY_CASINGS,
    HILLSHADING,
    ...WATER,
    ...LANDUSE_OUTLINES_LOWER,
    ...AEROWAY_OUTLINES,
    ...LANDUSE_OUTLINES_UPPER,
    ...BOUNDARIES,
    ...PIERS,
    ...RAIL_TUNNELS,
    ...ROAD_CONSTRUCTION,
    ...ROADS[0],
    ...ROAD_ONEWAY_TUNNEL,
    ...FERRIES,
    ...AEROWAYS,
    ...ROADS[1],
    ...ROAD_UNPAVED,
    ...RAIL_SURFACE,
    ...ROAD_ONEWAY_SURFACE,
    ...DRAG_LIFTS,
    ...BUILDINGS,
    ...ROADS[2],
    ...ROADS[3],
    ...ROADS[4],
    ...ROADS[5],
    ...RAIL_BRIDGES,
    ...ROAD_ONEWAY_BRIDGE,
    ...LIFTS,
    ...WATERWAY_LABELS,
    ...ROAD_LABELS,
    ...LANDUSE_LABELS,
    ...WATER_LABELS,
    ...AEROWAY_LABELS,
    ...SHIELDS,
    ...POIS,
    ...PLACES,
  ],
};
