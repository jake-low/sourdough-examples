import { WATER } from "./water.js";
import { BOUNDARIES } from "./boundaries.js";
import { RAILWAYS, STATIONS } from "./railways.js";

export const style = {
  "version": 8,
  "name": "Railways",
  "center": [-74.0, 40.75],
  "zoom": 8,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json",
      "url": "https://tiles.openstreetmap.us/vector/sourdough.json",
    },
  },
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
  "sprite": "https://sourdough.osm.fyi/assets/sprites",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#f4f4f4",
      },
    },
    ...WATER,
    ...BOUNDARIES,
    ...RAILWAYS,
    ...STATIONS,
  ],
};
