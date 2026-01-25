import { WATER } from "./water.js";
import { BOUNDARIES } from "./boundaries.js";
import { PLACES } from "./places.js";

export const style = {
  "version": 8,
  "name": "Places",
  "center": [-78, 17],
  "zoom": 3.5,
  "sources": {
    "sourdough": {
      "type": "vector",
      "url": "https://tiles.osm.fyi/vector/sourdough.json",
    },
  },
  "glyphs": "https://tiles.openstreetmap.us/fonts/{fontstack}/{range}.pbf",
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
    ...PLACES,
  ],
};
