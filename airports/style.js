import { WATER } from "./water.js";
import { AEROWAYS } from "./aeroways.js";

export const style = {
  "version": 8,
  "name": "Airports",
  "center": [-73.78, 40.64],
  "zoom": 12.5,
  "sources": {
    "sourdough": {
      "type": "vector",
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
        "background-color": "#f0f0f0",
      },
    },
    ...WATER,
    ...AEROWAYS,
  ],
};
