import { WATER } from "./water.js";
import { BOUNDARIES } from "./boundaries.js";
import { POWER } from "./power.js";

export const style = {
  "version": 8,
  "name": "Power Infrastructure",
  "center": [-118, 34],
  "zoom": 7,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json",
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
    ...WATER,
    ...BOUNDARIES,
    ...POWER,
  ],
};
