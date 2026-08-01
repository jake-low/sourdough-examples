import { BOUNDARIES } from "./boundaries.js";
import { HILLSHADE } from "./hillshade.js";
import { PARK_AREAS, PARK_LABELS } from "./parks.js";
import { WATER } from "./water.js";

export const style = {
  "version": 8,
  "name": "Parks & Protected Areas",
  "center": [-122.6, 48.55],
  "zoom": 9.5,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json",
    },
    "hillshade": {
      "type": "raster",
      "url": "https://tiles.openstreetmap.us/raster/hillshade.json",
    },
  },
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
  "sprite": "https://sourdough.osm.fyi/assets/sprites",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#f8f4f0",
      },
    },
    ...PARK_AREAS,
    ...HILLSHADE,
    ...WATER,
    ...BOUNDARIES,
    ...PARK_LABELS,
  ],
};
